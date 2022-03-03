/*
This is the JavaScript file containing the logic for the rules.html webpage.
Created by Josiah Schuller
*/

// Get the location of user from local storage
// For sprint 1, assume Melbourne
let userLocation = retrieveData("user-state");
document.getElementById("heading").innerText = `COVID restrictions in ${toTitleCase(userLocation)}`;


// Connect to Firebase realtime database
let databaseData = "";
let password = "";
let allRestrictionsString = "";
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
    dbRef = firebase.database().ref("lockdownRules");
    dbRef.on("value", snapshot => loadData(snapshot.val()));    
} catch (error) {
    console.log(error);
}

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
    This function loads the data from the database into the databaseData variable, and then calls the displayData function.
    Inputs:
    - data (object): an object of data from the online database
    */
    console.log(data);
    databaseData = data;
    displayData(data);
}

function displayData(data) {
    /*
    This function displays data as a list on the webpage.
    Inputs:
    - data (object): an object of data from the online database
    */
    let ruleListRef = document.getElementById("ruleList");
    let rulesHtml = "";
    for (let i = 0; i < data[userLocation.toLowerCase()].length; i ++) {
        let restriction = data[userLocation.toLowerCase()][i];

        rulesHtml += `
        <li class="mdl-list__item mdl-list__item--three-line">
        <span class="mdl-list__item-primary-content" style="font-family: 'Advent Pro', sans-serif; font-size : 20px; font-weight: bold">
          <span>${restriction["title"]}</span>
          <span class="mdl-list__item-text-body" style="font-weight : bold; font-size: 17px">
            ${restriction["description"]}
          </span>
        </span>
        <button onclick='playRule("${restriction["description"]}")'
        style="border: none;background: none; float: right; background-color: #055b6e; color: white;" 
        class="mdl-button mdl-js-button mdl-button--fab">
            <i class="material-icons">microphone</i>
        </button>
        </li>`

        // Add restrictions to a large string for the text-to-speech.
        allRestrictionsString += "Title: " + restriction["title"] + ". Description: " + restriction["description"] + ". ";
    }
    rulesHtml += "<br><br>";
    ruleListRef.innerHTML = rulesHtml;
}

function playSound(){
    var synth = window.speechSynthesis;
    var utterance = new SpeechSynthesisUtterance(allRestrictionsString);

    if (synth.speaking) {
        synth.cancel();
    }
    else{
        synth.speak(utterance);
    }
}

/**
 * Text to speech for titles
 * :param title: the title string to speak
 */
 function playRule(rule){

    let synth = window.speechSynthesis;
    let utterance = new SpeechSynthesisUtterance(rule);
  
    if (synth.speaking) {
        synth.cancel();
    }
    else{
        synth.speak(utterance);
    }
  }