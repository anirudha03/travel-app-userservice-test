import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import preferenceRoutes from './routes/preferences.route.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferenceRoutes);

mongoose.connect(process.env.user_connection).then(async () => {
    console.log("Connected to the database");
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
    } catch (error) {
        console.error('Error: ', error);
    } 
}).catch((err)=>{
    console.log('Error connecting to the database:', err);
});

app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
});
