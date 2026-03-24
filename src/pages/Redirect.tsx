import { Navigate } from 'react-router-dom';

/**
 * 根路径重定向组件
 * 访问 / 时自动重定向到 /dev
 */
function Redirect() {
  return <Navigate to="/dev" replace />;
}

export default Redirect;
