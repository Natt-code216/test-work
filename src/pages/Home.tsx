import { Link } from 'react-router-dom';

/**
 * /dev 首页组件
 * 简单的欢迎页面
 */
function Home() {
  return (
    <div className="home-page">
      <h1>这是 Dev 首页</h1>
      <p>欢迎使用 AI 对话系统</p>
      <Link to="/dev/sub_page" className="enter-chat-link">
        进入对话页面 →
      </Link>
    </div>
  );
}

export default Home;
