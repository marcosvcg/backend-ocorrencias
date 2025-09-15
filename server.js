import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import apiMetabase from './src/service/apiMetabase.js';
import corsOptions from './src/config/corsOptions.js';

const app = express(); // servir requisicoes da api do metabase
app.use(express.json());
app.use(cors(corsOptions));
dotenv.config();

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