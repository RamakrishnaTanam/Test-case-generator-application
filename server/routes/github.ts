import { RequestHandler } from "express";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  private: boolean;
}

interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url?: string;
}

export const handleGitHubAuth: RequestHandler = (req, res) => {
  // In a real implementation, this would handle OAuth flow
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
  res.json({ authUrl });
};

export const handleGitHubCallback: RequestHandler = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code required" });
  }

  try {
    // In a real implementation, exchange code for access token
    // const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     client_id: process.env.GITHUB_CLIENT_ID,
    //     client_secret: process.env.GITHUB_CLIENT_SECRET,
    //     code: code,
    //   }),
    // });

    // For demo purposes, return mock success
    res.json({
      access_token: "mock_token",
      token_type: "bearer",
      scope: "repo",
    });
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.status(500).json({ error: "GitHub authentication failed" });
  }
};

export const handleGetRepositories: RequestHandler = async (req, res) => {
  const authHeader = req.headers.authorization;
  const { username } = req.query;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    let repos: GitHubRepo[] = [];

    if (username) {
      // Try to fetch real repositories from GitHub API
      try {
        console.log(`🔍 Fetching repositories for user: ${username}`);
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'TestGen-AI-App'
          },
        });

        if (response.ok) {
          const githubRepos = await response.json();
          repos = githubRepos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description || "No description available",
            language: repo.language || "Unknown",
            private: repo.private,
          }));

          console.log(`✅ Successfully fetched ${repos.length} repositories for ${username}`);
        } else {
          console.warn(`⚠️ GitHub API responded with ${response.status}, falling back to mock data`);
          throw new Error('GitHub API error');
        }
      } catch (githubError) {
        console.warn('Failed to fetch from GitHub API, using mock data:', githubError);
        // Fallback to mock repositories if GitHub API fails
        repos = [
          {
            id: 1,
            name: "my-react-app",
            full_name: `${username}/my-react-app`,
            description: "A modern React application with TypeScript",
            language: "TypeScript",
            private: false,
          },
          {
            id: 2,
            name: "api-service",
            full_name: `${username}/api-service`,
            description: "REST API built with Node.js",
            language: "JavaScript",
            private: false,
          },
          {
            id: 3,
            name: "mobile-app",
            full_name: `${username}/mobile-app`,
            description: "React Native mobile application",
            language: "TypeScript",
            private: true,
          },
          {
            id: 4,
            name: "data-pipeline",
            full_name: `${username}/data-pipeline`,
            description: "Python data processing pipeline",
            language: "Python",
            private: false,
          },
        ];
      }
    } else {
      // Default mock repositories if no username provided
      repos = [
        {
          id: 1,
          name: "sample-repo",
          full_name: "user/sample-repo",
          description: "Sample repository for testing",
          language: "JavaScript",
          private: false,
        },
      ];
    }

    res.json(repos);
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
};

export const handleGetRepositoryFiles: RequestHandler = async (req, res) => {
  const { owner, repo } = req.params;
  const authHeader = req.headers.authorization;

  console.log(`📁 Fetching files for repository: ${owner}/${repo}`);

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    let files: GitHubFile[] = [];

    // Try to fetch real files from GitHub API
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TestGen-AI-App'
        },
      });

      if (response.ok) {
        const githubFiles = await response.json();
        files = githubFiles.map((file: any) => ({
          name: file.name,
          path: file.path,
          type: file.type,
          download_url: file.download_url
        }));

        console.log(`✅ Successfully fetched ${files.length} files for ${owner}/${repo}`);
      } else {
        console.warn(`⚠️ GitHub API responded with ${response.status}, falling back to repository-specific mock data`);
        throw new Error('GitHub API error');
      }
    } catch (githubError) {
      console.warn('Failed to fetch from GitHub API, using repository-specific mock data:', githubError);

      // Generate repository-specific mock files based on repo name and language
      files = generateRepositorySpecificFiles(repo);
    }

    res.json(files);
  } catch (error) {
    console.error("Failed to fetch repository files:", error);
    res.status(500).json({ error: "Failed to fetch repository files" });
  }
};

function generateRepositorySpecificFiles(repoName: string): GitHubFile[] {
  const repoLower = repoName.toLowerCase();

  if (repoLower.includes('flask') || repoLower.includes('python')) {
    return [
      { name: "app.py", path: "app.py", type: "file" },
      { name: "requirements.txt", path: "requirements.txt", type: "file" },
      { name: "config.py", path: "config.py", type: "file" },
      { name: "models", path: "models", type: "dir" },
      { name: "user.py", path: "models/user.py", type: "file" },
      { name: "auth.py", path: "models/auth.py", type: "file" },
      { name: "routes", path: "routes", type: "dir" },
      { name: "api.py", path: "routes/api.py", type: "file" },
      { name: "auth.py", path: "routes/auth.py", type: "file" },
      { name: "utils", path: "utils", type: "dir" },
      { name: "helpers.py", path: "utils/helpers.py", type: "file" },
      { name: "validators.py", path: "utils/validators.py", type: "file" },
      { name: "tests", path: "tests", type: "dir" },
      { name: "test_app.py", path: "tests/test_app.py", type: "file" },
      { name: "README.md", path: "README.md", type: "file" },
    ];
  } else if (repoLower.includes('react') || repoLower.includes('js') || repoLower.includes('ts')) {
    return [
      { name: "src", path: "src", type: "dir" },
      { name: "components", path: "src/components", type: "dir" },
      { name: "App.tsx", path: "src/App.tsx", type: "file" },
      { name: "index.tsx", path: "src/index.tsx", type: "file" },
      { name: "Button.tsx", path: "src/components/Button.tsx", type: "file" },
      { name: "Header.tsx", path: "src/components/Header.tsx", type: "file" },
      { name: "utils", path: "src/utils", type: "dir" },
      { name: "api.ts", path: "src/utils/api.ts", type: "file" },
      { name: "helpers.ts", path: "src/utils/helpers.ts", type: "file" },
      { name: "package.json", path: "package.json", type: "file" },
      { name: "tsconfig.json", path: "tsconfig.json", type: "file" },
      { name: "README.md", path: "README.md", type: "file" },
    ];
  } else if (repoLower.includes('api') || repoLower.includes('service')) {
    return [
      { name: "server.js", path: "server.js", type: "file" },
      { name: "routes", path: "routes", type: "dir" },
      { name: "index.js", path: "routes/index.js", type: "file" },
      { name: "users.js", path: "routes/users.js", type: "file" },
      { name: "middleware", path: "middleware", type: "dir" },
      { name: "auth.js", path: "middleware/auth.js", type: "file" },
      { name: "utils", path: "utils", type: "dir" },
      { name: "database.js", path: "utils/database.js", type: "file" },
      { name: "package.json", path: "package.json", type: "file" },
      { name: "README.md", path: "README.md", type: "file" },
    ];
  } else {
    // Generic repository structure
    return [
      { name: "src", path: "src", type: "dir" },
      { name: "main.js", path: "src/main.js", type: "file" },
      { name: "utils.js", path: "src/utils.js", type: "file" },
      { name: "config.json", path: "config.json", type: "file" },
      { name: "package.json", path: "package.json", type: "file" },
      { name: "README.md", path: "README.md", type: "file" },
    ];
  }
}

export const handleGetFileContent: RequestHandler = async (req, res) => {
  const { owner, repo, path } = req.params;
  const authHeader = req.headers.authorization;

  console.log(`📁 Fetching file content: ${owner}/${repo}/${path}`);

  if (!authHeader) {
    console.warn("❌ No authorization header provided");
    return res.status(401).json({ error: "Authorization header required" });
  }

  if (!path) {
    console.warn("❌ No file path provided");
    return res.status(400).json({ error: "File path is required" });
  }

  try {
    // In a real implementation, fetch from GitHub API
    // const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    //   headers: {
    //     'Authorization': authHeader,
    //     'Accept': 'application/vnd.github.v3+json',
    //   },
    // });

    // Mock file content for demo - generate appropriate content based on file type
    let mockContent = "";

    const fileName = path.split("/").pop() || "";
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (path.includes("UserProfile.tsx")) {
      mockContent = `import React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface UserProfileProps {
  user: User;
  onEdit?: (userId: number) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  return (
    <div className="user-profile">
      <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>Edit Profile</button>
      )}
    </div>
  );
};`;
    } else if (extension === "tsx" || extension === "jsx") {
      const componentName = fileName.replace(/\.(tsx|jsx)$/, "");
      mockContent = `import React from 'react';

interface ${componentName}Props {
  // Define props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${componentName.toLowerCase()}">
      {/* Component content */}
    </div>
  );
};

export default ${componentName};`;
    } else if (extension === "ts" || extension === "js") {
      mockContent = `// ${fileName} - Utility functions and helpers

export const sampleFunction = (input: any) => {
  return input;
};

export const validateInput = (data: any): boolean => {
  return data !== null && data !== undefined;
};

export default {
  sampleFunction,
  validateInput,
};`;
    } else {
      mockContent = `// Mock content for ${path}
export const mockFunction = () => {
  return "This is mock content for demonstration";
};`;
    }

    console.log(`✅ Successfully generated mock content for ${path}`);

    res.json({
      name: fileName,
      path: path,
      content: Buffer.from(mockContent).toString("base64"),
      encoding: "base64",
    });
  } catch (error) {
    console.error(`❌ Failed to fetch file content for ${path}:`, error);
    res.status(500).json({
      error: "Failed to fetch file content",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreatePullRequest: RequestHandler = async (req, res) => {
  const { owner, repo } = req.params;
  const { title, body, head, base, files } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header required" });
  }

  try {
    // In a real implementation, this would:
    // 1. Create a new branch
    // 2. Commit the test files
    // 3. Create a pull request

    // Mock PR creation for demo
    res.json({
      id: Date.now(),
      number: Math.floor(Math.random() * 1000) + 1,
      title: title,
      body: body,
      html_url: `https://github.com/${owner}/${repo}/pull/${Math.floor(Math.random() * 1000) + 1}`,
      state: "open",
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to create pull request:", error);
    res.status(500).json({ error: "Failed to create pull request" });
  }
};
