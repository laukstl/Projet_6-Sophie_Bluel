async function main_func () {

/* Variables pour gestion des closures */

    // category choisi ( 0 par défaut )
    let category_selected = 0;
    // liste des cards ( image + desc )
    let card_listing = []

    // section_main
    let main = null;
    // section_category
    let categoryContainer = null;
    // fenêtre de login
    let section_login = null;
    // <input > de email et password
    let login_email = null;
    let login_password = null;
    // <p> de message d'erreur
    let login_error_message = null;

    // callage...
    document.getElementById("portfolioTitle").style["margin-top"] = "130px";

const galleryContainer = document.querySelector(".galleryContainer");

/* Affichage des cards */
function show_cards(cards) {
    clean_gallery()
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
function clean_gallery() {
    galleryContainer.innerHTML = "";
}

function refresh() {
    /* Update les btn category avec le bon background */
    const all_btn = document.querySelectorAll(".btn");
    all_btn.forEach((button, index) => {
        if (category_selected === index) {
            button.classList.add("btn--selected")
        } else {
            button.classList.remove("btn--selected")
        }
    })
    /* Filtres les cards en fonction de la category */
    let cards_to_show = card_listing;
    if (category_selected !== 0) {
        cards_to_show = card_listing.filter(item => item.categoryId === category_selected);
    }
    show_cards(cards_to_show);
} // refresh

try {
    let response_works = await fetch("http://localhost:5678/api/works");

    if (response_works.ok) { // 200-299
        card_listing = await response_works.json();

        /* création de la liste des catégories */
        let category_tab = {};
        card_listing.forEach(item => {
            category_tab[item.category.id] = item.category.name;
        });
        category_tab["0"] = "Tous";

        /* creation des btn category */
        categoryContainer = document.querySelector(".categoryContainer");
        for (let i=0; i<Object.keys(category_tab).length; i++) {
            const btn = document.createElement("button");
            categoryContainer.appendChild(btn);
            btn.style.cursor = "pointer";
            const btn_txt = document.createElement("span");
            btn.appendChild(btn_txt);
            btn.classList.add("btn");

            btn_txt.textContent = category_tab[i];

            btn.addEventListener("click", () => {
                category_selected = i;
                refresh();
            });
        }
    }
    else {
        console.error("La requête a échoué. Code : " + response_works.status);
    }
    /* activation forcée du premier refresh au chargement */
    refresh()

} // try
catch(error){
    console.error("Une erreur est survenue : " + error);
}

/* création de la fenêtre login */
const nav_login = document.getElementById("nav__login");
nav_login.addEventListener("click", () => login_window());

function login_window() {
    main = document.querySelector("main");
    // hide the main section ( keep the <header> and <footer> )
    main.style.display = "none";

    // création section LOGIN
    section_login = document.createElement("form");
    const loginContainer = document.getElementById("loginContainer");
    loginContainer.appendChild(section_login);
    section_login.id = "login";
    section_login.style.gap = "30px";
    section_login.style.top = "130px";
    section_login.style.height = "872px";
    // section_login.style.display = "none";
    section_login.style.position = "relative";

    // TITRE
    const login_title = document.createElement("h2");
    section_login.appendChild(login_title);
    login_title.innerText = "Log In";

    // <p> pour message d'erreur
    login_error_message = document.createElement("p");
    section_login.appendChild(login_error_message);
    login_error_message.style.color = "red";

    // box EMAIL
    const login_email_box = document.createElement("div");
    section_login.appendChild(login_email_box);
    login_email_box.style.display = "flex";
    login_email_box.style["flex-direction"] = "column";
    login_email_box.style["align-items"] = "flex-start";
    login_email_box.style.gap = "7px";
    // input EMAIL
    const login_email_label = document.createElement("label");
    login_email_box.appendChild(login_email_label);
    login_email_label.innerText = "E-mail";
    login_email_label.style["font-weight"] = "500";
    login_email = document.createElement("input");
    login_email_box.appendChild(login_email);
    login_email.id = "login_email_id";
    login_email.type = "email";
    login_email.style["font-size"] = "20px";
    login_email.style["text-align"] = "center";
    login_email.style.width = "379px";
    login_email.style.height = "51px";
    login_email.style.border = "0px";
    login_email.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";

    // box PASSWORD
    const login_password_box = document.createElement("div");
    section_login.appendChild(login_password_box);
    login_password_box.style.display = "flex";
    login_password_box.style["flex-direction"] = "column";
    login_password_box.style["align-items"] = "flex-start";
    login_password_box.style.gap = "7px";
    // input PASSWORD
    const login_password_label = document.createElement("label");
    login_password_box.appendChild(login_password_label);
    login_password_label.innerText = "Mot de passe";
    login_password_label.style["font-weight"] = "500";
    login_password = document.createElement("input");
    login_password_box.appendChild(login_password);
    login_password.id = "login_password_id";
    login_password.type = "password";
    login_password.style["font-size"] = "20px";
    login_password.style["text-align"] = "center";
    login_password.style.width = "379px";
    login_password.style.height = "51px";
    login_password.style.border = "0px";
    login_password.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";

    // création du BOUTTON
    const loginButton = document.createElement("button");
    section_login.appendChild(loginButton);

    loginButton.type = "button"; // pour éviter le submit du button par défaut et le refresh de la page
    loginButton.classList.add("btn", "btn--selected");
    loginButton.style.width = "180px";
    loginButton.style.height = "51px";
    loginButton.style.cursor = "pointer";
    loginButton.style.innerText = "Se connecter";
    loginButton.fontSize = "14px";
    
    const loginButton_span = document.createElement("span")
    loginButton.appendChild(loginButton_span);
    loginButton_span.innerText = "Se connecter";
    loginButton_span.style["font-size"] = "14px";

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
    const login_mdp_forgotten = document.createElement("a");
    section_login.appendChild(login_mdp_forgotten);
    login_mdp_forgotten.setAttribute("href", "#");
    login_mdp_forgotten.innerText = "Mot de passe oublié";
    login_mdp_forgotten.style.color = "inherit";
    login_mdp_forgotten.style["font-weight"] = "500";

    // Affiche la section
    section_login.style.display = "flex";
    section_login.style["flex-direction"] = "column";
    section_login.style["align-items"] = "center";
}

async function checkLogin () {

    // Valeurs pour les tests
    const userData = {
        email: "sophie.bluel@test.tld",
        password: "S0phie"
    }

    // const userData = {
    //     email: login_email.value,
    //     password: login_password.value
    // }

    // Vérification de la bonne forme de l'email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!emailRegex.test(userData.email)) {
        login_error_message.innerText = "Entrez une adresse E-mail valide";
        return;
    }

    // Vérification de la bonne forme du mot de passe
    if (userData.password.length < 5) {
        login_error_message.innerText =  "Le mot de passe doit contenir au moins 5 caractères";
        return;
    }

    try {
        let response_login = await fetch("http://localhost:5678/api/users/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(userData)
                                        });
        
        const response = await response_login.json();

        if (response_login.ok) {
            const userId = response.userId;
            const token = response.token;
          
            console.log(userId + " - " + token);

            editMode();
        }
        else {
            if (response_login.status === 401) {
                login_error_message.innerText = "Erreur: Mot de passe éroné";
                const inputField_pwd = document.getElementById('login_password_id');
                inputField_pwd.focus();
            }
            else if (response_login.status === 404) {
                login_error_message.innerText = "Erreur: Utilisateur non trouvé";
                const inputField_id = document.getElementById('login_email_id');
                inputField_id.focus();
            }
        }

    } // try
    catch(error){
        console.error("Une erreur est survenue ( " + error + " )");
    }
}

function editMode() {
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
            portfolioBannerLink.setAttribute("href","#");
            portfolioBannerLink.style.color = "inherit";
            linkContainer.appendChild(portfolioBannerLink);
            
    // juste pour test
    linkContainer.addEventListener("click", () => modalWindow());

    // Masquer le modal de connexion et la sélection de catégorie, et afficher la section principale
    section_login.style.display = "none";
    categoryContainer.style.display = "none";
    main.style.display = "block";
}

function modalWindow() {
    // Création du conteneur du modal
    const modalContainer = document.getElementById("modalContainer");
    modalContainer.style["z-index"] = "9999";
    modalContainer.style.Height = "688px";
    modalContainer.style.maxWidth = "630px";
    modalContainer.style.backgroundColor  = "#fFf";
    modalContainer.style.boxShadow  = "0px 4px 10px rgba(0, 0, 0, 0.25)";
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
    modalSubmitButton.addEventListener("click", () => {modalContainer.style.display = "none"});

    // Affichage des images dans la gallerie du modal
    function showModalWindowCards(cards) {
        cards.forEach(item => {
            const card = document.createElement("div"); // Es-tu necessaire ?!
            modalGalleryContainer.appendChild(card);

            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.style.width = "100%";
            card.appendChild(img);
        });
    }
    showModalWindowCards(card_listing)
}
// modalWindow()

} // main_func()
main_func();
