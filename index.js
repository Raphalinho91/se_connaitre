const express = require("express");
const { google } = require("googleapis");
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", async (req, res) => {
    const { email, name, signification, origine, temperament, aime, aimepas, atouts, qualites, defauts, peurs, importants, reves, role, aide, sens } = req.body;

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "./credentials.json", // Remplacez par le chemin de votre fichier JSON
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });

        const client = await auth.getClient();

        const googleSheets = google.sheets({ version: "v4", auth: client });

        const spreadsheetID = '1vGmsrzAJSLmCgskWLErYBtfA93ShjofdjbahQIE_Ndc';

        const metaData = await googleSheets.spreadsheets.get({
            spreadsheetId: spreadsheetID,
        });

        // Read rows from spreadsheet
        const getRows = await googleSheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetID,
            range: "Feuille 1!A:A",
        });

        // Write row to spreadsheet
        await googleSheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetID,
            range: "Feuille 1", // La plage doit être la même que lors de la lecture
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[ email, name, signification, origine, temperament, aime, aimepas, atouts, qualites, defauts, peurs, importants, reves, role, aide, sens]],
            }
        });

        res.send("<script>alert('Soumis avec succès !');</script>");
    } catch (error) {
        console.error("Erreur :", error);
        res.status(500).send("Une erreur s'est produite : " + error.message);
    }
});

app.listen(1337, () => console.log("En cours d'exécution sur le port 1337"));
