/* eslint-disable no-multi-spaces */
async function mainFunc () {
    /* Variables pour gestion des closures */
    let categorySelected = 0; // categorie choisi ( 0 par défaut )
    let fetchedCards = []; // liste des cards ( image + desc )
    let cardsToDisplay = [];
    let main = null; // section_main
    let categoryContainer = null;
    let modalGalleryContainer = null;
    let galleryContainer = null;
    let login = null; // fenêtre de login
    let emailInput = null;
    let passwordInput = null;
    let loginErrorMessage = null; // <p> de message d'erreur
    let userId = null; // login
    let userToken = null; // login

    // const orangeColor =     "#B1663C"; // Couleur orange
    // const orangeColorDark = "#93532F"; // Couleur orange sombre
    const greenColor =      "#1D6154"; // Couleur verte
    const greenColorDark =  "#0E2F28"; // Couleur verte sombre
    const whiteColor =      "#FFFFFF"; // Couleur blanche
    // const offWhiteColor =   "#FFFEF8"; // Couleur blanc cassé
    // const greyColor =       "#A7A7A7"; // Couleur grise

// callage...
document.getElementById("portfolioTitle").style["margin-top"] = "130px";

// Affichage des cards du portfolio
function displayPortfolioCards (cards) {
    galleryContainer = document.querySelector(".galleryContainer");

    // cleanGallery
    galleryContainer.innerHTML = "";

    cards.forEach(item => {
        const card = document.createElement("figure");
        galleryContainer.appendChild(card);

        const img = document.createElement("img");
        img.src = item.imageUrl;
        card.appendChild(img);

        const figcaption = document.createElement("figcaption");
        figcaption.textContent = item.title;
        card.appendChild(figcaption);
    });
}

// Mise à jour des boutons de catégorie avec le bon fond
function updatePortfolioButtons () {
    const allButton = document.querySelectorAll(".button");
    allButton.forEach((button, index) => {
        if (categorySelected === index) {
            button.style.background = "#1D6154";
            button.style.color = "#ffffff";
        } else {
            button.style.background = "#ffffff";
            button.style.color = "#1D6154";
        }
    });
}

// Filtres les cards en fonction de la categorie
function updatePortfolioCards () {
    cardsToDisplay = fetchedCards;
    if (categorySelected !== 0) {
        cardsToDisplay = fetchedCards.filter(item => item.categoryId === categorySelected);
    }
    displayPortfolioCards(cardsToDisplay);
}

function portfolioUpdate () {
    updatePortfolioButtons();
    updatePortfolioCards();
}

/*
    - function createButton (container, width, text, reverseColor) -
    container : the container where the button will be added (*required)
    width : the width of the button
    text : the text of the button
    reverseColor : reverse de color of the button true/false
*/
function createButton (container, width = null, text = "Click!", reverseColor = false) {
    // .height = "36px";
    const button = document.createElement("button");
    button.classList.add("button");

    let primaryColor = whiteColor;
    let secondaryColor = greenColor;

    if (reverseColor) {
        primaryColor = greenColor;
        secondaryColor = whiteColor;
    }

    button.style.background = primaryColor;
    button.style.color = secondaryColor;

    button.style.borderRadius = "60px";
    button.style.border = "1px solid #1D6154";
    button.style.padding = "8px 15px";
    button.style.marginLeft = "15px";
    button.style.width = width;
    button.style.minWidth = "100px";
    button.style.cursor = "pointer";
    button.style.fontFamily = "Syne";
    button.style.fontWeight = "700";
    button.style.fontSize = "16px";
    button.textContent = text; // ?? "Click!";

    // gestion des comportements de la souris Click/Moove
    let isMouseInside = false;
    let isMouseDown = false;

    button.addEventListener("mousedown", () => {
        if (isMouseInside) {
            button.style.background = greenColorDark;
            button.style.color = whiteColor;
            isMouseDown = true;
        }
    });

    button.addEventListener("mouseup", () => {
        if (isMouseDown) {
            button.style.background = primaryColor;
            button.style.color = secondaryColor;
            isMouseDown = false;
        }
    });

    button.addEventListener("mouseenter", () => {
        if (isMouseDown) {
            button.style.background = greenColorDark;
            button.style.color = whiteColor;
        }
        isMouseInside = true;
    });

    button.addEventListener("mouseleave", () => {
        if (isMouseDown) {
            button.style.background = primaryColor;
            button.style.color = secondaryColor;
        }
        isMouseInside = false;
    });

     // assure le bon comportement du bouton si on click et glisse en dehors
    // document.addEventListener("mouseup", () => {
    //     hasClicked = false;
    //     if (!reverseColor) {
    //         updatePortfolioButtons();
    //     } else {
    //         button.style.background = "#1D6154";
    //         button.style.color = "#ffffff";
    //     }
    // });

    container.appendChild(button);

    return button;
}

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
        categoryContainer = document.querySelector(".categoryContainer");
        for (let i = 0; i < Object.keys(categoryMapping).length; i++) {
            const button = createButton(categoryContainer, null, categoryMapping[i]);

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

/* création de la fenêtre login */
const linkLogin = document.getElementById("nav__login");
linkLogin.addEventListener("click", () => displayLoginWindow());

function displayLoginWindow () {
    main = document.querySelector("main");
    // hide the main section ( keep the <header> and <footer> )
    main.style.display = "none";

    // création section LOGIN
    login = document.createElement("form");
    const loginContainer = document.getElementById("loginContainer");
    login.id = "login";
    login.style.gap = "30px";
    login.style.top = "130px";
    login.style.height = "872px";
    // login.style.display = "none";
    login.style.position = "relative";
    loginContainer.appendChild(login);

    // TITRE
    const loginTitle = document.createElement("h2");
    loginTitle.innerText = "Log In";
    login.appendChild(loginTitle);

    // <p> pour message d'erreur
    loginErrorMessage = document.createElement("p");
    loginErrorMessage.style.color = "red";
    login.appendChild(loginErrorMessage);

    // box EMAIL
    const emailContainer = document.createElement("div");
    emailContainer.style.display = "flex";
    emailContainer.style["flex-direction"] = "column";
    emailContainer.style["align-items"] = "flex-start";
    emailContainer.style.gap = "7px";
    login.appendChild(emailContainer);

    // input EMAIL
    const emailLabel = document.createElement("label");
    emailLabel.innerText = "E-mail";
    emailLabel.style["font-weight"] = "500";
    emailContainer.appendChild(emailLabel);
    emailInput = document.createElement("input");
    emailInput.id = "login_email_id";
    emailInput.type = "email";
    emailInput.style["font-size"] = "20px";
    emailInput.style["text-align"] = "center";
    emailInput.style.width = "379px";
    emailInput.style.height = "51px";
    emailInput.style.border = "0px";
    emailInput.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";
    emailContainer.appendChild(emailInput);

    // box PASSWORD
    const passwordContainer = document.createElement("div");
    passwordContainer.style.display = "flex";
    passwordContainer.style["flex-direction"] = "column";
    passwordContainer.style["align-items"] = "flex-start";
    passwordContainer.style.gap = "7px";
    login.appendChild(passwordContainer);
    // input PASSWORD
    const passwordLabel = document.createElement("label");
    passwordLabel.innerText = "Mot de passe";
    passwordLabel.style["font-weight"] = "500";
    passwordContainer.appendChild(passwordLabel);
    passwordInput = document.createElement("input");
    passwordInput.id = "login_password_id";
    passwordInput.type = "password";
    passwordInput.style["font-size"] = "20px";
    passwordInput.style["text-align"] = "center";
    passwordInput.style.width = "379px";
    passwordInput.style.height = "51px";
    passwordInput.style.border = "0px";
    passwordInput.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";
    passwordContainer.appendChild(passwordInput);

    // création du BOUTTON
    const loginButton = createButton(login, "180px", "Se connecter", true);
    loginButton.style.height = "51px";
    loginButton.style.fonSize = "14px";
    // const loginButton = document.createElement("button");
    // loginButton.type = "button"; // pour éviter le submit du button par défaut et le refresh de la page
    // loginButton.classList.add("btn", "btn--selected");
    // loginButton.style.width = "180px";
    // loginButton.style.height = "51px";
    // loginButton.style.cursor = "pointer";
    // loginButton.style.innerText = "Se connecter";
    // loginButton.fontSize = "14px";
    // login.appendChild(loginButton);

    // const loginButtonText = document.createElement("span");
    // loginButtonText.innerText = "Se connecter";
    // loginButtonText.style["font-size"] = "14px";
    // loginButton.appendChild(loginButtonText);

    // loginButton.addEventListener("mouseover", () => {
    //     loginButton.classList.add("btn--pushed");
    //     loginButton.classList.remove("btn--selected");
    // });

    // loginButton.addEventListener("mouseout", () => {
    //     loginButton.classList.remove("btn--pushed");
    //     loginButton.classList.add("btn--selected");
    // });

    loginButton.addEventListener("click", () => {
        checkLogin();
    });

    // Lien mot de passe oublié
    const linkPwdForgotten = document.createElement("a");
    linkPwdForgotten.setAttribute("href", "#");
    linkPwdForgotten.innerText = "Mot de passe oublié";
    linkPwdForgotten.style.color = "inherit";
    linkPwdForgotten.style["font-weight"] = "500";
    login.appendChild(linkPwdForgotten);

    // Affiche la section
    login.style.display = "flex";
    login.style["flex-direction"] = "column";
    login.style["align-items"] = "center";
}

async function checkLogin () {
    // Valeurs pour les tests
    const userData = {
        email: "sophie.bluel@test.tld",
        password: "S0phie"
    };

    // const userData = {
    //     email: emailInput.value,
    //     password: passwordInput.value
    // }

    // Vérification de la bonne forme de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!emailRegex.test(userData.email)) {
        loginErrorMessage.innerText = "Entrez une adresse E-mail valide";
        return;
    }

    // Vérification de la bonne forme du mot de passe
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
}

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
    linkContainer.addEventListener("click", () => modalWindow());

    // Masquer le modal de connexion et la sélection de catégorie, et afficher la section principale
    login.style.display = "none";
    categoryContainer.style.display = "none";
    main.style.display = "block";
}

function modalWindow () {
    // Création du conteneur du modal
    const modalContainer = document.getElementById("modalContainer");
    modalContainer.style["z-index"] = "9999";
    modalContainer.style.Height = "688px";
    modalContainer.style.maxWidth = "630px";
    modalContainer.style.backgroundColor = "#fFf";
    modalContainer.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.25)";
    modalContainer.style.borderRadius = "10px";
    modalContainer.style.position = "absolute";
    modalContainer.style.margin = "auto";
    modalContainer.style.top = "400px";
    modalContainer.style.left = "0";
    modalContainer.style.right = "0";

    // Bouton de fermeture de la modal
    const modalCloseButton = document.createElement("img");
    modalContainer.appendChild(modalCloseButton);

    // Titre
    const modalTitle = document.createElement("h3");
    modalTitle.innerText = "Galerie photo";
    modalTitle.style.textAlign = "center";
    modalTitle.style.fontFamily = "Work Sans";
    modalTitle.style.fontSize = "26px";
    modalTitle.style.marginTop = "60px";
    modalContainer.appendChild(modalTitle);

    // Conteneur de la gallerie d'images
    modalGalleryContainer = document.createElement("div");
    modalGalleryContainer.style.display = "grid";
    modalGalleryContainer.style["grid-template-columns"] = "1fr 1fr 1fr 1fr 1fr";
    modalGalleryContainer.style["grid-column-gap"] = "20px";
    modalGalleryContainer.style["grid-row-gap"] = "20px";
    modalGalleryContainer.style.margin = "60px 105px";
    modalContainer.appendChild(modalGalleryContainer);

    // Trait horizontal de de séparation
    const modalHorizontalLine = document.createElement("div");
    modalHorizontalLine.style.width = "420px";
    modalHorizontalLine.style.height = "20px";
    modalHorizontalLine.style.borderBottom = "1px solid #B3B3B3";
    modalHorizontalLine.style.margin = "0 auto";
    modalContainer.appendChild(modalHorizontalLine);

    // Bouton de submission du formulaire
    const modalSubmitButton = document.createElement("button");
    modalSubmitButton.style.margin = "30px 0";
    modalSubmitButton.style.position = "relative";
    modalSubmitButton.style.left = "50%";
    modalSubmitButton.style.right = "50%";
    modalContainer.appendChild(modalSubmitButton);

    updateModalCards(fetchedCards);

    // juste pour test
    modalSubmitButton.innerText = "Click!";
    modalSubmitButton.addEventListener("click", () => { modalContainer.style.display = "none"; });
}

// Affichage les images dans la gallerie du modal en fonction de cardsToDisplay
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
}

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
}
} // mainFunc()
mainFunc();
