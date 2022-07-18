import React, {} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import UserCard from './UserCard';
import { useSelector } from 'react-redux';
function UserModal(props) {
    // console.log(props.listUsers);
    const user = useSelector((state) => state.user.user);
    // console.log(user);
    const listuser = props.listuser;
    return user ? (
        <Modal
            {...props}
            dialogClassName="modal-250"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            scrollable={true}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Danh sách user</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modalBody scroll-bar">
                {listuser ? (
                    <ul>
                        {listuser.map((e) =>
                            e._id !== user._id ? (
                                <li key={e._id}>
                                    <UserCard
                                        userId={user._id}
                                        targetId={e._id}
                                        avatar={e.avatar}
                                        fullname={e.fullname}
                                        onHide={props.onHide}
                                    />
                                </li>
                            ) : null
                        )}
                    </ul>
                ) : null}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    ) : null;
}

UserModal.propTypes = {};

export default UserModal;
