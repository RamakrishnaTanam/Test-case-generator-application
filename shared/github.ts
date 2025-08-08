export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  private: boolean;
}

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url?: string;
  content?: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface PullRequest {
  id: number;
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: 'open' | 'closed' | 'merged';
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}
