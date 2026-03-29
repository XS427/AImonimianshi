# 部署指南

## 当前状态
- ✅ 本地开发：SQLite（正常工作）
- ❌ 生产部署：需要 PostgreSQL（SQLite 不支持 Serverless 环境）

## 问题原因
SQLite 是文件数据库，在 Vercel/Netlify 等 Serverless 平台上：
- 每次部署后文件丢失
- 只读文件系统无法写入
- 数据无法持久化

## 解决方案：切换到 Neon PostgreSQL

### 步骤 1: 注册 Neon（免费）

1. 访问 https://neon.tech
2. 点击 "Sign up" 注册账号
3. 选择免费计划（Free tier）

### 步骤 2: 创建项目

1. 登录后点击 "Create a project"
2. 项目名称：`interview-simulator`
3. 区域：选择离你最近的（如 Singapore）
4. 点击 "Create project"

### 步骤 3: 获取连接字符串

创建完成后，你会看到连接信息：

```
Connection string:
postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

### 步骤 4: 在部署平台设置环境变量

在你的部署平台（Vercel/Netlify/Railway）设置以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...?sslmode=require` | 连接池 URL |
| `DIRECT_DATABASE_URL` | `postgresql://...?sslmode=require` | 直连 URL |

### 步骤 5: 切换 Schema

```bash
# 1. 备份当前 schema
cp prisma/schema.prisma prisma/schema.sqlite.prisma

# 2. 使用 PostgreSQL schema
cp prisma/schema.postgres.prisma prisma/schema.prisma

# 3. 重新生成 Prisma Client
bun run db:generate

# 4. 提交代码并部署
```

### 步骤 6: 部署

部署平台会自动运行：
```bash
prisma generate && prisma migrate deploy && next build
```

## 快速切换命令

```bash
# 切换到 PostgreSQL
cp prisma/schema.postgres.prisma prisma/schema.prisma

# 切换回 SQLite（本地开发）
cp prisma/schema.sqlite.prisma prisma/schema.prisma
```

## 本地测试 PostgreSQL

在 `.env` 文件中设置：
```env
DATABASE_URL="你的Neon连接字符串"
DIRECT_DATABASE_URL="你的Neon连接字符串"
```

然后运行：
```bash
bun run db:push
bun run dev
```

## 验证部署成功

部署完成后访问：
```
https://你的域名/api/test-db
```

返回 `{"status":"ok"}` 表示数据库连接成功。
