import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Github, 
  FileCode, 
  TestTube, 
  Sparkles, 
  GitPullRequest, 
  FolderOpen,
  CheckCircle,
  Play,
  Code2,
  Loader2
} from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  private: boolean;
}

interface CodeFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  language?: string;
  selected?: boolean;
}

interface TestCaseSummary {
  id: string;
  title: string;
  description: string;
  framework: string;
  complexity: 'Low' | 'Medium' | 'High';
  estimatedTime: string;
}

export default function Index() {
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<CodeFile[]>([]);
  const [testSummaries, setTestSummaries] = useState<TestCaseSummary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [showCodeDialog, setShowCodeDialog] = useState(false);

  // Mock data for demo
  useEffect(() => {
    // Simulate connected state for demo
    setRepositories([
      {
        id: 1,
        name: "my-react-app",
        full_name: "user/my-react-app",
        description: "A modern React application with TypeScript",
        language: "TypeScript",
        private: false
      },
      {
        id: 2,
        name: "python-api",
        full_name: "user/python-api",
        description: "REST API built with FastAPI",
        language: "Python",
        private: false
      },
      {
        id: 3,
        name: "vue-dashboard",
        full_name: "user/vue-dashboard",
        description: "Admin dashboard with Vue.js",
        language: "Vue",
        private: true
      }
    ]);
  }, []);

  const connectToGitHub = () => {
    // In a real app, this would initiate OAuth flow
    setIsConnected(true);
  };

  const selectRepository = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    // Mock file structure
    const mockFiles: CodeFile[] = [
      { name: "src", path: "src", type: "dir" },
      { name: "components", path: "src/components", type: "dir" },
      { name: "UserProfile.tsx", path: "src/components/UserProfile.tsx", type: "file", language: "TypeScript" },
      { name: "Button.tsx", path: "src/components/Button.tsx", type: "file", language: "TypeScript" },
      { name: "utils", path: "src/utils", type: "dir" },
      { name: "api.ts", path: "src/utils/api.ts", type: "file", language: "TypeScript" },
      { name: "helpers.ts", path: "src/utils/helpers.ts", type: "file", language: "TypeScript" },
      { name: "App.tsx", path: "src/App.tsx", type: "file", language: "TypeScript" },
      { name: "index.tsx", path: "src/index.tsx", type: "file", language: "TypeScript" }
    ];
    setFiles(mockFiles);
    setSelectedFiles([]);
    setTestSummaries([]);
  };

  const toggleFileSelection = (file: CodeFile) => {
    if (file.type === 'dir') return; // Can't select directories
    
    setSelectedFiles(prev => {
      const isSelected = prev.some(f => f.path === file.path);
      if (isSelected) {
        return prev.filter(f => f.path !== file.path);
      } else {
        return [...prev, file];
      }
    });
  };

  const generateTestSummaries = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSummaries: TestCaseSummary[] = [
      {
        id: "1",
        title: "Component Rendering Tests",
        description: "Test suite for React component rendering, props handling, and basic interactions",
        framework: "Jest + React Testing Library",
        complexity: "Low",
        estimatedTime: "15 min"
      },
      {
        id: "2", 
        title: "API Integration Tests",
        description: "Comprehensive tests for API calls, error handling, and data transformation",
        framework: "Jest + MSW",
        complexity: "Medium",
        estimatedTime: "30 min"
      },
      {
        id: "3",
        title: "User Flow E2E Tests",
        description: "End-to-end testing of user authentication, profile management, and core workflows",
        framework: "Playwright",
        complexity: "High",
        estimatedTime: "45 min"
      },
      {
        id: "4",
        title: "Utility Function Tests",
        description: "Unit tests for helper functions, data validators, and utility methods",
        framework: "Jest",
        complexity: "Low",
        estimatedTime: "20 min"
      }
    ];
    
    setTestSummaries(mockSummaries);
    setIsGenerating(false);
  };

  const generateTestCode = async (summary: TestCaseSummary) => {
    setIsGenerating(true);
    
    // Simulate code generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockGeneratedCode = `import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../components/UserProfile';

describe('UserProfile Component', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg'
  };

  test('renders user information correctly', () => {
    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockUser.avatar);
  });

  test('handles edit profile action', () => {
    const onEdit = jest.fn();
    render(<UserProfile user={mockUser} onEdit={onEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit profile/i });
    fireEvent.click(editButton);
    
    expect(onEdit).toHaveBeenCalledWith(mockUser.id);
  });

  test('displays fallback avatar when image fails to load', () => {
    const userWithoutAvatar = { ...mockUser, avatar: null };
    render(<UserProfile user={userWithoutAvatar} />);
    
    expect(screen.getByText('JD')).toBeInTheDocument(); // Initials fallback
  });
});`;
    
    setGeneratedCode(mockGeneratedCode);
    setIsGenerating(false);
    setShowCodeDialog(true);
  };

  const createPullRequest = async () => {
    // In a real app, this would create a PR with the generated test code
    alert("Pull request created successfully! (This is a demo)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <TestTube className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">TestGen AI</h1>
                <p className="text-sm text-muted-foreground">Intelligent Test Case Generator</p>
              </div>
            </div>
            {isConnected && (
              <Badge variant="secondary" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                GitHub Connected
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Generate Smart Test Cases</h2>
              <p className="text-lg text-muted-foreground mt-4">
                Connect your GitHub repository and let AI generate comprehensive test cases for your code
              </p>
            </div>
            
            <Card className="p-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Github className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Connect GitHub</h3>
                    <p className="text-sm text-muted-foreground">Browse your repositories and select files</p>
                  </div>
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold">AI Generation</h3>
                    <p className="text-sm text-muted-foreground">Get intelligent test case suggestions</p>
                  </div>
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <Code2 className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-semibold">Generate Code</h3>
                    <p className="text-sm text-muted-foreground">Export ready-to-use test code</p>
                  </div>
                </div>
                
                <Button onClick={connectToGitHub} size="lg" className="w-full">
                  <Github className="mr-2 h-5 w-5" />
                  Connect to GitHub
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            <Tabs defaultValue="repositories" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="repositories">Repositories</TabsTrigger>
                <TabsTrigger value="files" disabled={!selectedRepo}>Files</TabsTrigger>
                <TabsTrigger value="summaries" disabled={testSummaries.length === 0}>Test Cases</TabsTrigger>
                <TabsTrigger value="code" disabled={!generatedCode}>Generated Code</TabsTrigger>
              </TabsList>

              <TabsContent value="repositories" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5" />
                      Your Repositories
                    </CardTitle>
                    <CardDescription>
                      Select a repository to analyze and generate test cases
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {repositories.map((repo) => (
                        <Card 
                          key={repo.id} 
                          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedRepo?.id === repo.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => selectRepository(repo)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{repo.name}</h3>
                                  {repo.private && <Badge variant="secondary">Private</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">{repo.description}</p>
                                <Badge variant="outline">{repo.language}</Badge>
                              </div>
                              <FileCode className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileCode className="h-5 w-5" />
                      Repository Files
                      {selectedRepo && (
                        <Badge variant="outline">{selectedRepo.name}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Select files to generate test cases for ({selectedFiles.length} selected)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                      {files.map((file) => (
                        <div
                          key={file.path}
                          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 ${
                            file.type === 'dir' ? 'opacity-60' : 'cursor-pointer'
                          }`}
                          onClick={() => toggleFileSelection(file)}
                        >
                          {file.type === 'file' && (
                            <Checkbox
                              checked={selectedFiles.some(f => f.path === file.path)}
                              disabled={file.type === 'dir'}
                            />
                          )}
                          <FileCode className={`h-4 w-4 ${file.type === 'dir' ? 'text-muted-foreground' : 'text-primary'}`} />
                          <span className={`text-sm ${file.type === 'dir' ? 'font-medium text-muted-foreground' : ''}`}>
                            {file.name}
                          </span>
                          {file.language && (
                            <Badge variant="secondary" className="ml-auto">
                              {file.language}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={generateTestSummaries}
                      disabled={selectedFiles.length === 0 || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Test Cases...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Test Case Summaries
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summaries" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TestTube className="h-5 w-5" />
                      Generated Test Case Summaries
                    </CardTitle>
                    <CardDescription>
                      Select a test case to generate the actual code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {testSummaries.map((summary) => (
                        <Card key={summary.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-semibold">{summary.title}</h3>
                                  <p className="text-sm text-muted-foreground">{summary.description}</p>
                                </div>
                                <Badge 
                                  variant={summary.complexity === 'High' ? 'destructive' : 
                                          summary.complexity === 'Medium' ? 'default' : 'secondary'}
                                >
                                  {summary.complexity}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{summary.framework}</span>
                                  <span>~{summary.estimatedTime}</span>
                                </div>
                                <Button 
                                  onClick={() => generateTestCode(summary)}
                                  disabled={isGenerating}
                                  size="sm"
                                >
                                  {isGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Generate Code
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="h-5 w-5" />
                      Generated Test Code
                    </CardTitle>
                    <CardDescription>
                      Review and export your generated test code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
                      <pre>{generatedCode}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={createPullRequest} className="flex-1">
                        <GitPullRequest className="mr-2 h-4 w-4" />
                        Create Pull Request
                      </Button>
                      <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedCode)}>
                        Copy Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>

      {/* Code Generation Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generated Test Code</DialogTitle>
            <DialogDescription>
              Review the generated test code and make any necessary adjustments
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <pre>{generatedCode}</pre>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCodeDialog(false)}>
                Close
              </Button>
              <Button onClick={() => navigator.clipboard.writeText(generatedCode)}>
                Copy Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
