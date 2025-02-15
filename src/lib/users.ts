import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, query, getDocs } from 'firebase/firestore';

// Types for better TypeScript support
interface UserData {
  email: string;
  fullName: string;
  dateJoined: string;
  subscriptionStatus: 'trial' | 'active' | 'cancelled' | 'free';
  trialStartDate: string;
  trialEndDate: string;
  aiRequestsLimit: number;
  aiRequestsUsed: number;
  stripeCustomerId: string | null;
  subscriptionId: string | null;
  postsDrafted: number;
  postsGenerated: number;
  shares: {
    facebook: number;
    linkedin: number;
    twitter: number;
  };
  recentPosts: any[];
  profilePicture: string;
  lastUpdated: string;
  settings: {
    notifications: boolean;
    emailUpdates: boolean;
  };
}

// Create new user document
export async function createNewUser(user: any): Promise<UserData> {
  const userDocRef = doc(db, 'users', user.uid);
  
  const userData: UserData = {
    email: user.email,
    fullName: user.displayName || '',
    dateJoined: new Date().toISOString(),
    subscriptionStatus: 'trial',
    trialStartDate: new Date().toISOString(),
    trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    aiRequestsLimit: 5,
    aiRequestsUsed: 0,
    stripeCustomerId: null,
    subscriptionId: null,
    postsDrafted: 0,
    postsGenerated: 0,
    shares: {
      facebook: 0,
      linkedin: 0,
      twitter: 0
    },
    recentPosts: [],
    profilePicture: '',
    lastUpdated: new Date().toISOString(),
    settings: {
      notifications: true,
      emailUpdates: true
    }
  };

  try {
    await setDoc(userDocRef, userData);
    console.log('User document created successfully');
    return userData;
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
}

// Update existing user document
export async function updateUserDocument(userId: string, data: Partial<UserData>) {
  const userDocRef = doc(db, 'users', userId);
  try {
    await setDoc(userDocRef, data, { merge: true });
    console.log('User document updated successfully');
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
}

// Migration script to update all existing users
export async function migrateExistingUsers() {
  const usersRef = collection(db, 'users');
  const q = query(usersRef);
  
  try {
    const querySnapshot = await getDocs(q);
    
    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      
      // Default values for new fields
      const updates: Partial<UserData> = {
        subscriptionStatus: userData.subscriptionStatus || 'trial',
        trialStartDate: userData.trialStartDate || new Date().toISOString(),
        trialEndDate: userData.trialEndDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        aiRequestsLimit: userData.aiRequestsLimit || 5,
        aiRequestsUsed: userData.aiRequestsUsed || 0,
        stripeCustomerId: userData.stripeCustomerId || null,
        subscriptionId: userData.subscriptionId || null,
        lastUpdated: new Date().toISOString(),
        settings: userData.settings || {
          notifications: true,
          emailUpdates: true
        }
      };
      
      await updateUserDocument(doc.id, updates);
      console.log(`Migrated user: ${doc.id}`);
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
}