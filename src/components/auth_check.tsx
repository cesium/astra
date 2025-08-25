"use client"
import { UserContext } from '@/contexts/user-provider';
import { useRouter } from 'next/navigation';
import { use, useEffect } from 'react';

export const AuthCheck = ({ children, userTypes }: { 
  children: React.ReactNode, 
  userTypes: string[]  
}) => {
  const { user } = use(UserContext);
  const router = useRouter();
  
  useEffect(() => {    
    if (!user || !userTypes.includes(user.type)) {
      router.push('/');
    }
  }, [user, userTypes, router]);
  
  if (!user || (user && !userTypes.includes(user.type))) {
    return null;
  }
  
  return children;
};