import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

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

export default apiMetabase;