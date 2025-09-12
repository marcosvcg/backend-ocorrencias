import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import axios from 'axios';

dotenv.config();
const app = express(); // servir requisicoes da api do metabase

app.use(express.json());
app.use(cors());

const apiMetabase = axios.create({
    baseURL: process.env.URL_API_METABASE,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiMetabase.interceptors.request.use(config => {
    config.headers['Content-Type'] = "application/json";
    config.headers['x-api-key'] = process.env.METABASE_API_KEY;
    return config;
});

app.post("/consultar-nome", async (req, res) => {
    const { cpf } = req.body;

    if (!cpf || cpf.length < 11) {
        return res.status(400).json({ error: "CPF inválido ou ausente" });
    }

    const body = {
        ignore_cache: false,
        collection_preview: false,
        parameters: [
            {
                type: "text",
                value: cpf,
                target: ["variable", ["template-tag", "cpf"]],
            },
        ],
    };

    try {
        const response = await apiMetabase.post(`/card/2900/query`, body);
        
        const rows = response.data?.data?.rows;

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Não encontrado" });
        }

        return res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({ 
            error: "Erro ao consultar dados"
        });
    }
});

app.listen(process.env.PORT);