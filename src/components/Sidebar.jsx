import React, { useEffect, useState, useRef, useContext } from 'react';
import Row from 'react-bootstrap/Row';
import UserChatCard from './UserChatCard';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { selectChat, addNotifications, removeNotifications } from './../redux/chatSlice.js';
import { startSearch, endSearch } from './../redux/userSlice';
import UserModal from './UserModal';
import SocketContext from './../context/SocketContext';
// import PropTypes from 'prop-types'
import { BiPlus, BiSearch, BiArrowBack } from 'react-icons/bi';
import { BsPersonPlusFill } from 'react-icons/bs';
import userService from '../services/userService';
import Search from './Search';
import ChatGroupModal from './ChatGroupModal';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import Skeleton from './Skeleton';
const getChatInfo = (chats, userId) => {
    const result = [];
    chats.forEach((chat) => {
        let [{ avatar, fullname }] = chat.members.filter((i) => i.id !== userId);
        if (chat.type === 1) {
            avatar = chat.avatar;
            fullname = chat.name;
        }

        const author = chat.lastMessage?.author;
        const messContent = chat.lastMessage?.body;
        const createAt = chat.lastMessage?.createAt;
        const isYours = author === userId ? true : false;
        const chatId = chat._id;
        result.push({ avatar, fullname, isYours, messContent, createAt, chatId });
    });

    return result;
};

function Sidebar({ recentChat }) {
    const { socket } = useContext(SocketContext);
    const sidebarRef = useRef(null);
    const { user, isSearching } = useSelector((state) => state.user);
    const { lastMessage } = useSelector((state) => state.chat);
    const [chatArray, setChatArray] = useState([]);
    const dispatch = useDispatch();
    const [addDirectChatShow, setAddDirectChatShow] = useState(false);
    const [addGroupChatShow, setAddGroupChatShow] = useState(false);
    const [listUsers, setlistUsers] = useState(null);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const searchRef = useRef();

    useEffect(() => {
        if (recentChat) {
            const userId = user._id;
            const res = getChatInfo(recentChat, userId);
            res.sort(function (a, b) {
                return new Date(b.createAt) - new Date(a.createAt);
            });

            res.forEach((chat) => {
                const data = {
                    userId: user._id,
                    fullname: user.fullname,
                    room: chat.chatId,
                };
                // add notifycation if there are messages were sent while user offline
                const x = user.lastSeen.filter((e) => e.chatGroupID === chat.chatId);
                let time = null;
                if (x.length > 0) {
                    time = x[0].time;
                }
                const temp = new Date(time);
                temp.setSeconds(temp.getSeconds() + 1);
                if (new Date(chat.createAt) > temp) {
                    dispatch(addNotifications(chat.chatId));
                }
                socket.emit('join_room', data);
            });

            setChatArray(res);
        }
    }, [recentChat, socket, dispatch, user._id, user.fullname, user.lastSeen]);

    const navLinkClass = ({ isActive }) => {
        return isActive ? 'nav-link activated' : 'nav-link';
    };

    const onSelectRoom = (roomId, prevRoomId) => {
        if (window.innerWidth < 900) {
            document.querySelector('.sidebar-container').classList.add('hidden');
            document.querySelector('.navbar-container').classList.add('hidden');
            document.querySelector('.chat-container').classList.add('un-hidden');
        }

        const [currentChat] = recentChat.filter((e) => e._id === roomId);
        if (!currentChat) return;
        let [{ avatar: targetAvatar, fullname: targetFullname }] = currentChat?.members.filter(
            (e) => e._id !== user._id
        );

        // type =1 : group chat
        if (currentChat.type === 1) {
            targetAvatar = currentChat.avatar;
            targetFullname = currentChat.name;
        }

        dispatch(selectChat({ targetAvatar, targetFullname, type: currentChat.type }));
        dispatch(removeNotifications(roomId));
        const data = {
            socketId: socket.id,
            roomId,
            userId: user._id,
            prevRoomId,
        };

        socket.emit('load_room_message', data);
        // dispatch(reset);
    };

    const onSearchUser = () => {
        console.log('Search User');
        searchRef.current.value = '';
        dispatch(startSearch());
    };

    const onCancelSearch = () => {
        searchRef.current.value = '';
        dispatch(endSearch());
    };

    const onChangeText = (e) => {
        setSearchText(e.target.value);
    };

    useEffect(() => {
        socket.on('direct_chat_existed', (chat) => {
            // console.log(recentChat);
            if (recentChat) {
                onSelectRoom(chat._id, chat._id);
                navigate(`chat/${chat._id}`);
            }
            // onSelectRoom(chat._id, chat._id);
        });
    }, [recentChat, socket]);

    useEffect(() => {
        if (lastMessage) {
            let tempArr = [...chatArray];
            for (let i = 0; i < tempArr.length; i++) {
                if (lastMessage.chatGroupID === tempArr[i].chatId) {
                    tempArr[i].author = lastMessage.author;
                    tempArr[i].messContent = lastMessage.body;
                    tempArr[i].createAt = lastMessage.createAt;
                    tempArr[i].isYours = lastMessage.isYours;
                }
            }
            tempArr.sort(function (a, b) {
                return new Date(b.createAt) - new Date(a.createAt);
            });

            setChatArray(tempArr);
        }
    }, [socket, lastMessage]);

    //  console.log("a")

    const onCreateDirectChat = () => {
        if (listUsers) {
            setAddDirectChatShow(true);
        }
    };

    const onCreateGroupChat = () => {
        if (listUsers) {
            setAddGroupChatShow(true);
        }
    };

    useEffect(() => {
        const loadUsers = async () => {
            const users = await userService.getAllUsers();
            setlistUsers(users.data.users);
        };
        loadUsers();
    }, []);
    const { t } = useTranslation();

    // console.log(recentChat)
    if (!recentChat) return <Skeleton />;
    return (
        <Row className="pt-2">
            <UserModal show={addDirectChatShow} onHide={() => setAddDirectChatShow(false)} listuser={listUsers} />
            <ChatGroupModal show={addGroupChatShow} onHide={() => setAddGroupChatShow(false)} listuser={listUsers} />
            <div className="sidebar-header pt-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>Chats</h3>
                    <div className="d-flex gap-4">
                        <div className="add-chat">
                            <BsPersonPlusFill fontSize={'18px'} onClick={onCreateDirectChat} />
                        </div>

                        <div className="add-chat">
                            <AiOutlineUsergroupAdd fontSize={'18px'} onClick={onCreateGroupChat} />
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center sidebar-search mx-auto">
                    {isSearching ? (
                        <div className="bg-light" onClick={onCancelSearch}>
                            <BiArrowBack fontSize={'24px'} />
                        </div>
                    ) : (
                        <div className="bg-light">
                            <BiSearch fontSize={'24px'} />
                        </div>
                    )}

                    <input
                        type="text"
                        name="sidebar-search"
                        id="sidebar-search"
                        className="d-inline-block bg-light"
                        placeholder={t('content.searchPlaceholder')}
                        onFocus={onSearchUser}
                        onChange={(e) => onChangeText(e)}
                        ref={searchRef}
                        defaultValue=""
                    />
                </div>
            </div>
            <div className="sidebar-main">
                {isSearching ? (
                    <Search listUsers={listUsers} searchText={searchText} />
                ) : (
                    <>
                        <div className="recent-chat my-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4>{t('content.privateChatTitle')}</h4>
                            </div>
                            <ul className="chat-list scroll-bar">
                                {chatArray.length > 0
                                    ? chatArray.map((chat, idx) => {
                                          const prevRoom = window.location.pathname.split('/').pop();
                                          return (
                                              <li key={idx}>
                                                  <NavLink
                                                      key={idx}
                                                      to={`chat/${chat.chatId}`}
                                                      className={navLinkClass}
                                                      onClick={() => onSelectRoom(chat.chatId, prevRoom)}
                                                      ref={sidebarRef}
                                                  >
                                                      <UserChatCard
                                                          avatar={chat.avatar}
                                                          fullname={chat.fullname}
                                                          isYours={chat.isYours}
                                                          messContent={chat.messContent}
                                                          createAt={chat.createAt}
                                                          chatId={chat.chatId}
                                                      />
                                                  </NavLink>
                                              </li>
                                          );
                                      })
                                    : null}
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </Row>
    );
}

Sidebar.propTypes = {};

export default Sidebar;
