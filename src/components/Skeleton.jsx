import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './../pages/Login/Login.css';
const Skeleton = () => {
    return (
        <Row className="mt-5">
            {[...Array(8)].map((e, idx) => (
                <div className="chat-item-skeleton" key={idx}>
                    <div className="chat-avatar-skeleton"></div>
                    <div className="chat-line-skeleton"></div>
                    <div className="chat-line-skeleton"></div>
                </div>
            ))}
        </Row>
    );
};

export default Skeleton;
