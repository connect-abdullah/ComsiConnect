import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './auth/ProtectedRoute';
import Home from './pages/landingPage/Home';
import Login from './pages/auth/Login';
import Signup from "./pages/auth/Signup";
import About from "./pages/landingPage/About";
import Contact from "./pages/landingPage/Contact";
import Feed from "./pages/Feed";
import Profile from "./pages/profileSection/Profile";
import EditProfile from "./pages/profileSection/EditProfile";
import Confessions from "./pages/Confessions";
import MyConfessions from "./pages/MyConfessions";
import ForgotPass from "./pages/auth/ForgotPass";
import VerifyOTP from "./pages/auth/VerifyOTP";

function App() {
  return (
    <Routes>
       {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/forgot-pass" element={<ForgotPass />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      
      {/* Protected Routes */}
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/confessions" element={<ProtectedRoute><Confessions /></ProtectedRoute>} />
      <Route path="/my-confessions" element={<ProtectedRoute><MyConfessions /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;