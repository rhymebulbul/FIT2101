/*
This is the JavaScript file containing the logic for the admin.html webpage.
Created by Josiah Schuller
*/

// On startup:
// Connect to Firebase realtime database
let databaseData;
let password = "";
const firebaseConfig = {
    apiKey: "AIzaSyDImRxY3Kabi9AXhPG5E60esGdeREPN48E",
    authDomain: "fit2101-2f82e.firebaseapp.com",
    databaseURL: "https://fit2101-2f82e-default-rtdb.firebaseio.com",
    projectId: "fit2101-2f82e",
    storageBucket: "fit2101-2f82e.appspot.com",
    messagingSenderId: "182542596921",
    appId: "1:182542596921:web:a4a6ef412ce05b007206e8"
};
let dbRef;
try {
    firebase.initializeApp(firebaseConfig);
    dbRef = firebase.database().ref();
    dbRef.on("value", snapshot => loadData(snapshot.val()));    
} catch (error) {
    console.log(error);
}


let adminUsername = retrieveData("adminUsername");
document.getElementById("usernameText").innerText = "Admin account: " + adminUsername;

/**
 * This method converts strings like "hello world" to "Hello World"
 * @param {} phrase The phrase to conver to Title Case 
 * @returns phrase, in Title Case
 */
 function toTitleCase(phrase){
    return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

function loadData(data) {
    /*
    This function loads the data from the database into the databaseData variable and loads the credential data into the credentialsData variable.
    Inputs:
    - data (object): an object of data from the online database
    */
    console.log(data);
    databaseData = data;
    displayDatabase(data);
}

function displayDatabase(data) {
    /*
    This function displays the data from the database onto the webpage.
    Inputs:
    - data (object): an object of data from the online database
    */
    let databaseDataRef = document.getElementById("databaseList");
    let htmlOutput = "";
    for (let databaseRegion in databaseData["lockdownRules"]) {
        if (databaseRegion != "placeholderRegion") {
            // Add a header for the region
            htmlOutput += `<h6 style="padding-left: 3%;font-family: 'Advent Pro', sans-serif; font-size: 25px; font-weight:bold">${toTitleCase(databaseRegion) + ":"}</h6>`;
            for (let i = 0; i < databaseData["lockdownRules"][databaseRegion].length; i++) {
                // Add each restriction from the region
                let restriction = databaseData["lockdownRules"][databaseRegion][i];
                htmlOutput += `
                <li class="mdl-list__item mdl-list__item--three-line" style="font-family: 'Advent Pro', sans-serif; font-size: 18px; font-weight:bold">
                <span class="mdl-list__item-primary-content">
                    <span>${restriction["title"]} - ${restriction["admin"]}</span><br>
                    <span class="mdl-list__item-sub-title" style='font-size:14px;font-weight:bold'>${restriction["description"]}</span><br>
                </span>
                <span class="mdl-list__item-secondary-content">
                    <a class="mdl-list__item-secondary-action" href="#" onclick="buttonRemoveRestriction('${restriction["title"]}', '${databaseRegion}')"><i class="material-icons" style="position: relative; color:black">delete</i></a>
                </span>
                </li><br>`;
            }
        }
    }
    databaseDataRef.innerHTML = htmlOutput;
}

function buttonRemoveRestriction(restrictionTitle, region) {
    /*
    This function is called when the delete button next to a restriction is called.
    This function will ask the user for confirmation before calling the adminRemoveRestriction function.
    Inputs:
    - restrictionTitle (string): The title of the restriction to be deleted
    - region (string): The region containing the restriction
    */
    if (confirm("Are you sure you want to delete this restriction?")) {
        adminRemoveRestriction(restrictionTitle, region)
    }
}


function addRestriction() {
    /*
    This function is called after the "Add Restriction" button is pressed.
    This function will check that the inputs are valid before calling the adminAddRestriction function.
    */
    let titleRef = document.getElementById("addTitle");
    let descriptionRef = document.getElementById("addDescription");
    let regionRef = document.getElementById("addRegion");
    let title = titleRef.value.trim();
    let description = descriptionRef.value.trim();
    let region = regionRef.value.trim();
    let snackbarContainer = document.querySelector('#snackbar'); // Snackbar
    let snackbarMessage = {};
    if (!(title == "" || description == "" || region == "")) {
        // Success
        snackbarMessage = { message: adminAddRestriction(title, description, region) };
        snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
        titleRef.value = "";
        descriptionRef.value = "";
        regionRef.value = "";
    } else {
        // Bad inputs
        snackbarMessage = { message: "Please enter the title, description and region" };
        snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
    }
    return false;
}


// ADMIN TOOLS:
function adminAddRestriction(restrictionTitle, restrictionDescription, region) {
    /*
    This function adds a restriction to the online database.
    If the region does not exist in the database, the region will be added.
    If a restriction of the same title already exists in this region, then nothing will be changed.
    Inputs:
    - restrictionTitle (string): The title of the restriction
    - restrictionDescription (string): The description of the restriction
    - region (string): The region where the restriction is in place
    */
    region = region.toLowerCase();
    if (typeof restrictionTitle != "string" || typeof restrictionDescription != "string" || typeof region != "string") {
        return "Error: invalid inputs.";
    }
    for (let databaseRegion in databaseData["lockdownRules"]) {
        if (databaseRegion == region) {
            for (let i = 0; i < databaseData["lockdownRules"][databaseRegion].length; i++) {
                if (databaseData["lockdownRules"][databaseRegion][i].title == restrictionTitle) {
                    return "Error: restriction of same title already exists.";
                }
            }
            databaseData["lockdownRules"][databaseRegion].push({"description": restrictionDescription, "title": restrictionTitle, "admin": adminUsername});
            try {
                dbRef.set(databaseData);                
            } catch (error) {
                console.log(error);
            }
            return "Restriction has been added!";
        }
    }
    // When region doesn't exist:
    databaseData["lockdownRules"][region] = [{"description": restrictionDescription, "title": restrictionTitle, "admin": adminUsername}];
    dbRef.set(databaseData);
    return "Region and restriction have been added!";
}

function adminRemoveRestriction(restrictionTitle, region) {
    /*
    This function removes a restriction from the online database.
    If a region no longer contains any more restrictions, it is removed from the database.
    Inputs:
    - restrictionTitle (string): The title of the restriction to be deleted
    - region (string): The region containing the restriction
    */
    for (let databaseRegion in databaseData["lockdownRules"]) {
        if (databaseRegion == region.toLowerCase()) {
            for (let i = 0; i < databaseData["lockdownRules"][databaseRegion].length; i++) {
                if (databaseData["lockdownRules"][databaseRegion][i].title == restrictionTitle) {
                    databaseData["lockdownRules"][databaseRegion].splice(i, 1);
                    try {
                        dbRef.set(databaseData);                        
                    } catch (error) {
                        console.log(error);
                    }
                    return "Restriction has been deleted!";
                }
            }
            return "Error: restriction doesn't exist.";
        }
    }
    return "Error: region does not exist.";
}

function addAdminAccount() {
    /*
    This function is called upon the press of the "ADD ADMIN ACCOUNT" button.
    This function takes the user's input, validates it, then creates an admin account (which is stored in the online database).
    */
    let usernameRef = document.getElementById("newUsername");
    let username = usernameRef.value.trim();
    let passwordRef = document.getElementById("newPassword");
    let password = passwordRef.value.trim();
    let password2Ref = document.getElementById("newPassword2");
    let password2 = password2Ref.value.trim();
    let snackbarContainer = document.querySelector('#snackbar'); // Snackbar
    let snackbarMessage = {};
    if (!(username == "" || password == "" || password2 == "")) {
        // Inputs are given
        if (password === password2) {
            // Passwords match

            // Check if admin account already exists
            if (databaseData["adminCredentials"].hasOwnProperty(username)) {
                // Admin account does already exist
                snackbarMessage = { message: `Admin account "${username}" already exists`};
                snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
            } else {
                // Admin account does not already exist
                // Add admin account to online database
                databaseData["adminCredentials"][username] = password;
                try {
                    dbRef.set(databaseData);                    
                } catch (error) {
                    console.log(error);
                }
                snackbarMessage = { message: "Admin account created"};
                snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
                usernameRef.value = "";
                passwordRef.value = "";
                password2Ref.value = "";
            }
        } else {
            // Passwords do not match
            snackbarMessage = { message: "Passwords do not match" };
            snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
        }
    } else {
        // Inputs are not given
        snackbarMessage = { message: "Please enter a username and password" };
        snackbarContainer.MaterialSnackbar.showSnackbar(snackbarMessage);
    }
    return false;
}