const GEO_API = "AIzaSyDC0axLEDyJVzBCX6JQIy3HOjjSQzdSueQ"

// Connect to Firebase realtime database
// let databaseData = "";
let firebaseConfig = {
    apiKey: "AIzaSyDImRxY3Kabi9AXhPG5E60esGdeREPN48E",
    authDomain: "fit2101-2f82e.firebaseapp.com",
    databaseURL: "https://fit2101-2f82e-default-rtdb.firebaseio.com",
    projectId: "fit2101-2f82e",
    storageBucket: "fit2101-2f82e.appspot.com",
    messagingSenderId: "182542596921",
    appId: "1:182542596921:web:a4a6ef412ce05b007206e8"
};
firebase.initializeApp(firebaseConfig);
let dbRef2 = firebase.database().ref("lockdownRules");
dbRef2.on("value", snapshot => getLockdownRadius(snapshot.val()));

function getLockdownRadius(databaseData) {

    /*
    This function returns the lockdown radius in km for the state the user's address is in.
    */
    // Get user's state from local storage (this function is from shared.js)
    let userState = localStorage.getItem("user_state"); 
    let lockdownRadius;
    // Get lockdown radius from online database
    try {
        let restrictions = databaseData[userState.toLowerCase()];
        for (let i = 0; i < restrictions.length; i++) {
            if (restrictions[i]["title"] === "Lockdown radius (km)") {
                lockdownRadius = parseInt(restrictions[i]["description"]);
                break;
            }
        }
        console.log(lockdownRadius)
        localStorage.setItem("radius",lockdownRadius)
    } catch(err) {
        localStorage.setItem("radius", 50)
    }
}

function geocodeConstructor(substr){
    res = "https://maps.googleapis.com/maps/api/geocode/json?address="
    res += substr[0] 
    for (let i = 1; i < 3; i++){
      res += "+"
      res += substr[i] 
    }
    res += ","
    for (let i = 3; i < 5; i++){
      res += "+"
      res += substr[i] 
    }
    res += ",+"
    res += substr[5] 
    res += "&key="
    res += GEO_API
    
    fetch(res)
    .then(res => res.json())
    .then(data => localStorage.setItem("user_state", data["results"][0]["address_components"][4]["long_name"]))

    fetch(res)
    .then(res => res.json())
    .then(data => localStorage.setItem("user_lat", data["results"][0]["geometry"]["location"]["lat"]) )
  
    fetch(res)
    .then(res => res.json())
    .then(data => localStorage.setItem("user_lng", data["results"][0]["geometry"]["location"]["lng"]) )
    
    res = "test.json"
    fetch(res)
    .then(res => res.json())
    .then(data => localStorage.setItem("testing", JSON.stringify(data["sites"])))

  }
// url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=32.715738,%20-117.161084&radius=12218&type=grocery_or_supermarket&key=AIzaSyDm6YmPrANaGrfBgouWBM0o1axvB9tOS38"

// fetch(url, {method: 'GET'})
// .then(url => url.json())  
// .then(data => console.log(data))


  
let address = localStorage.getItem('user-home-address')
let substr = address.split(" ")
geocodeConstructor(substr)

