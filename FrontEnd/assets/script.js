import {
    initMainPage
} from "./main-handler.js";

// variables générales
export const generalVar = { cardsList: [], categoryList: [] };

async function fetchCards () {
    try {
        const responseWorks = await fetch("http://localhost:5678/api/works");

        if (responseWorks.ok) { // 200-299
            generalVar.cardsList = await responseWorks.json();
        } else {
            displayErrorMessage("La requête de récupération de la liste des images a échoué. Code : " + responseWorks.status);
            return;
        }
    } catch (error) {
        displayErrorMessage("Erreur du serveur : impossible dé récupérer la liste des images (" + error + ")");
    }

    try {
        const responseCategorie = await fetch("http://localhost:5678/api/categories");

        if (responseCategorie.ok) { // 200-299
            generalVar.categoryList = await responseCategorie.json();
        } else {
            displayErrorMessage("La requête de récupération de la liste des catégories a échoué. Code : " + responseCategorie.status);
            return;
        }
    } catch (error) {
        displayErrorMessage("Erreur du serveur : Impossible de récupérer la liste des catégories (" + error + ")");
    }

    initMainPage(generalVar.cardsList); // REVIEW: Message d'erreur qui s'effaccent...
} // fetchCards ()
fetchCards();

function displayErrorMessage (message) {
    const gallery = document.querySelector(".gallery");
    gallery.style.display = "flex";

    const errorWindow = document.createElement("div");
    errorWindow.style.margin = "auto";
    errorWindow.style.color = "red";
    errorWindow.style.border = "2px solid red";
    errorWindow.style.padding = "5px";
    errorWindow.style.backgroundColor = "#FF0";
    errorWindow.style.textAlign = "center";

    gallery.appendChild(errorWindow);

    errorWindow.innerText = message;
}
