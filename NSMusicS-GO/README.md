# NSMusicS-GO Music-Server
A Go (Golang) Backend Clean Architecture project with Gin, MongoDB, JWT Authentication Middleware, Test, and Docker.

![Go Backend Clean Architecture](https://github.com/amitshekhariitbhu/go-backend-clean-architecture/blob/main/assets/go-backend-clean-architecture.png?raw=true)

## Architecture Layers of the project

- Router
- Controller
- Usecase
- Repository
- Domain

![Go Backend Clean Architecture Diagram](https://github.com/amitshekhariitbhu/go-backend-clean-architecture/blob/main/assets/go-backend-arch-diagram.png?raw=true)

## Major Packages used in this project

- **gin**: Gin is an HTTP web framework written in Go (Golang). It features a Martini-like API with much better performance -- up to 40 times faster. If you need a smashing performance, get yourself some Gin.
- **mongo go driver**: The Official Golang driver for MongoDB.
- **jwt**: JSON Web Tokens are an open, industry-standard RFC 7519 method for representing claims securely between two parties. Used for Access Token and Refresh Token.
- **viper**: For loading configuration from the `.env` file. Go configuration with fangs. Find, load, and unmarshal a configuration file in JSON, TOML, YAML, HCL, INI, envfile, or Java properties formats.
- **bcrypt**: Package bcrypt implements Provos and Mazières's bcrypt adaptive hashing algorithm.
- **testify**: A toolkit with common assertions and mocks that plays nicely with the standard library.
- **mockery**: A mock code autogenerator for Golang used in testing.
- Check more packages in `go.mod`.

### Public API Request Flow without JWT Authentication Middleware

![Public API Request Flow](https://github.com/amitshekhariitbhu/go-backend-clean-architecture/blob/main/assets/go-arch-public-api-request-flow.png?raw=true)

### Private API Request Flow with JWT Authentication Middleware

> JWT Authentication Middleware for Access Token Validation.

![Private API Request Flow](https://github.com/amitshekhariitbhu/go-backend-clean-architecture/blob/main/assets/go-arch-private-api-request-flow.png?raw=true)

### The Complete Project Folder Structure

```
.
├── Dockerfile                          # 定义如何构建 Docker 容器的文件
│
├── api                                 # 包含 API 相关代码的目录
│   ├── controller                          # 包含控制器的目录，控制器处理 HTTP 请求
│   │   ├── login_controller.go                 # 处理登录请求的控制器
│   │   ├── profile_controller.go               # 处理用户个人资料请求的控制器
│   │   ├── profile_controller_test.go          # 用户个人资料控制器的测试文件
│   │   ├── refresh_token_controller.go         # 处理刷新令牌请求的控制器
│   │   ├── signup_controller.go                # 处理用户注册请求的控制器
│   │   └── task_controller.go                  # 处理任务请求的控制器
│   ├── middleware                          # 包含中间件的目录，中间件用于执行请求处理前后的操作
│   │   └── jwt_auth_middleware.go              # JWT 认证中间件
│   └── route                               # 包含路由定义的目录，路由将 HTTP 请求映射到控制器
│       ├── login_route.go                      # 登录功能的路由定义
│       ├── profile_route.go                    # 用户个人资料功能的路由定义
│       ├── refresh_token_route.go              # 刷新令牌功能的路由定义
│       ├── route.go                            # 可能包含路由的通用配置或初始化代码
│       ├── signup_route.go                     # 用户注册功能的路由定义
│       └── task_route.go                       # 任务功能的路由定义
│
├── bootstrap                           # 包含启动应用程序所需的初始化代码的目录
│   ├── app.go                              # 初始化 Gin Web 框架或其他服务的代码
│   ├── database.go                         # 初始化数据库连接的代码
│   └── env.go                              # 加载环境变量的代码
│
├── cmd                                 # 包含应用程序入口点的目录
│   └── main.go                             # 应用程序的主入口文件
│
├── docker-compose.yaml                 # 定义多个 Docker 容器配置的 YAML 文件
│
├── domain                              # 包含应用程序的核心业务逻辑和数据模型的目录
│   ├── error_response.go                   # 定义错误响应的结构体
│   ├── jwt_custom.go                       # 定义 JWT 令牌处理的逻辑
│   ├── login.go                            # 定义登录相关的数据模型和逻辑
│   ├── profile.go                          # 定义用户个人资料相关的数据模型和逻辑
│   ├── refresh_token.go                    # 定义刷新令牌相关的数据模型和逻辑
│   ├── signup.go                           # 定义用户注册相关的数据模型和逻辑
│   ├── success_response.go                 # 定义成功响应的结构体
│   ├── task.go                             # 定义任务相关的数据模型和逻辑
│   └── user.go                             # 定义用户相关的数据模型和逻辑
│
├── go.mod                              # Go Modules 的模块定义文件
│
├── go.sum                              # Go Modules 的依赖校验和版本信息文件
│
├── internal                            # 包含应用程序内部工具和实用程序代码的目录
│   └── tokenutil                           # 包含与令牌生成和验证相关的工具的目录
│       └── tokenutil.go                        # 令牌生成和验证的工具代码
│
├── mongo                               # 包含与 MongoDB 数据库交互的代码的目录
│   └── mongo.go                            # MongoDB 数据库连接和操作的代码
│
├── repository                          # 包含数据访问层代码的目录，定义了与数据库交互的方法
│   ├── task_repository.go                  # 与任务数据交互的方法
│   ├── user_repository.go                  # 与用户数据交互的方法
│   └── user_repository_test.go             # 对用户存储库进行单元测试的测试文件
│
└── usecase                             # 包含应用程序业务逻辑层代码的目录
    ├── login_usecase.go                    # 处理登录逻辑的业务逻辑
    ├── profile_usecase.go                  # 处理用户个人资料逻辑的业务逻辑
    ├── refresh_token_usecase.go            # 处理刷新令牌逻辑的业务逻辑
    ├── signup_usecase.go                   # 处理用户注册逻辑的业务逻辑
    ├── task_usecase.go                     # 处理任务逻辑的业务逻辑
    └── task_usecase_test.go                # 对任务业务逻辑进行单元测试的测试文件
```