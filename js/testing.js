/**
 * This function takes in the lat/lng of 2 locations and calculates the distance in km between them
 * @param {*} lat1 : the latitude of first location
 * @param {*} lng1 : the longitude of first location
 * @param {*} lat2 : the latitude of second location
 * @param {*} lng2 : the longitude of second location
 * @returns distance between 2 locations in km
 */
 function haversine(lat1, lng1, lat2, lng2){

    var R = 6371; // km 
    //has a problem with the .toRad() method below.
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon= (lng2-lng1) * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180
    lat2 = lat2 * Math.PI / 180
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);  
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    
    return Math.round(d);
   }
   
/**
* This function takes a jsonfile and gets the locations within the lockdown radius
* @returns an array of the locations
*/
function getTesting(){
    test = JSON.parse(localStorage.getItem("testing"))
    locations = []

    for (let i = 0; i < test.length; i++){
    let temp_lat = test[i]["Latitude"]
    let temp_lng = test[i]["Longitude"]
    let distance = haversine(temp_lat,temp_lng, localStorage.getItem("user_lat"), localStorage.getItem("user_lng"))
    if (distance < localStorage.getItem('radius')){
        locations.push(test[i])
    }

    }
    return locations
}



function displayData(data) {
    document.getElementById("heading").innerText = `There are ${data.length} testing sites close to your address`;

    /*
    This function displays data as a list on the webpage.
    Inputs:
    - data (object): an object of data from the online database
    */
    let testSitesRef = document.getElementById("testSites");
    let testSitesHtml = "";
    for (let i = 0; i < data.length; i ++) {

        testSitesHtml += `
        <li class="mdl-list__item mdl-list__item--three-line">
        <span class="mdl-list__item-primary-content" style="font-family: 'Advent Pro', sans-serif; font-size : 20px; font-weight: bold">
        <a style='text-decoration:underline; color:black; font-weight: bold' href=${data[i]["Website"]}>${data[i]["Site_Name"]}</a>
        

        </span>
        </li>`


    }
    console.log(testSitesHtml)
    testSitesRef.innerHTML = testSitesHtml;
}

function remove() {
    var div =document.getElementById("quiz");
    div.parentNode.removeChild(div);
}
