import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import DOMPurify from 'dompurify';

// Secure axios instance
const secureAxios = axios.create({
  baseURL: "https://localhost:3000/api",
  headers: {
    'Content-Type': 'multipart/form-data',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// Response interceptor
secureAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const useGetList = () => {
  return useQuery({
    queryKey: ["GET_ITEM_LIST"],
    queryFn: async () => {
      const response = await secureAxios.get("/items");
      const sanitizedData = response.data.map(item => ({
        ...item,
        item_name: DOMPurify.sanitize(item.item_name),
        description: DOMPurify.sanitize(item.description),
      }));
      return { data: sanitizedData };
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSaveItem = () => {
  return useMutation({
    mutationKey: ["SAVE_ITEM_DATA"],
    mutationFn: async (data) => {
      const itemName = DOMPurify.sanitize(data.get('item_name'));
      const description = DOMPurify.sanitize(data.get('description'));
      if (!itemName || !description) {
        throw new Error("Item name and description are required");
      }
      return secureAxios.post("/items", data);
    },
    onError: (error) => {
      console.error("Save item error:", error.message);
    },
  });
};

export const useDeleteItem = () => {
  return useMutation({
    mutationKey: ["DELETE_ITEM_DATA"],
    mutationFn: async (id) => {
      if (!id) {
        throw new Error("Invalid item ID");
      }
      return secureAxios.delete(`/items/${DOMPurify.sanitize(id)}`);
    },
    onError: (error) => {
      console.error("Delete item error:", error.message);
    },
  });
};

export const useUpdateItem = () => {
  return useMutation({
    mutationKey: ["UPDATE_ITEM_DATA"],
    mutationFn: async ({ id, data }) => {
      if (!id) {
        throw new Error("Invalid item ID");
      }
      const itemName = DOMPurify.sanitize(data.get('item_name'));
      const description = DOMPurify.sanitize(data.get('description'));
      if (!itemName || !description) {
        throw new Error("Item name and description are required");
      }
      return secureAxios.put(`/items/${DOMPurify.sanitize(id)}`, data);
    },
    onError: (error) => {
      console.error("Update item error:", error.message);
    },
  });
};

export const useSearchItems = () => {
  return useQuery({
    queryKey: ["SEARCH_ITEMS"],
    queryFn: async ({ queryKey }) => {
      const [, query] = queryKey;
      if (!query) return { data: [] };
      const response = await secureAxios.get(`/items/search?query=${encodeURIComponent(query)}`);
      return { data: response.data };
    },
    enabled: false,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });
};