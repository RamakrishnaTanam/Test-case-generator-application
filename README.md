# TestGen AI - Intelligent Test Case Generator

A modern web application that integrates with GitHub to automatically generate comprehensive test cases for your code using AI. Built with React, TypeScript, Node.js, and modern UI components.

![TestGen AI Screenshot](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=TestGen+AI+Dashboard)

## ✨ Features

- **🔗 GitHub Integration**: Seamlessly connect and browse your repositories
- **📁 Smart File Browser**: Interactive UI to select files for test generation
- **🤖 AI-Powered Generation**: Intelligent test case suggestions using modern AI
- **🧪 Multiple Test Frameworks**: Support for Jest, Playwright, PyTest, JUnit, and more
- **📊 Test Summaries**: Get overview of suggested test cases before generation
- **💻 Code Generation**: Generate ready-to-use test code
- **🔄 Pull Request Creation**: Automatically create PRs with generated tests
- **🎨 Modern UI/UX**: Clean, responsive design with dark mode support

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- GitHub account for repository integration

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd testgen-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   OPENAI_API_KEY=your_openai_api_key  # or other AI service
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to `http://localhost:8080` in your browser

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - High-quality, accessible UI primitives
- **Lucide React** - Beautiful & consistent icons
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server development
- **GitHub API** - Repository and file access
- **AI Integration** - OpenAI, Google Gemini, or Anthropic

### Development
- **ESLint & Prettier** - Code linting and formatting
- **Vitest** - Fast unit testing framework
- **Docker** - Containerization support

## 📖 Usage Guide

### 1. Connect to GitHub
- Click "Connect to GitHub" on the homepage
- Authorize the application to access your repositories
- Your repositories will be automatically loaded

### 2. Select Repository & Files
- Choose a repository from the list
- Browse the file structure
- Select files you want to generate tests for (components, utilities, APIs, etc.)

### 3. Generate Test Summaries
- Click "Generate Test Case Summaries"
- AI analyzes your selected files
- Review the suggested test cases with complexity estimates

### 4. Generate Test Code
- Select a test case summary
- Click "Generate Code" 
- Review the generated test code
- Copy or create a pull request

### 5. Create Pull Request (Optional)
- Click "Create Pull Request"
- Automatically creates a PR with your generated tests
- Review and merge when ready

## 🧪 Supported Test Frameworks

| Framework | Languages | Description |
|-----------|-----------|-------------|
| Jest + React Testing Library | TypeScript, JavaScript | React component testing |
| Jest + MSW | TypeScript, JavaScript | API mocking and testing |
| Playwright | TypeScript, JavaScript | End-to-end testing |
| PyTest | Python | Python unit and integration testing |
| JUnit | Java | Java unit testing |
| Go Testing | Go | Built-in Go testing |

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - Application name: "TestGen AI"
   - Homepage URL: `http://localhost:8080`
   - Authorization callback URL: `http://localhost:8080/api/github/callback`
3. Copy the Client ID and Client Secret to your `.env` file

### AI Service Setup

Choose one of the following AI services:

#### OpenAI
```env
OPENAI_API_KEY=your_openai_api_key
```

#### Google Gemini
```env
GOOGLE_API_KEY=your_gemini_api_key
```

#### Anthropic Claude
```env
ANTHROPIC_API_KEY=your_claude_api_key
```

## 🏗️ Project Structure

```
├── client/                 # React frontend
│   ├── components/ui/      # Reusable UI components
│   ├── pages/             # Page components
│   ├── App.tsx            # Main app component
│   └── global.css         # Global styles
├── server/                # Express backend
│   ├── routes/           # API route handlers
│   │   ├── github.ts     # GitHub integration
│   │   └── ai.ts         # AI service integration
│   └── index.ts          # Server configuration
├── shared/               # Shared types and utilities
│   ├── github.ts        # GitHub-related types
│   └── ai.ts           # AI service types
└── package.json         # Dependencies and scripts
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```

### Docker Deployment
```bash
docker build -t testgen-ai .
docker run -p 8080:8080 testgen-ai
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or run into issues:

1. Check the [GitHub Issues](https://github.com/your-username/testgen-ai/issues)
2. Create a new issue if your problem isn't already documented
3. Provide as much detail as possible including:
   - Operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

## 🎯 Roadmap

- [ ] Support for more programming languages
- [ ] Advanced test configuration options
- [ ] Test coverage analysis
- [ ] Integration with CI/CD pipelines
- [ ] Team collaboration features
- [ ] Custom test templates
- [ ] Performance testing generation

## 🏆 Credits

Built with ❤️ using:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [GitHub API](https://docs.github.com/en/rest)
- [OpenAI API](https://platform.openai.com/)

---

**TestGen AI** - Making test writing intelligent and effortless! 🚀
