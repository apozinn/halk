import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export default async function Connect() {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 60000,
        keepAlive: true, 
        keepAliveInitialDelay: 300000 
    };

    let Connect = mongoose.connection;
    let url = process.env.DATABASE_URL;

    if(!url) return console.log("Não foi possivel encontrar o link de acesso da sua database.");

    Connect.on("connected", () => {
        console.log("Database conectada.");
    });

    await mongoose.connect(url, options);
}