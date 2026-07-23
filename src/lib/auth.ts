import { fetchWordPress } from './wordpress';

export interface AuthResponse {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export const authenticateWithWordPress = async (username: string, password: string): Promise<AuthResponse> => {
  // Assuming the standard JWT Authentication for WP REST API plugin is used
  // Endpoint: /wp-json/jwt-auth/v1/token
  
  return fetchWordPress('jwt-auth/v1/token', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
    }),
  });
};
