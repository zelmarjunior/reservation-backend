import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from "./database/data-source";
import routers from './routes/router';
import 'dotenv/config'

const app = express();

app.use(cors());

app.use(express.json());

app.use(routers);

const PORT = 3333;

AppDataSource.initialize().then(async () => {
    console.log('Database connection ready!')
    
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
}).catch(error => console.log(error));
