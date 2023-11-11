async function main_func () {

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
nav_login.addEventListener("click", () => show_login_screen());

function show_login_screen() {
    const main = document.querySelector("main");
    // clear the main section ( keep header/footer )
    main.innerHTML = "";

    // création section LOGIN
    const section_login = document.createElement("form");
    main.appendChild(section_login);
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

    // Box EMAIL
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
    const login_email = document.createElement("input");
    login_email_box.appendChild(login_email);
    login_email.type = "email";
    login_email.style["font-size"] = "20px";
    login_email.style["text-align"] = "center";
    login_email.style.width = "379px";
    login_email.style.height = "51px";
    login_email.style.border = "0px";
    login_email.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";

    // Box PASSWORD
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
    const login_password = document.createElement("input");
    login_password_box.appendChild(login_password);
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
        check_login(login_email, login_password);
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

async function check_login (login_email, login_password) {
    
    // const email = login_email.value;
    // const password = login_password.value;

    const userData = {
        email: "sophie.bluel@test.tld",
        password: "S0phie"
    }

    let response_login = await fetch("http://localhost:5678/api/users/login", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                          },
                                        body: JSON.stringify(userData)
                                    });

    // if(response_login.ok){...}
    // else{print(response_login.status)}
    const response = await response_login.json();
    const userId = response.userId;
    const token = response.token;
    console.log(userId + " - " + token);
}

} // main_func()
main_func();
