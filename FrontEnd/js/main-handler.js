import { cssTweak } from "./ui/csstweak.js";

import * as color from "./ui/colors.js";

import { createButton } from "./ui/button.js";

import {
    loginContainer,
    loginButton,
    buildLoginWindow
} from "./ui/login-ui.js";

import { checkLogin } from "../js/login-handler.js";

import {
    hideModalWindow
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
        categoryButtons.push(button);
        button.addEventListener("click", () => portfolioButtonClickHandler(k));
    }
}

function portfolioButtonClickHandler (k) {
    categorySelected = categoryList[k].id;
    updatePortfolioCategoryButtonsColor();
    updatePortfolioCardsList();
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
            figcaption.style.color = "#3D3D3D";
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
const linkLogin = document.getElementById("nav__login");
const main = document.querySelector("main");
let isConnected = false;

function loginLogoutLinkHandler () {
    // container central ( entre le header et le footer )
    linkLogin.addEventListener("click", () => {
        if (!isConnected) { // LogIn
            loginContainer.style.display = "block";
            loginContainer.ariaHidden = "false";
            main.style.display = "none";
            main.ariaHidden = "true";
            loginButton.addEventListener("click", loginButtonClickHandler);
        } else { // LogOut
            isConnected = false;
            linkLogin.innerText = "login";
            portfolioBannerLinkContainer.style.display = "none";
            banner.style.display = "none";
            category.style.display = "block";
            hideModalWindow();
            // delete id and token
            try {
                window.localStorage.removeItem("userID");
                window.localStorage.removeItem("tokenID");
            } catch (error) {
                console.log("Erreur de nettoyage des tokens : " + error);
            }
        }
    });
}

async function loginButtonClickHandler () {
    if (await checkLogin()) { // LogIn
        isConnected = true;
        linkLogin.innerText = "logout";

        banner.style.display = "flex";
        portfolioBannerLinkContainer.style.display = "flex";

        loginContainer.style.display = "none";
        loginContainer.ariaHidden = "true";

        category.style.display = "none";

        main.style.display = "block";
        main.ariaHidden = "false";

        loginButton.removeEventListener("click", loginButtonClickHandler);
    } else {
        // log(time + " - Login failed ! - " + userID + " - IP " + IP);
    }
}
