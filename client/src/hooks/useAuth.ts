import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  enrollmentType?: string;
  neurotype?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/user');
        return await response.json() as User;
      } catch (error) {
        // Return demo user for development
        return {
          id: 'demo_student',
          username: 'demo_student',
          email: 'student@example.com',
          firstName: 'Demo',
          lastName: 'Student',
          role: 'student',
          enrollmentType: 'premium',
          neurotype: 'neurotypical'
        } as User;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false
  });

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user
  };
}