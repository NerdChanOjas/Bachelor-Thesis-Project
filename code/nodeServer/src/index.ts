import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes'
import fileRoutes from './routes/fileRoutes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//routes
app.use('/api/user', userRoutes)
app.use('/api/file', fileRoutes)

app.get('/hello', (req: Request, res: Response) => {
    res.status(200).json({ 
        message: 'Hello World from TypeScript Express!',
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});