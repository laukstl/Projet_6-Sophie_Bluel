/* eslint-disable no-return-assign */
import { cssTweak } from "./ui/csstweak.js";

import * as color from "./ui/colors.js";

import { createButton } from "./ui/button.js";

import {
    loginContainer, // <div> container HTML
    loginButton, // <button>
    buildLoginWindow
} from "./ui/login-ui.js";

import { checkLogin } from "../js/login-handler.js";

import {
    hideModal
} from "./modal-handler.js";

import { buildModalWindow } from "./ui/modal-ui.js";

import {
    banner,
    portfolioBannerLinkContainer,
    displayErrorMessage,
    buildEditMode
} from "./ui/main-ui.js";

import {
    generalVar
} from "../script.js";

let categorySelected = 0; // categorie choisi ( 0 ("Tous") par défaut )
let category, gallery, categoryList;
const categoryButtons = [];

// -- Initialisation de la page principale ----------------------------------------------

export function initMainPage () {
    try {
        cssTweak(); // Apply some css style
        buildPortfolioCategoryButtons();
        updatePortfolioCategoryButtonsColor();
        buildLoginWindow();
        buildEditMode();
        buildModalWindow();
        updatePortfolioCardsList();
        loginLogoutLinkHandler();
    } catch (error) {
        displayErrorMessage("Erreur locale", "Impossible d'initialiser la page", error);
    }
}

/*
 ---------------------------------------------------
 -- Portfolio ---------------------------------------------------------------------------
 ---------------------------------------------------
*/

// -- Gestion des boutons de catégorie du portfolio -------------------------------------

export function buildPortfolioCategoryButtons () {
    categoryList = generalVar.categoryList;

    // ajout du bouton "Tous" à la liste des catégories du portfolio
    categoryList.unshift({ id: 0, name: "Tous" });

    // création des boutons des catégories du portfolio
    category = document.querySelector(".category");
    for (const k in categoryList) {
        const button = createButton(category, null, categoryList[k].name);
        button.style.marginLeft = "15px";
        button.classList.add("categoryButtons");
        // categoryButtons.push({ id: categoryList[k].id, name: categoryList[k].name });
        categoryButtons.push(button);
        button.addEventListener("click", () => {
            categorySelected = categoryList[k].id;
            updatePortfolioCategoryButtonsColor();
            updatePortfolioCardsList();
        });
    }
}

function updatePortfolioCategoryButtonsColor () {
    // mise à jour des boutons de la section "category" avec le bon fond
    categoryButtons.forEach((button, index) => {
        if (categorySelected === index) {
            button.style.background = color.green;
            button.style.color = color.white;
        } else {
            button.style.background = color.white;
            button.style.color = color.green;
        }
    });
}

// -- Affichage des cards du portfolio --------------------------------------------------

export function updatePortfolioCardsList () {
    let cardsToDisplay;

    if (categorySelected !== 0) {
        cardsToDisplay = generalVar.cardsList.filter(item => item.categoryId === categorySelected);
    } else {
        cardsToDisplay = generalVar.cardsList;
    }
    displayPortfolioCards(cardsToDisplay);
}

function displayPortfolioCards (cardsToDisplay) {
    gallery = document.querySelector(".gallery");

    // cleanGallery
    gallery.innerHTML = "";

    if (generalVar.cardsList.length === 0) {
        displayErrorMessage("Erreur de chargement ?", "La liste des images est actuellement Vide.", "None.");
    } else {
        cardsToDisplay.forEach(item => {
            const card = document.createElement("figure");
            gallery.appendChild(card);

            const img = document.createElement("img");
            img.src = item.imageUrl;
            card.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.textContent = item.title;
            card.appendChild(figcaption);
        });
    }
}

/*
 ---------------------------------------------------
 -- Login/Logout ------------------------------------------------------------------------
 ---------------------------------------------------
*/

// -- Gestion du comportement du lien Login/Logout --------------------------------------

function loginLogoutLinkHandler () {
    // container central ( entre le header et le footer )
    const main = document.querySelector("main");

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
                console.log("Unexpected error: " + error); // TODO: Not in console !
            }
        }
    });
}
