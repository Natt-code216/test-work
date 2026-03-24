import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHAT_API_URL } from '../constants';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

/**
 * /dev/sub_page 对话页面组件
 * 包含与 AI 交互的完整功能
 */
function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState(CHAT_API_URL);

  /**
   * 发送消息到后端 API
   */
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    // 检查 API 地址是否配置
    if (!apiUrl || apiUrl.includes('<YOUR_TENCENT_CLOUD_IP>') || apiUrl.includes('your-server-ip')) {
      setError('⚠ 请先在页面底部配置正确的后端接口地址');
      return;
    }

    // 立即将用户消息显示在列表中
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const reply = data.reply || data.response || data.content || data.message || JSON.stringify(data);

      // 将 AI 回复添加到消息列表
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (err) {
      // 捕获错误并显示醒目的红色错误信息
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`链路异常：${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理键盘事件（Ctrl+Enter 发送）
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-page">
      {/* 顶部导航 */}
      <nav className="chat-nav">
        <Link to="/dev" className="back-link">
          ← 返回首页
        </Link>
        <span className="nav-status">
          <span className="status-dot"></span>
          SIGNAL ACTIVE
        </span>
      </nav>

      {/* 主内容区 */}
      <div className="chat-container">
        {/* 左侧信息面板 */}
        <div className="chat-sidebar">
          <div className="panel-label">/ dev / sub_page</div>
          <h2 className="panel-title">AI 对话<span>终端</span></h2>
          <p className="panel-desc">
            向 AI 大模型发送指令，获取智能回复。
          </p>

          <div className="telemetry">
            <div className="tele-row">
              <span className="tele-key">后端地址</span>
              <span className="tele-val" title={apiUrl}>
                {apiUrl.length > 25 ? apiUrl.slice(0, 23) + '...' : apiUrl || '—'}
              </span>
            </div>
            <div className="tele-row">
              <span className="tele-key">消息数</span>
              <span className="tele-val">{messages.length}</span>
            </div>
            <div className="tele-row">
              <span className="tele-key">状态</span>
              <span className={`tele-val ${loading ? 'live' : ''}`}>
                {loading ? 'TRANSMITTING' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* 右侧对话面板 */}
        <div className="chat-main">
          {/* 消息列表 */}
          <div className="messages-container" id="messages">
            {messages.length === 0 && (
              <div className="empty-state">
                系统就绪。配置后端接口地址后，输入您的问题并发送。
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="msg-label">
                  {msg.role === 'user' ? 'YOU' : 'AI'}
                </div>
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}

            {/* AI 思考中提示 */}
            {loading && (
              <div className="message ai">
                <div className="msg-label">AI</div>
                <div className="msg-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-text">AI 正在思考...</span>
                </div>
              </div>
            )}
          </div>

          {/* 错误信息显示 */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* 输入区域 */}
          <div className="input-area">
            <div className="input-wrap">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="在此输入您的问题，Ctrl+Enter 发送"
                rows={3}
                maxLength={2000}
                disabled={loading}
              />
              <button
                className="send-button"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                {loading ? '发送中...' : '发送'}
              </button>
            </div>
            <div className="input-meta">
              <span className="input-hint">Ctrl+Enter 发送</span>
              <span className="char-count">{input.length} / 2000</span>
            </div>
          </div>
        </div>
      </div>

      {/* 底部配置栏 */}
      <div className="config-bar">
        <span className="config-label">后端接口</span>
        <input
          type="text"
          className="config-input"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://your-server-ip:8000/api/chat"
        />
      </div>
    </div>
  );
}

export default Chat;
