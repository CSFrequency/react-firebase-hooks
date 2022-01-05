import { HttpsCallable, HttpsCallableResult } from 'firebase/functions';
import { useMemo, useState } from 'react';

export type HttpsCallableHook<RequestData = unknown, ResponseData = unknown> = [
  (data?: RequestData) => Promise<HttpsCallableResult<ResponseData> | unknown>,
  boolean,
  Error | undefined
];

export default <RequestData = unknown, ResponseData = unknown>(
  callable: HttpsCallable<RequestData, ResponseData>
): HttpsCallableHook<RequestData, ResponseData> => {
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);

  const callCallable = async (
    data?: RequestData
  ): Promise<HttpsCallableResult<ResponseData> | undefined> => {
    setLoading(true);
    try {
      return callable(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const resArray: HttpsCallableHook<RequestData, ResponseData> = [
    callCallable,
    loading,
    error,
  ];
  return useMemo<HttpsCallableHook<RequestData, ResponseData>>(
    () => resArray,
    resArray
  );
};
