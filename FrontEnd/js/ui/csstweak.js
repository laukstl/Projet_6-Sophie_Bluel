import * as color from "./colors.js";

export function cssTweak () {
    document.querySelector("body").style.backgroundColor = color.offWhite;

    document.querySelector("header h1").style.marginBottom = "4px";

    document.querySelector("#logoContainer > span").style.color = color.darkOrange;

    const linksNav = document.querySelectorAll("nav a");
    linksNav.forEach(link => {
        link.style.textDecoration = "none";
        link.style.color = "black";
    });

    // document.querySelector("li:hover").style.fontWeight = "600";
    const liElements = document.querySelectorAll("li");
    liElements.forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.fontWeight = "600";
        });
    link.addEventListener("mouseleave", () => {
            link.style.fontWeight = "normal";
        });
    });

    document.querySelector("li img").style.width = "22px";

    document.querySelector("main").style.position = "relative";

    document.getElementById("nav__login").style.cursor = "pointer";
    document.getElementById("nav__login").style.color = "inherit";

    document.getElementById("portfolioTitle").style.marginTop = "130px";

    const category = document.querySelector(".category");
    category.style.textAlign = "center";
    category.style.margin = "auto";
    category.style.marginBottom = "50px"; // STRANGE
}
