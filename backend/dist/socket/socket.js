"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const index_1 = require("../index");
const io = new socket_io_1.Server(index_1.httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
        credentials: true
    }
});
