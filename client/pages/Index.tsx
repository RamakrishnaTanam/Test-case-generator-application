import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Loader2,
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
  type: "file" | "dir";
  language?: string;
  selected?: boolean;
}

interface TestCaseSummary {
  id: string;
  title: string;
  description: string;
  framework: string;
  complexity: "Low" | "Medium" | "High";
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

  // Initialize repositories on connection
  useEffect(() => {
    if (isConnected) {
      fetchRepositories();
    }
  }, [isConnected]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch("/api/github/repositories", {
        headers: {
          Authorization: "Bearer mock_token",
        },
      });
      const repos = await response.json();
      setRepositories(repos);
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
    }
  };

  const connectToGitHub = () => {
    // In a real app, this would initiate OAuth flow
    setIsConnected(true);
  };

  const selectRepository = async (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setSelectedFiles([]);
    setTestSummaries([]);

    try {
      const [owner, repoName] = repo.full_name.split("/");
      const response = await fetch(
        `/api/github/repos/${owner}/${repoName}/contents`,
        {
          headers: {
            Authorization: "Bearer mock_token",
          },
        },
      );
      const fetchedFiles = await response.json();

      const processedFiles: CodeFile[] = fetchedFiles.map((file: any) => ({
        name: file.name,
        path: file.path,
        type: file.type,
        language: getLanguageFromPath(file.path),
      }));

      setFiles(processedFiles);
    } catch (error) {
      console.error("Failed to fetch repository files:", error);
      // Fallback to mock data
      const mockFiles: CodeFile[] = [
        { name: "src", path: "src", type: "dir" },
        { name: "components", path: "src/components", type: "dir" },
        {
          name: "UserProfile.tsx",
          path: "src/components/UserProfile.tsx",
          type: "file",
          language: "TypeScript",
        },
        {
          name: "Button.tsx",
          path: "src/components/Button.tsx",
          type: "file",
          language: "TypeScript",
        },
        { name: "utils", path: "src/utils", type: "dir" },
        {
          name: "api.ts",
          path: "src/utils/api.ts",
          type: "file",
          language: "TypeScript",
        },
        {
          name: "helpers.ts",
          path: "src/utils/helpers.ts",
          type: "file",
          language: "TypeScript",
        },
        {
          name: "App.tsx",
          path: "src/App.tsx",
          type: "file",
          language: "TypeScript",
        },
        {
          name: "index.tsx",
          path: "src/index.tsx",
          type: "file",
          language: "TypeScript",
        },
      ];
      setFiles(mockFiles);
    }
  };

  const getLanguageFromPath = (path: string): string => {
    const ext = path.split(".").pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      tsx: "TypeScript",
      ts: "TypeScript",
      jsx: "JavaScript",
      js: "JavaScript",
      py: "Python",
      vue: "Vue",
      java: "Java",
      go: "Go",
      rs: "Rust",
      cpp: "C++",
      c: "C",
    };
    return languageMap[ext || ""] || "Unknown";
  };

  const toggleFileSelection = (file: CodeFile) => {
    if (file.type === "dir") return; // Can't select directories

    setSelectedFiles((prev) => {
      const isSelected = prev.some((f) => f.path === file.path);
      if (isSelected) {
        return prev.filter((f) => f.path !== file.path);
      } else {
        return [...prev, file];
      }
    });
  };

  const generateTestSummaries = async () => {
    if (selectedFiles.length === 0) return;

    setIsGenerating(true);

    try {
      // Fetch file contents for selected files
      const filesWithContent = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            if (!selectedRepo) return { ...file, content: "" };
            const [owner, repoName] = selectedRepo.full_name.split("/");
            const response = await fetch(
              `/api/github/repos/${owner}/${repoName}/contents/${file.path}`,
              {
                headers: {
                  Authorization: "Bearer mock_token",
                },
              },
            );
            const fileData = await response.json();
            const content = fileData.content ? atob(fileData.content) : "";
            return { ...file, content };
          } catch (error) {
            console.error(`Failed to fetch content for ${file.path}:`, error);
            return { ...file, content: "" };
          }
        }),
      );

      // Generate test summaries using AI
      const response = await fetch("/api/ai/generate-summaries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ files: filesWithContent }),
      });

      const data = await response.json();
      setTestSummaries(data.summaries);
    } catch (error) {
      console.error("Failed to generate test summaries:", error);
      // Fallback to mock data
      const mockSummaries: TestCaseSummary[] = [
        {
          id: "1",
          title: "Component Rendering Tests",
          description:
            "Test suite for React component rendering, props handling, and basic interactions",
          framework: "Jest + React Testing Library",
          complexity: "Low",
          estimatedTime: "15 min",
        },
        {
          id: "2",
          title: "API Integration Tests",
          description:
            "Comprehensive tests for API calls, error handling, and data transformation",
          framework: "Jest + MSW",
          complexity: "Medium",
          estimatedTime: "30 min",
        },
      ];
      setTestSummaries(mockSummaries);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTestCode = async (summary: TestCaseSummary) => {
    setIsGenerating(true);

    try {
      // Fetch file contents for the files related to this summary
      const relevantFiles = selectedFiles.filter((file) =>
        summary.files ? summary.files.includes(file.path) : true,
      );

      const filesWithContent = await Promise.all(
        relevantFiles.map(async (file) => {
          try {
            if (!selectedRepo)
              return { ...file, content: "", language: file.language };
            const [owner, repoName] = selectedRepo.full_name.split("/");
            const response = await fetch(
              `/api/github/repos/${owner}/${repoName}/contents/${file.path}`,
              {
                headers: {
                  Authorization: "Bearer mock_token",
                },
              },
            );
            const fileData = await response.json();
            const content = fileData.content ? atob(fileData.content) : "";
            return {
              ...file,
              content,
              language: file.language || "JavaScript",
            };
          } catch (error) {
            console.error(`Failed to fetch content for ${file.path}:`, error);
            return {
              ...file,
              content: "",
              language: file.language || "JavaScript",
            };
          }
        }),
      );

      // Generate test code using AI
      const response = await fetch("/api/ai/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summaryId: summary.id,
          files: filesWithContent,
        }),
      });

      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (error) {
      console.error("Failed to generate test code:", error);
      // Fallback to mock code
      const mockCode = `import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from '../components/UserProfile';

describe('${summary.title}', () => {
  test('basic test case', () => {
    // Generated test code would appear here
    expect(true).toBe(true);
  });
});`;
      setGeneratedCode(mockCode);
    } finally {
      setIsGenerating(false);
      setShowCodeDialog(true);
    }
  };

  const createPullRequest = async () => {
    if (!selectedRepo || !generatedCode) return;

    try {
      const [owner, repoName] = selectedRepo.full_name.split("/");

      const response = await fetch(
        `/api/github/repos/${owner}/${repoName}/pulls`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer mock_token",
          },
          body: JSON.stringify({
            title: "Add generated test cases",
            body: "This PR adds automatically generated test cases using TestGen AI.",
            head: "feature/generated-tests",
            base: "main",
            files: [
              {
                path: `tests/generated-tests-${Date.now()}.test.tsx`,
                content: generatedCode,
              },
            ],
          }),
        },
      );

      const pullRequest = await response.json();
      alert(
        `Pull request created successfully! View it at: ${pullRequest.html_url}`,
      );
    } catch (error) {
      console.error("Failed to create pull request:", error);
      alert("Failed to create pull request. This is a demo feature.");
    }
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
                <h1 className="text-xl font-bold text-foreground">
                  TestGen AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Intelligent Test Case Generator
                </p>
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
              <h2 className="text-3xl font-bold tracking-tight">
                Generate Smart Test Cases
              </h2>
              <p className="text-lg text-muted-foreground mt-4">
                Connect your GitHub repository and let AI generate comprehensive
                test cases for your code
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
                    <p className="text-sm text-muted-foreground">
                      Browse your repositories and select files
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="font-semibold">AI Generation</h3>
                    <p className="text-sm text-muted-foreground">
                      Get intelligent test case suggestions
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                      <Code2 className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-semibold">Generate Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Export ready-to-use test code
                    </p>
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
                <TabsTrigger value="files" disabled={!selectedRepo}>
                  Files
                </TabsTrigger>
                <TabsTrigger
                  value="summaries"
                  disabled={testSummaries.length === 0}
                >
                  Test Cases
                </TabsTrigger>
                <TabsTrigger value="code" disabled={!generatedCode}>
                  Generated Code
                </TabsTrigger>
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
                            selectedRepo?.id === repo.id
                              ? "ring-2 ring-primary"
                              : ""
                          }`}
                          onClick={() => selectRepository(repo)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{repo.name}</h3>
                                  {repo.private && (
                                    <Badge variant="secondary">Private</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {repo.description}
                                </p>
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
                      Select files to generate test cases for (
                      {selectedFiles.length} selected)
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2 max-h-96 overflow-y-auto">
                      {files.map((file) => (
                        <div
                          key={file.path}
                          className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 ${
                            file.type === "dir"
                              ? "opacity-60"
                              : "cursor-pointer"
                          }`}
                          onClick={() => toggleFileSelection(file)}
                        >
                          {file.type === "file" && (
                            <Checkbox
                              checked={selectedFiles.some(
                                (f) => f.path === file.path,
                              )}
                              disabled={file.type === "dir"}
                            />
                          )}
                          <FileCode
                            className={`h-4 w-4 ${file.type === "dir" ? "text-muted-foreground" : "text-primary"}`}
                          />
                          <span
                            className={`text-sm ${file.type === "dir" ? "font-medium text-muted-foreground" : ""}`}
                          >
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
                        <Card
                          key={summary.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-semibold">
                                    {summary.title}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {summary.description}
                                  </p>
                                </div>
                                <Badge
                                  variant={
                                    summary.complexity === "High"
                                      ? "destructive"
                                      : summary.complexity === "Medium"
                                        ? "default"
                                        : "secondary"
                                  }
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
                      <Button
                        variant="outline"
                        onClick={() =>
                          navigator.clipboard.writeText(generatedCode)
                        }
                      >
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
              <Button
                variant="outline"
                onClick={() => setShowCodeDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => navigator.clipboard.writeText(generatedCode)}
              >
                Copy Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
