'use server';

import { cookies } from 'next/headers';
import { authenticateWithWordPress } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username and password are required' };
  }

  try {
    const response = await authenticateWithWordPress(username, password);

    if (!response.token) {
      return { error: 'Invalid credentials' };
    }

    const cookieStore = await cookies();
    
    // Store user session data in HttpOnly cookies
    // 7 days expiration
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      expires,
      path: '/',
    };

    cookieStore.set('wp_jwt', response.token, cookieOptions);
    cookieStore.set('wp_user_email', response.user_email, cookieOptions);
    cookieStore.set('wp_user_nicename', response.user_nicename, cookieOptions);
    cookieStore.set('wp_user_display_name', response.user_display_name, cookieOptions);
    
  } catch (error: any) {
    console.error('Login error:', error);
    return { error: error.message || 'An error occurred during login' };
  }
  
  redirect('/engineer/dashboard');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  
  cookieStore.delete('wp_jwt');
  cookieStore.delete('wp_user_email');
  cookieStore.delete('wp_user_nicename');
  cookieStore.delete('wp_user_display_name');

  redirect('/engineer/login');
}
