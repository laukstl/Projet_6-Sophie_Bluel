/* eslint-disable */

import { createButton } from "./gui/button.js";
// import { displayLoginWindow } from "./gui/loginwindow.js";
import { cssTweak } from "./csstweak.js";
import * as color from "./gui/colors.js";

import {
        login, // <form>
        displayLoginWindow, // the function
        // emailInput, // <input>
        // passwordInput, // <input>
        loginErrorMessage, // <p>
        loginButton // <button>
    } from "./gui/loginwindow.js";

import { modalWindow, modalGalleryContainer } from "./gui/modalwindow.js";

const main = document.querySelector("main");
export { main };

async function mainFunc () {
    /* Variables pour gestion des closures */
    let categorySelected = 0; // categorie choisi ( 0 par défaut )
    let fetchedCards = []; // liste des cards ( image + desc )
    let cardsToDisplay = [];
    let category = null;
    let gallery = null;
    let userId = null;
    let userToken = null;

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
function updatePortfolioCards () {
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
}
fetchCards();

/* création de la fenêtre login */
const linkLogin = document.getElementById("nav__login");
linkLogin.addEventListener("click", () => {
    displayLoginWindow();

    loginButton.addEventListener("click", (event) => {
        checkLogin(loginErrorMessage);
    });
});

// displayLoginWindow(main);

async function checkLogin (loginErrorMessage) {
    // Valeurs pour tests
    const userData = {
        email: "sophie.bluel@test.tld",
        password: "S0phie"
    };
    // const userData = {
    //     email: emailInput.value,
    //     password: passwordInput.value
    // };

    // Vérification de la bonne forme de l'email
    if (userData.email.trim() === "") { // Test champ vide
        loginErrorMessage.innerText = "Le champ email ne peut pas être vide";
        return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!emailRegex.test(userData.email)) { // Test conformormité au Regex
        loginErrorMessage.innerText = "Entrez une adresse E-mail valide";
        return;
    }

    // Vérification de la bonne forme du mot de passe ( pourrait être un peu plus travaillé )
    if (userData.password.length < 5) {
        loginErrorMessage.innerText = "Le mot de passe doit contenir au moins 5 caractères";
        return;
    }

    try {
        const responseLogin = await fetch("http://localhost:5678/api/users/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(userData)
                                        });

        const response = await responseLogin.json();

        if (responseLogin.ok) {
            userId = response.userId;
            userToken = response.token;

            window.localStorage.setItem("userID", userId);
            window.localStorage.setItem("tokenID", userToken);

            // const newUserId = window.localStorage.getItem("userID");
            // const newUserToken = window.localStorage.getItem("tokenID");

            // window.localStorage.removeItem("key");

            console.log("Welcome " + userId + ", you have the token : " + userToken);

            editMode();
        } else {
            if (responseLogin.status === 401) {
                loginErrorMessage.innerText = "Erreur: Mot de passe éroné";
                const passwordInputField = document.getElementById('login_password_id');
                passwordInputField.focus();
            } else if (responseLogin.status === 404) {
                loginErrorMessage.innerText = "Erreur: Utilisateur non trouvé";
                const userInputField = document.getElementById('login_email_id');
                userInputField.focus();
            }
        }
    } catch (error) {
        console.error("Une erreur est survenue ( " + error + " )");
    }
} // checkLogin ()

function editMode () {
    //  Ajout d'une bannière au dessus de l'header
    const banner = document.getElementById("editModeBanner");
    banner.style.background = "Black";
    banner.style.height = "60px";
    banner.style.display = "flex";
    banner.style.justifyContent = "center";
    banner.style.alignItems = "center";
    banner.style.gap = "10px";

        // Icône de la bannière
        const bannerIcon = document.createElement("img");
        bannerIcon.setAttribute("src", "./assets/icons/edit_white.svg");
        bannerIcon.style.height = "16px";
        banner.appendChild(bannerIcon);

        // Texte de la bannière
        const bannerText = document.createElement("p");
        bannerText.style.color = "white";
        bannerText.innerText = "Mode édition";
        banner.appendChild(bannerText);

    // changement de comportement du lien login/logout de la barre de nav du header
    // ------------------- Y SERAIT BIEN DE FAIRE UNE function logInOut ()
    const navLogin = document.getElementById("nav__login");
    navLogin.innerText = "logout";
    // ...Ajouter des actions pour se déconnecter...

    // Conteneur de la bannière ( titre - icone - lien )
    const portfolioBanner = document.getElementById("portfolioTitle");
    portfolioBanner.style.display = "flex";
    portfolioBanner.style.justifyContent = "center";
    portfolioBanner.style.alignItems = "center";
    portfolioBanner.style.margin = "130px 0 100px 0";

        // Titre de la section du portfolio
        const portfolioTitleText = document.querySelector("#portfolioTitle > h2");
        portfolioTitleText.style.margin = "auto 0";

        // Conteneur ( icone - lien )
        const linkContainer = document.createElement("div");
        linkContainer.style.display = "flex";
        linkContainer.style.gap = "1em";
        linkContainer.style.marginLeft = "2em";
        portfolioBanner.appendChild(linkContainer);

            // Icône "modifier"
            const portfolioBannerIcon = document.createElement("img");
            portfolioBannerIcon.src = "./assets/icons/edit_black.svg";
            portfolioBannerIcon.style.height = "16px";
            linkContainer.appendChild(portfolioBannerIcon);

            // Lien "modifier"
            const portfolioBannerLink = document.createElement("a");
            portfolioBannerLink.style.fontSize = "14px";
            portfolioBannerLink.innerText = "modifier";
            portfolioBannerLink.setAttribute("href", "#");
            portfolioBannerLink.style.color = "inherit";
            linkContainer.appendChild(portfolioBannerLink);

    // juste pour test
    linkContainer.addEventListener("click", () => {
            modalWindow();
            updateModalCards(fetchedCards);
        });

    // Masquer le modal de connexion et la sélection de catégorie, et afficher la section principale
    console.log(login);
    login.style.display = "none";
    category.style.display = "none";
    main.style.display = "block";
} // editMode ()

// Affichage les images dans la gallerie du modal en fonction de cardsToDisplay ( donc idem à l'autre gal )
function updateModalCards (cards) {
    // clean gallery
    modalGalleryContainer.innerHTML = "";

    cardsToDisplay.forEach(item => {
        const card = document.createElement("div");
        card.style.position = "relative";
        modalGalleryContainer.appendChild(card);

            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.style.width = "100%";
            card.appendChild(img);

            const iconContainer = document.createElement("a");
            iconContainer.style.position = "absolute";
            iconContainer.style.top = "5px";
            iconContainer.style.right = "5px";
            iconContainer.style.height = "17px";
            iconContainer.style.width = "17px";
            iconContainer.style.textAlign = "center";
            iconContainer.style.lineHeight = "17px";
            iconContainer.style.background = "black";
            iconContainer.style.cursor = "pointer";
            iconContainer.addEventListener("click", () => deleteCard(item));
            card.appendChild(iconContainer);

                const trashIcon = document.createElement("img");
                trashIcon.setAttribute("src", "./assets/icons/trashcan.svg");
                trashIcon.style.height = "11px";
                trashIcon.style.width = "9px";
                iconContainer.appendChild(trashIcon);
    });
} // updateModalCards (cards)

function deleteCard (item) {
    // cardsToDisplay = cardsToDisplay.filter(card => card.id !== item.id); // L'élégance...
    cardsToDisplay.forEach((cards, index) => {
        if (item.id === cards.id) {
            cardsToDisplay.splice(index, 1);
        }
    });

    // refresh gallerieS
    updateModalCards();
    updatePortfolioCards();
} // deleteCard (item)
} // mainFunc()
mainFunc();
