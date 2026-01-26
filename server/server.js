import express from 'express'
import { PORT } from './envValidation';
import { fileURLToPath } from 'url';
import router from '../routes/shortener.routes';
import path from 'path';

const app = express();

//for absolute path of the file;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//json file;

app.use(express.static(path.join(__dirname, "..", "staticfiles")));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "..", "staticfiles", "index.html")
    );
});

//to get the data from form;
//as we used post method type;
//browser will give a text response to http;
//to translae that text into js object we have to use middleware;
app.use(express.urlencoded({ extended: true }));

//express router;
app.use(router);

app.listen(PORT, () => {
    console.log(typeof PORT)
    console.log(`Server is running or ${PORT}`);
});