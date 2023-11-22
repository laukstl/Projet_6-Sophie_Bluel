import {
    modalReturnButton,
    modalCloseButton,
    modalSubmitButton,
    modalAddPhoto,
    modalTitle,
    modalGallery,
    modalWindow
} from "./modal-ui.js";

import {
    updatePortfolioCards, // func
    cardsToDisplay // func
} from "./script.js";

// Need ajouter les EventListener ET les retirer correctement
modalReturnButton.addEventListener("click", () => displayPhotoGallery()); // flèche de retour
modalSubmitButton.addEventListener("click", () => displayAddPhoto()); // bouton "Ajouter une photo"

export function displayPhotoGallery () {
    // on cache
    modalAddPhoto.style.display = "none";
    // on update
    modalReturnButton.style.display = "none";
    modalTitle.innerText = "Galerie photo";
    // on affiche
    modalGallery.style.display = "grid";
    modalWindow.style.display = "flex";
}

export function displayAddPhoto () {
    // on cache
    modalGallery.style.display = "none";
    // on update
    modalTitle.innerText = "Ajout photo";
    modalReturnButton.style.display = "block";
    // on affiche
    modalAddPhoto.style.display = "flex";
}

// ***************************************

// show/hide Modal Window
export function displayModal () {
    displayPhotoGallery();
    modalWindow.style.display = "flex";

    // setTimeout pour éviter que la func modalClickHandler ne soit immédiatement lancé au click d'ouverture
    // apparement, js propage l'eventListener en même temps qu'il affiche la fenêtre...
    // et comme on fait apparaitre la fenêtre avec un click, et qu'un click la ferme, ... clickclick
    setTimeout(() => document.addEventListener("click", modalClickHandler), 1); // 1 ms
    document.addEventListener("keydown", modalKeydownHandler);
}

export function hideModal () {
    console.log("Hiding Modal");
    document.removeEventListener("click", modalClickHandler);
    document.removeEventListener("keydown", modalKeydownHandler);

    modalWindow.style.display = "none";
}

function modalClickHandler (event) {
    console.log(event);
    if ((event.target !== modalWindow && !modalWindow.contains(event.target)) || event.target === modalCloseButton) {
        hideModal();
    }
}

function modalKeydownHandler (event) {
    if (event.key === "Escape") {
        hideModal();
    }
}

// ***************************************

// Affichage les images dans la gallerie du modal en fonction de cardsToDisplay ( donc idem à l'autre gal )
export function updateModalCards (cards) {
    // clean gallery
    modalGallery.innerHTML = "";

    cardsToDisplay.forEach(item => {
        const card = document.createElement("div");
        card.style.position = "relative";
        modalGallery.appendChild(card);

            const img = document.createElement("img");
            img.src = item.imageUrl;
            img.style.width = "100%";
            card.appendChild(img);

            const trashIconContainer = document.createElement("a");
            trashIconContainer.style.position = "absolute";
            trashIconContainer.style.top = "5px";
            trashIconContainer.style.right = "5px";
            trashIconContainer.style.height = "17px";
            trashIconContainer.style.width = "17px";
            trashIconContainer.style.textAlign = "center";
            trashIconContainer.style.lineHeight = "17px";
            trashIconContainer.style.background = "black";
            trashIconContainer.style.cursor = "pointer";
            trashIconContainer.addEventListener("click", () => deleteCard(item));
            card.appendChild(trashIconContainer);

                const trashIcon = document.createElement("img");
                trashIcon.setAttribute("src", "./assets/icons/trashcan.svg");
                trashIcon.style.height = "11px";
                trashIcon.style.width = "9px";
                trashIconContainer.appendChild(trashIcon);
    });
} // updateModalCards (cards)

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
} // deleteCard (item)
