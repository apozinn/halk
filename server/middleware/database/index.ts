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
    if (!url) return console.error("Plese provider a mongoDB url");
    mongoose.set('strictQuery', true);
    await mongoose.connect(url, options)
        .then(() => console.log('Initial database connection attempt successful!'))
        .catch(err => console.error('Error attempting to connect to MongoDB:', err));
}