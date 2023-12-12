import {
    initMainPage
} from "./js/main-handler.js";

import {
    displayErrorMessage
} from "./js/ui/main-ui.js";

// variables générales
export const generalVar = { cardsList: [], categoryList: [], srvURL: "http://localhost:5678/" };

// -- Initialisation du site ------------------------------------------------------------

async function firstInit () {
    if (await fetchCards()) { // Si la récupération des fichiers a réussi
        initMainPage(); // lance l'initialisation de la page principale
    }
}
firstInit();

// -- Récupération des images du serveur ------------------------------------------------

export async function fetchCards () {
    const url = generalVar.srvURL;
    try {
        const worksResponse = await fetch(url + "api/works");

        if (worksResponse.ok) { // 200-299
            testWorksResponse(worksResponse);
        } else {
            displayErrorMessage(worksResponse.status, "La requête de récupération de la liste des images a échoué.");
            return;
        }

        const categorieResponse = await fetch(url + "api/categories");

        if (categorieResponse.ok) { // 200-299
            await testCategorieResponse(categorieResponse);

            return true;
        } else {
            displayErrorMessage(categorieResponse.status, "La requête de récupération de la liste des catégories a échoué.");
        }
    } catch (error) {
        displayErrorMessage("Erreur du serveur", "impossible dé récupérer les données", error);
    }
} // fetchCards ()

// -- Gestion des erreurs de conversion JSON de la base de données des images -----------

async function testWorksResponse (worksResponse) {
    try {
        generalVar.cardsList = await worksResponse.json();
    } catch (error) {
        displayErrorMessage("Erreur de la base de données", "Echec du traitement de la base de données des images", error);
    }
}

// -- Gestion des erreurs de conversion JSON de la base de données des catégories -------

async function testCategorieResponse (categorieResponse) {
    try {
        generalVar.categoryList = await categorieResponse.json();
    } catch (error) {
        displayErrorMessage("Erreur de la base de données", "Echec du traitement de la base de données des catégories", error);
    }
}
