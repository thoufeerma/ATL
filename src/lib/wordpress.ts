import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const getWordPressApiUrl = (endpoint: string) => {
  const url = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_WOOCOMMERCE_URL is not defined');
  }
  // Remove trailing slash if present
  const baseUrl = url.replace(/\/$/, '');
  return `${baseUrl}/wp-json/${endpoint}`;
};

export const fetchWordPress = async (endpoint: string, options: RequestInit = {}) => {
  const url = getWordPressApiUrl(endpoint);
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    // Attempt to clear cookies
    try {
      const cookieStore = await cookies();
      cookieStore.delete('wp_jwt');
      cookieStore.delete('wp_user_email');
      cookieStore.delete('wp_user_nicename');
      cookieStore.delete('wp_user_display_name');
    } catch {
      // If we are in a context where cookies cannot be modified, ignore
    }
    redirect('/engineer/login');
  }

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // Ignore JSON parse error for error response
    }
    throw new Error(`WordPress API Error (${response.status}): ${errorMsg}`);
  }

  return response.json();
};
