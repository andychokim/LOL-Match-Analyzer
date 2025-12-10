import mongoose from 'mongoose';
import app from './app';


const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        mongoose.connect(process.env.MONGO_URI!).then(() => {
            app.listen(PORT, () => {
                console.log(`Connected to DB & Server is running on port ${PORT}`);
            });
        });
    }
    catch (error) {
        console.error('Failed to connect:', error);
        process.exit(1);
    }
};

startServer();
