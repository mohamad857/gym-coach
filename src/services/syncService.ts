import { db, getActiveUserProfile, getActiveWorkoutPlan, getWorkoutLogs } from '../db';
import { auth, dbFirestore, isFirebaseConfigured, doc, setDoc, getDoc, collection, getDocs } from './firebase';
import { UserProfile, WorkoutPlan, WorkoutSessionLog } from '../types';

export interface SyncStatus {
  isOnline: boolean;
  isCloudConnected: boolean;
  userEmail: string | null;
  lastSyncedAt: string | null;
  isSyncing: boolean;
  error: string | null;
}

class SyncService {
  private listeners: ((status: SyncStatus) => void)[] = [];
  private status: SyncStatus = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isCloudConnected: false,
    userEmail: null,
    lastSyncedAt: null,
    isSyncing: false,
    error: null,
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateStatus({ isOnline: true });
        this.triggerAutoSync();
      });
      window.addEventListener('offline', () => {
        this.updateStatus({ isOnline: false });
      });

      if (auth) {
        auth.onAuthStateChanged((user) => {
          this.updateStatus({
            isCloudConnected: Boolean(user),
            userEmail: user?.email || null,
          });
          if (user) {
            this.pullFromCloudAndMerge(user.uid);
          }
        });
      }
    }
  }

  public subscribe(callback: (status: SyncStatus) => void): () => void {
    this.listeners.push(callback);
    callback(this.status);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private updateStatus(patch: Partial<SyncStatus>) {
    this.status = { ...this.status, ...patch };
    this.listeners.forEach(cb => cb(this.status));
  }

  public getStatus(): SyncStatus {
    return this.status;
  }

  /**
   * Pushes all local IndexedDB data to Cloud Firestore
   */
  public async pushToCloud(): Promise<boolean> {
    if (!isFirebaseConfigured || !auth?.currentUser || !dbFirestore) {
      return false;
    }

    try {
      this.updateStatus({ isSyncing: true, error: null });
      const uid = auth.currentUser.uid;

      const profile = await getActiveUserProfile();
      const plan = await getActiveWorkoutPlan();
      const logs = await getWorkoutLogs();

      if (profile) {
        await setDoc(doc(dbFirestore, 'users', uid), profile, { merge: true });
      }

      if (plan) {
        await setDoc(doc(dbFirestore, 'plans', uid), plan, { merge: true });
      }

      // Sync logs
      for (const log of logs) {
        await setDoc(doc(dbFirestore, 'users', uid, 'sessions', log.id), log, { merge: true });
      }

      this.updateStatus({
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString('ar-EG'),
      });
      return true;
    } catch (err: any) {
      console.error('Cloud Sync push error:', err);
      this.updateStatus({ isSyncing: false, error: err.message || 'فشلت المزامنة السحابية' });
      return false;
    }
  }

  /**
   * Pulls data from Cloud Firestore to restore progress on a new phone / cleared browser
   */
  public async pullFromCloudAndMerge(uid: string): Promise<boolean> {
    if (!isFirebaseConfigured || !dbFirestore) return false;

    try {
      this.updateStatus({ isSyncing: true, error: null });

      // Pull Profile
      const profileSnap = await getDoc(doc(dbFirestore, 'users', uid));
      if (profileSnap.exists()) {
        const cloudProfile = profileSnap.data() as UserProfile;
        await db.user_profile.put(cloudProfile);
      }

      // Pull Plan
      const planSnap = await getDoc(doc(dbFirestore, 'plans', uid));
      if (planSnap.exists()) {
        const cloudPlan = planSnap.data() as WorkoutPlan;
        await db.workout_plan.put(cloudPlan);
      }

      // Pull Logs
      const logsSnap = await getDocs(collection(dbFirestore, 'users', uid, 'sessions'));
      for (const sessionDoc of logsSnap.docs) {
        const cloudLog = sessionDoc.data() as WorkoutSessionLog;
        await db.workout_logs.put(cloudLog);
      }

      this.updateStatus({
        isSyncing: false,
        lastSyncedAt: new Date().toLocaleTimeString('ar-EG'),
      });
      return true;
    } catch (err: any) {
      console.error('Cloud Sync pull error:', err);
      this.updateStatus({ isSyncing: false, error: err.message || 'فشل استرجاع البيانات' });
      return false;
    }
  }

  public triggerAutoSync() {
    if (this.status.isOnline && this.status.isCloudConnected) {
      this.pushToCloud();
    }
  }

  /**
   * Export all data to an offline JSON backup file
   */
  public async exportBackupJSON(): Promise<void> {
    const profile = await getActiveUserProfile();
    const plan = await getActiveWorkoutPlan();
    const logs = await getWorkoutLogs();
    const prs = await db.personal_records.toArray();

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      plan,
      logs,
      personalRecords: prs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gymcoach-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import data from an offline JSON backup file
   */
  public async importBackupJSON(file: File): Promise<boolean> {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.profile) await db.user_profile.put(data.profile);
      if (data.plan) await db.workout_plan.put(data.plan);
      if (Array.isArray(data.logs)) {
        for (const log of data.logs) {
          await db.workout_logs.put(log);
        }
      }
      if (Array.isArray(data.personalRecords)) {
        for (const pr of data.personalRecords) {
          await db.personal_records.put(pr);
        }
      }
      return true;
    } catch (err) {
      console.error('Import error:', err);
      return false;
    }
  }
}

export const syncService = new SyncService();

