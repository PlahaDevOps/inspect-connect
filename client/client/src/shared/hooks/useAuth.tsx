import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/index";
import type { RootState } from "../../store/index";
import { loginUser, logoutUser } from "../../store/actions/authActions";

export function useAuth() {
  return useSelector((s: RootState) => s.auth);  
}

export function useAuthActions() {
  const dispatch = useDispatch<AppDispatch>();
  return {
    login: (p: { email: string; password: string }) => dispatch(loginUser(p)).unwrap(),
    logout: () => dispatch(logoutUser()),
  };
}
    