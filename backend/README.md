# 本地后端测试指南

## 前提条件

1. Python 3.8+ 已安装
2. DeepSeek API Key（从 https://platform.deepseek.com/ 获取）

## 快速开始

### 步骤 1：安装 Python 依赖

```bash
cd backend
pip install -r requirements.txt
```

### 步骤 2：配置 API Key

编辑 `backend/.env` 文件，将 `DEEPSEEK_API_KEY` 替换为你的真实 API Key：

```
DEEPSEEK_API_KEY=sk-your-actual-api-key
```

### 步骤 3：启动后端服务

```bash
cd backend
python server.py
```

启动成功后会看到：
```
==================================================
AI Chat Backend Server
==================================================
DeepSeek API Key: 已配置
Server running at: http://localhost:8000
API Endpoint: POST http://localhost:8000/api/chat
Health Check: GET http://localhost:8000/api/health
==================================================
```

### 步骤 4：启动前端

在另一个终端窗口：

```bash
npm run dev
```

### 步骤 5：测试联调

1. 浏览器访问：`http://localhost:3000/dev/sub_page`
2. 在页面底部"后端接口"输入框确认地址为：`http://localhost:8000/api/chat`
3. 在输入框输入问题，例如：`请问你是什么模型？`
4. 点击"发送"按钮
5. 等待 AI 回复显示在页面上

## 健康检查

浏览器访问或使用 curl 测试后端是否正常：

```bash
curl http://localhost:8000/api/health
```

正常返回：
```json
{"status": "ok", "deepseek_configured": true}
```

## 错误排查

| 错误现象 | 可能原因 | 解决方案 |
|----------|----------|----------|
| `Failed to fetch` | 后端未启动或 CORS 失败 | 确认后端正在运行，检查控制台 CORS 错误 |
| `DeepSeek API Key: 未配置` | `.env` 文件未正确配置 | 检查 `.env` 文件中 API Key 是否正确 |
| `DeepSeek API 调用失败：401` | API Key 无效 | 检查 API Key 是否正确，确认账户余额 |
| 前端显示红色错误 | 网络异常或后端返回错误 | 查看浏览器控制台和后端日志 |

## 腾讯云部署（后续）

1. 将 `backend` 目录上传到腾讯云服务器
2. 在服务器上安装依赖并运行
3. 配置安全组，开放 8000 端口
4. 前端页面底部修改接口地址为服务器公网 IP

```
http://<你的腾讯云 IP>:8000/api/chat
```
