async function main () {

let category_selected = 0;
let card_listing = []

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
        const category = document.querySelector(".category");
        for (let i=0; i<Object.keys(category_tab).length; i++) {
            const btn = document.createElement("button");
            category.appendChild(btn);
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
nav_login.addEventListener("click", () => show_login_screen());

function show_login_screen() {
    const main = document.querySelector("main");
    // clean screen
    main.innerHTML = "";

    // création section LOGIN
    const section_login = document.createElement("section");
    main.appendChild(section_login);
    section_login.id = "login";

    // TITRE
    const login_title = document.createElement("h2");
    section_login.appendChild(login_title);
    login_title.innerText = "Log In";

    // input EMAIL
    const login_email = document.createElement("input");
    section_login.appendChild(login_email);
    login_email.innerText = "E-mail";

    // input PASSWORD
    const login_password = document.createElement("input");
    section_login.appendChild(login_password);
    login_password.innerText = "Mot de passe";

    // BOUTTON
    const login_btn = document.createElement("button");
    section_login.appendChild(login_btn);
    login_btn.style.width = "180px";
    const login_btn_span = document.createElement("span")
    login_btn.appendChild(login_btn_span);
    login_btn.classList.add("btn");
    login_btn.classList.add("btn--selected");
    login_btn_span.innerText = "Se connecter";

    // LIEN FORGOTTEN
    const login_mdp_forgotten = document.createElement("a");
    section_login.appendChild(login_mdp_forgotten);
    section_login.setAttribute("href", "#");
    login_mdp_forgotten.innerText = "Mot de passe oublié";

    // Affiche la section
    section_login.style.display = "flex";
    section_login.style["flex-direction"] = "column";
    section_login.style["align-items"] = "center";
}

} // main()
main();
