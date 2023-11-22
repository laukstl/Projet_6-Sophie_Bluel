import { createButton } from "./button.js";
import { cssTweak } from "./csstweak.js";
import * as color from "./gui/colors.js";

import {
        loginContainer, // <div> le container HTML
        loginButton // <button>
    } from "./login-ui.js";

import { checkLogin } from "./login-handler.js";

import {
    // updateModalCards, // func
    // displayModal, // func
    hideModal // func
} from "./modal-handler.js";

import {
    banner,
    portfolioBannerLinkContainer
 } from "./main-ui.js";

const main = document.querySelector("main"); // *************************************

    /* Variables pour gestion des closures */
    let categorySelected = 0; // categorie choisi ( 0 par défaut )
    let fetchedCards = []; // liste des cards ( image + desc )
    let cardsToDisplay = [];
    let category = null;
    let gallery = null;

export {
    fetchedCards,
    cardsToDisplay
};

// Apply some css tyle
cssTweak();

// Affichage des cards du portfolio
function displayPortfolioCards (cards) {
    gallery = document.querySelector(".gallery");

    // cleanGallery
    gallery.innerHTML = "";

    cards.forEach(item => {
        const card = document.createElement("figure");
        gallery.appendChild(card);

        const img = document.createElement("img");
        img.src = item.imageUrl;
        card.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = item.title;
        card.appendChild(figcaption);
    });
} // displayPortfolioCards (cards)

// Filtres les cards en fonction de la categorie
export function updatePortfolioCards () {
    cardsToDisplay = fetchedCards;
    if (categorySelected !== 0) {
        cardsToDisplay = fetchedCards.filter(item => item.categoryId === categorySelected);
    }
    displayPortfolioCards(cardsToDisplay);
} // updatePortfolioCards ()

function portfolioUpdate () {
    // Mise à jour des boutons de catégorie avec le bon fond
    const allButton = document.querySelectorAll(".button");
    allButton.forEach((button, index) => {
        if (categorySelected === index) {
            button.style.background = color.green;
            button.style.color = color.white;
        } else {
            button.style.background = color.white;
            button.style.color = color.green;
        }
    });

    // Mise à jours des cards
    updatePortfolioCards();
} // portfolioUpdate ()

async function fetchCards () {
    try {
        const responseWorks = await fetch("http://localhost:5678/api/works");

        if (responseWorks.ok) { // 200-299
            fetchedCards = await responseWorks.json();

            // création de la liste des catégories
            const categoryMapping = {};
            fetchedCards.forEach(item => {
                categoryMapping[item.category.id] = item.category.name;
            });
            categoryMapping["0"] = "Tous";

            // création des boutons de catégorie
            category = document.querySelector(".category");
            for (let i = 0; i < Object.keys(categoryMapping).length; i++) {
                const button = createButton(category, null, categoryMapping[i]);
                button.style.marginLeft = "15px";
                button.addEventListener("click", () => {
                    categorySelected = i;
                    portfolioUpdate();
                });
            }
        } else {
            console.error("La requête a échoué. Code : " + responseWorks.status);
        }
        // activation forcée du premier portfolioUpdate au chargement
        portfolioUpdate();
    } catch (error) {
        console.error("Une erreur est survenue : " + error);
    }
} // fetchCards ()
fetchCards();

let isConnected = false;
const linkLogin = document.getElementById("nav__login");
linkLogin.addEventListener("click", () => {
    if (!isConnected) { // To LogIn page
        loginContainer.style.display = "block";
        main.style.display = "none";
        loginButton.addEventListener("click", (event) => {
            if (checkLogin()) { // LogIn
                isConnected = true;
                linkLogin.innerText = "logout";

                banner.style.display = "flex";
                portfolioBannerLinkContainer.style.display = "flex";
                loginContainer.style.display = "none";
                category.style.display = "none";
                main.style.display = "block";
            } else {
                // ***************************************
            }
        });
    } else { // LogOut
        isConnected = false;
        linkLogin.innerText = "login";
        portfolioBannerLinkContainer.style.display = "none";
        banner.style.display = "none";
        category.style.display = "block";
        hideModal();
        // delete id and token
        try {
            window.localStorage.removeItem("userID");
            window.localStorage.removeItem("tokenID");
        } catch (error) {
            console.log("Unexpected error: " + error); // ********************************
        }
    }
});
