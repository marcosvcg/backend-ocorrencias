import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import apiMetabase from './src/service/apiMetabase.js';
import corsOptions from './src/config/corsOptions.js';

const app = express(); // servir requisicoes da api do metabase
app.use(express.json());
app.use(cors(corsOptions));
dotenv.config();

async function consultarMetabase(cardId, parameters) {
    const body = {
        ignore_cache: false,
        collection_preview: false,
        parameters,
    };

    try {
        const response = await apiMetabase.post(`/card/${cardId}/query`, body);
        const rows = response.data?.data?.rows;

        if (!rows || rows.length === 0) {
            return { error: "Não encontrado.", status: 404 };
        }

        return { data: rows[0] };
    } catch (error) {
        console.error(`Erro ao consultar card ${cardId}:`, error.message);
        return { error: "Erro ao consultar dados.", status: 500 };
    }
}

app.post("/consultar-nome", async (req, res) => {
    const { cpf } = req.body;

    if (!cpf || cpf.length < 11) {
        return res.status(400).json({ error: "CPF inválido ou ausente" });
    }

    const params = [
        {
            type: "text",
            value: cpf,
            target: ["variable", ["template-tag", "cpf"]],
        }
    ];

    const result = await consultarMetabase(2900, params);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    return res.json(result.data);
});

app.post("/visualizar-ocorrencia", async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "ID inválido ou ausente." });
    }

    const params = [
        {
            type: "text",
            value: id,
            target: ["variable", ["template-tag", "id"]],
        }
    ];

    const result = await consultarMetabase(2955, params);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }

    return res.json(result.data);
});

app.post("/obter-tramitacao", async (req, res) => {
    const { protocolo, flow_slug } = req.body;

    if (!protocolo || !flow_slug) {
        return res.status(400).json({ error: "Parâmetro inválido ou ausente." });
    }

    const body = {
        ignore_cache: false,
        collection_preview: false,
        parameters: [
            {
                type: "text",
                value: protocolo,
                target: ["variable", ["template-tag", "protocolo"]],
            },
            {
                type: "text",
                value: flow_slug,
                target: ["variable", ["template-tag", "flow_slug"]],
            }
        ],
    };

    try {
        const response = await apiMetabase.post(`/card/2968/query`, body);

        const rows = response.data?.data?.rows;

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "Não encontrado." });
        }
        
        const tramitacoes = rows.map((row) => ({
            tramitacao_id: row[0],
            ordem: row[1],
            orgao_id: row[2],
            atividade: row[3],
            status: row[4],
            descricao: row[5],
            tramitacao_concluida_id: row[6],
        }));

        return res.json(tramitacoes);
    } catch (error) {
        return res.status(500).json({
            error: "Erro ao consultar dados"
        });
    }
});

app.listen(process.env.PORT);