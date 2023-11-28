import { createButton } from "./button.js";

export let modalGallery, modalWindow, modalCloseButton, modalAddPhoto, modalReturnButton, modalTitle, modalSubmitButton;

export function buildModalWindow () {
    console.log("buildModalWindow()");
    // -- Container global de la modale -------------------------------------------------

    modalWindow = document.getElementById("modalWindow");
    modalWindow.id = "modalWindow";
    modalWindow.style["z-index"] = "9999";
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
    modalReturnButton.style.display = "none"; // **************************
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
    modalTitle.style.fontFamily = "Work Sans";
    modalTitle.style.fontSize = "26px";
    modalTitle.style.marginTop = "60px";
    modalWindow.appendChild(modalTitle);

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
    modalAddPhoto.style.display = "none"; // **********************************
    modalAddPhoto.style.margin = "60px 105px";
    modalAddPhoto.style.display = "flex";
    modalAddPhoto.style.flexDirection = "column";
    modalAddPhoto.style.gap = "20px";
    modalWindow.appendChild(modalAddPhoto);

    // -- Trait horizontal de séparation ------------------------------------------------

    const modalPictureContainer = document.createElement("div");
    modalPictureContainer.style.display = "flex";
    modalPictureContainer.style.flexDirection = "column";
    modalPictureContainer.style.alignItems = "center";
    modalPictureContainer.style.justifyContent = "center";
    modalPictureContainer.style.gap = "10px";
    modalPictureContainer.style.width = "420px";
    modalPictureContainer.style.height = "169px";
    modalPictureContainer.style.backgroundColor = "#E8F1F6";
    modalAddPhoto.appendChild(modalPictureContainer);

    const modalImg = document.createElement("img");
    modalImg.src = "./assets/icons/picture.svg";
    modalPictureContainer.appendChild(modalImg);

    const modalAddPictureButton = document.createElement("button");
    modalAddPictureButton.style.borderRadius = "60px";
    modalAddPictureButton.style.backgroundColor = "#CBD6DC";
    modalAddPictureButton.style.border = "#CBD6DC";
    modalAddPictureButton.style.padding = "8px 15px";
    modalAddPictureButton.style.width = "173px";
    modalAddPictureButton.style.height = "36px";
    modalAddPictureButton.style.cursor = "pointer";
    modalAddPictureButton.style.fontFamily = "Work Sans";
    modalAddPictureButton.style.fontWeight = "500";
    modalAddPictureButton.style.fontSize = "14px";
    modalAddPictureButton.style.color = "#306685";
    modalAddPictureButton.textContent = "+ Ajouter photo";
    modalPictureContainer.appendChild(modalAddPictureButton);

    const modalInstructions = document.createElement("div");
    modalInstructions.innerText = "jpg, png : 4mo max";
    modalInstructions.style.color = "#444444";
    modalPictureContainer.appendChild(modalInstructions);

    // -- Formulaire d'ajout de photo ---------------------------------------------------

    // const modalFormContainer = document.createElement("form");
    const labelTitre = document.createElement("label");
    labelTitre.innerText = "Titre";
    labelTitre.style.color = "#3D3D3D";
    const inputTitre = document.createElement("input");
    inputTitre.style.height = "51px";
    inputTitre.style.boxShadow = "0px 4px 14px rgba(0, 0, 0, 0.09)";
    inputTitre.style.border = "none";
    const labelCategory = document.createElement("label");
    labelCategory.innerText = "Catégorie";
    labelCategory.style.color = "#3D3D3D";
    const inputCategory = document.createElement("input");
    inputCategory.style.height = "51px";
    inputCategory.style.boxShadow = "0px 4px 14px rgba(0, 0, 0, 0.09)";
    inputCategory.style.border = "none";

    modalAddPhoto.appendChild(labelTitre);
    modalAddPhoto.appendChild(inputTitre);
    modalAddPhoto.appendChild(labelCategory);
    modalAddPhoto.appendChild(inputCategory);

    // -- Trait horizontal de séparation ------------------------------------------------

    const modalHorizontalLine = document.createElement("div");
    modalHorizontalLine.style.width = "420px";
    modalHorizontalLine.style.height = "20px";
    modalHorizontalLine.style.borderBottom = "1px solid #B3B3B3";
    modalWindow.appendChild(modalHorizontalLine);

    // -- Bouton de submission du formulaire --------------------------------------------

    modalSubmitButton = createButton(modalWindow, "237px", "Ajouter une photo", true);
    modalSubmitButton.style.margin = "50px";
} // buildModalWindow ()
buildModalWindow();
