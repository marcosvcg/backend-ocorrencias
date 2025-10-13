import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import corsOptions from './src/config/corsOptions.js';
import router from './src/routes/metabaseRouter.js';

dotenv.config();

const app = express(); // servir requisicoes da api do metabase

app.use(express.json());
app.use(cors(corsOptions));
app.use('/', router);

app.listen(process.env.PORT);