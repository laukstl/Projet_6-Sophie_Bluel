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

    modalAddPhotoButton,
    modalRealHiddenAddPictureButton,

    modalPicturePreview,
    modalImg,
    modalInstructions,

    photoTitleInputField,
    photoTitleErrorMessageCount,
    photoTitleErrorMessageAlphaNum,
    categoryDropdown,

    modalSubmitButtonEnabled,
    modalSubmitButtonDisabled,

    displayModalMessage
} from "./ui/modal-ui.js";

import {
    generalVar,
    fetchCards
} from "../script.js";

import {
    updatePortfolioCardsList // func
} from "./main-handler.js";

let selectedFile;

// -- Gestion affichage de la gallery de la modale --------------------------------------

function displayPhotoGallery () {
    // modalMessageContainer.innerHTML = "";
    hideAddPhoto();

    modalTitle.innerText = "Galerie photo";

    modalGallery.style.display = "grid";
    modalWindow.style.display = "flex";

    modalButtonHandler("gal");
}

function hidePhotogalery () {
    modalGallery.style.display = "none";
}

// -- Gestion de l'affichage de la page d'ajout de photo de la modale -------------------

function displayAddPhoto () {
    // modalMessageContainer.innerHTML = "";
    hidePhotogalery();

    modalTitle.innerText = "Ajout photo";

    modalReturnButton.style.display = "block";
    modalAddPhoto.style.display = "flex";

    // modalPicturePreview.innerHTML = "";
    // modalPicturePreview.style.display = "none";
    // photoTitleInputField.innerText = "";
    // selectedFile = null;

    modalImg.style.display = "block";
    modalAddPhotoButton.style.display = "block";
    modalInstructions.style.display = "block";

    // modalMessageContainer.style.display = "none";

    modalButtonHandler("no-gal");
    fileSelectionAndTest();
}

function hideAddPhoto () {
    modalAddPhoto.style.display = "none";
    modalReturnButton.style.display = "none";

    photoTitleInputField.value = "";
    selectedFile = null;
    modalPicturePreview.innerHTML = "";
    modalPicturePreview.style.display = "none";

    // modalReturnButton.removeEventListener("click", () => { displayPhotoGallery(); });

    // modalSubmitButton.removeEventListener("click", event => submitForm(modalRealHiddenAddPictureButton, photoTitleInputField, categoryDropdown));
    // modalSubmitButton.removeEventListener("click", event => console.log("CLICK!", event))
}

/*
 ---------------------------------------------------
 -- Show/Hide Modal ---------------------------------------------------------------------
 ---------------------------------------------------
*/

// -- Affichage de la modale ------------------------------------------------------------

const main = document.querySelector("main");

export function displayModal () {
    displayPhotoGallery();

    modalWindow.style.display = "flex";
    modalMessageContainer.style.display = "block";

    modalWindow.ariaHidden = "false";
    main.ariaHidden = "true";

    // setTimeout pour éviter que la func modalClickHandler ne soit immédiatement lancé au click d'ouverture
    // apparement, js propage l'eventListener en même temps qu'il affiche la fenêtre...
    // et comme on fait apparaitre la fenêtre avec un click, et qu'un click la ferme, ... clickclick
    setTimeout(() => document.addEventListener("click", modalClickHandler), 1); // 1 ms

    // stopPropagation permet d'éviter hideModal() (de modalClickHandler()) si on click sur trashIconContainer ou trashIcon
    // !modalWindow.contains(event.target) dans modalClickHandler() n'était pas suffisant
    modalWindow.addEventListener('click', function (event) { event.stopPropagation(); });

    modalCloseButton.addEventListener('click', () => hideModal()); // modalCloseButton

    modalReturnButton.addEventListener("click", () => { hideAddPhoto(); displayPhotoGallery(); }); // modalReturnButton

    document.addEventListener("keydown", modalKeydownHandler); // Escape
}

// -- Masquage de la modale -------------------------------------------------------------

export function hideModal () {
    document.removeEventListener("click", modalClickHandler);
    modalWindow.removeEventListener('click', function (event) { event.stopPropagation(); });
    modalCloseButton.removeEventListener('click', () => hideModal());
    // modalReturnButton.removeEventListener("click", () => { displayPhotoGallery(); });
    document.removeEventListener("keydown", modalKeydownHandler);

    modalWindow.style.display = "none";
    modalWindow.ariaHidden = "true";
    main.ariaHidden = "false";
}

// -- Fermeture de la modale si Click en dehors ou press Escape -------------------------

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

// changements et comportements du bouton transformiste "Ajouter une photo"/"envoyer"

function modalButtonHandler (window) {
    modalSubmitButton.removeEventListener("click", event => console.log("CLICK!", event));
    modalSubmitButton.removeEventListener("click", () => displayAddPhoto());

    // changement du comportement du bouton en toggle "valider"/"ajouter une photo"
    if (window === "gal") {
        // "ajouter une photo"
        modalSubmitButton.innerText = "Ajouter une photo";
        modalSubmitButton.addEventListener("click", () => displayAddPhoto());
        modalSubmitButtonEnabled();
    } else {
        // "valider"
        modalSubmitButton.innerText = "valider";
        modalSubmitButtonDisabled();

        modalSubmitButton.removeEventListener("click", () => displayAddPhoto());

        // modalSubmitButton.addEventListener("click", event => submitForm(modalRealHiddenAddPictureButton, photoTitleInputField, categoryDropdown));
        console.log("Ffiiiizz !");
        modalSubmitButton.addEventListener("click", event => console.log("CLICK!", event));
    }

    // changement du comportement du bouton en fonction du nombre de charactère dans l'inputField
    // changement de couleur des aides pou l'InputField par validation du nombre ou du genre des caractères
    photoTitleInputField.addEventListener("input", () => {
        const titleInput = photoTitleInputField.value;
        const regex = /^[a-zA-Z0-9.&_-]+$/;
        if (!regex.test(photoTitleInputField.value)) {
            photoTitleErrorMessageAlphaNum.style.color = "red";
        } else {
            photoTitleErrorMessageAlphaNum.style.color = "green";
        }

        if (titleInput.length >= 4) {
            photoTitleErrorMessageCount.style.color = "green";
            modalSubmitButtonEnabled();
        } else {
            photoTitleErrorMessageCount.style.color = "red";
            modalSubmitButtonDisabled();
        }
    });
}

/*
async function submitForm (modalRealHiddenAddPictureButton, photoTitleInputField, categoryDropdown) {
    // if (modalSubmitButton.disabled === true) { return; }
    console.log(modalRealHiddenAddPictureButton.files[0], photoTitleInputField.value, categoryDropdown.value);
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

            // reinitAddPhoto();
            displayAddPhoto(); // NOTE: MMMMHHHHHHHHHHHHHHHHHHH
        } else {
            displayModalMessage("La création de la carte a échouée !<br> ( status: " + response.statusText + ", code: " + response.status + " )", true);
        }
    } catch (error) {
        displayModalMessage("Erreur de serveur :<br>" + error, true);
    }
    updateAllGallery();
}
*/

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

        // modalMessageContainer.style.display = "none";

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
