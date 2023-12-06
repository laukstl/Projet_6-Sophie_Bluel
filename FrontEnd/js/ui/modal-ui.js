import * as color from "./colors.js";

import { createButton } from "./button.js";

import { generalVar } from "../../script.js";

import {
    deleteCard,
    formHandler
} from "../modal-handler.js";

export let modalWindow, modalReturnButton, modalTitle, modalCloseButton, modalMessageContainer, modalGallery, modalAddPhoto, modalSubmitButton, modalGalleryButton;
export let photoTitleInputField, photoTitleErrorMessageCount, photoTitleErrorMessageAlphaNum, categoryDropdown;
export let modalAddPhotoButton, modalRealHiddenAddPictureButton;
export let modalInstructions, modalPicturePreview, modalImg;

export function buildModalWindow () {
    // -- Container global de la modale -------------------------------------------------

    modalWindow = document.getElementById("modalWindow");
    modalWindow.id = "modalWindow";
    modalWindow.style["z-index"] = "1";
    modalWindow.style.Height = "688px";
    modalWindow.style.maxWidth = "630px";
    modalWindow.style.backgroundColor = "#fFf";
    modalWindow.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.25)";
    modalWindow.style.borderRadius = "10px";
    modalWindow.style.position = "absolute";
    modalWindow.style.margin = "auto";
    modalWindow.style.top = "400px";
    modalWindow.style.left = "0";
    modalWindow.style.right = "0";
    modalWindow.style.display = "none";
    modalWindow.style.flexDirection = "column";
    modalWindow.style.alignItems = "center";

    // -- Flèche de retour -- ( Uniquement sur Ajout photo ) ----------------------------

    modalReturnButton = document.createElement("img");
    modalReturnButton.style.display = "none";
    modalReturnButton.src = "./assets/icons/arrow-left.svg";
    modalReturnButton.style.height = "21px";
    modalReturnButton.style.width = "21px";
    modalReturnButton.style.position = "absolute";
    modalReturnButton.style.top = "30px";
    modalReturnButton.style.left = "30px";
    modalReturnButton.style.cursor = "pointer";
    modalWindow.appendChild(modalReturnButton);

    // -- Bouton en haut à droite pour close --------------------------------------------

    modalCloseButton = document.createElement("img");
    modalCloseButton.src = "./assets/icons/close.svg";
    modalCloseButton.style.height = "12px";
    modalCloseButton.style.width = "12px";
    modalCloseButton.style.position = "absolute";
    modalCloseButton.style.top = "30px";
    modalCloseButton.style.right = "30px";
    modalCloseButton.style.cursor = "pointer";
    // le close est géré dans modalClickHandler de script.js
    modalWindow.appendChild(modalCloseButton);

    // -- Titre de la modale ------------------------------------------------------------

    modalTitle = document.createElement("h3");
    modalTitle.id = "modalTitle";
    modalTitle.style.fontFamily = "Work Sans";
    modalTitle.style.fontSize = "26px";
    modalTitle.style.marginTop = "60px";
    modalWindow.appendChild(modalTitle);
    modalWindow.setAttribute("aria-describedby", "modalTitle");

    // -- Messages d'informations/erreurs de la modale ----------------------------------

    modalMessageContainer = document.createElement("div");
    modalMessageContainer.style.display = "none";
    modalMessageContainer.style.position = "absolute";
    modalMessageContainer.style.top = "95px";
    modalMessageContainer.style.alignItems = "center";
    modalMessageContainer.style.justifyContent = "center";
    modalMessageContainer.style.padding = "5px";

    modalWindow.appendChild(modalMessageContainer);

/*
 ---------------------------------------------------
 -- page  de la Gallerie ----------------------------------------------------------------
 ---------------------------------------------------
*/

    // -- Container de la Gallerie d'images miniatures ----------------------------------

    modalGallery = document.createElement("div");
    modalGallery.style["grid-template-columns"] = "1fr 1fr 1fr 1fr 1fr";
    modalGallery.style["grid-column-gap"] = "20px";
    modalGallery.style["grid-row-gap"] = "20px";
    // modalGallery.style.margin = "30px 105px 60px 105px";
    modalGallery.style.margin = "60px 105px";
    modalWindow.appendChild(modalGallery);
    modalGallery.style.display = "none";

/*
 ---------------------------------------------------
 -- page Ajouter une photo ------------------------------------------------------------
 ---------------------------------------------------
*/

    // -- Container de la page addPhoto -------------------------------------------------

    modalAddPhoto = document.createElement("div");
    modalAddPhoto.style.display = "none"; // Pas utile, mais par principe
    modalAddPhoto.style.margin = "60px 105px";
    modalAddPhoto.style.display = "flex";
    modalAddPhoto.style.flexDirection = "column";
    modalAddPhoto.style.gap = "20px";
    modalWindow.appendChild(modalAddPhoto);

    // -- Container pour la sélection d'une photo ---------------------------------------

    const modalPhotoContainer = document.createElement("div");
    modalPhotoContainer.style.display = "flex";
    modalPhotoContainer.style.flexDirection = "column";
    modalPhotoContainer.style.alignItems = "center";
    modalPhotoContainer.style.justifyContent = "center";
    modalPhotoContainer.style.gap = "10px";
    modalPhotoContainer.style.width = "420px";
    modalPhotoContainer.style.height = "169px";
    modalPhotoContainer.style.backgroundColor = "#E8F1F6";
    modalPicturePreview = document.createElement("img");
    modalPicturePreview.style.display = "none";
    modalPhotoContainer.appendChild(modalPicturePreview);
    modalAddPhoto.appendChild(modalPhotoContainer);

    // l'image de démonstration
    modalImg = document.createElement("img");
    modalImg.src = "./assets/icons/picture.svg";
    modalPhotoContainer.appendChild(modalImg);

    // le bouton "+ Ajouter photo"
    modalAddPhotoButton = document.createElement("button");
    modalRealHiddenAddPictureButton = document.createElement("input");
    modalRealHiddenAddPictureButton.type = "file";
    modalRealHiddenAddPictureButton.accept = ".jpg, .png";
    modalRealHiddenAddPictureButton.style.display = "none";
    modalAddPhotoButton.style.borderRadius = "60px";
    modalAddPhotoButton.style.backgroundColor = "#CBD6DC";
    modalAddPhotoButton.style.border = "#CBD6DC";
    modalAddPhotoButton.style.padding = "8px 15px";
    modalAddPhotoButton.style.width = "173px";
    modalAddPhotoButton.style.height = "36px";
    modalAddPhotoButton.style.cursor = "pointer";
    modalAddPhotoButton.style.fontFamily = "Work Sans";
    modalAddPhotoButton.style.fontWeight = "500";
    modalAddPhotoButton.style.fontSize = "14px";
    modalAddPhotoButton.style.color = "#306685";
    modalAddPhotoButton.textContent = "+ Ajouter photo";
    modalAddPhotoButton.addEventListener("click", () => modalRealHiddenAddPictureButton.click());
    modalPhotoContainer.appendChild(modalAddPhotoButton);
    modalPhotoContainer.appendChild(modalRealHiddenAddPictureButton);

    // les instructions de formats acceptés
    modalInstructions = document.createElement("div");
    modalInstructions.innerText = "jpg, png : 4mo max";
    modalInstructions.style.color = "#444444";
    modalPhotoContainer.appendChild(modalInstructions);

    // -- Formulaire d'ajout de photo ---------------------------------------------------

    // const modalFormContainer = document.createElement("form");
    // Titre
    const photoTitleContainer = document.createElement("div");
    photoTitleContainer.style.display = "flex";
    photoTitleContainer.style.position = "relative";
    const photoTitleLabel = document.createElement("label");
    photoTitleLabel.innerText = "Titre";
    photoTitleLabel.style.color = "#3D3D3D";

    photoTitleErrorMessageCount = document.createElement("div");
    photoTitleErrorMessageCount.style.marginLeft = "45px";
    photoTitleErrorMessageCount.style.position = "absolute";
    photoTitleErrorMessageCount.style.top = "-7px";
    photoTitleErrorMessageCount.style.color = "lightgrey";
    photoTitleErrorMessageCount.innerText = "Minimum 4 caractères";
    photoTitleErrorMessageAlphaNum = document.createElement("div");
    photoTitleErrorMessageAlphaNum.style.marginLeft = "45px";
    photoTitleErrorMessageAlphaNum.style.position = "absolute";
    photoTitleErrorMessageAlphaNum.style.top = "7px";
    photoTitleErrorMessageAlphaNum.style.color = "lightgrey";
    photoTitleErrorMessageAlphaNum.innerText = "Chiffres, lettres, et caractères - . & _ autorisés";

    photoTitleContainer.appendChild(photoTitleLabel);
    photoTitleContainer.appendChild(photoTitleErrorMessageCount);
    photoTitleContainer.appendChild(photoTitleErrorMessageAlphaNum);

    photoTitleInputField = document.createElement("input");
    photoTitleInputField.style.height = "51px";
    photoTitleInputField.style.color = "#3D3D3D";
    photoTitleInputField.style.paddingLeft = "16px";
    photoTitleInputField.style.boxShadow = "0px 4px 14px rgba(0, 0, 0, 0.09)";
    photoTitleInputField.style.border = "none";
    // Catégorie
    const categoryLabel = document.createElement("label");
    categoryLabel.innerText = "Catégorie";
    categoryLabel.style.color = "#3D3D3D";
    categoryDropdown = document.createElement("select");
    categoryDropdown.style.height = "51px";
    categoryDropdown.style.color = "#3D3D3D";
    categoryDropdown.style.paddingLeft = "16px";
    categoryDropdown.style.boxShadow = "0px 4px 14px rgba(0, 0, 0, 0.09)";
    categoryDropdown.style.border = "none";

    formHandler();

    modalAddPhoto.appendChild(photoTitleContainer);
    modalAddPhoto.appendChild(photoTitleInputField);
    modalAddPhoto.appendChild(categoryLabel);
    modalAddPhoto.appendChild(categoryDropdown);

    // -- Trait horizontal de séparation ------------------------------------------------

    const modalHorizontalLine = document.createElement("div");
    modalHorizontalLine.style.width = "420px";
    modalHorizontalLine.style.height = "20px";
    modalHorizontalLine.style.borderBottom = "1px solid #B3B3B3";
    modalWindow.appendChild(modalHorizontalLine);

    // -- Bouton-lien vers la page d'ajout de photo -------------------------------------

    modalGalleryButton = createButton(modalWindow, "237px", "Ajouter une photo", true);
    modalGalleryButton.style.margin = "50px";

    // -- Bouton de submission du formulaire --------------------------------------------

    modalSubmitButton = createButton(modalWindow, "237px", "envoyer", true);
    modalSubmitButton.style.margin = "50px";
}

export function modalSubmitButtonEnabled () {
    modalSubmitButton.style.background = color.green;
    modalSubmitButton.style.border = `1px solid ${color.green}`;
    modalSubmitButton.disabled = false;
    modalSubmitButton.style.cursor = "pointer";
}

export function modalSubmitButtonDisabled () {
    modalSubmitButton.style.background = color.grey;
    modalSubmitButton.style.border = `1px solid ${color.grey}`;
    modalSubmitButton.disabled = true;
    modalSubmitButton.style.cursor = "not-allowed";
}

// Affichage les images dans la gallerie du modal en fonction de cardsList ( donc idem à l'autre gal )
export function buildModalGalleryCards () {
    const cardsList = generalVar.cardsList;
    // clean gallery
    modalGallery.innerHTML = "";

    if (generalVar.cardsList.length === 0) {
        const modalPreErrorMessage = document.createElement("p");
        modalPreErrorMessage.innerHTML = "OU";
        modalPreErrorMessage.style.color = "white";
        modalPreErrorMessage.style.fontSize = "60px";
        modalPreErrorMessage.style.padding = "10px";
        modalPreErrorMessage.style.border = "1px solid white";
        modalPreErrorMessage.style.width = "100%";
        modalPreErrorMessage.style.textAlign = "center";
        modalPreErrorMessage.style.backgroundColor = "#0E2F28";

        const modalErrorMessage = document.createElement("p");
        modalErrorMessage.innerHTML = "La liste des images est actuellement vide!";
        modalErrorMessage.style.color = "white";
        modalErrorMessage.style.padding = "10px";
        modalErrorMessage.style.border = "1px solid white";
        modalErrorMessage.style.width = "100%";
        modalErrorMessage.style.textAlign = "center";
        modalErrorMessage.style.backgroundColor = "#0E2F28";

        const modalPostErrorMessage = document.createElement("p");
        modalPostErrorMessage.innerHTML = "PS";
        modalPostErrorMessage.style.color = "white";
        modalPostErrorMessage.style.fontSize = "60px";
        modalPostErrorMessage.style.padding = "10px";
        modalPostErrorMessage.style.border = "1px solid white";
        modalPostErrorMessage.style.width = "100%";
        modalPostErrorMessage.style.textAlign = "center";
        modalPostErrorMessage.style.backgroundColor = "#0E2F28";

        modalGallery.appendChild(modalPreErrorMessage);
        modalGallery.appendChild(modalErrorMessage);
        modalGallery.appendChild(modalPostErrorMessage);
    } else {
        cardsList.forEach(item => {
            const card = document.createElement("div");
            card.style.position = "relative";
            modalGallery.appendChild(card);

                const img = document.createElement("img");
                img.src = item.imageUrl;
                img.style.width = "100%";
                card.appendChild(img);

                const trashIconContainer = document.createElement("div");
                trashIconContainer.style.position = "absolute";
                trashIconContainer.style.top = "5px";
                trashIconContainer.style.right = "5px";
                trashIconContainer.style.height = "17px";
                trashIconContainer.style.width = "17px";
                trashIconContainer.style.textAlign = "center";
                trashIconContainer.style.lineHeight = "17px";
                trashIconContainer.style.background = "black";
                trashIconContainer.style.cursor = "pointer";
                trashIconContainer.addEventListener("click", (event) => { deleteCard(item); });
                card.appendChild(trashIconContainer);

                    const trashIcon = document.createElement("img");
                    trashIcon.setAttribute("src", "./assets/icons/trashcan.svg");
                    trashIcon.style.height = "11px";
                    trashIcon.style.width = "9px";
                    trashIconContainer.appendChild(trashIcon);
        });
    }
} // buildModalGalleryCards (cards)

// -- Affichage des messages/erreurs de la modale ---------------------------------------

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
    setTimeout(() => {
        modalMessageContainer.style.display = "none";
    }, 7500);
}
