import { cssTweak } from "./csstweak.js";

import { doSomething } from "./main-handler.js";

export const generalVar = { cardsList: [] };

// Apply some css tyle
cssTweak();

export async function fetchCards () {
    try {
        const responseWorks = await fetch("http://localhost:5678/api/works");

        if (responseWorks.ok) { // 200-299
            generalVar.cardsList = await responseWorks.json();

            console.log("script.js cardsList : ", generalVar.cardsList);

            doSomething();
        } else {
            console.error("La requête a échoué. Code : " + responseWorks.status);
        }
    } catch (error) {
        console.error("Une erreur est survenue : " + error);
    }
} // fetchCards ()
fetchCards();

console.log("script.js end file : ", generalVar.cardsList);
