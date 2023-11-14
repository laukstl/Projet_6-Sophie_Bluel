async function main_func () {

/* Variables pour gestion des closures */

    // category choisi ( 0 par défaut )
    let category_selected = 0;
    // liste des cards ( image + desc )
    let card_listing = []

    // section_main
    let main = null;
    // section_category
    let category = null;
    // fenêtre de login
    let section_login = null;
    // <input > de email et password
    let login_email = null;
    let login_password = null;
    // <p> de message d'erreur
    let login_error_message = null;

    // callage...
    document.getElementById("projetsTitle").style["margin-top"] = "130px";

const gallery_element = document.querySelector(".gallery");

/* Affichage des cards */
function show_cards(cards) {
    clean_gallery()
    cards.forEach(item => {
        const card = document.createElement("figure");
        gallery_element.appendChild(card);

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
    gallery_element.innerHTML = "";
}

function refresh() {
    /* Update les btn category avec le bon background */
    const all_btn = document.querySelectorAll(".btn");
    all_btn.forEach((button, index) => {
        if (category_selected == index) {
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
        category = document.querySelector(".category");
        for (let i=0; i<Object.keys(category_tab).length; i++) {
            const btn = document.createElement("button");
            category.appendChild(btn);
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
    const box_section_login = document.getElementById("box_section_login");
    box_section_login.appendChild(section_login);
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

    // BOUTTON
    const login_btn = document.createElement("button");
    section_login.appendChild(login_btn);
    login_btn.type = "button"; // pour éviter le submit du button par défaut et le refresh de la page
    login_btn.style.width = "180px";
    login_btn.style.height = "51px";
    login_btn.style.cursor = "pointer";
    const login_btn_span = document.createElement("span")
    login_btn.appendChild(login_btn_span);
    login_btn.classList.add("btn");
    login_btn.classList.add("btn--selected");
    login_btn_span.innerText = "Se connecter";
    login_btn_span.style["font-size"] = "14px";
    login_btn.addEventListener("mouseover", () => {
        login_btn.classList.add("btn--pushed");
        login_btn.classList.remove("btn--selected");
    });
    login_btn.addEventListener("mouseout", () => {
        login_btn.classList.remove("btn--pushed");
        login_btn.classList.add("btn--selected");
    });
    login_btn.addEventListener("click", () => {
        check_login();
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

async function check_login () {

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

            mode_edition();
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

async function mode_edition() {
    //**  Bannière  **//   au top header
    const editMode_banner = document.getElementById("editMode_banner");
    editMode_banner.style.background = "Black";
    editMode_banner.style.height = "60px";
    editMode_banner.style.display = "flex";
    editMode_banner.style["justify-content"] = "center";
    editMode_banner.style["align-items"] = "center";
    editMode_banner.style.gap = "10px";
    // icon
    const editMode_banner_icon = document.createElement("img");
    editMode_banner.appendChild(editMode_banner_icon);
    editMode_banner_icon.setAttribute("src", "./assets/icons/edit_white.svg");
    editMode_banner_icon.style.height = "16px";
    // text
    const editMode_banner_txt = document.createElement("p");
    editMode_banner.appendChild(editMode_banner_txt);
    editMode_banner_txt.style.color = "white";
    editMode_banner_txt.innerText = "Mode édition";

    //**  nav login/logout  **//
    const logInOut = document.getElementById("nav__login");
    logInOut.innerText = "logout";

    //**  Titre "Mes projets"  **// 
    const Titre_MesProjets = document.querySelector("#projetsTitle > h2");
    Titre_MesProjets.style.margin = "auto 0";

    // box
    const editMode_projetsTitle_box = document.createElement("div");
    editMode_projetsTitle_box.style.display = "flex";
    editMode_projetsTitle_box.style.gap = "1em";
    editMode_projetsTitle_box.style["margin-left"] = "2em";
    const projetsTitle = document.getElementById("projetsTitle");
    projetsTitle.style.display = "flex";
    projetsTitle.style["justify-content"] = "center";
    projetsTitle.style["align-items"] = "center";
    projetsTitle.style.margin = "130px 0 100px 0";
    projetsTitle.appendChild(editMode_projetsTitle_box);
    // icon
    const editMode_projetsTitle_icon = document.createElement("img");
    editMode_projetsTitle_box.appendChild(editMode_projetsTitle_icon);
    editMode_projetsTitle_icon.setAttribute("src", "./assets/icons/edit_black.svg");
    editMode_projetsTitle_icon.style.height = "16px";
    // text
    const editMode_projetsTitle_txt = document.createElement("p");
    editMode_projetsTitle_box.appendChild(editMode_projetsTitle_txt);
    editMode_projetsTitle_txt.style["font-size"] = "14px";
    editMode_projetsTitle_txt.innerText = "modifier";


    section_login.style.display = "none";
    main.style.display = "block";
    category.style.display = "none";

}

} // main_func()
main_func();
