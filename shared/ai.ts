export interface TestCaseSummary {
  id: string;
  title: string;
  description: string;
  framework: string;
  complexity: "Low" | "Medium" | "High";
  estimatedTime: string;
  files?: string[];
}

export interface CodeFile {
  name: string;
  path: string;
  type: "file" | "dir";
  language?: string;
  content?: string;
  selected?: boolean;
}

export interface GenerateTestSummariesRequest {
  files: CodeFile[];
}

export interface GenerateTestSummariesResponse {
  summaries: TestCaseSummary[];
}

export interface GenerateTestCodeRequest {
  summaryId: string;
  files: CodeFile[];
}

export interface GenerateTestCodeResponse {
  code: string;
  framework: string;
  filename: string;
}

export interface TestFramework {
  id: string;
  name: string;
  description: string;
  languages: string[];
  setup: string[];
}

export const SUPPORTED_FRAMEWORKS: TestFramework[] = [
  {
    id: "jest-rtl",
    name: "Jest + React Testing Library",
    description: "Unit and integration testing for React components",
    languages: ["JavaScript", "TypeScript"],
    setup: [
      "npm install --save-dev jest @testing-library/react @testing-library/jest-dom",
    ],
  },
  {
    id: "jest-msw",
    name: "Jest + MSW",
    description: "API testing with mock service workers",
    languages: ["JavaScript", "TypeScript"],
    setup: ["npm install --save-dev jest msw"],
  },
  {
    id: "playwright",
    name: "Playwright",
    description: "End-to-end testing across all browsers",
    languages: ["JavaScript", "TypeScript"],
    setup: ["npm install --save-dev @playwright/test"],
  },
  {
    id: "pytest",
    name: "PyTest",
    description: "Python testing framework",
    languages: ["Python"],
    setup: ["pip install pytest pytest-mock requests-mock"],
  },
  {
    id: "junit",
    name: "JUnit",
    description: "Java unit testing framework",
    languages: ["Java"],
    setup: ["Add JUnit 5 dependency to pom.xml or build.gradle"],
  },
  {
    id: "go-test",
    name: "Go Testing",
    description: "Built-in Go testing package",
    languages: ["Go"],
    setup: ["No additional setup required - uses built-in testing package"],
  },
];
