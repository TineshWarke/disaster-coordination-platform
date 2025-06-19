// lib/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
    transports: ['websocket'],
    withCredentials: false,
});

export default socket;
