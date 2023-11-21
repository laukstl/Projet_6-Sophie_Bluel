import { createButton } from "./button.js";

let modalGalleryContainer = null;

export function modalWindow () {
    // Création du conteneur du modal
    const modalContainer = document.getElementById("modalContainer");
    modalContainer.style["z-index"] = "9999";
    modalContainer.style.Height = "688px";
    modalContainer.style.maxWidth = "630px";
    modalContainer.style.backgroundColor = "#fFf";
    modalContainer.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.25)";
    modalContainer.style.borderRadius = "10px";
    modalContainer.style.position = "absolute";
    modalContainer.style.margin = "auto";
    modalContainer.style.top = "400px";
    modalContainer.style.left = "0";
    modalContainer.style.right = "0";
    modalContainer.style.display = "flex";
    modalContainer.style.flexDirection = "column";
    modalContainer.style.alignItems = "center";

    // Bouton de retour -- Uniquement sur Ajout photo
    // const modalReturnButton = document.createElement("img");
    // modalReturnButton.src = "./assets/icons/arrow-left.svg";
    // modalReturnButton.style.height = "21px";
    // modalReturnButton.style.width = "21px";
    // modalReturnButton.style.position = "absolute";
    // modalReturnButton.style.top = "30px";
    // modalReturnButton.style.left = "30px";
    // modalReturnButton.style.cursor = "pointer";
    // modalContainer.appendChild(modalReturnButton);

    // Bouton de fermeture
    const modalCloseButton = document.createElement("img");
    modalCloseButton.src = "./assets/icons/close.svg";
    modalCloseButton.style.height = "12px";
    modalCloseButton.style.width = "12px";
    modalCloseButton.style.position = "absolute";
    modalCloseButton.style.top = "30px";
    modalCloseButton.style.right = "30px";
    modalCloseButton.style.cursor = "pointer";
    modalContainer.appendChild(modalCloseButton);

    // Titre
    const modalTitle = document.createElement("h3");
    modalTitle.innerText = "Galerie photo";
    modalTitle.style.fontFamily = "Work Sans";
    modalTitle.style.fontSize = "26px";
    modalTitle.style.marginTop = "60px";
    modalContainer.appendChild(modalTitle);

    // Conteneur de la gallerie d'images
    modalGalleryContainer = document.createElement("div");
    modalGalleryContainer.style.display = "grid";
    modalGalleryContainer.style["grid-template-columns"] = "1fr 1fr 1fr 1fr 1fr";
    modalGalleryContainer.style["grid-column-gap"] = "20px";
    modalGalleryContainer.style["grid-row-gap"] = "20px";
    modalGalleryContainer.style.margin = "60px 105px";
    modalContainer.appendChild(modalGalleryContainer);

    // Trait horizontal de séparation
    const modalHorizontalLine = document.createElement("div");
    modalHorizontalLine.style.width = "420px";
    modalHorizontalLine.style.height = "20px";
    modalHorizontalLine.style.borderBottom = "1px solid #B3B3B3";
    modalContainer.appendChild(modalHorizontalLine);

    // Bouton de submission du formulaire
    const modalSubmitButton = createButton(modalContainer, "237px", 'Ajouter une photo', true);
    // modalSubmitButton.style.textAlign = "center";
    modalSubmitButton.style.margin = "50px";

       // juste pour test
    modalSubmitButton.innerText = "Click!";
    modalSubmitButton.addEventListener("click", () => { modalContainer.style.display = "none"; });
} // modalWindow ()

export { modalGalleryContainer };
