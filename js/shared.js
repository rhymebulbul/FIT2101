/*
general purpose functions here including:
local storage functions

Created by Liam Todd

note: I plagiarised this straight from my ENG1003 assignment
*/

/*
@desc: function checks if an input key references any data in local storage
@param: 'key': a key string which may or may not reference data in local storage
@return: true if key references data in local storage, false otherwise
*/
function checkLocalStorage(key){

    let data = localStorage.getItem(key)//access data from local storgage using input key
    if (data){//check if data exists in local storage
        return true
    }
    else{//run block if data does not exist in local storage
        return false
    }
}

/*
@desc: function updates local storage with inputted data and associated key
@param: 'key': string to be paired with stored data
@param: 'data': data to be stored in local storage with associated key
*/
function updateLocalStorage(key, data){

    let jsonString = JSON.stringify(data);//convert data to json representation
    localStorage.setItem(key, jsonString);//store json string with provided key into local storage
}

/*
@desc: function retrieves data from local storage which was paired with a specific input key.
       used try{}catch{}finally{} to account for parsing object data
@param: 'key': string key paired with some data in local storage
*/
function retrieveData(key){

    let data = localStorage.getItem(key);//retrieve data from ls
    try{
        data = JSON.parse(data);//try parsing data
    }
    catch(error){//check for errors
        //nothing else to do if data doesn't need to be parsed
    }
    finally{
        return data
    }
}

