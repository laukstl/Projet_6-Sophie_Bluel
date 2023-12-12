import { createButton } from "./button.js";

export let loginContainer, loginButton; // TO: main-handler
export let emailInput, passwordInput, loginErrorMessage; // TO: login-handler

export function buildLoginWindow () { // TO: main-handler
    // création section LOGIN
    const login = document.createElement("form");
    loginContainer = document.getElementById("loginContainer");
    loginContainer.style.display = "none";
    login.id = "login";
    login.style.display = "flex";
    login.style["flex-direction"] = "column";
    login.style["align-items"] = "center";
    login.style.gap = "30px";
    login.style.top = "130px";
    login.style.height = "872px";
    login.style.position = "relative";
    loginContainer.appendChild(login);

    // Titre - section LOGIN
    const loginTitle = document.createElement("h2");
    loginTitle.innerText = "Log In";
    login.appendChild(loginTitle);

    // <p> pour message d'erreur - section LOGIN
    loginErrorMessage = document.createElement("p");
    loginErrorMessage.style.color = "red";
    login.appendChild(loginErrorMessage);

    // Container de l'input Email - section LOGIN
    const emailContainer = document.createElement("div");
    emailContainer.style.display = "flex";
    emailContainer.style["flex-direction"] = "column";
    emailContainer.style["align-items"] = "flex-start";
    emailContainer.style.gap = "7px";
    login.appendChild(emailContainer);
    // input Email - section LOGIN
    const emailLabel = document.createElement("label");
    emailLabel.innerText = "E-mail";
    emailLabel.style["font-weight"] = "500";
    emailLabel.style.color = "#3D3D3D";
    emailContainer.appendChild(emailLabel);
    emailInput = document.createElement("input");
    emailInput.autocomplete = "email";
    emailInput.id = "login_email_id";
    emailInput.type = "email";
    emailInput.style["font-size"] = "20px";
    emailInput.style["text-align"] = "center";
    emailInput.style.width = "379px";
    emailInput.style.height = "51px";
    emailInput.style.border = "0px";
    emailInput.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";
    emailContainer.appendChild(emailInput);

    // container de l'input Password - section LOGIN
    const passwordContainer = document.createElement("div");
    passwordContainer.style.display = "flex";
    passwordContainer.style["flex-direction"] = "column";
    passwordContainer.style["align-items"] = "flex-start";
    passwordContainer.style.gap = "7px";
    login.appendChild(passwordContainer);
    // input Password - section LOGIN
    const passwordLabel = document.createElement("label");
    passwordLabel.innerText = "Mot de passe";
    passwordLabel.style["font-weight"] = "500";
    passwordLabel.style.color = "#3D3D3D";
    passwordContainer.appendChild(passwordLabel);
    passwordInput = document.createElement("input");
    passwordInput.autocomplete = "current-password";
    passwordInput.id = "login_password_id";
    passwordInput.type = "password";
    passwordInput.style["font-size"] = "20px";
    passwordInput.style["text-align"] = "center";
    passwordInput.style.width = "379px";
    passwordInput.style.height = "51px";
    passwordInput.style.border = "0px";
    passwordInput.style.filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.1))";
    passwordContainer.appendChild(passwordInput);

    // Bouton de submit - section LOGIN
    loginButton = createButton(login, "180px", "Se connecter", true);
    loginButton.style.height = "36px";
    loginButton.style.fontSize = "14px";

    // Lien mot de passe oublié - section LOGIN
    const linkPwdForgotten = document.createElement("a");
    linkPwdForgotten.setAttribute("href", "#");
    linkPwdForgotten.innerText = "Mot de passe oublié";
    linkPwdForgotten.style.color = "#3D3D3D";
    linkPwdForgotten.style["font-weight"] = "500";
    login.appendChild(linkPwdForgotten);
} // buildLoginWindow ()
