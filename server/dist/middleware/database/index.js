"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function Connect() {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 60000,
        keepAlive: true,
        keepAliveInitialDelay: 300000
    };
    let Connect = mongoose_1.default.connection;
    let url = process.env.DATABASE_URL;
    if (!url)
        return console.log("Não foi possivel encontrar o link de acesso da sua database.");
    Connect.on("connected", () => {
        console.log("Database conectada.");
    });
    await mongoose_1.default.connect(url, options);
}
exports.default = Connect;
//# sourceMappingURL=index.js.map