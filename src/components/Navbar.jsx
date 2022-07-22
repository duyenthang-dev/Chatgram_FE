import React, { useContext } from 'react';
import Row from 'react-bootstrap/Row';
import { FaUserCircle } from 'react-icons/fa';
import { BiChat, BiPhoneCall, BiMoon, BiLockOpen, BiLogOutCircle, BiSave, BiServer } from 'react-icons/bi';
import { FiSettings } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { MdOutlineLanguage } from 'react-icons/md';
import authService from './../services/authService';
import { useNavigate } from 'react-router-dom';
import SocketContext from './../context/SocketContext';
import { resetAll as resetUserAll } from '../redux/userSlice';
import { resetAll as resetChatAll } from '../redux/chatSlice';
import logo from './../assets/img/logo-transparent.png'
// import PropTypes from 'prop-types';
const Navbar = (props) => {
    const dispatch = useDispatch();
    const { socket, removeSocket } = useContext(SocketContext);
    const navigate = useNavigate();
    const  {user}  = useSelector((state) => state.user);

    const onHandleLogout = () => {
        authService.logout();
        dispatch(resetUserAll());
        dispatch(resetChatAll());
        navigate('/login');
        socket.emit("logout", (user));
        removeSocket()
        // socket.off();
       
    };

    return (
        <Row className="flex-lg-column navbar-wrapper pt-4 pb-4 position-relative h-100">
            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <img src={logo} alt="logo" width="28px" />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <FaUserCircle
                    fontSize={'24px'}
                    color="#878a92"
                    cursor={'pointer'}
                    onClick={() => props.setDisplayModal(true)}
                />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon active-icon">
                <BiChat fontSize={'24px'} color="#878a92" />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <BiPhoneCall fontSize={'24px'} color="#878a92" cursor={'pointer'} />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <FiSettings
                    fontSize={'24px'}
                    color="#878a92"
                    cursor={'pointer'}
                    onClick={() => props.setIsSetting(!props.isSetting)}
                />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon">
                <BiMoon fontSize={'24px'} color="#878a92" cursor={'pointer'} />
            </div>

            <div className="d-flex justify-content-center align-items-center navbar-icon mt-auto rounded-circle">
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-btn">
                        <div className="avatar-xs avatar" id="dropdown-basic">
                            <img src={user.avatar } alt="" />
                        </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="dropdown-menu">
                        <Dropdown.Item
                            href="#/action-2"
                            className="dropdown-item d-flex align-items-center justify-content-between "
                        >
                            Ngôn ngữ <MdOutlineLanguage fontSize={'17px'} />
                        </Dropdown.Item>
                        <Dropdown.Item
                            href="#/action-2"
                            className="dropdown-item d-flex align-items-center justify-content-between "
                        >
                            Sao lưu <BiSave fontSize={'17px'} />
                        </Dropdown.Item>
                        <Dropdown.Item
                            href="#/action-2"
                            className="dropdown-item d-flex align-items-center justify-content-between "
                        >
                            Đổi mật khẩu <BiLockOpen fontSize={'17px'} />
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            className="dropdown-item d-flex align-items-center justify-content-between"
                            onClick={onHandleLogout}
                        >
                            Đăng xuất <BiLogOutCircle fontSize={'17px'} />
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </Row>
    );
};

Navbar.propTypes = {};

export default Navbar;
