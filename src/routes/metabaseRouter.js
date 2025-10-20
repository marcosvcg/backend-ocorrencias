import { consultarNome, visualizarOcorrencia, obterTramitacao } from '../controller/metabaseFormsController.js';
import { obterDemandasPorFiltros, obterDetalhesDemanda, obterSetorIdPorSigla } from '../controller/metabaseOuvidoriaController.js';
import express from 'express';

const router = express.Router();

router.post('/consultar-nome', consultarNome);
router.post('/visualizar-ocorrencia', visualizarOcorrencia);
router.post('/obter-tramitacao', obterTramitacao);
// =========================================================
router.post('/obter-demandas', obterDemandasPorFiltros)
router.post('/obter-demanda', obterDetalhesDemanda)
router.post('/obter-setor', obterSetorIdPorSigla)

export default router;