import React, { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Slider from './Slider';
import UserCard from './UserCard';
import { useSelector } from 'react-redux';
import { BiSearch } from 'react-icons/bi';
import SocketContext from './../context/SocketContext';


const ChatGroupModal = (props) => {
    const user = useSelector((state) => state.user.user);

    const [checked, setChecked] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [listUsers, setListUsers] = useState([]);
    const { socket } = useContext(SocketContext);

    const handleCheck = (e) => {
        let tempArr = [...checked];
        if (e.target.checked) {
            tempArr = [...checked, { id: e.target.id, avatar: e.target.getAttribute('avatar') }];
        } else {
            const removeIdx = tempArr.map((e) => e.id).indexOf(e.target.id);
            tempArr.splice(removeIdx, 1);
        }

        setChecked(tempArr);
    };

    const handleClose = () => {
        setChecked([]);
        props.onHide();
    };

    const handleCreateGroup = () => {
        console.log(checked)
        console.log(groupName)
        const data = {
            name: groupName,
            members: [...checked.map((member) => member.id), user._id]
        }
        socket.emit("create_group_chat", data)
       
        props.onHide();
    };

    const onSearching = (e) => {
        const tempArr = props.listuser.filter(
            (elm) => elm.fullname.toLocaleLowerCase().includes(e.target.value.toLowerCase()) && elm._id !== user._id
        );
        setListUsers(tempArr);
    };

    const renderSelected = (list) => {
        return list.map((user) => (
            <div className="avatar-medium avatar" key={user.id}>
                <img src={user.avatar} alt="" />
            </div>
        ));
    };
    return user ? (
        <Modal
            {...props}
            dialogClassName="modal-400"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable={true}
        >
            <Modal.Header closeButton className="modal-header">
                <Modal.Title id="contained-modal-title-vcenter">
                    <h4>Tạo nhóm mới</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalBody not-scroll px-4">
                <div className="newgroup-name mt-2 mb-5">
                    <label htmlFor="np-group-name" className="d-block">
                        <h5 className="mb-2">Tên nhóm</h5>
                    </label>
                    <input
                        type="text"
                        name="inp-group-name"
                        id="inp-group-name"
                        className="w-100"
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </div>

                <div className="newgroup-search mt-2 mb-3 position-relative">
                    <BiSearch fontSize={'22px'} />
                    <input
                        type="text"
                        name="inp-group-search"
                        id="inp-group-search"
                        className="w-100"
                        placeholder="Nhập tên để tìm ..."
                        onChange={onSearching}
                        defaultValue=""
                    />
                </div>

                <div className="selected-user mb-4">
                    <h5 className="mb-4 mt-3">Thành viên</h5>
                    <div className="mx-4">
                        <Slider list={renderSelected(checked)} slidersPerView={6} />
                    </div>
                </div>
                <div className="modal-list-wrapper">
                    <h5 className="">Danh sách user</h5>
                    {listUsers ? (
                        <ul className="modal-list scroll-bar pr-3">
                            {listUsers.map((e) =>
                                e._id !== user._id ? (
                                    <label className="d-flex justify-content-between d-block w-100" htmlFor={e._id} key={e._id}>
                                        <li key={e._id} className="flex-grow-1 d-flex justify-content-between px-3">
                                            <label htmlFor={e._id}>
                                                <UserCard
                                                    userId={user._id}
                                                    targetId={e._id}
                                                    avatar={e.avatar}
                                                    fullname={e.fullname}
                                                    // onHide={props.onHide}
                                                />
                                            </label>

                                            <input
                                                type="checkbox"
                                                name="select-user"
                                                id={e._id}
                                                onChange={handleCheck}
                                                user_id={user._id}
                                                target_id={e._id}
                                                avatar={e.avatar}
                                                className="select-user"
                                            />
                                        </li>
                                    </label>
                                ) : null
                            )}
                        </ul>
                    ) : null}
                </div>
            </Modal.Body>
            <Modal.Footer className="px-4 mt-5 py-3">
                <Button onClick={handleClose} className="mx-4 btn-secondary">
                    Close
                </Button>
                <Button onClick={handleCreateGroup}>Tạo mới</Button>
            </Modal.Footer>
        </Modal>
    ) : null;
};

ChatGroupModal.propTypes = {};

export default ChatGroupModal;
