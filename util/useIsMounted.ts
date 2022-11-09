import { useEffect, useState } from 'react';

export default () => {
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);
  return isMounted;
};
