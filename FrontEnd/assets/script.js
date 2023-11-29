// REVIEW: Séparation des préoccupations : chaque fonction ou module a une seule responsabilité et suit le principe de la séparation des préoccupations.
import {
    initMainPage
} from "./main-handler.js";

import {
    displayErrorMessage
} from "./main-ui.js";

// variables générales
export const generalVar = { cardsList: [], categoryList: [] };

async function fetchCards () {
    try {
        const worksResponse = await fetch("http://localhost:5678/api/works");

        if (worksResponse.ok) { // 200-299
            testWorksResponse(worksResponse);
        } else {
            displayErrorMessage(worksResponse.status, "La requête de récupération de la liste des images a échoué.");
            return;
        }

        const categorieResponse = await fetch("http://localhost:5678/api/categories");

        if (categorieResponse.ok) { // 200-299
            await testCategorieResponse(categorieResponse);

            // Si tout est ok, lance l'init de la page
            initMainPage();
        } else {
            displayErrorMessage("La requête de récupération de la liste des catégories a échoué. Code : " + categorieResponse.status);
        }
    } catch (error) {
        displayErrorMessage("Erreur du serveur", "impossible dé récupérer les données", error);
    }
} // fetchCards ()
fetchCards();

async function testWorksResponse (worksResponse) {
    try {
        generalVar.cardsList = await worksResponse.json();
    } catch (error) {
        displayErrorMessage("Erreur de la base de données", "Echec de la conversion du format JSON", error);
    }
}

async function testCategorieResponse (categorieResponse) {
    try {
        generalVar.categoryList = await categorieResponse.json();
    } catch (error) {
        displayErrorMessage("Erreur de la base de données", "Echec de la conversion du format JSON", error);
    }
}
