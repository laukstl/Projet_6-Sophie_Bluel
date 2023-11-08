async function main () {
    let category_selected = 0;
    let card_listing = {}
    const gallery_element = document.querySelector(".gallery");

    // Ajout des cards par défaut
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
        })
    }

    // clean la gallery
    function clean_gallery() {
        gallery_element.innerHTML = "";
    }

    // Update les btn avec le bon background
    function refresh() {
        const all_btn = document.querySelectorAll(".btn");
        all_btn.forEach((button, index) => {
            if (category_selected == index) {
                button.classList.add("btn--selected")
            } else {
                button.classList.remove("btn--selected")
            }

            let cards_to_show = {};
            switch(category_selected) {
                case 0:
                    cards_to_show = card_listing;
                    break;
                case 1:
                    cards_to_show = card_listing.filter(item => item.categoryId == 1);
                    break;
                case 2:
                    cards_to_show = card_listing.filter(item => item.categoryId == 2);
                    break;
                case 3:
                    cards_to_show = card_listing.filter(item => item.categoryId == 3);
                    break;
            }
            show_cards(cards_to_show);
        })
    }

    try {
        let response_works = await fetch("http://localhost:5678/api/works");

        if (response_works.ok) { // 200-299
            card_listing = await response_works.json();

            // création de la liste des catégories
            let category_tab = {};
            card_listing.forEach(item => {
                category_tab[item.category.id] = item.category.name;
            });
            category_tab["0"] = "Tous";

            // creation des boutons de category
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

        refresh()

    }
    catch(error){
        console.error("Une erreur est survenue : " + error);
    }
}

main();

