import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ChatLayout from './layout/ChatLayout';
import Home from './pages/Home/Home';
import Chat from './components/Chat'
function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/password-reset" element={<ResetPassword />} />
            <Route path="/" element={<ChatLayout />}>
                <Route path="" element={<Home />} />
                <Route path="chat/:id" element={<Chat />} />
            </Route>
        </Routes>
    );
}

export default App;
