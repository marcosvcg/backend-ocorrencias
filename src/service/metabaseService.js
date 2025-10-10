import apiMetabase from "../api/apiMetabase.js";

export async function consultarCard(cardId, parameters) {
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