import * as color from "./colors.js";

export function cssTweak () {
    const body = document.querySelector("body");
    body.style.backgroundColor = color.offWhite;
    body.style.maxWidth = "1440px";

    document.querySelector("header h1").style.marginBottom = "4px";

    const header = document.querySelector("header");
    header.style.padding = "0px 150px";

    const logoSpanTxt = document.querySelector("#logoContainer > span");
    logoSpanTxt.style.color = color.darkOrange;
    logoSpanTxt.style.fontSize = "10px";

    const linksNav = document.querySelectorAll("nav a");
    linksNav.forEach(link => {
        link.style.textDecoration = "none";
        link.style.color = "black";
    });

    const liElements = document.querySelectorAll("li");
    liElements.forEach(link => {
        link.style.marginRight = "25px";
        link.addEventListener("mouseenter", () => {
            link.style.fontWeight = "600";
        });
        link.addEventListener("mouseleave", () => {
            link.style.fontWeight = "normal";
        });
    });

    document.querySelector("li img").style.width = "22px";

    const main = document.querySelector("main");
    main.style.position = "relative";
    main.style.padding = "0px 250px";

    document.getElementById("nav__login").style.cursor = "pointer";
    document.getElementById("nav__login").style.color = "#000000";

    document.querySelector("figure img").style.width = "474px";
    document.querySelector("figure img").style.marginRight = "75px";
    document.querySelector("article").style.maxWidth = "400px";
    document.querySelector("article").style.marginRight = "75px";
    document.querySelector("article").style.color = "#3D3D3D";

    const category = document.querySelector(".category");
    category.style.textAlign = "center";
    category.style.marginBottom = "50px"; // STRANGE

    const contactTextAccroche = document.querySelector("#contact p");
    contactTextAccroche.style.color = "#3D3D3D";
    contactTextAccroche.style.fontSize = "16px";

    const contactFormTexts = document.querySelectorAll("form label");
    contactFormTexts.forEach(txt => {
        txt.style.color = "#3D3D3D";
    });

    const form = document.querySelector("form");
    form.style.paddingLeft = "50px";

    const contactButton = document.querySelector("#contact .btn");
    contactButton.style.height = "36px";
    contactButton.style.maxWidth = "180px";
    contactButton.style.fontSize = "14px";
    contactButton.style.marginLeft = "100px";

    const contactInputs = document.querySelectorAll("#contact input");
    contactInputs.forEach(zone => {
        zone.style.width = "380px";
        });
    const contactTextarea = document.querySelector("#contact textarea");
    contactTextarea.style.width = "380px";

    const footerTexts = document.querySelector("footer li");
    footerTexts.style.color = "#3D3D3D";
}
