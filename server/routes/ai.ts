import { RequestHandler } from "express";

interface TestCaseSummary {
  id: string;
  title: string;
  description: string;
  framework: string;
  complexity: 'Low' | 'Medium' | 'High';
  estimatedTime: string;
  files: string[];
}

interface GenerateTestCodeRequest {
  summaryId: string;
  files: Array<{
    path: string;
    content: string;
    language: string;
  }>;
}

export const handleGenerateTestSummaries: RequestHandler = async (req, res) => {
  const { files } = req.body;
  
  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "Files array is required" });
  }

  try {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real implementation, this would:
    // 1. Analyze the provided code files
    // 2. Send to AI service (OpenAI, Google Gemini, etc.)
    // 3. Generate intelligent test case summaries

    const summaries: TestCaseSummary[] = [];

    // Analyze file types and generate appropriate test summaries
    const hasReactComponents = files.some(f => 
      f.path.includes('.tsx') || f.path.includes('.jsx') || 
      f.content?.includes('React') || f.content?.includes('component')
    );
    
    const hasApiCode = files.some(f => 
      f.path.includes('api') || f.path.includes('service') ||
      f.content?.includes('fetch') || f.content?.includes('axios')
    );
    
    const hasUtilityFunctions = files.some(f => 
      f.path.includes('utils') || f.path.includes('helpers') ||
      f.path.includes('lib')
    );

    const hasHooks = files.some(f => 
      f.path.includes('hooks') || f.path.includes('use') ||
      f.content?.includes('useState') || f.content?.includes('useEffect')
    );

    if (hasReactComponents) {
      summaries.push({
        id: "react-components",
        title: "React Component Tests",
        description: "Comprehensive tests for React components including rendering, props validation, user interactions, and accessibility",
        framework: "Jest + React Testing Library",
        complexity: "Medium",
        estimatedTime: "25 min",
        files: files.filter(f => f.path.includes('.tsx') || f.path.includes('.jsx')).map(f => f.path)
      });

      summaries.push({
        id: "component-integration",
        title: "Component Integration Tests", 
        description: "Tests for component interactions, state management, and data flow between parent and child components",
        framework: "Jest + React Testing Library",
        complexity: "High",
        estimatedTime: "40 min",
        files: files.map(f => f.path)
      });
    }

    if (hasApiCode) {
      summaries.push({
        id: "api-tests",
        title: "API Integration Tests",
        description: "Mock API calls, test error handling, data transformation, and response validation",
        framework: "Jest + MSW (Mock Service Worker)",
        complexity: "Medium",
        estimatedTime: "30 min",
        files: files.filter(f => f.path.includes('api') || f.path.includes('service')).map(f => f.path)
      });
    }

    if (hasUtilityFunctions) {
      summaries.push({
        id: "utility-tests",
        title: "Utility Function Tests",
        description: "Unit tests for helper functions, data validators, formatters, and pure functions",
        framework: "Jest",
        complexity: "Low",
        estimatedTime: "15 min",
        files: files.filter(f => f.path.includes('utils') || f.path.includes('helpers')).map(f => f.path)
      });
    }

    if (hasHooks) {
      summaries.push({
        id: "hooks-tests",
        title: "Custom Hook Tests",
        description: "Test custom React hooks with renderHook, state changes, and side effects",
        framework: "Jest + @testing-library/react-hooks",
        complexity: "Medium",
        estimatedTime: "20 min",
        files: files.filter(f => f.path.includes('hooks') || f.path.includes('use')).map(f => f.path)
      });
    }

    // Always include E2E if there are multiple components
    if (files.length > 3) {
      summaries.push({
        id: "e2e-tests",
        title: "End-to-End User Flow Tests",
        description: "Complete user journey testing from authentication to key feature interactions",
        framework: "Playwright",
        complexity: "High",
        estimatedTime: "50 min",
        files: files.map(f => f.path)
      });
    }

    // Add performance tests for larger codebases
    if (files.length > 5) {
      summaries.push({
        id: "performance-tests",
        title: "Performance & Load Tests",
        description: "Component rendering performance, memory leaks, and optimization validation",
        framework: "Jest + React Testing Library + @testing-library/jest-dom",
        complexity: "High",
        estimatedTime: "35 min",
        files: files.map(f => f.path)
      });
    }

    res.json({ summaries });
  } catch (error) {
    console.error("Failed to generate test summaries:", error);
    res.status(500).json({ error: "Failed to generate test summaries" });
  }
};

export const handleGenerateTestCode: RequestHandler = async (req, res) => {
  const { summaryId, files } = req.body as GenerateTestCodeRequest;
  
  if (!summaryId || !files || !Array.isArray(files)) {
    return res.status(400).json({ error: "Summary ID and files are required" });
  }

  try {
    // Simulate AI code generation time
    await new Promise(resolve => setTimeout(resolve, 2000));

    let generatedCode = "";

    // Generate different test code based on summary type
    switch (summaryId) {
      case "react-components":
        generatedCode = generateReactComponentTests(files);
        break;
      case "api-tests":
        generatedCode = generateApiTests(files);
        break;
      case "utility-tests":
        generatedCode = generateUtilityTests(files);
        break;
      case "hooks-tests":
        generatedCode = generateHooksTests(files);
        break;
      case "e2e-tests":
        generatedCode = generateE2ETests(files);
        break;
      case "component-integration":
        generatedCode = generateIntegrationTests(files);
        break;
      case "performance-tests":
        generatedCode = generatePerformanceTests(files);
        break;
      default:
        generatedCode = generateGenericTests(files);
    }

    res.json({ 
      code: generatedCode,
      framework: getFrameworkForSummary(summaryId),
      filename: getFilenameForSummary(summaryId, files)
    });
  } catch (error) {
    console.error("Failed to generate test code:", error);
    res.status(500).json({ error: "Failed to generate test code" });
  }
};

function generateReactComponentTests(files: any[]): string {
  const componentFile = files.find(f => f.path.includes('UserProfile') || f.path.includes('.tsx'));
  const componentName = componentFile?.path.split('/').pop()?.replace('.tsx', '') || 'Component';
  
  return `import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${componentName} } from '../${componentFile?.path || 'Component'}';

describe('${componentName}', () => {
  const mockProps = {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg'
    },
    onEdit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders user information correctly', () => {
    render(<${componentName} {...mockProps} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProps.user.avatar);
  });

  test('handles missing avatar gracefully', () => {
    const propsWithoutAvatar = {
      ...mockProps,
      user: { ...mockProps.user, avatar: undefined }
    };
    
    render(<${componentName} {...propsWithoutAvatar} />);
    
    // Should show default avatar or initials
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', expect.stringContaining('default'));
  });

  test('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<${componentName} {...mockProps} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    expect(mockProps.onEdit).toHaveBeenCalledWith(mockProps.user.id);
  });

  test('does not render edit button when onEdit is not provided', () => {
    const { onEdit, ...propsWithoutEdit } = mockProps;
    render(<${componentName} {...propsWithoutEdit} />);
    
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
  });

  test('has correct accessibility attributes', () => {
    render(<${componentName} {...mockProps} />);
    
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', mockProps.user.name);
  });
});`;
}

function generateApiTests(files: any[]): string {
  return `import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { fetchUserData, updateUserProfile } from '../utils/api';

const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      })
    );
  }),
  
  rest.put('/api/users/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com'
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Functions', () => {
  test('fetchUserData retrieves user successfully', async () => {
    const userData = await fetchUserData(1);
    
    expect(userData).toEqual({
      id: 1,
      name: 'John Doe', 
      email: 'john@example.com'
    });
  });

  test('fetchUserData handles error responses', async () => {
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res(ctx.status(404), ctx.json({ error: 'User not found' }));
      })
    );

    await expect(fetchUserData(999)).rejects.toThrow('User not found');
  });

  test('updateUserProfile updates user data', async () => {
    const updateData = { name: 'Updated Name', email: 'updated@example.com' };
    const result = await updateUserProfile(1, updateData);
    
    expect(result).toEqual({
      id: 1,
      ...updateData
    });
  });

  test('handles network errors gracefully', async () => {
    server.use(
      rest.get('/api/users/:id', (req, res, ctx) => {
        return res.networkError('Connection failed');
      })
    );

    await expect(fetchUserData(1)).rejects.toThrow('Connection failed');
  });
});`;
}

function generateUtilityTests(files: any[]): string {
  return `import { 
  formatDate, 
  validateEmail, 
  calculateAge, 
  debounce 
} from '../utils/helpers';

describe('Utility Functions', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2023-12-25T10:30:00Z');
      expect(formatDate(date)).toBe('December 25, 2023');
    });

    test('handles invalid dates', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });
  });

  describe('validateEmail', () => {
    test('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('calculateAge', () => {
    test('calculates age correctly', () => {
      const birthDate = new Date('1990-01-01');
      const referenceDate = new Date('2023-01-01');
      expect(calculateAge(birthDate, referenceDate)).toBe(33);
    });

    test('handles edge cases', () => {
      const birthDate = new Date('2000-12-31');
      const referenceDate = new Date('2001-01-01');
      expect(calculateAge(birthDate, referenceDate)).toBe(0);
    });
  });

  describe('debounce', () => {
    jest.useFakeTimers();

    test('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      jest.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});`;
}

function generateHooksTests(files: any[]): string {
  return `import { renderHook, act } from '@testing-library/react';
import { useAuth, useApi } from '../hooks';

describe('Custom Hooks', () => {
  describe('useAuth', () => {
    test('initializes with correct default state', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(false);
    });

    test('handles login correctly', async () => {
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        await result.current.login('test@example.com', 'password');
      });
      
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toBeTruthy();
    });

    test('handles logout correctly', () => {
      const { result } = renderHook(() => useAuth());
      
      act(() => {
        result.current.logout();
      });
      
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  describe('useApi', () => {
    test('manages loading state correctly', async () => {
      const mockFetch = jest.fn().mockResolvedValue({ data: 'test' });
      const { result } = renderHook(() => useApi(mockFetch));
      
      expect(result.current.loading).toBe(false);
      
      act(() => {
        result.current.execute();
      });
      
      expect(result.current.loading).toBe(true);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });
      
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual({ data: 'test' });
    });

    test('handles errors correctly', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('API Error'));
      const { result } = renderHook(() => useApi(mockFetch));
      
      await act(async () => {
        await result.current.execute();
      });
      
      expect(result.current.error).toBeTruthy();
      expect(result.current.data).toBeNull();
    });
  });
});`;
}

function generateE2ETests(files: any[]): string {
  return `import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('user can sign up, log in, and manage profile', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Sign up flow
    await page.click('[data-testid="signup-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'securepassword');
    await page.fill('[data-testid="confirm-password-input"]', 'securepassword');
    await page.click('[data-testid="submit-signup"]');
    
    // Verify successful signup
    await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
    
    // Log out
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    // Log back in
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'securepassword');
    await page.click('[data-testid="submit-login"]');
    
    // Verify successful login
    await expect(page.locator('[data-testid="dashboard"]')).toBeVisible();
    
    // Update profile
    await page.click('[data-testid="profile-link"]');
    await page.fill('[data-testid="name-input"]', 'Updated Name');
    await page.click('[data-testid="save-profile"]');
    
    // Verify profile update
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="user-name"]')).toHaveText('Updated Name');
  });

  test('handles authentication errors gracefully', async ({ page }) => {
    await page.goto('/');
    
    // Try to log in with invalid credentials
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'invalid@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="submit-login"]');
    
    // Verify error message is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
  });
});

test.describe('Core Feature Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Set up authenticated state
    await page.goto('/');
    await page.click('[data-testid="login-button"]');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.click('[data-testid="submit-login"]');
  });

  test('user can create and manage items', async ({ page }) => {
    // Navigate to create item page
    await page.click('[data-testid="create-item-button"]');
    
    // Fill out item form
    await page.fill('[data-testid="item-title"]', 'Test Item');
    await page.fill('[data-testid="item-description"]', 'This is a test item');
    await page.selectOption('[data-testid="item-category"]', 'work');
    
    // Submit form
    await page.click('[data-testid="submit-item"]');
    
    // Verify item was created
    await expect(page.locator('[data-testid="item-list"]')).toContainText('Test Item');
    
    // Edit the item
    await page.click('[data-testid="edit-item-1"]');
    await page.fill('[data-testid="item-title"]', 'Updated Test Item');
    await page.click('[data-testid="submit-item"]');
    
    // Verify item was updated
    await expect(page.locator('[data-testid="item-list"]')).toContainText('Updated Test Item');
    
    // Delete the item
    await page.click('[data-testid="delete-item-1"]');
    await page.click('[data-testid="confirm-delete"]');
    
    // Verify item was deleted
    await expect(page.locator('[data-testid="item-list"]')).not.toContainText('Updated Test Item');
  });
});`;
}

function generateIntegrationTests(files: any[]): string {
  return `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../App';

const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Application Integration Tests', () => {
  test('complete user workflow from landing to dashboard', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    // Start from landing page
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    
    // Navigate to signup
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Fill signup form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword');
    await user.click(screen.getByRole('button', { name: /create account/i }));
    
    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
    
    // Verify user can interact with main features
    expect(screen.getByRole('button', { name: /create item/i })).toBeInTheDocument();
  });

  test('handles data fetching and state management', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);
    
    // Mock authenticated state
    // Login process...
    
    // Verify loading states
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Verify data is displayed
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test('handles error boundaries and error states', async () => {
    // Mock API error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderWithProviders(<App />);
    
    // Trigger error condition
    // This would depend on your specific error scenarios
    
    // Verify error is handled gracefully
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
    
    console.error.mockRestore();
  });
});`;
}

function generatePerformanceTests(files: any[]): string {
  return `import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { UserProfile } from '../components/UserProfile';
import { performanceMonitor } from '../utils/performance';

describe('Performance Tests', () => {
  test('component renders within performance budget', () => {
    const startTime = performance.now();
    
    render(<UserProfile user={{ id: 1, name: 'Test User', email: 'test@example.com' }} />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 16ms (60fps budget)
    expect(renderTime).toBeLessThan(16);
  });

  test('handles large datasets efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: \`User \${i}\`,
      email: \`user\${i}@example.com\`
    }));

    const startTime = performance.now();
    
    render(
      <div>
        {largeDataset.map(user => (
          <UserProfile key={user.id} user={user} />
        ))}
      </div>
    );
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should handle large datasets within reasonable time
    expect(renderTime).toBeLessThan(1000); // 1 second max
  });

  test('does not cause memory leaks', () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Render and unmount multiple times
    for (let i = 0; i < 100; i++) {
      const { unmount } = render(
        <UserProfile user={{ id: i, name: \`User \${i}\`, email: \`user\${i}@example.com\` }} />
      );
      unmount();
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be minimal
    expect(memoryIncrease).toBeLessThan(1024 * 1024); // Less than 1MB
  });

  test('optimizes re-renders', () => {
    let renderCount = 0;
    
    const TestComponent = ({ user }: { user: any }) => {
      renderCount++;
      return <UserProfile user={user} />;
    };
    
    const user = { id: 1, name: 'Test User', email: 'test@example.com' };
    const { rerender } = render(<TestComponent user={user} />);
    
    // Re-render with same props
    rerender(<TestComponent user={user} />);
    rerender(<TestComponent user={user} />);
    
    // Should use memoization to prevent unnecessary re-renders
    expect(renderCount).toBeLessThanOrEqual(2);
  });
});`;
}

function generateGenericTests(files: any[]): string {
  return `import { render, screen } from '@testing-library/react';

describe('Generic Tests', () => {
  test('renders without crashing', () => {
    // Basic smoke test
    render(<div>Test Component</div>);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  test('handles props correctly', () => {
    const testProps = { title: 'Test Title' };
    // Test component with props
  });
});`;
}

function getFrameworkForSummary(summaryId: string): string {
  const frameworks = {
    'react-components': 'Jest + React Testing Library',
    'api-tests': 'Jest + MSW',
    'utility-tests': 'Jest',
    'hooks-tests': 'Jest + @testing-library/react-hooks',
    'e2e-tests': 'Playwright',
    'component-integration': 'Jest + React Testing Library',
    'performance-tests': 'Jest + React Testing Library'
  };
  return frameworks[summaryId] || 'Jest';
}

function getFilenameForSummary(summaryId: string, files: any[]): string {
  const baseName = summaryId.replace(/-/g, '');
  return `${baseName}.test.tsx`;
}
