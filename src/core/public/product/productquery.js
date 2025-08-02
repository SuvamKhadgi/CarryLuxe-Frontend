import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { getCSRFToken, refreshCSRFToken } from "../../../utils/csrf";

// Secure axios instance: cookie-based auth
const secureAxios = axios.create({
  baseURL: "https://localhost:3000/api",
  withCredentials: true,
});

// Add CSRF token interceptor to secureAxios instance
secureAxios.interceptors.request.use(async (config) => {
  const isAuthEndpoint = config.url?.includes('/creds/login') ||
    config.url?.includes('/creds/signup') ||
    config.url?.includes('/creds/logout') ||
    config.url?.includes('/login') ||
    config.url?.includes('/signup') ||
    config.url?.includes('/logout');

  // Add CSRF token to non-GET requests (except auth endpoints)
  if (config.method !== 'get' && !isAuthEndpoint) {
    try {
      const csrfToken = await getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    } catch (error) {
      console.warn('Failed to get CSRF token for productquery secureAxios:', error);
    }
  }
  return config;
});

// Response interceptor for CSRF token errors
secureAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle CSRF token mismatch
    if (error.response?.status === 403 &&
      error.response?.data?.error === 'CSRF_TOKEN_MISMATCH') {
      try {
        const newToken = await refreshCSRFToken();
        const originalRequest = error.config;
        originalRequest.headers['X-CSRF-Token'] = newToken;
        return secureAxios(originalRequest);
      } catch (retryError) {
        console.error('Failed to retry productquery secureAxios request with new CSRF token:', retryError);
      }
    }

    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const getUserId = async () => {
  const res = await secureAxios.get("/creds/me");
  return res.data.id;
};

export const useGetprod = () => {
  return useQuery({
    queryKey: ["GET_PROD_LIST"],
    queryFn: async () => {
      const response = await secureAxios.get("/items/");
      return response.data;
    },
  });
};

// Women Bags
export const useGetBabyCareProducts = () => {
  const { data, ...rest } = useGetprod();
  const filteredData = data?.filter((item) => item.sub_item_type === "Women Bags");
  return { data: filteredData, ...rest };
};

// Party Bags
export const useGetWomanCareProducts = () => {
  const { data, ...rest } = useGetprod();
  const filteredData = data?.filter((item) => item.sub_item_type === "Party Bags");
  return { data: filteredData, ...rest };
};

// Men Bags
export const useGetMenCareProducts = () => {
  const { data, ...rest } = useGetprod();
  const filteredData = data?.filter((item) => item.sub_item_type === "Men Bags");
  return { data: filteredData, ...rest };
};

// School Bags
export const useGetDevicesProducts = () => {
  const { data, ...rest } = useGetprod();
  const filteredData = data?.filter((item) => item.sub_item_type === "School Bags");
  return { data: filteredData, ...rest };
};

// Travel Bags
export const useGetFirstAidProducts = () => {
  const { data, ...rest } = useGetprod();
  const filteredData = data?.filter((item) => item.sub_item_type === "Travel Bags");
  return { data: filteredData, ...rest };
};

// Filter products by any filter object (category, price, etc)
export const useFilterProducts = (filterObj) => {
  return useQuery({
    queryKey: ["FILTER_PROD_LIST", filterObj],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filterObj || {}).forEach(([key, val]) => {
        if (val !== undefined && val !== "") params.append(key, val);
      });
      const response = await secureAxios.get("/items/filter?" + params.toString());
      return response.data;
    },
    enabled: !!filterObj && Object.keys(filterObj).length > 0,
  });
};

// Search products by query string
export const useSearchProducts = (query) => {
  return useQuery({
    queryKey: ["SEARCH_PROD_LIST", query],
    queryFn: async () => {
      if (!query) return [];
      const response = await secureAxios.get(`/items/search?query=${encodeURIComponent(query)}`);
      return response.data;
    },
    enabled: !!query,
  });
};

// Add to cart
export const useCartprod = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["ADD_TO_CART"],
    mutationFn: async ({ itemId, quantity }) => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User not logged in");
      }
      return secureAxios.post("/cart", {
        userId,
        items: [{ itemId, quantity }],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

// Add item to wishlist
export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId }) => {
      const userId = await getUserId();
      return secureAxios.post("/wishlist", { productId, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });
};

// Remove item from wishlist
export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId }) => {
      const userId = await getUserId();
      return secureAxios.delete(`/wishlist/${productId}`, {
        data: { userId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wishlist"]);
    },
  });
};

// Fetch wishlist
export const useGetWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User not logged in");
      }
      const { data } = await secureAxios.get("/wishlist", {
        params: { userId },
      });
      return data.wishlist;
    },
  });
};