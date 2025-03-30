const TOKEN_COOKIE_NAME = 'auth_token';

export function setToken(token: string) {
  console.log('Setting token:', token);
  // Set cookie with token
  document.cookie = `${TOKEN_COOKIE_NAME}=${token}; path=/; max-age=604800; SameSite=Lax; domain=localhost`; // 7 days
  console.log('Cookie set:', document.cookie);
}

export function getToken(): string | null {
  // Get token from cookie
  const cookies = document.cookie.split(';');
  console.log('All cookies:', cookies);
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith(`${TOKEN_COOKIE_NAME}=`));
  console.log('Token cookie:', tokenCookie);
  const token = tokenCookie ? tokenCookie.split('=')[1] : null;
  console.log('Extracted token:', token);
  return token;
}

export function removeToken() {
  console.log('Removing all cookies');
  // Get all cookies
  const cookies = document.cookie.split(';');
  
  // Remove each cookie
  cookies.forEach(cookie => {
    const [name] = cookie.split('=');
    const trimmedName = name.trim();
    document.cookie = `${trimmedName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost`;
  });
  
  console.log('Cookies after removal:', document.cookie);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  console.log('isAuthenticated:', !!token);
  return !!token;
} 