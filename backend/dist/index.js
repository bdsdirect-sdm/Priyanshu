"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./environment/env");
const db_1 = __importDefault(require("./config/db"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const http_1 = require("http");
// import sequelize from 'seq';
const app = (0, express_1.default)();
exports.httpServer = (0, http_1.createServer)(app);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/", userRouter_1.default);
db_1.default.sync({ force: false }).then(() => {
    console.log('Database connected');
    exports.httpServer.listen(env_1.Local.SERVER_PORT, () => {
        console.log(`Server is running on port ${env_1.Local.SERVER_PORT}`);
    });
}).catch((err) => {
    console.log("Error: ", err);
});
