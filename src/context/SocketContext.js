import React, { createContext, useState } from 'react';
import { io } from 'socket.io-client';
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const SOCKET_URL = process.env.REACT_APP_SOCKET_ENDPOINT;
    let socketClient = io.connect(SOCKET_URL);
    const [socket, setSocket] = useState(socketClient);

    const removeSocket = () => {
        setSocket(null);
    };

    const addSocket = () => {
        const SOCKET_URL = process.env.REACT_APP_SOCKET_ENDPOINT;
        let socketClient = io.connect(SOCKET_URL);
        setSocket(socketClient);
    }
    return <SocketContext.Provider value={{ socket, removeSocket, addSocket }}>{children}</SocketContext.Provider>;
};

export default SocketContext;
