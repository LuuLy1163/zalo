// src/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // nhớ đổi đúng port của server

export default socket;
