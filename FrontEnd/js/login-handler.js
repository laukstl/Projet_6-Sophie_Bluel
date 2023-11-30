import {
    loginErrorMessage // <p>
} from "./ui/login-ui.js";

let userId = null;
let userToken = null;

export async function checkLogin () {
    // Valeurs pour tests
    const userData = {
        email: "sophie.bluel@test.tld",
        password: "S0phie"
    };
    // const userData = {
    //     email: emailInput.value,
    //     password: passwordInput.value
    // };

    // Vérification de la bonne forme de l'email
    if (userData.email.trim() === "") { // Test champ vide
        loginErrorMessage.innerText = "Le champ email ne peut pas être vide";
        return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!emailRegex.test(userData.email)) { // Test conformormité au Regex
        loginErrorMessage.innerText = "Entrez une adresse E-mail valide";
        return;
    }

    // Vérification de la bonne forme du mot de passe
    if (userData.password.length < 5) {
        loginErrorMessage.innerText = "Le mot de passe doit contenir au moins 5 caractères";
        return;
    }

    try {
        const responseLogin = await fetch("http://localhost:5678/api/users/login", {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json"
                                            },
                                            body: JSON.stringify(userData)
                                        });

        const response = await responseLogin.json();

        if (responseLogin.ok) {
            userId = response.userId;
            userToken = response.token;

            window.localStorage.setItem("userID", userId);
            window.localStorage.setItem("tokenID", userToken);

            return true;
        } else {
            if (responseLogin.status === 401) {
                loginErrorMessage.innerText = "Erreur: Mot de passe éroné";
                const passwordInputField = document.getElementById('login_password_id');
                passwordInputField.focus();
            } else if (responseLogin.status === 404) {
                loginErrorMessage.innerText = "Erreur: Utilisateur non trouvé";
                const userInputField = document.getElementById('login_email_id');
                userInputField.focus();
            }
        }
    } catch (error) {
        console.error("Une erreur est survenue ( " + error + " )");
    }
} // checkLogin ()
