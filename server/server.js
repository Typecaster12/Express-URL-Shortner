import express from 'express'
import { PORT } from './envValidation';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

//for absolute path of the file;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const aliasArray = [];

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
app.post('/submit', (req, res) => {

    //contains the main/real url
    const mainUrl = req.body.mainUrl;
    //steps: to validate url, url should be existing and valid;
    if (!mainUrl) {
        return res.status(400).send("Error : URL parameter is missing..");
    }

    //url validation;
    try {
        new URL(mainUrl);
        // res.status(200).send("Valid url : " + mainUrl); //bug no.1(to early send the response, future response will be effected by this and may notbe working..);
        console.log("valid url");
    } catch (error) {
        if (error.name === 'TypeError') {
            return res.status(400).send(`Error: '${mainUrl}' is not a valid URL.`);
        } else {
            // Handle other potential errors
            return res.status(500).send('An unexpected error occurred during validation.');
        }
    }

    //alias;
    //for safe characters like alphanumeric space etc..
    const safeCharsRegex = /^[a-zA-Z0-9_-]+$/;
    const alias = req.body.alias;
    const finalAlias = alias.trim().toLowerCase(); //if white space is there this will remove the white space;

    //should not be empty;
    if (!finalAlias) {
        return res.status(400).send("Error : No alias is found...");
    }

    //finalAlias validation(must contain all safe characters);
    if (finalAlias && !safeCharsRegex.test(finalAlias)) {
        return res.status(400).json({
            message: 'Input contains unsafe characters. Only alphanumeric, spaces, hyphens, and underscores are allowed.'
        });
    } else {
        //loop to iterate through array,
        //as array is of alias, we have to make sure no dublicate alias will be inserted;
        for (let i = 0; i < aliasArray.length; i++) {
            if (aliasArray[i] === finalAlias) {
                return res.status(400).send("Error : Make sure to take unique alias. this one is already in use..");
            } else {
                aliasArray.push(finalAlias);
            }
        }
    }
})
app.listen(PORT, () => {
    console.log(typeof PORT)
    console.log(`Server is running or ${PORT}`);
});