// import * as color from "./ui/colors.js";

import {
    modalReturnButton,
    modalCloseButton,
    modalSubmitButton,
    modalAddPhoto,
    modalTitle,
    modalGallery,
    modalWindow,
    buildModalGalleryCards,

    // modalAddPictureButton,
    // modalRealHiddenAddPictureButton,

    titleInputField,
    titleErrorCharCount,
    titleErrorAlphaNumChar,
    categoryDropdown,

    modalSubmitButtonEnabled,
    modalSubmitButtonDisabled
} from "./ui/modal-ui.js";

import {
    generalVar,
    fetchCards
} from "../script.js";

import {
    updatePortfolioCardsList // func
} from "./main-handler.js";

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

    modalButtonHandler("no-gal");
}

/*
 ---------------------------------------------------
 -- Show/Hide Modal ---------------------------------------------------------------------
 ---------------------------------------------------
*/

// -- Affichage de la modale ------------------------------------------------------------

export function displayModal () { // TODO: Gérer les removeListener
    // TODO: rendre inactif l'arrière plan
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

    modalReturnButton.addEventListener("click", () => displayPhotoGallery()); // flèche de retour

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

    // // mets à jour les 2 gallerieS à partir d'un new fetch de la liste du server
    // if (await fetchCards()) {
    //     buildModalGalleryCards();
    //     updatePortfolioCardsList();
    // }
    updateAllGallery();
} // deleteCard (item)

export async function updateAllGallery () {
    // mets à jour les 2 gallerieS à partir d'un new fetch de la liste du server
    if (await fetchCards()) {
        buildModalGalleryCards();
        updatePortfolioCardsList();
    }
}

// export async function addCard (item) {

// }

// -- Ajout d'une image -----------------------------------------------------------------

export function formHandler () {
    //
    // remplissage du menu déroulant
    generalVar.categoryList.forEach(item => {
        if (item.id !== 0) {
            const optionChoice = document.createElement("option");
            optionChoice.innerText = item.name;
            optionChoice.value = item.id;
            categoryDropdown.appendChild(optionChoice);
        }
    });
}

function modalButtonHandler (window) {
    // changement du comportement du bouton en toggle "valider"/"ajouter une photo"
    if (window === "gal") {
        // "ajouter une photo"
        modalSubmitButton.innerText = "Ajouter une photo";
        modalSubmitButtonEnabled();

        modalSubmitButton.addEventListener("click", () => displayAddPhoto()); // TODO: Gérer les removeListener
    } else {
        const titleInput = titleInputField.value;
        // "valider"
        modalSubmitButton.innerText = "valider";
        if (titleInput.length >= 4) {
            modalSubmitButtonEnabled();
        } else {
            modalSubmitButtonDisabled();
        }
    }

    // changement du comportement du bouton en fonction du nombre de charactère dans l'inputField
    // changement de couleur des aides pou l'InputField par validation du nombre ou du genre des caractères
    titleInputField.addEventListener("input", () => {
        const titleInput = titleInputField.value;
        const regex = /^[a-zA-Z0-9.&_-]+$/;
        if (!regex.test(titleInputField.value)) {
            titleErrorAlphaNumChar.style.color = "red";
        } else {
            titleErrorAlphaNumChar.style.color = "green";
        }

        if (titleInput.length >= 4) {
            titleErrorCharCount.style.color = "green";
            modalSubmitButtonEnabled();
        } else {
            titleErrorCharCount.style.color = "red";
            modalSubmitButtonDisabled();
        }
    });
}
