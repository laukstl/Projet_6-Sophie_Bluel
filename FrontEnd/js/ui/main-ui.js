import {
    generalVar
} from "../../script.js";

import {
    displayModalWindow
} from "../modal-handler.js";

import {
    buildModalGalleryCards
} from "./modal-ui.js";

export let banner, portfolioBannerLinkContainer;

// -- ui du mode Edition ----------------------------------------------

export function buildEditMode () {
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
    portfolioBanner.style.margin = "130px 0 50px 0";

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
            buildModalGalleryCards(generalVar.cardsList);
            displayModalWindow();
        });
}

// -- Gestion de laffichage des erreurs -------------------------------------------------

export function displayErrorMessage (photoTitleLabel = "", title = "", error = "None.") {
    const errors = document.getElementById("errors");
    const portfolio = document.getElementById("portfolio");

    const errorMessageContact = document.querySelector("#contact p");
    errorMessageContact.innerText = "Désole pour ce contre-temps. Vous pouvez toujours nous contacter :";

    portfolio.style.display = "none";
    errors.style.marginBottom = "30px";

    const errorContainer = document.createElement("div");
    errorContainer.style.margin = "auto";
    errorContainer.style.zIndex = "9999";
    errorContainer.style.position = "absolute";
    errorContainer.style.maxWidth = "500px";
    errorContainer.style.left = 0;
    errorContainer.style.right = 0;
    errorContainer.style.top = "180px";
    errorContainer.style.color = "red";
    errorContainer.style.border = "2px solid red";
    errorContainer.style.padding = "15px";
    errorContainer.style.backgroundColor = "rgba(255,255,200,0.85)";
    errorContainer.style.wordWrap = "break-word";
    // errorContainer.style.backgroundColor = "#FF0";

    const errorTitleLabel = document.createElement("div");
    errorTitleLabel.style.display = "flex";
    errorTitleLabel.style.flexDirection = "column";
    errorTitleLabel.style.textAlign = "center";
    errorTitleLabel.style.fontFamily = "Syne";
    errorTitleLabel.style.fontWeight = "700";
    errorTitleLabel.style.fontSize = "30px";
    errorTitleLabel.style.color = "#1D6154";
    errorTitleLabel.innerHTML = photoTitleLabel;

    const errorTitle = document.createElement("div");
    errorTitle.style.display = "flex";
    errorTitle.style.flexDirection = "column";
    errorTitle.style.textAlign = "center";
    errorTitle.style.fontFamily = "Syne";
    errorTitle.style.fontWeight = "700";
    errorTitle.style.fontSize = "20px";
    errorTitle.style.color = "#1D6154";
    errorTitle.innerHTML = title;
    errorTitle.style.marginTop = "10px";

    const errorShortDescriptionLabel = document.createElement("div");
    errorShortDescriptionLabel.style.fontSize = "15px";
    errorShortDescriptionLabel.style.fontWeight = "800";
    errorShortDescriptionLabel.style.color = "#B1663C";
    errorShortDescriptionLabel.innerHTML = "Short description :";
    errorShortDescriptionLabel.style.marginTop = "2em";

    const errorShortDescription = document.createElement("div");
    errorShortDescription.innerHTML = error;

    const errorStackLabel = document.createElement("p");
    errorStackLabel.innerHTML = "Stack :";
    errorStackLabel.style.fontSize = "15px";
    errorStackLabel.style.fontWeight = "800";
    errorStackLabel.style.color = "#B1663C";
    errorStackLabel.style.marginTop = "1em";

    const errorStack = document.createElement("p");
    if (error.stack) {
        errorStack.innerHTML = error.stack;
    } else {
        errorStack.innerHTML = "Non applicable.";
    }

    errorContainer.appendChild(errorTitleLabel);
    errorContainer.appendChild(errorTitle);
    errorContainer.appendChild(errorShortDescriptionLabel);
    errorContainer.appendChild(errorShortDescription);
    errorContainer.appendChild(errorStackLabel);
    errorContainer.appendChild(errorStack);

    errors.appendChild(errorContainer);

    errorContainer.ariaHidden = "false";
    // main.ariaHidden = "true"; // NOTE: à cause du formulaire de contact, c'est mal pensé
}
