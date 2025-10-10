import { consultarNome, visualizarOcorrencia, obterTramitacao } from '../controller/metabaseFormsController.js';
import express from 'express';

const router = express.Router();

router.post('/consultar-nome', consultarNome);
router.post('/visualizar-ocorrencia', visualizarOcorrencia);
router.post('/obter-tramitacao', obterTramitacao);

export default router;
