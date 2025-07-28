import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  return useQuery({
    queryKey: ["GET_USER_LIST"],
    queryFn: async () => {
      const response = await fetch("https://localhost:3000/api/creds/getuser", {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json();
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};