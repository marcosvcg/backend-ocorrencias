import dotenv from "dotenv";

dotenv.config();

const allowedOrigins = [
    process.env.URL_WEBAPP_OCORRENCIAS
];

export default allowedOrigins;
