'use client';

import { useState } from 'react';
import Login from '@/components/Login';
import DynamicForm from '@/components/DynamicForm';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rollNumber, setRollNumber] = useState('');

  const handleLoginSuccess = (rollNumber: string) => {
    setRollNumber(rollNumber);
    setIsLoggedIn(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <DynamicForm rollNumber={rollNumber} />
      )}
    </main>
  );
} 