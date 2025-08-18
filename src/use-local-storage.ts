import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
type SetValue<T> = Dispatch<SetStateAction<T>>;
export const useLocalStorage = <T>(key: string, defaultValue: unknown) => {
  const [state, setState] = useState<T>(() => {
    const item = localStorage.getItem(key)
    if (item != null) {
      return(JSON.parse(item));
    }else{
      return defaultValue;
    }
  });
  const updateState:SetValue<T> = (value: unknown) => {
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

  return [state, updateState];
};