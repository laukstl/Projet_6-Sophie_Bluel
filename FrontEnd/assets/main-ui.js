import { cssTweak } from "./csstweak.js";

import {
    generalVar
} from "./script.js";

import {
    updateModalCards, // func
    displayModal // func
} from "./modal-handler.js";

// Apply some css tyle
cssTweak();

export let banner, portfolioBannerLinkContainer;

// -- ui du mode Edition ----------------------------------------------

function editMode () {
    //  Ajout d'une bannière au dessus de l'header
    banner = document.getElementById("editModeBanner");
    banner.style.background = "Black";
    banner.style.height = "60px";
    banner.style.display = "none";
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

    // Conteneur de la bannière du portfolio ( titre - icone - lien )
    const portfolioBanner = document.getElementById("portfolioTitle");
    portfolioBanner.style.display = "flex";
    portfolioBanner.style.justifyContent = "center";
    portfolioBanner.style.alignItems = "center";
    portfolioBanner.style.margin = "130px 0 100px 0";

        // Titre de la section du portfolio
        const portfolioTitleText = document.querySelector("#portfolioTitle > h2");
        portfolioTitleText.style.margin = "auto 0";

        // Conteneur ( icone - lien )
        portfolioBannerLinkContainer = document.createElement("div");
        portfolioBannerLinkContainer.style.display = "none";
        portfolioBannerLinkContainer.style.gap = "1em";
        portfolioBannerLinkContainer.style.marginLeft = "2em";
        portfolioBannerLinkContainer.style.cursor = "pointer";
        portfolioBanner.appendChild(portfolioBannerLinkContainer);

            // Icône "modifier"
            const portfolioBannerIcon = document.createElement("img");
            portfolioBannerIcon.src = "./assets/icons/edit_black.svg";
            portfolioBannerIcon.style.height = "16px";
            portfolioBannerLinkContainer.appendChild(portfolioBannerIcon);

            // Lien "modifier"
            const portfolioBannerLink = document.createElement("a");
            portfolioBannerLink.style.fontSize = "14px";
            portfolioBannerLink.innerText = "modifier";
            portfolioBannerLink.style.color = "inherit";
            portfolioBannerLinkContainer.appendChild(portfolioBannerLink);

    // update and display the modal
    portfolioBannerLinkContainer.addEventListener("click", () => {
            updateModalCards(generalVar.cardsList);
            displayModal();
        });
}
editMode();
