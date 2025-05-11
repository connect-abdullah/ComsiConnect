import { Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/confessions" element={<Confessions />} />
      <Route path="/my-confessions" element={<MyConfessions />} />
    </Routes>
  );
}

export default App;