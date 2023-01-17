import { addDoc, collection, doc } from 'firebase/firestore';

import { db } from '../test/firebase';
import { act, renderHook } from '@testing-library/react-hooks';
import { useDocument } from './useDocument';
import { useState } from 'react';

describe('useDocument hook', () => {
  test('begins in loading state', async () => {
    // arrange
    const { id } = await addDoc(collection(db, 'test'), {});

    // act
    const { result, unmount } = renderHook(() => {
      const [snapshot, loading, error] = useDocument(
        doc(collection(db, 'test'), id)
      );
      return { snapshot, loading, error };
    });

    //assert
    expect(result.current.snapshot).toBe(undefined);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(undefined);

    // clean up
    unmount();
  });

  test('loads and returns data from server', async () => {
    // arrange
    const { id } = await addDoc(collection(db, 'test'), { name: 'bo' });

    // act
    const { result, waitFor, unmount } = renderHook(() => {
      const [snapshot, loading, error] = useDocument(
        doc(collection(db, 'test'), id)
      );
      return { snapshot, loading, error };
    });
    await waitFor(() => result.current.loading === false);

    // assert
    expect(result.current.snapshot?.data()).toEqual({ name: 'bo' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);

    // clean up
    unmount();
  });

  test('start loading after documentReference is changed', async () => {
    // arrange
    const { id: id1 } = await addDoc(collection(db, 'test'), { a: '1' });
    const { id: id2 } = await addDoc(collection(db, 'test'), { b: '2' });

    // act
    const { result, unmount, waitFor } = renderHook(() => {
      const [id, setID] = useState(id1);
      const [snapshot, loading, error] = useDocument(
        doc(collection(db, 'test'), id)
      );
      return {
        id,
        snapshot,
        loading,
        error,
        setID,
      };
    });
    await waitFor(() => result.current.loading === false);

    act(() => {
      result.current.setID(id2);
    });

    //assert
    expect(result.current.snapshot).toBe(undefined);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(undefined);

    // clean up
    unmount();
  });

  test('loads and returns data from server after documentReference is changed', async () => {
    // arrange
    const { id: id1 } = await addDoc(collection(db, 'test'), { a: '1' });
    const { id: id2 } = await addDoc(collection(db, 'test'), { b: '2' });

    // act
    const { result, unmount, waitFor } = renderHook(() => {
      const [id, setID] = useState(id1);
      const [snapshot, loading, error] = useDocument(
        doc(collection(db, 'test'), id)
      );
      return {
        id,
        snapshot,
        loading,
        error,
        setID,
      };
    });

    await waitFor(() => result.current.loading === false);

    act(() => result.current.setID(id2));

    await waitFor(() => result.current.loading === false);

    //assert
    expect(result.current.snapshot?.data()).toEqual({ b: '2' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(undefined);

    // clean up
    unmount();
  });

  test('consistency between params and result data', async () => {
    // arrange
    const { id: id1 } = await addDoc(collection(db, 'test'), { a: '1' });
    const { id: id2 } = await addDoc(collection(db, 'test'), { b: '2' });

    // act
    const { result, unmount, waitFor } = renderHook(() => {
      const [id, setID] = useState(id1);
      const [snapshot, loading, error] = useDocument(
        doc(collection(db, 'test'), id)
      );
      return {
        id,
        snapshot,
        loading,
        error,
        setID,
      };
    });

    await waitFor(() => result.current.loading === false);

    act(() => {
      result.current.setID(id2);
    });

    await waitFor(() => result.current.loading === false);

    //assert
    result.all.forEach((_eachResult) => {
      const eachResult = _eachResult as typeof result.current;
      expect([
        { id: id1, data: undefined },
        { id: id1, data: { a: '1' } },
        { id: id2, data: undefined },
        { id: id2, data: { b: '2' } },
      ]).toContainEqual({
        id: eachResult.id,
        data: eachResult.snapshot?.data(),
      });
    });

    // clean up
    unmount();
  });
});
