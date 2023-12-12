import * as color from "./colors.js";

/*
    function createButton (container, width, text, reverseColor) {}
    .
    container : the container where the button will be added (*required)
    width : the width of the button
    text : the text of the button
    reverseColor : reverse de color of the button true/false
*/

export function createButton (container, width = null, text = "Click!", reverseColor = false) {
    const button = document.createElement("button");
    button.classList.add("button");

    let primaryColor = color.white;
    let secondaryColor = color.green;

    if (reverseColor) {
        primaryColor = color.green;
        secondaryColor = color.white;
    }

    button.type = "button";

    button.style.background = primaryColor;
    button.style.color = secondaryColor;

    button.style.borderRadius = "60px";
    button.style.border = `1px solid ${color.green}`;
    button.style.padding = "8px 15px";
    button.style.width = width;
    button.style.minWidth = "100px";
    button.style.cursor = "pointer";
    button.style.fontFamily = "Syne";
    button.style.fontWeight = "700";
    button.style.fontSize = "16px";
    button.textContent = text; // ?? "Click!";

    // gestion des comportements souris/bouton - Click/Moove
    let isMouseInside = false;
    let isMouseDown = false;

    button.addEventListener("mousedown", () => {
        if (isMouseInside) {
            button.style.background = color.darkGreen;
            button.style.color = color.white;
            isMouseDown = true;
        }
    });

    button.addEventListener("mouseup", () => {
        if (isMouseDown) {
            button.style.background = primaryColor;
            button.style.color = secondaryColor;
            isMouseDown = false;
        }
    });

    button.addEventListener("mouseenter", () => {
        if (isMouseDown) {
            button.style.background = color.darkGreen;
            button.style.color = color.white;
        }
        isMouseInside = true;
    });

    button.addEventListener("mouseleave", () => {
        if (isMouseDown) {
            button.style.background = primaryColor;
            button.style.color = secondaryColor;
        }
        isMouseInside = false;
    });

    container.appendChild(button);

    return button;
} // createButton (...)
