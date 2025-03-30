import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  console.log('API - Starting request to:', url);
  const token = Cookies.get('token');
  console.log('API - Token present:', !!token);
  
  if (!token) {
    console.error('API - No authentication token found');
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  console.log('API - Request headers:', headers);

  try {
    console.log('API - Making fetch request');
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });
    console.log('API - Response status:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('API - Authentication failed');
        Cookies.remove('token');
        throw new Error('Authentication required');
      }
      const error = await response.json();
      console.error('API - Error response:', error);
      throw new Error(error.error || 'API request failed');
    }

    const data = await response.json();
    console.log('API - Successful response:', data);
    return data;
  } catch (error) {
    console.error('API - Request failed:', error);
    throw error;
  }
}

export const api = {
  submitSurvey: async (data: any) => {
    try {
      const response = await fetchWithAuth('/survey/submit', {
        method: 'POST',
        body: JSON.stringify({
          demographic: {
            ...data.demographic,
            age: Number(data.demographic.age)
          },
          health: {
            ...data.health,
            lifestyle: {
              ...data.health.lifestyle,
              smoking: Boolean(data.health.lifestyle.smoking)
            }
          },
          financial: {
            ...data.financial,
            income: Number(data.financial.income),
            savings: Number(data.financial.savings),
            insurance: Boolean(data.financial.insurance)
          }
        }),
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      return response;
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  },

  getResponses: async (isAdmin: boolean) => {
    return fetchWithAuth('/survey/responses');
  },

  getSurveyResponse: async (id: string) => {
    return fetchWithAuth(`/survey/response/${id}`);
  },
}; 