import express from 'express'
import { PORT } from './envValidation';

const app = express();

app.listen(PORT, () => {
    console.log(typeof PORT)
    console.log(`Server is running or ${PORT}`);
})