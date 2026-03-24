import { Routes, Route } from 'react-router-dom';
import Redirect from './pages/Redirect';
import Home from './pages/Home';
import Chat from './pages/Chat';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Redirect />} />
      <Route path="/dev" element={<Home />} />
      <Route path="/dev/sub_page" element={<Chat />} />
    </Routes>
  );
}

export default App;
