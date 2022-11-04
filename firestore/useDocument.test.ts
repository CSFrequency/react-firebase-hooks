import { addDoc, collection, doc } from 'firebase/firestore';

import { db } from '../test/firebase';
import { renderHook } from '@testing-library/react-hooks';
import { useDocument } from './useDocument';

describe('useDocument hook', () => {
  test('begins in loading state', async () => {
    // arrange
    const { id } = await addDoc(collection(db, 'test'), {});

    // act
    const { result, unmount } = renderHook(() =>
      useDocument(doc(collection(db, 'test'), id))
    );

    //assert
    expect(result.current[1]).toBeTruthy();

    // clean up
    unmount();
  });

  test('loads and returns data from server', async () => {
    // arrange
    const { id } = await addDoc(collection(db, 'test'), { name: 'bo' });

    // act
    const { result, waitFor, unmount } = renderHook(() =>
      useDocument(doc(collection(db, 'test'), id))
    );
    await waitFor(() => result.current[1] === false);

    // assert
    expect(result.current[0]?.data()).toEqual({ name: 'bo' });

    // clean up
    unmount();
  });
});
