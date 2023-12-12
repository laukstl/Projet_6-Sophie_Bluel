// TODO: Ajout FOCUS

import {
    modalWindow,
    modalOverlay,
    modalReturnButton,
    modalCloseButton,
    modalTitle,
    displayModalMessage,

    modalGallery,
    modalGalleryButton,
    buildModalGalleryCards,

    modalAddPhoto,
    modalSubmitButton,
    modalSubmitButtonEnabled,
    modalSubmitButtonDisabled,

    photoTitleInputField,
    photoTitleErrorMessageCount,
    photoTitleErrorMessageAlphaNum,
    categoryDropdown,

    modalAddPhotoButton,
    modalRealHiddenAddPictureButton,
    modalInstructions,
    modalPicturePreview,
    modalImg
} from "./ui/modal-ui.js";

import {
    generalVar,
    fetchCards
} from "../script.js";

import {
    updatePortfolioCardsList
} from "./main-handler.js";

/*
 ---------------------------------------------------
 -- Show/Hide Modal ---------------------------------------------------------------------
 ---------------------------------------------------
*/

// -- Affichage de la modale ------------------------------------------------------------

const main = document.querySelector("main");

export function displayModalWindow () {
    modalOverlay.style.display = "block";

    displayPhotoGallery();

    modalWindow.style.display = "flex";

    modalWindow.ariaHidden = "false";
    main.ariaHidden = "true";

    // setTimeout pour éviter que la func modalClickHandler ne soit immédiatement lancé au click d'ouverture
    // apparement, js propage l'eventListener en même temps qu'il affiche la fenêtre...
    // et comme on fait apparaitre la fenêtre avec un click, et qu'un click la ferme, ... clickclick
    setTimeout(() => document.addEventListener("click", modalClickHandler), 1); // 1 ms

    // stopPropagation permet d'éviter hideModalWindow() (de modalClickHandler()) si on click sur trashIconContainer ou trashIcon
    // !modalWindow.contains(event.target) dans modalClickHandler() n'était pas suffisant
    modalWindow.addEventListener('click', function (event) { event.stopPropagation(); });

    modalCloseButton.addEventListener('click', hideModalWindow);

    modalReturnButton.addEventListener("click", displayPhotoGallery);

    modalSubmitButton.addEventListener("click", () => submitForm(modalRealHiddenAddPictureButton, photoTitleInputField, categoryDropdown));

    modalGalleryButton.addEventListener("click", () => { displayAddPhoto(); });

    document.addEventListener("keydown", modalKeydownHandler); // Escape

    document.addEventListener("keydown", (event) => { if (event.key === "ArrowLeft") { displayPhotoGallery(); } });
    document.addEventListener("keydown", (event) => { if (event.key === "ArrowRight") { displayAddPhoto(); } });
}

// -- Masquage de la modale -------------------------------------------------------------

export function hideModalWindow () {
    modalOverlay.style.display = "none";

    document.removeEventListener("click", modalClickHandler);

    modalWindow.removeEventListener('click', function (event) { event.stopPropagation(); });

    modalCloseButton.removeEventListener('click', hideModalWindow);

    modalReturnButton.removeEventListener("click", displayPhotoGallery);

    hideAddPhoto();
    hidePhotoGallery();

    document.removeEventListener("keydown", modalKeydownHandler);

    modalWindow.style.display = "none";

    modalWindow.ariaHidden = "true"; // inutile
    main.ariaHidden = "false";
}

// -- Fermeture de la modale si Click en dehors ou press Escape -------------------------

function modalClickHandler (event) {
    if (
        event.target !== modalWindow
    ) {
        hideModalWindow();
    }
}

function modalKeydownHandler (event) {
    if (event.key === "Escape") {
        hideModalWindow();
    }
}

let selectedFile;
// -- Gestion affichage de la gallery de la modale --------------------------------------

function displayPhotoGallery () {
    hideAddPhoto();

    modalTitle.innerText = "Galerie photo";

    modalGallery.style.display = "grid";
    modalGalleryButton.style.display = "block";

    modalSubmitButtonEnabled();
}

function hidePhotoGallery () {
    modalGallery.style.display = "none";
    modalGalleryButton.style.display = "none";
}

// -- Gestion de l'affichage de la page d'ajout de photo de la modale -------------------

function displayAddPhoto () {
    hidePhotoGallery();

    modalGalleryButton.removeEventListener("click", () => displayAddPhoto);

    modalTitle.innerText = "Ajout photo";

    modalReturnButton.style.display = "block";
    modalSubmitButton.style.display = "block";
    modalAddPhoto.style.display = "flex";

    modalPicturePreview.innerHTML = "";
    modalPicturePreview.style.display = "none";
    photoTitleInputField.value = "";
    selectedFile = null;
    photoTitleErrorMessageAlphaNum.style.color = "lightgrey";
    photoTitleErrorMessageCount.style.color = "lightgrey";

    modalImg.style.display = "block";
    modalAddPhotoButton.style.display = "block";
    modalInstructions.style.display = "block";

    modalSubmitButtonDisabled();

    // changement du comportement du bouton en fonction du nombre de charactère dans l'inputField
    // changement de couleur des aides pou l'InputField par validation du nombre ou du genre des caractères
    photoTitleInputField.addEventListener("input", () => {
        const titleInput = photoTitleInputField.value;
        const regex = /^[a-zA-Z0-9.&_-]+$/;
        if (!regex.test(photoTitleInputField.value)) {
            photoTitleErrorMessageAlphaNum.style.color = "red";
            modalSubmitButtonDisabled();
        } else {
            photoTitleErrorMessageAlphaNum.style.color = "green";
            modalSubmitButtonEnabled();
        }

        if (titleInput.length >= 4) {
            photoTitleErrorMessageCount.style.color = "green";
        } else {
            photoTitleErrorMessageCount.style.color = "red";
            modalSubmitButtonDisabled();
        }
    });

    fileSelectionAndTest();
}

function hideAddPhoto () {
    modalAddPhoto.style.display = "none";
    modalReturnButton.style.display = "none";
    modalSubmitButton.style.display = "none";

    photoTitleInputField.value = "";
    selectedFile = null;
    modalPicturePreview.innerHTML = "";
    modalPicturePreview.style.display = "none";

    modalReturnButton.removeEventListener("click", () => displayPhotoGallery);
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
            return;
        }

        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${UserToken}`
            }
        });

        if (response.ok) {
            displayModalMessage("Carte effacée !", false);
        } else {
            displayModalMessage("L'effacement de la carte a échouée !<br>( status: " + response.statusText + ", code: " + response.status + " )", true);
        }
    } catch (error) {
        displayModalMessage("Erreur du serveur : " + error, true);
    }

    updateAllGallery();
}

export async function updateAllGallery () {
    // mets à jour les 2 gallerieS à partir d'un new fetch de la liste du server
    if (await fetchCards()) {
        buildModalGalleryCards();
        updatePortfolioCardsList();
    }
}

// -- Ajout d'une image -----------------------------------------------------------------

export function formHandler () {
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

async function submitForm (modalRealHiddenAddPictureButton, photoTitleInputField, categoryDropdown) {
    // if (modalSubmitButton.disabled === true) { return; }

    const formData = new FormData();
    formData.append("image", modalRealHiddenAddPictureButton.files[0]);
    formData.append("title", photoTitleInputField.value);
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
            displayModalMessage("La création de la carte a réussie !", false);

            displayAddPhoto();
        } else {
            displayModalMessage("La création de la carte a échouée !<br> ( status: " + response.statusText + ", code: " + response.status + " )", true);
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

        // display the thumbail
        const imageUrl = URL.createObjectURL(selectedFile);
        modalPicturePreview.style.display = "flex";
        modalPicturePreview.src = imageUrl;
        modalPicturePreview.style.maxHeight = "169px";
        modalPicturePreview.style.width = "auto";

        // hide helpers
        modalImg.style.display = "none";
        modalAddPhotoButton.style.display = "none";
        modalInstructions.style.display = "none";
    });
}
