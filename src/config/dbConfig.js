import mongoose from 'mongoose'

export async function connectDB() {
    try {
        console.log('MONGO_URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Conexion exitosa a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB', error);
        process.exit(1);
    }
}
