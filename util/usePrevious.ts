import { useEffect, useRef } from 'react';

export const usePrevious = <T>(currentValue: T): T | undefined => {
  const previousRef = useRef<T | undefined>(undefined);

  useEffect(() => {
    previousRef.current = currentValue;
  });

  return previousRef.current;
};
