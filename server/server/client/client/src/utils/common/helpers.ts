
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/index';
import locationData from "../../shared/enums/country.json";


export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};
 
  export function getStatesByCountry(countryName: string) {
  const country = locationData?.find(c => c?.country?.toLowerCase() === countryName?.toLowerCase());
  return country ? country?.states?.map(s => s?.state) : [];
}

 
export function getCitiesByState(countryName: string, stateName: string) {
  const country = locationData?.find(c => c?.country?.toLowerCase() === countryName?.toLowerCase());
  if (!country) return [];

  const state = country?.states?.find(s => s?.state?.toLowerCase() === stateName?.toLowerCase());
  return state ? state.cities : [];
}
export function getCurrentTimeAndDate() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return `${hours}:${minutes}:${seconds}`;
}
 




export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 
 