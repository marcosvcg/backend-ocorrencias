import { consultarCard } from "../service/metabaseService.js";

export const obterDemandasPorFiltros = async (req, res) => {
    const { page, status, filtro, valor, orgao_slug, setor_id } = req.body;
    
    const params = [
        {
            type: "text",
            value: orgao_slug,
            target: ["variable", ["template-tag", "orgao_slug"]],
        }
    ];

    const addParam = (value, name, type) => {
        if (value !== undefined && value !== null) {
            params.push({
                type,
                value,
                target: ["variable", ["template-tag", name]],
            });
        }
    };

    if (setor_id) addParam(setor_id, "setor_id", "category");
    if (status) addParam(status, "status", "text");
    if (filtro) addParam(filtro, "filtro", "text");
    if (valor) addParam(valor, "valor", "text");
    if (page) addParam(page, "page", "number");

    const result = await consultarCard(3000, params);

    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.json(
        JSON.parse(result.data)
    );

};

export const obterDetalhesDemanda = async (req, res) => {
    const { protocolo } = req.body;
    const params = [
        {
            type: "text",
            value: protocolo,
            target: ["variable", ["template-tag", "protocolo"]],
        }
    ];
    const result = await consultarCard(3005, params);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.json(
        JSON.parse(result.data)
    );
}

export const obterSetorIdPorSigla = async (req, res) => {
    const { orgao_id, setor_sigla } = req.body;
    const params = [
        {
            type: "text",
            value: orgao_id,
            target: ["variable", ["template-tag", "orgao_id"]],
        },
        {
            type: "category",
            value: setor_sigla,
            target: ["variable", ["template-tag", "setor_sigla"]],
        }
    ];
    const result = await consultarCard(3001, params);
    if (result.error) {
        return res.status(result.status).json({ error: result.error });
    }
    return res.json(result.data[0]);
};
