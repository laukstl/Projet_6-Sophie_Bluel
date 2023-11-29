import {
    modalReturnButton,
    modalCloseButton,
    modalSubmitButton,
    modalAddPhoto,
    modalTitle,
    modalGallery,
    modalWindow,
    buildModalGalleryCards
} from "./modal-ui.js";

import {
    fetchCards
} from "./script.js";

import {
    updatePortfolioCardsList // func
} from "./main-handler.js";

// TODO: Need ajouter les EventListener ET les retirer correctement
modalReturnButton.addEventListener("click", () => displayPhotoGallery()); // flèche de retour
// modalSubmitButton.addEventListener("click", () => displayAddPhoto()); // bouton "Ajouter une photo"

function modalButtonHandler (window) {
    if (window === "gal") {
        // mode Gallery photo
        modalSubmitButton.innerText = "Ajouter une photo";
        modalSubmitButton.style.background = "#1D6154";

        modalSubmitButton.addEventListener("click", () => displayAddPhoto());
    } else {
        // mode Ajout photo
        modalSubmitButton.innerText = "valider";
        modalSubmitButton.style.background = "#A7A7A7";
        modalSubmitButton.style.border = "1px solid #A7A7A7";
        modalSubmitButton.disabled = true;

        // modalSubmitButton.addEventListener("click", (event) => event.preventDefault());
    }
}

// -- Affichage de la gallery de la modale ----------------------------------------------

export function displayPhotoGallery () {
    // on cache
    modalAddPhoto.style.display = "none";
    // on update
    modalReturnButton.style.display = "none";
    modalTitle.innerText = "Galerie photo";
    // on affiche
    modalGallery.style.display = "grid";
    modalWindow.style.display = "flex";

    modalButtonHandler("gal");
}

// -- Affichage de la page d'ajout de photo de la modale --------------------------------

export function displayAddPhoto () {
    // on cache
    modalGallery.style.display = "none";
    // on update
    modalTitle.innerText = "Ajout photo";
    modalReturnButton.style.display = "block";
    // on affiche
    modalAddPhoto.style.display = "flex";

    modalButtonHandler("add");
}

/*
 ---------------------------------------------------
 -- Show/Hide Modal ---------------------------------------------------------------------
 ---------------------------------------------------
*/

// -- Affichage de la modale ------------------------------------------------------------

export function displayModal () {
    displayPhotoGallery();
    modalWindow.style.display = "flex";

    // setTimeout pour éviter que la func modalClickHandler ne soit immédiatement lancé au click d'ouverture
    // apparement, js propage l'eventListener en même temps qu'il affiche la fenêtre...
    // et comme on fait apparaitre la fenêtre avec un click, et qu'un click la ferme, ... clickclick
    setTimeout(() => document.addEventListener("click", modalClickHandler), 1); // 1 ms

    // stopPropagation permet d'éviter hideModal() (de modalClickHandler()) si on click sur trashIconContainer ou trashIcon
    // !modalWindow.contains(event.target) dans modalClickHandler() n'était pas suffisant
    modalWindow.addEventListener('click', function (event) { event.stopPropagation(); });

    modalCloseButton.addEventListener('click', () => hideModal());

    document.addEventListener("keydown", modalKeydownHandler);
}

// -- Masquage de la modale -------------------------------------------------------------

export function hideModal () {
    document.removeEventListener("click", modalClickHandler);
    document.removeEventListener("keydown", modalKeydownHandler);

    modalWindow.style.display = "none";
}

// -- Gestion des comportements du Click et Escape --------------------------------------

function modalClickHandler (event) {
    if (
        event.target !== modalWindow
    ) {
        hideModal();
    }
}

function modalKeydownHandler (event) {
    if (event.key === "Escape") {
        hideModal();
    }
}

/*
 ---------------------------------------------------
 -- Gestionnaire d'ajout / retrait d'image ----------------------------------------------
 ---------------------------------------------------
*/

// -- Effacement d'une image ------------------------------------------------------------

export async function deleteCard (item) {
    const id = item.id;

    try {
        const UserToken = window.localStorage.getItem("tokenID"); // FIXME: need a try

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${UserToken}`
            }
        });
        if (response.ok) {
            console.log("Item succefully deleted !");
            // cardsToDisplay.splice(index, 1);
        } else {
            console.log("deleteItem() error : ", response);
        }
    } catch (error) {
        console.log("Erreur de serveur : " + error);
    }

    // mets à jour les 2 gallerieS à partir d'un new fetch de la liste du server
    if (await fetchCards()) {
        buildModalGalleryCards();
        updatePortfolioCardsList();
    }
} // deleteCard (item)

// -- Ajout d'une image -----------------------------------------------------------------
