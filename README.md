# PhotoBuddies

PhotoBuddy is a web project developed using the MERN (MongoDB, Express.js, React.js, Node.js) stack, designed to connect photographers and models, helping them find suitable matches. The project is divided into frontend (`frontend`) and backend (`backend`) components, and is deployed using Docker containers.

## Project Structure

PhotoBuddies 是一个基于 MERN (MongoDB, Express.js, React.js, Node.js) 栈开发的 Web 项目，旨在连接摄影师和模特，帮助他们找到合适的匹配。该项目分为前端（`frontend`）和后端（`backend`）两个部分，并通过 Docker 容器化进行部署。

## 项目整体结构

PhotoBuddy/
│
├── backend/ # Backend code, including API, database connections, etc.
│
├── frontend/ # Frontend code, including React components and pages
│
├── (Important).env.development # Configuration file for development environment (for backend)
│
├── (Ignore).env.production # Configuration file for production environment (for backend)
│
├── (Important)docker-compose.yml # Docker Compose configuration file for containerized deployment
│
├── (Ignore)package.json # Project configuration file for Render (deployment platform)
│
└── .gitignore # Git ignore file configuration

## Usage Instructions

1. Ensure Docker is installed locally, open Docker, and log in successfully.

2. Use `docker-compose` to start the project:

   Navigate to the ./PhotoBuddy directory in your terminal and run the following command:

   ```
   docker-compose up --build
   ```

3. The frontend application will run on http://localhost:3001 (note the port is 3001, not 3000, changed earlier for testing), and the backend API will run on http://localhost:4000.

4. Open your browser and visit http://localhost:3001 to view the frontend page.

5. Open your browser and visit http://localhost:4000/auth/dashboard to view SuperTokens backend user data (username and password required). This is not frequently used if you're not developing the backend.

## GitHub Collaboration Guidelines

1. The master branch is the main project branch. Please do not modify it arbitrarily.

2. When developing new features, please fork the dev branch and create your own branch. Merge back to the dev branch after development is complete.

3. Before starting development, pull the dev branch to avoid code conflicts.

## Technology Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: SuperTokens
- Deployment: Docker, Docker Compose

## Contribution

Contributions of code or suggestions are welcome. Please follow the GitHub collaboration guidelines above to ensure code quality and project stability.

## License

[MIT License](LICENSE)

```
PhotoBuddy/
│
├── backend/                  # 后端代码，包含 API、数据库连接等
│
├── frontend/                 # 前端代码，包含 React 组件和页面
│
├── (重要).env.development    # 开发环境的配置文件（给后端用的）
│
├── (不用管).env.production   # 生产环境的配置文件（给后端用的）
│
├── (重要)docker-compose.yml  # Docker Compose 配置文件，用于容器化部署
│
├── (不用管)package.json      # 项目在 Render(部署平台)上的配置文件
│
└── .gitignore                # Git 忽略文件配置
```

## 使用说明

1. 确保本地已经下载 Docker，打开 Docker 并成功登录。

2. 使用 `docker-compose` 启动项目：

   用终端进入到 ./PhotoBuddy 目录下，运行以下命令：

   ```
   docker-compose up --build
   ```

3. 前端应用将运行在 http://localhost:3001 （注意这里有个 1，不是 3000，之前为了测试端口改的），后端 API 将运行在 http://localhost:4000。

4. 打开浏览器，访问 http://localhost:3001，即可看到前端页面。

5. 打开浏览器，访问 http://localhost:4000/auth/dashboard，即可查看 SuperTokens 后端用户数据（需要用户名和密码）。若不开发后端则用不太到这里。

## GitHub 协作注意事项

1. master 分支是项目主分支，请勿随意修改。

2. 开发新功能时，请 fork dev 分支并新建属于自己的分支，开发完成后合并到 dev 分支。

3. 每次准备开发前，先 pull 一下 dev 分支，避免代码冲突。

## 技术栈

- 前端：React.js
- 后端：Node.js, Express.js
- 数据库：MongoDB
- 认证：SuperTokens
- 部署：Docker, Docker Compose, Render

## 贡献

欢迎贡献代码或提出建议。请遵循上述 GitHub 协作注意事项，确保代码质量和项目稳定性。

## 许可证

[MIT License](LICENSE)
