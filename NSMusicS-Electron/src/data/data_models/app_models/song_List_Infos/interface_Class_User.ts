interface User {
    id: string; // 用户的唯一标识符
    user_name: string; // 用户名
    name: string; // 用户姓名
    email: string; // 用户的电子邮件地址
    password: string; // 用户的密码
    is_admin: boolean; // 用户是否为管理员
    last_login_at?: string; // 上次登录的日期和时间，可选属性
    last_access_at?: string; // 上次访问的日期和时间，可选属性
    created_at: string; // 用户的创建日期和时间
    updated_at: string; // 用户信息的最后更新日期和时间
  }