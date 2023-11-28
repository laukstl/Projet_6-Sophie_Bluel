/* eslint-disable no-return-assign */
import * as color from "./gui/colors.js";
import { createButton } from "./button.js";

import {
    loginContainer, // <div> container HTML
    loginButton // <button>
} from "./login-ui.js";

import { checkLogin } from "./login-handler.js";

import { hideModal } from "./modal-handler.js";

import {
    banner,
    portfolioBannerLinkContainer
} from "./main-ui.js";

import {
    generalVar
} from "./script.js";

// container central ( entre le header et le footer )
const main = document.querySelector("main");

let categorySelected = 0; // categorie choisi ( 0 ("Tous") par défaut )
let category, gallery, cardsList, categoryList, categoryButtons;

export function initMainPage () {
    buildPortfolioCategoryButtons();
    updatePortfolioCategoryButtons();
    updatePortfolioCardsList(generalVar.cardsList);
}

// -- Affichage des categories du portfolio ---------------------------------------------

export function buildPortfolioCategoryButtons () {
    categoryList = generalVar.categoryList;

    // ajout du bouton "Tous" à la liste des catégories du portfolio
    categoryList.unshift({ id: "0", name: "Tous" });

    // création des boutons des catégories du portfolio
    category = document.querySelector(".category");
    for (const k in categoryList) {
        const button = createButton(category, null, categoryList[k].name);
        button.style.marginLeft = "15px";
        button.classList.add("categoryButtons");
        button.addEventListener("click", () => {
            categorySelected = categoryList[k].id;
            updatePortfolioCategoryButtons();
        });
    }
    categoryButtons = document.querySelectorAll(".categoryButtons");
}

// -- Affichage des cards du portfolio --------------------------------------------------

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

// -- Gestion du comportement du portfolio ----------------------------------------------
export function updatePortfolioCardsList (cardsToDisplay) {
    if (categorySelected !== 0) {
        cardsToDisplay = cardsList.filter(item => item.categoryId === categorySelected);
    } else {
        cardsToDisplay = generalVar.cardsList;
    }
    displayPortfolioCards(cardsToDisplay);
} // updatePortfolioCardsList ()

function updatePortfolioCategoryButtons () {
    // mise à jour des boutons de la section "category" avec le bon fond
    categoryButtons.forEach((button, index) => { // REVIEW: PAS D'INDEX DIDIOU
        if (categorySelected === index) {
            button.style.background = color.green;
            button.style.color = color.white;
        } else {
            button.style.background = color.white;
            button.style.color = color.green;
        }
    });
    // mise à jours des cards
    updatePortfolioCardsList();
} // updatePortfolioCategoryButtons ()

// -- Gestion du comportement du lien Login/Logout --------------------------------------

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
                // TODO: Message d'erreur ?
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
            console.log("Unexpected error: " + error); // REVIEW:
        }
    }
});
