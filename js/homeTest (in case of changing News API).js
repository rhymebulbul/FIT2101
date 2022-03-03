/*
This is in case everything goes wrong
Created by Liam Todd
*/

const NEWS_ACCESS_TOKEN = "68998b0d-a1f2-421a-863d-37e944e8459a";
const URL = "https://webhose.io/filterWebContent?";

// for dynamic news search
const KEYWORDS = ["COVID", "CORONAVIRUS", localStorage.getItem('user-state'), localStorage.getItem('user-country')];

/*
generates request url to call API, accepts array of keyword strings
*/

function urlGenerator(keyWords){

    let url = URL 
        + "token=" 
        + NEWS_ACCESS_TOKEN
        + "&format=json&sort=crawled"
        + "&q=language%3Aenglish%20" // language=english
        + "country%3AAU%20";         // country = australia
    
    for (i=0; i<keyWords.length; i++){
        url += "thread.title%3A";
        url += keyWords[i];

        if (i != keyWords.length - 1){
            url += "%20";  
        }
    }

    console.log(url)
    return url;
}


/*
displays news on page
*/
function getNews(){

    urlRequest = urlGenerator(KEYWORDS);;
    newsArticles = fetch(urlRequest)
    .then(response => response.json()
    .then(data => {
        console.log(data)
        
        for (i=0;i<data.posts.length;i++){

            let imageInnerHtml;
            // generic image if none associated with story
            if (data.posts[i].external_images.length == 0){
                // imageInnerHtml =  `<div><img src="img/COVID-19-news-banner.jpg" width="100%"></div>`
                imageInnerHtml = ""; // no image if none exists
            }
            // get image url if associated with story
            else{
                imageInnerHtml = `<div><img src=${data.posts[i].external_images[0].url}  width="100%"></div>`;
            }

            newsCard =     
            `
            <div class="demo-card-wide mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title">
              <h2 class="mdl-card__title-text" style="color:grey;font-size:17px">${data.posts[i].title}</h2>
            </div>
            ${imageInnerHtml}
            <div class="mdl-card__supporting-text">
              ${data.posts[i].text.slice(0,90) + '...'}
            </div>
            <div class="mdl-card__actions mdl-card--border">
                <a href=${data.posts[i].url} style='color:grey'>See full story</a>
            </div>
          </div>;
          `
          document.getElementById('output').innerHTML += newsCard
        }
    }))
}



/*
get user's address and display news on load
*/
getNews();


