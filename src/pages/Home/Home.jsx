import React, { useEffect, useState, useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Chat from '../../components/Chat';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reset, getUser } from './../../redux/userSlice';
import Spinner from '../../components/Spinner';
import SocketContext from '../../context/SocketContext';
import './Home.css';
import ModalProfile from '../../components/modal/ModalProfile';
import ModalSettingOption from '../../components/modal/ModalSettingOption';
import { addChat, selectChat } from './../../redux/chatSlice';
import Skeleton from '../../components/Skeleton';
import RightSidebar from '../../components/RightSidebar';

const Home = (props) => {
    const { socket } = useContext(SocketContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError } = useSelector((state) => state.user);
    const [recentChat, setRecentChat] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);
    const [screenchatClassName, setScreenchatClassName] = useState('d-flex');
    const [isSetting, setIsSetting] = useState(false);
    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
            dispatch(reset());
        }
    }, [isError, navigate, dispatch]);

    useEffect(() => {
        socket.on('direct_chat_created', (newchat) => {
            setRecentChat((prev) => [newchat, ...prev]);
            navigate(`chat/${newchat._id}`);
        });

        socket.on('group_chat_created', (newchat) => {
            console.log('new chat created');
            setRecentChat((prev) => [newchat, ...prev]);
            navigate(`chat/${newchat._id}`);
            dispatch(selectChat({ targetAvatar: newchat.avatar, targetFullname: newchat.name, type: 1 }));
        });
    }, [socket]);

    // realtime chat
    useEffect(() => {
        if (user) {
            socket.emit('add-new-user', user);
            socket.emit('get_list_rooms', user._id);
            socket.on('get-onlineUser', (data) => {
                console.log(data);
            });
        }
    }, [dispatch, socket, user]);

    useEffect(() => {
        socket.on('room_list', (groupChats) => {
            // console.log(groupChats);
            setRecentChat(groupChats);
        });
    }, [socket]);

    useEffect(() => {
        socket.on('refresh_chat', (groupChats) => {
            setRecentChat(groupChats);
        });
    }, [socket]);

    useEffect(() => {
        if (displayModal) {
            setScreenchatClassName('modal-displayed');
        } else {
            setScreenchatClassName('d-flex');
        }
    }, [displayModal]);

    // console.log(socket);
    const a = null;
    return (
        <Container fluid className="home-container">
            <>
                <Row className={screenchatClassName}>
                    <Col className="navbar-container">
                        {!user ? null : (
                            <Navbar
                                setDisplayModal={setDisplayModal}
                                setIsSetting={setIsSetting}
                                isSetting={isSetting}
                            />
                        )}{' '}
                    </Col>
                    <Col className="sidebar-container">
                        {!user ? <Skeleton /> : <Sidebar recentChat={recentChat} />}
                    </Col>
                    <Col className="chat-container w-100 overflow-hidden">{!user ? <Spinner /> : <Chat />}</Col>
                    {/* <Col className="right-sidebar-container">
                        <RightSidebar />
                    </Col> */}
                </Row>
                {displayModal && (
                    <div className="over-modal-container">
                        <ModalProfile setDisplayModal={setDisplayModal} />
                    </div>
                )}

                {isSetting && (
                    <div className="over-modal-setting-container">
                        <ModalSettingOption setIsSetting={setIsSetting} />
                    </div>
                )}
            </>
        </Container>
    );
};

Home.propTypes = {};

export default Home;
