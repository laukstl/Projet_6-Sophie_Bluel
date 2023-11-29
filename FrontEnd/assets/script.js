/* eslint-disable no-irregular-whitespace */

// NOTE: Séparation des préoccupations : chaque fonction ou module a une seule responsabilité et suit le principe de la séparation des préoccupations.

import {
    initMainPage
} from "./main-handler.js";

import {
    displayErrorMessage
} from "./main-ui.js";

// variables générales
export const generalVar = { cardsList: [], categoryList: [] };

/*
Array(11) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
​0: Object { id: 1, title: "Abajour Tahina", imageUrl: "http://localhost:5678/images/abajour-tahina1651286843956.png", … }
​1: Object { id: 2, title: "Appartement Paris V", imageUrl: "http://localhost:5678/images/appartement-paris-v1651287270508.png", … }
​2: Object { id: 3, title: "Restaurant Sushisen - Londres", imageUrl: "http://localhost:5678/images/restaurant-sushisen-londres1651287319271.png", … }
​3: Object { id: 4, title: "Villa “La Balisiere” - Port Louis", imageUrl: "http://localhost:5678/images/la-balisiere1651287350102.png", … }
​4: Object { id: 5, title: "Structures Thermopolis", imageUrl: "http://localhost:5678/images/structures-thermopolis1651287380258.png", … }
​5: Object { id: 6, title: "Appartement Paris X", imageUrl: "http://localhost:5678/images/appartement-paris-x1651287435459.png", … }
​6: Object { id: 7, title: "Pavillon “Le coteau” - Cassis", imageUrl: "http://localhost:5678/images/le-coteau-cassis1651287469876.png", … }
​7: Object { id: 8, title: "Villa Ferneze - Isola d’Elba", imageUrl: "http://localhost:5678/images/villa-ferneze1651287511604.png", … }
​8: Object { id: 9, title: "Appartement Paris XVIII", imageUrl: "http://localhost:5678/images/appartement-paris-xviii1651287541053.png", … }
​9: Object { id: 10, title: "Bar “Lullaby” - Paris", imageUrl: "http://localhost:5678/images/bar-lullaby-paris1651287567130.png", … }
​10: Object { id: 11, title: "Hotel First Arte - New Delhi", imageUrl: "http://localhost:5678/images/hotel-first-arte-new-delhi1651287605585.png", … }
​length: 11
*/

/*
categoryList
Array(3) [ {…}, {…}, {…} ]
0: Object { id: 0, name: "Tous" } // added in main-handler
1: Object { id: 1, name: "Objets" }
2: Object { id: 2, name: "Appartements" }
3: Object { id: 3, name: "Hotels & restaurants" }
length: 4
*/

// -- Récupération des images du serveur ------------------------------------------------

export async function fetchCards () {
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

            return true;
        } else {
            displayErrorMessage(categorieResponse.status, "La requête de récupération de la liste des catégories a échoué.");
        }
    } catch (error) {
        displayErrorMessage("Erreur du serveur", "impossible dé récupérer les données", error);
    }
} // fetchCards ()

async function firstInit () {
    if (await fetchCards()) {
        // Si tout est ok, lance l'initialisation de la page principale
        initMainPage();
    }
}
firstInit();

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
