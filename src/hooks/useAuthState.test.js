import { renderHook, act } from '@testing-library/react';
import { useAuthState } from './useAuthState';
import { onAuthStateChanged } from 'firebase/auth';

jest.mock('../firebase/config', () => ({ auth: {} }));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
}));

describe('useAuthState', () => {
  test('updates state on auth change', () => {
    let handler;
    onAuthStateChanged.mockImplementation((auth, callback) => {
      handler = callback;
      return jest.fn();
    });

    const { result } = renderHook(() => useAuthState());

    expect(onAuthStateChanged).toHaveBeenCalled();

    act(() => {
      handler({ uid: '123' });
    });

    expect(result.current.user).toEqual({ uid: '123' });
    expect(result.current.loading).toBe(false);
  });
});
