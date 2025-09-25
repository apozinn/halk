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

    let url = process.env.DATABASE_URL;
    if(!url) return console.error("Plese provider a mongoDB url");
    await mongoose.connect(url, options);
}