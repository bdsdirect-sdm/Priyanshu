"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./environment/env");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
db_1.default.sync({ force: false }).then(() => {
    console.log('Database connected');
    app.listen(env_1.Local.SERVER_PORT, () => {
        console.log(`Server is running on port ${env_1.Local.SERVER_PORT}`);
    });
}).catch((err) => {
    console.log("Error: ", err);
});
