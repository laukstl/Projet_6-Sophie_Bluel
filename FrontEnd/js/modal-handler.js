// import * as color from "./ui/colors.js";

import {
    modalReturnButton,
    modalCloseButton,
    modalMessageContainer,
    modalSubmitButton,
    modalAddPhoto,
    modalTitle,
    modalGallery,
    modalWindow,
    buildModalGalleryCards,

    modalAddPictureButton,
    modalRealHiddenAddPictureButton,

    modalPicturePreview,
    modalImg,
    modalInstructions,

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

let selectedFile;

// -- Affichage des messages de la modale -----------------------------------------------

export function displayModalMessage (message, isError = null) {
    modalMessageContainer.style.display = "flex";
    modalMessageContainer.innerHTML = "";

    if (isError === true) {
        modalMessageContainer.style.color = "red";
        modalMessageContainer.style.backgroundColor = "#FFDDDD";
        modalMessageContainer.style.border = "1px red solid";
    } else if (isError === false) {
        modalMessageContainer.style.color = "green";
        modalMessageContainer.style.backgroundColor = "#DDFFDD";
        modalMessageContainer.style.border = "1px green solid";
    } else {
        modalMessageContainer.style.color = "black";
        modalMessageContainer.style.backgroundColor = "#DDDDDD";
        modalMessageContainer.style.border = "1px black solid";
    }

    modalMessageContainer.style.textAlign = "center";
    modalMessageContainer.innerHTML = message;
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

    modalPicturePreview.innerHTML = "";
    modalPicturePreview.style.display = "none";
    titleInputField.innerText = "";
    selectedFile = null;

    modalImg.style.display = "block";
    modalAddPictureButton.style.display = "block";
    modalInstructions.style.display = "block";

    modalButtonHandler("no-gal");
    fileSelectionAndTest();
}

/*
 ---------------------------------------------------
 -- Show/Hide Modal ---------------------------------------------------------------------
 ---------------------------------------------------
*/

// -- Affichage de la modale ------------------------------------------------------------

const main = document.querySelector("main");

export function displayModal () { // TODO: Gérer les removeListener
    displayPhotoGallery();

    modalWindow.style.display = "flex";

    modalWindow.ariaHidden = "false";
    main.ariaHidden = "true";

    modalMessageContainer.style.display = "none";

    // setTimeout pour éviter que la func modalClickHandler ne soit immédiatement lancé au click d'ouverture
    // apparement, js propage l'eventListener en même temps qu'il affiche la fenêtre...
    // et comme on fait apparaitre la fenêtre avec un click, et qu'un click la ferme, ... clickclick
    setTimeout(() => document.addEventListener("click", modalClickHandler), 1); // 1 ms

    // stopPropagation permet d'éviter hideModal() (de modalClickHandler()) si on click sur trashIconContainer ou trashIcon
    // !modalWindow.contains(event.target) dans modalClickHandler() n'était pas suffisant
    modalWindow.addEventListener('click', function (event) { event.stopPropagation(); });

    modalCloseButton.addEventListener('click', () => hideModal());

    modalReturnButton.addEventListener("click", () => {
            displayPhotoGallery();
            modalMessageContainer.style.display = "none";
    }); // flèche de retour

    document.addEventListener("keydown", modalKeydownHandler);
}

// -- Masquage de la modale -------------------------------------------------------------

export function hideModal () {
    document.removeEventListener("click", modalClickHandler);
    document.removeEventListener("keydown", modalKeydownHandler);

    modalWindow.style.display = "none";
    modalWindow.ariaHidden = "true";
    main.ariaHidden = "false";
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
        let UserToken;
        try {
            UserToken = window.localStorage.getItem("tokenID");
        } catch (error) {
            displayModalMessage("La récupération du token a échoué !", true);
        }

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${UserToken}`
            }
        });

        if (response.ok) {
            displayModalMessage("Carte effacée ! <br>-<br> " + response.statusText + " ( code " + response.status + " )", false);
        } else {
            displayModalMessage("L'effacement de la carte a échouée !<br>-<br> " + response.statusText + " ( code " + response.status + " )", true);
        }
    } catch (error) {
        displayModalMessage("Erreur du serveur : " + error, true);
    }

    updateAllGallery();
} // deleteCard (item)

export async function updateAllGallery () {
    // mets à jour les 2 gallerieS à partir d'un new fetch de la liste du server
    if (await fetchCards()) {
        buildModalGalleryCards();
        updatePortfolioCardsList();
    }
}

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

        modalSubmitButton.removeEventListener("click", () => displayAddPhoto());

        modalSubmitButton.addEventListener("click", (event) => { // NOTE: le fameux bouton qui est TROP multifonction
            console.log(modalSubmitButton.disabled);
            // if (modalSubmitButtonState === "add") {
            if (modalSubmitButton.disabled === false) {
                // --
            } else {
                submitForm(modalRealHiddenAddPictureButton, titleInputField, categoryDropdown);
            }
        }); // click
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

async function submitForm (modalRealHiddenAddPictureButton, titleInputField, categoryDropdown) {
    const formData = new FormData();
    formData.append("image", modalRealHiddenAddPictureButton.files[0]);
    formData.append("title", titleInputField.value);
    formData.append("category", categoryDropdown.value);

    try {
        let UserToken;
        try {
            UserToken = window.localStorage.getItem("tokenID");
        } catch (error) {
            displayModalMessage("La récupération du token a échoué !", true);
        }

        const response = await fetch("http://localhost:5678/api/works/", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${UserToken}`
            }
        });
        if (response.ok) {
            displayModalMessage("La création de la carte " + toString(titleInputField) + " a réussie !<br>-<br>" + response.statusText + " ( code " + response.status + " )", false);

            // reinitAddPhoto();
            displayAddPhoto();
        } else {
            displayModalMessage("La création de la carte " + toString(titleInputField.value) + " a échouée !<br>-<br> " + response.statusText + " ( code " + response.status + " )", true);
        }
    } catch (error) {
        displayModalMessage("Erreur de serveur :<br>" + error, true);
    }
    updateAllGallery();
}

function fileSelectionAndTest () {
    modalRealHiddenAddPictureButton.addEventListener("change", (event) => {
        selectedFile = event.target.files[0];

        // ("Nom du fichier:", selectedFile.name);

        if (selectedFile.size > 4000000) {
            displayModalMessage("Le fichier doit être inférieur à 4Mo", true);
            return;
        }

        if (selectedFile.type !== "image/jpeg" && selectedFile.type !== "image/png") {
            displayModalMessage("Seuls les .JPG et les .PNG sont acceptés", true);
            return;
        }

        modalMessageContainer.style.display = "none";

        // display the thumbail
        const imageUrl = URL.createObjectURL(selectedFile);
        modalPicturePreview.style.display = "flex";
        modalPicturePreview.src = imageUrl;
        modalPicturePreview.style.maxHeight = "169px";
        modalPicturePreview.style.width = "auto";

        // hide helpers
        modalImg.style.display = "none";
        modalAddPictureButton.style.display = "none";
        modalInstructions.style.display = "none";
    });
}
