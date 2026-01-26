import path from 'path';
import fs from "fs";
import { Router } from 'express';

const router = Router();

const DataFile = path.join(__dirname, "..", "data", "urls.json");

//function to readFile(json);
const readDataFile = () => {
    //if file does not exists, create it;
    if (!fs.existsSync(DataFile)) {
        fs.writeFileSync(DataFile, "{}");
        return {};
    }

    try {
        const rawData = fs.readFileSync(DataFile, 'utf-8');

        if (!rawData.trim()) {
            return {}
        }

        return JSON.parse(rawData);
    } catch (err) {
        console.error(" urls.json corrupted. Resetting file.");
        fs.writeFileSync(DataFile, "{}");
        return {};
    }
}

const writeDataFile = (data) => {
    return fs.writeFileSync(DataFile, JSON.stringify(data, null, 2));
}

// router.post('/submit', (req, res) => {

//     //contains the main/real url
//     const mainUrl = req.body.mainUrl?.trim();
//     //steps: to validate url, url should be existing and valid;
//     if (!mainUrl) {
//         return res.status(400).send("Error : URL parameter is missing..");
//     }

//     //url validation;
//     try {
//         new URL(mainUrl);
//         // res.status(200).send("Valid url : " + mainUrl); //bug no.1(to early send the response, future response will be effected by this and may notbe working..);
//         console.log("valid url");
//     } catch (error) {
//         if (error.name === 'TypeError') {
//             return res.status(400).send(`Error: '${mainUrl}' is not a valid URL.`);
//         } else {
//             // Handle other potential errors
//             return res.status(500).send('An unexpected error occurred during validation.');
//         }
//     }

//     //alias;
//     //for safe characters like alphanumeric space etc..
//     const safeCharsRegex = /^[a-zA-Z0-9_-]+$/;

//     let alias = req.body.alias?.trim().toLowerCase();
//     //should not be empty;
//     if (!alias) {
//         return res.status(400).send("Error : No alias is found...");
//     }

//     //finalAlias validation(must contain all safe characters);
//     if (alias && !safeCharsRegex.test(alias)) {
//         return res.status(400).json({
//             message: 'Input contains unsafe characters. Only alphanumeric, spaces, hyphens, and underscores are allowed.'
//         });
//     }

//     //readFile For urls;
//     const urls = readDataFile();

//     //duplicate alias prevention;
//     if (urls[alias]) {
//         return res.status(400).send("Error: Alias is already present, try something new..");
//     }

//     //push the data into json file;
//     urls[alias] = mainUrl;
//     writeDataFile(urls);

//     //send final response;
//     // res.send(
//     //     `http://localhost:${PORT}/${alias}`
//     // );

//     res.send(`${req.protocol}://${req.get("host")}/${alias}`);
// });


router.post("/submit", (req, res) => {

    const mainUrl = req.body.mainUrl?.trim();

    if (!mainUrl) {
        return res.status(400).send("Error : URL parameter is missing..");
    }

    try {
        new URL(mainUrl);
    } catch {
        return res.status(400).send("Invalid URL");
    }

    const alias = req.body.alias?.trim().toLowerCase();

    if (!alias) {
        return res.status(400).send("Alias missing");
    }

    const urls = readDataFile();

    if (urls[alias]) {
        return res.status(400).send("Alias already exists");
    }

    urls[alias] = mainUrl;
    writeDataFile(urls);

    const shortUrl = `${req.protocol}://${req.get("host")}/${alias}`;

    res.send(shortUrl);
});


//!next steps:
//*Extract "google" from the URL
//*Read your JSON storage
//*Check if "google" exists
//*If yes → redirect to original URL
//*If no → show “link not found”
//when browser hit get request on the alias;
router.get('/:myalias', (req, res) => {
    const extractedAlias = req.params.myalias.toLowerCase();
    //reading json storage;
    //this the string, not real object;
    const jsonStoredData = fs.readFileSync(DataFile, 'utf-8');
    //converting into object;
    const objectData = JSON.parse(jsonStoredData);

    //if userEntered alias exists?
    if (objectData[extractedAlias]) {
        return res.redirect(objectData[extractedAlias]);
    }

    return res.status(404).send("Error: No link found");
});


export default router;