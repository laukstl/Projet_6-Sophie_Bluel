// eslint-disable-next-line padded-blocks
async function mainFunc () {

/* Variables pour gestion des closures */

    // category choisi ( 0 par défaut )
    let categorySelected = 0;
    // liste des cards ( image + desc )
    let fetchedCards = [];

    // section_main
    let main = null;
    // section_category
    let categoryContainer = null;
    // fenêtre de login
    let login = null;
    // <input > de email et password
    let emailInput = null;
    let passwordInput = null;
    // <p> de message d'erreur
    let loginErrorMessage = null;

    // callage...
    document.getElementById("portfolioTitle").style["margin-top"] = "130px";

const galleryContainer = document.querySelector(".galleryContainer");

/* Affichage des cards */
function displayCards (cards) {
    cleanGallery();
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

/* clean-gal en prevision future anim */
function cleanGallery () {
    galleryContainer.innerHTML = "";
}

function refresh () {
    /* Update les btn category avec le bon background */
    const allButton = document.querySelectorAll(".btn");
    allButton.forEach((button, index) => {
        if (categorySelected === index) {
            button.classList.add("btn--selected");
        } else {
            button.classList.remove("btn--selected");
        }
    });
    /* Filtres les cards en fonction de la category */
    let cardsToDisplay = fetchedCards;
    if (categorySelected !== 0) {
        cardsToDisplay = fetchedCards.filter(item => item.categoryId === categorySelected);
    }
    displayCards(cardsToDisplay);
} // refresh

try {
    const responseWorks = await fetch("http://localhost:5678/api/works");

    if (responseWorks.ok) { // 200-299
        fetchedCards = await responseWorks.json();

        /* création de la liste des catégories */
        const categoryMapping = {};
        fetchedCards.forEach(item => {
            categoryMapping[item.category.id] = item.category.name;
        });
        categoryMapping["0"] = "Tous";

        /* creation des btn category */
        categoryContainer = document.querySelector(".categoryContainer");
        for (let i = 0; i < Object.keys(categoryMapping).length; i++) {
            const btn = document.createElement("button");
            categoryContainer.appendChild(btn);
            btn.style.cursor = "pointer";
            const buttonText = document.createElement("span");
            btn.appendChild(buttonText);
            btn.classList.add("btn");

            buttonText.textContent = categoryMapping[i];

            btn.addEventListener("click", () => {
                categorySelected = i;
                refresh();
            });
        }
    } else {
        console.error("La requête a échoué. Code : " + responseWorks.status);
    }
    /* activation forcée du premier refresh au chargement */
    refresh();
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
    loginContainer.appendChild(login);
    login.id = "login";
    login.style.gap = "30px";
    login.style.top = "130px";
    login.style.height = "872px";
    // login.style.display = "none";
    login.style.position = "relative";

    // TITRE
    const loginTitle = document.createElement("h2");
    login.appendChild(loginTitle);
    loginTitle.innerText = "Log In";

    // <p> pour message d'erreur
    loginErrorMessage = document.createElement("p");
    login.appendChild(loginErrorMessage);
    loginErrorMessage.style.color = "red";

    // box EMAIL
    const emailContainer = document.createElement("div");
    login.appendChild(emailContainer);
    emailContainer.style.display = "flex";
    emailContainer.style["flex-direction"] = "column";
    emailContainer.style["align-items"] = "flex-start";
    emailContainer.style.gap = "7px";
    // input EMAIL
    const emailLabel = document.createElement("label");
    emailContainer.appendChild(emailLabel);
    emailLabel.innerText = "E-mail";
    emailLabel.style["font-weight"] = "500";
    emailInput = document.createElement("input");
    emailContainer.appendChild(emailInput);
    emailInput.id = "login_email_id";
    emailInput.type = "email";
    emailInput.style["font-size"] = "20px";
    emailInput.style["text-align"] = "center";
    emailInput.style.width = "379px";
    emailInput.style.height = "51px";
    emailInput.style.border = "0px";
    emailInput.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";

    // box PASSWORD
    const passwordContainer = document.createElement("div");
    login.appendChild(passwordContainer);
    passwordContainer.style.display = "flex";
    passwordContainer.style["flex-direction"] = "column";
    passwordContainer.style["align-items"] = "flex-start";
    passwordContainer.style.gap = "7px";
    // input PASSWORD
    const passwordLabel = document.createElement("label");
    passwordContainer.appendChild(passwordLabel);
    passwordLabel.innerText = "Mot de passe";
    passwordLabel.style["font-weight"] = "500";
    passwordInput = document.createElement("input");
    passwordContainer.appendChild(passwordInput);
    passwordInput.id = "login_password_id";
    passwordInput.type = "password";
    passwordInput.style["font-size"] = "20px";
    passwordInput.style["text-align"] = "center";
    passwordInput.style.width = "379px";
    passwordInput.style.height = "51px";
    passwordInput.style.border = "0px";
    passwordInput.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";

    // création du BOUTTON
    const loginButton = document.createElement("button");
    login.appendChild(loginButton);

    loginButton.type = "button"; // pour éviter le submit du button par défaut et le refresh de la page
    loginButton.classList.add("btn", "btn--selected");
    loginButton.style.width = "180px";
    loginButton.style.height = "51px";
    loginButton.style.cursor = "pointer";
    loginButton.style.innerText = "Se connecter";
    loginButton.fontSize = "14px";

    const loginButtonText = document.createElement("span");
    loginButton.appendChild(loginButtonText);
    loginButtonText.innerText = "Se connecter";
    loginButtonText.style["font-size"] = "14px";

    loginButton.addEventListener("mouseover", () => {
        loginButton.classList.add("btn--pushed");
        loginButton.classList.remove("btn--selected");
    });

    loginButton.addEventListener("mouseout", () => {
        loginButton.classList.remove("btn--pushed");
        loginButton.classList.add("btn--selected");
    });

    loginButton.addEventListener("click", () => {
        checkLogin();
    });

    // lien MDP FORGOTTEN
    const linkPwdForgotten = document.createElement("a");
    login.appendChild(linkPwdForgotten);
    linkPwdForgotten.setAttribute("href", "#");
    linkPwdForgotten.innerText = "Mot de passe oublié";
    linkPwdForgotten.style.color = "inherit";
    linkPwdForgotten.style["font-weight"] = "500";

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
            const userId = response.userId;
            const token = response.token;

            console.log(userId + " - " + token);

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
    modalContainer.appendChild(modalTitle);
    modalTitle.innerText = "Galerie photo";
    modalTitle.style.textAlign = "center";
    modalTitle.style.fontFamily = "Work Sans";
    modalTitle.style.fontSize = "26px";
    modalTitle.style.marginTop = "60px";

    // Conteneur de la gallerie d'images
    const modalGalleryContainer = document.createElement("div");
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
    modalContainer.appendChild(modalSubmitButton);
    modalSubmitButton.style.margin = "30px 0";
    modalSubmitButton.style.position = "relative";
    modalSubmitButton.style.left = "50%";
    modalSubmitButton.style.right = "50%";
    // juste pour test
    modalSubmitButton.innerText = "Click!";
    modalSubmitButton.addEventListener("click", () => { modalContainer.style.display = "none"; });

    // Affichage des images dans la gallerie du modal
    function showModalWindowCards (cards) {
        cards.forEach(item => {
            const card = document.createElement("div");
            card.style.position = "relative";
            modalGalleryContainer.appendChild(card);

                const img = document.createElement("img");
                img.src = item.imageUrl;
                img.style.width = "100%";
                card.appendChild(img);

                const iconContainer = document.createElement("div");
                iconContainer.style.position = "absolute";
                iconContainer.style.top = "5px";
                iconContainer.style.right = "5px";
                iconContainer.style.height = "17px";
                iconContainer.style.width = "17px";
                iconContainer.style.textAlign = "center";
                iconContainer.style.lineHeight = "17px";
                iconContainer.style.background = "black";
                card.appendChild(iconContainer);

                    const trashIcon = document.createElement("img");
                    trashIcon.setAttribute("src", "./assets/icons/trashcan.svg");
                    trashIcon.style.height = "11px";
                    trashIcon.style.width = "9px";
                    iconContainer.appendChild(trashIcon);
        });
    }
    showModalWindowCards(fetchedCards);
}
// modalWindow();
} // mainFunc()
mainFunc();
