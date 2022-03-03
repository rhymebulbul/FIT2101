/*
This is the JavaScript file containing the logic for the adminLogin.html webpage.
Created by Josiah Schuller
*/

// Connect to Firebase realtime database
let databaseData;
const firebaseConfig = {
    apiKey: "AIzaSyDImRxY3Kabi9AXhPG5E60esGdeREPN48E",
    authDomain: "fit2101-2f82e.firebaseapp.com",
    databaseURL: "https://fit2101-2f82e-default-rtdb.firebaseio.com",
    projectId: "fit2101-2f82e",
    storageBucket: "fit2101-2f82e.appspot.com",
    messagingSenderId: "182542596921",
    appId: "1:182542596921:web:a4a6ef412ce05b007206e8"
};
let passwordRef;
try {
    firebase.initializeApp(firebaseConfig);
    passwordRef = firebase.database().ref("adminCredentials");
    passwordRef.on("value", snapshot => databaseData = snapshot.val());
} catch (error) {
    console.log(error);
}


function login() {
    /*
    This function is called when the LOGIN button is pressed.
    If the user inputted a correct username and password, then they will be directed to the admin page.
    */
    let usernameRef = document.getElementById("username");
    let passwordRef = document.getElementById("password");
    let username = usernameRef.value.trim();
    let password = passwordRef.value.trim();
    let snackbarContainer = document.querySelector('#snackbar'); // Snackbar
    let snackbarMessage = {};

    if (!(username == "" || password == "")) {
        // Inputs are given
        for (let property in databaseData) {
            if (username === property && password === databaseData[property]) {
                // Username and password are correct
                updateLocalStorage("adminUsername", username);
                window.location = "admin.html?#";
                return false;
            }
        }
        snackbarMessage = { message: "Username and/or password are incorrect" };
        snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
    } else {
        // Bad inputs
        snackbarMessage = { message: "Please enter a username and password" };
        snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
    }
}