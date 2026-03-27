import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GuestLayout from './components/GuestLayout';
import Layout from './components/Layout';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import GroupList from './pages/GroupList';
import GroupDetail from './pages/GroupDetail';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
          <Route path="features" element={<Features />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<GroupList />} />
          <Route path="groups" element={<GroupList />} />
          <Route path="groups/:id" element={<GroupDetail />} />
          <Route path="saved" element={<div className="p-4"><h1 className="text-2xl font-bold">Saved Resources</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
