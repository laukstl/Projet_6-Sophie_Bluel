
async function main () {
    
    try{
        // let response_categories = await fetch("http://localhost:5678/api/categories");
        // if (response_categories.ok) {
        //     categories = await response_categories.json();
        //     console.log(categories.forEach(item=>console.log(item)));
        // }
        // else {
        //     console.error("La requête a échoué. Code : " + response_categories.status);
        // }

        let response_works = await fetch("http://localhost:5678/api/works");

        const gallery_element = document.querySelector(".gallery");

        if (response_works.ok) { // 200-299
            response_works = await response_works.json();

            // récolte des id/noms des catégories
            let category_tab = {};
            response_works.forEach(item => {
                category_tab[item.category.id] = item.category.name;
            });
            console.log(category_tab);

            // Ajout des cards par défaut
            response_works.forEach(item => {
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
        else {
            console.error("La requête a échoué. Code : " + response_works.status);
        }
    }
    catch(error){
        console.error("Une erreur est survenue : " + error);
    }
}

main();

