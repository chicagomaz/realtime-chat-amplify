import '@testing-library/jest-dom'

// Mock AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn(),
  signOut: jest.fn(),
}))

jest.mock('aws-amplify/utils', () => ({
  Hub: {
    listen: jest.fn(),
    remove: jest.fn(),
  },
}))

jest.mock('@aws-amplify/ui-react', () => ({
  Authenticator: ({ children }) => children({ signOut: jest.fn(), user: { attributes: { email: 'test@example.com' } } }),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({ id: 'test-conversation-id' }),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/font
jest.mock('next/font/google', () => ({
  Inter: () => ({ className: 'inter' }),
}))

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}))

// Mock UUID
jest.mock('uuid', () => ({
  v4: () => 'mock-uuid-1234',
}))

// Setup global test helpers
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))