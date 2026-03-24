"""
AI Chat 后端服务
接收前端请求，转发到 DeepSeek API，返回 AI 回复
"""

import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)

# 配置 CORS，允许前端跨域访问
CORS(app, origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
])

# DeepSeek API 配置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    处理前端发送的聊天请求
    Request Body: { "message": "用户输入的文本" }
    Response Body: { "reply": "AI 大模型的回答" }
    """
    try:
        data = request.get_json()

        if not data or "message" not in data:
            return jsonify({"error": "缺少 message 参数"}), 400

        user_message = data["message"]

        if not user_message.strip():
            return jsonify({"error": "message 不能为空"}), 400

        # 检查 API Key 是否配置
        if not DEEPSEEK_API_KEY:
            return jsonify({"error": "后端未配置 DeepSeek API Key"}), 500

        # 调用 DeepSeek API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [
                {"role": "user", "content": user_message}
            ],
            "stream": False
        }

        response = requests.post(
            DEEPSEEK_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )

        if not response.ok:
            return jsonify({
                "error": f"DeepSeek API 调用失败：{response.status_code}",
                "details": response.text
            }), response.status_code

        result = response.json()
        ai_reply = result["choices"][0]["message"]["content"]

        return jsonify({"reply": ai_reply})

    except requests.exceptions.Timeout:
        return jsonify({"error": "DeepSeek API 请求超时"}), 504
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"网络请求异常：{str(e)}"}), 503
    except Exception as e:
        return jsonify({"error": f"服务器内部错误：{str(e)}"}), 500


@app.route("/api/health", methods=["GET"])
def health():
    """健康检查接口"""
    return jsonify({
        "status": "ok",
        "deepseek_configured": bool(DEEPSEEK_API_KEY)
    })


if __name__ == "__main__":
    print("=" * 50)
    print("AI Chat Backend Server")
    print("=" * 50)
    print(f"DeepSeek API Key: {'已配置' if DEEPSEEK_API_KEY else '未配置'}")
    print("Server running at: http://localhost:8000")
    print("API Endpoint: POST http://localhost:8000/api/chat")
    print("Health Check: GET http://localhost:8000/api/health")
    print("=" * 50)

    app.run(host="0.0.0.0", port=8000, debug=True)
