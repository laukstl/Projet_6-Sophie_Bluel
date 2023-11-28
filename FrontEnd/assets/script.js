import {
    initMainPage
} from "./main-handler.js";

// variables générales
export const generalVar = { cardsList: [] };

async function fetchCards () {
    try {
        const responseWorks = await fetch("http://localhost:5678/api/works");

        if (responseWorks.ok) { // 200-299
            generalVar.cardsList = await responseWorks.json();

            initMainPage(generalVar.cardsList);
        } else {
            console.error("La requête a échoué. Code : " + responseWorks.status);
        }
    } catch (error) {
        console.error("Une erreur est survenue : " + error);
    }
} // fetchCards ()
fetchCards();
