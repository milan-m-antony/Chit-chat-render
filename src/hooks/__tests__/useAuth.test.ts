import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useAuth', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => mockRouter);
    (useSession as jest.Mock).mockImplementation(() => ({
      data: null,
      status: 'unauthenticated',
    }));
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.errors).toEqual({});
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isUnauthenticated).toBe(true);
  });

  it('handles successful registration', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: '1', email: 'test@example.com' }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('John Doe', 'test@example.com', 'Password123!');
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/login?registered=true');
    expect(result.current.errors).toEqual({});
  });

  it('handles registration validation errors', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('J', 'invalid-email', 'weak');
    });

    expect(result.current.errors).toHaveProperty('name');
    expect(result.current.errors).toHaveProperty('email');
    expect(result.current.errors).toHaveProperty('password');
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('handles registration API errors', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'User already exists' }),
      })
    ) as jest.Mock;

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register('John Doe', 'test@example.com', 'Password123!');
    });

    expect(result.current.errors).toHaveProperty('form', 'User already exists');
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('updates authentication status based on session', () => {
    (useSession as jest.Mock).mockImplementation(() => ({
      data: { user: { id: '1', email: 'test@example.com' } },
      status: 'authenticated',
    }));

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isUnauthenticated).toBe(false);
    expect(result.current.session).toBeTruthy();
  });
});