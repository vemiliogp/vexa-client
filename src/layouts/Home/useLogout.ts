import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { logout } from "@/services/auth";
import { useAuthStore } from "@/store/auth";

export const useLogout = () => {
  const navigate = useNavigate();
  const setIsAuth = useAuthStore((s) => s.setIsAuth);
  const setUser = useAuthStore((s) => s.setUser);

  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    },
    onError: () => {
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    },
  });

  return {
    logout: mutation.mutate,
    isPending: mutation.isPending,
  };
};
