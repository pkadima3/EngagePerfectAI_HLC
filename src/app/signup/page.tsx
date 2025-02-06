// app/signup/page.tsx
"use client";  // <-- Add this line at the very top!

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db }  from '../../lib/firebase'; // <— your firebase.ts location
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // optional: store user in Firestore
      await addDoc(collection(db, 'users'), {
        uid: userCred.user.uid,
        email: userCred.user.email,
        createdAt: new Date(),
      });

      // then go to homepage (or maybe /dashboard)
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Signup failed!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="flex flex-col space-y-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
        />
        <button type="submit" className="bg-green-500 text-white py-2 px-4">
          Create Account
        </button>
      </form>

      <Link href="/" className="mt-4 text-blue-500 underline">
        Go back Home
      </Link>
    </div>
  );
}
