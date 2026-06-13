import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Chatbox from './pages/Chatbox';
import AllChats from './pages/AllChats';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import Attachments from './pages/Attachments';

function App() {

  return (
    <>
      <BrowserRouter>
      <Navbar title={"Instagram"} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path={user ? `/${user.username || user}` : "/"} element={<Profile />} /> */}
          <Route path="/settings" element={<Settings />} />
          <Route path='/chat' element={<AllChats />} />
          <Route path='/addpost' element={<NewPost />} />

          {/* keep these in last */}
          <Route path='/chatbox/:username' element={<Chatbox />} />
          <Route path='/post/:id' element={<Post />} />
          <Route path='/:user/attachments' element={<Attachments />} />
          <Route path="/:username" element={<Profile />} /> 
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App