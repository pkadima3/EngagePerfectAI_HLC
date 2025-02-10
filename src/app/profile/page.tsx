// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { User } from 'firebase/auth';
import { 
  Calendar, 
  Share2, 
  Edit2, 
  Twitter, 
  Linkedin, 
  Facebook,
  FileText,
  MessageSquare 
} from 'lucide-react';

// Types for our user data
interface UserProfile {
  fullName: string;
  email: string;
  profilePicture: string;
  subscriptionStatus: 'free' | 'pro';
  planExpiryDate?: Date;
  dateJoined: Date;
  aiRequestsUsed: number;
  aiRequestsLimit: number;
  postsGenerated: number;
  postsDrafted: number;
  shares: {
    twitter: number;
    linkedin: number;
    facebook: number;
  };
  recentPosts: Array<{
    id: string;
    content: string;
    platform: string;
    shareCount: number;
    date: Date;
  }>;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserProfile(user.uid);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      
      // Get profile picture URL from Storage
      let profilePicUrl = '/default-avatar.png';
      if (userData.profilePicture) {
        try {
          profilePicUrl = await getDownloadURL(
            ref(storage, `profilePictures/${userId}`)
          );
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      }

      setProfile({
        ...userData,
        profilePicture: profilePicUrl,
        dateJoined: userData.dateJoined.toDate(),
        planExpiryDate: userData.planExpiryDate?.toDate(),
      } as UserProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Picture */}
          <div className="relative w-32 h-32">
            <Image
              src={profile.profilePicture}
              alt={profile.fullName}
              fill
              className="rounded-full object-cover"
            />
            <button 
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white"
              onClick={() => {/* Handle edit photo */}}
            >
              <Edit2 size={16} />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{profile.fullName}</h1>
            <p className="text-gray-600 mb-2">{profile.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Joined {new Date(profile.dateJoined).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={16} />
                {profile.subscriptionStatus.toUpperCase()} Plan
              </span>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {/* Handle edit profile */}}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* AI Usage */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">AI Requests</h3>
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{profile.aiRequestsUsed} used</span>
              <span>{profile.aiRequestsLimit} limit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 rounded-full h-2"
                style={{ width: `${(profile.aiRequestsUsed / profile.aiRequestsLimit) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Posts Generated */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Posts Generated</h3>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" />
            <span className="text-2xl font-bold">{profile.postsGenerated}</span>
          </div>
        </div>

        {/* Drafts Saved */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Drafts Saved</h3>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" />
            <span className="text-2xl font-bold">{profile.postsDrafted}</span>
          </div>
        </div>

        {/* Total Shares */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold mb-2">Total Shares</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Twitter size={16} className="text-blue-400" />
                Twitter
              </span>
              <span>{profile.shares.twitter}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Linkedin size={16} className="text-blue-700" />
                LinkedIn
              </span>
              <span>{profile.shares.linkedin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Facebook size={16} className="text-blue-600" />
                Facebook
              </span>
              <span>{profile.shares.facebook}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
        <div className="space-y-4">
          {profile.recentPosts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4">
              <p className="text-gray-600 mb-2">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <div className="flex items-center gap-2">
                  <Share2 size={16} />
                  <span>{post.shareCount} shares</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}