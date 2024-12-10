import { io, Socket } from 'socket.io-client';

// Initialize the socket connection (make sure the URL is correct)
const socket: Socket = io('http://localhost:4000');  // Replace with your server URL

export default socket;
