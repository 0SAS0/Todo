import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
type SetValue<T> = Dispatch<SetStateAction<T>>;
export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    const item = localStorage.getItem(key)
    if (item != null) {
      return(JSON.parse(item) as T);
    }else{
      return defaultValue;
    }
  });
  const updateState:SetValue<T> = (value) => {
    const newValue = value instanceof Function ? value(state) : value;
    localStorage.setItem(key, JSON.stringify(newValue));
    setState(newValue);
  };
  const getValue = useCallback(() => {
    const item = localStorage.getItem(key)
    if (item != null) {
      setState(JSON.parse(item));
    }
  },[key]);
  useEffect(() => {
    addEventListener('storage',
      getValue
    );
    return () => {
      removeEventListener('storage',
        getValue)
    };
  },[getValue]);

  return [state, updateState] as const;
};