/**
 * This file contains the logic for the welcome page
 * Written by Liam Todd
 */

 const GEOCODING_KEY = "04da6b0bd6c946de80d5e5c37e9d8e4d"; // using opencage geocoding to avoid CORB blocking issues with google API
 const url = "https://api.opencagedata.com/geocode/v1/json?q="; // initialise url


// stores input address to local storage if the input address can be matched to real locations
function recieveInput(){
    // get user input
    let userAddress = document.getElementById('autocomplete').value;
    if (userAddress == ''){
        window.alert("Please eneter an address")
        return
    }
    // call api
    try{
    forwardGeocodeRequest(userAddress, 'getSearchResults')
    }
    catch(error){
        console.log('geocoding API request failed')
    }

}

// callback function for api call
function getSearchResults(result){
    // look for first valid australian address
    for (i = 0; i < result.results.length; i++){
        if (result.results[i].components.country == "Australia"){
            console.log(result.results[i])
            // update LS with address information
            updateLocalStorage("user-home-address", result.results[i].formatted)
            updateLocalStorage("user-state", result.results[i].components.state);
            updateLocalStorage("user-country", result.results[i].components.country);
            updateLocalStorage("user-city", result.results[i].components.city);
            window.location.assign('home.html');
            return;
        }
    }

    // if no match in Australia was found
    document.getElementById('autocomplete').value = '';
    window.alert("Sorry, we were unable to match your input address to an Australian address. Please try again");
}


// generates url for api call
function forwardGeocodeRequest(placeName, callbackString){
    let encodedPlaceName = encodeURIComponent(placeName);//encode placename
    let output = `${url}`+`${encodedPlaceName}`+`&key=${GEOCODING_KEY}&callback=${callbackString}`;//create end of url
    let script = document.createElement('script');// create script tag
    script.src = output;//set src of script tag to url
    document.body.appendChild(script);//append script tag to page
}

// clear local storage upon entry
localStorage.clear();