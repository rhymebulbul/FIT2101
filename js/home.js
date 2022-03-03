/*
This is the JavaScript file containing the logic for the home.html website.
Created by Liam Todd
*/

const NEWS_ACCESS_TOKEN = "492ccef29a1d4970a7295b69280916ad";
const URL = "https://newsapi.org/v2/everything?";
// for dynamic news search
const KEYWORDS = ["COVID", "CORONAVIRUS", localStorage.getItem('user-state'), localStorage.getItem('user-country')];
const DEFAULT_KEYWORDS = ["COVID", "CORONAVIRUS", localStorage.getItem('user-country')];

/*
generates request url to call API, accepts array of keyword strings
*/

function urlGenerator(keyWords, daysAgo){

    let url = URL
        + "language=en"             // language=english
        + "&q=";
    
     // add keywords to news search
    for (i=0; i<keyWords.length; i++){
        url += keyWords[i];
        if (i < keyWords.length - 1){
            url += ", ";
        }
    }

    url += "&qInTitle=";

    // search for keywords in title too
    for (i=0; i<keyWords.length; i++){
        url += keyWords[i];
        if (i < keyWords.length - 1){
            url += ", ";
        }
    }

    // only search previous 5 days
    let fiveDaysAgo = new Date()
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - daysAgo)
    fiveDaysAgo = fiveDaysAgo.toISOString().slice(0,10)
    url += "&from=" + fiveDaysAgo
  
    // add access token to url
    url += "&apiKey=" + NEWS_ACCESS_TOKEN;

    return url;
}

/*
displays news on page
*/
function getNews(){

    // generate api request

    urlRequest = urlGenerator(KEYWORDS, 7);
    try{
        newsArticles = fetch(urlRequest)
        .then(response => response.json()
        .then(data => {
            if (data.articles.length > 0){ // sufficient articles
                console.log("sufficient articles")
                // iterate over articles in response
                for (i=0;i<data.articles.length;i++){
    
                    // get image from article
                    let imageInnerHtml = data.articles[i].urlToImage;

                    let titleSpeak = data.articles[i].title.toString();
        
                    // create news card to be displayed on page
                    newsCard =     
                    `
                    <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title">
                      <h2 class="mdl-card__title-text" style="color:grey;font-size:17px">${data.articles[i].title}</h2>
                    </div>
                    <img src=${imageInnerHtml}>
                    <div class="mdl-card__supporting-text">
                      ${data.articles[i].description}
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <a href=${data.articles[i].url} style='color:grey'>See full story</a>
                        <button onclick='playTitle("${titleSpeak.replace(/['']/, "")}")'
                        style="border: none;background: none; float: right; background-color: #055b6e; color: white;" 
                        class="mdl-button mdl-js-button mdl-button--fab">
                            <i class="material-icons">microphone</i>
                        </button>
                    </div>

                  </div>;

                  `
                //   append news card to page
                  document.getElementById('output').innerHTML += newsCard
                }
            
            }
            // insufficient relevant articles, call again
            else{
                console.log("insufficient articles")
                alert("We couldn't find any COVID-related news stories from your local area, so here are some from around the country.")
                urlRequest = urlGenerator(DEFAULT_KEYWORDS, 7);
                newsArticles = fetch(urlRequest)
                .then(response => response.json()
                .then(data => {
                // iterate over articles in response
                for (i=0;i<data.articles.length;i++){
    
                    // get image from article
                    let imageInnerHtml = data.articles[i].urlToImage;
                    let titleSpeak = data.articles[i].title.toString();
        
                    // create news card to be displayed on page
                    newsCard =     
                    `
                    <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title">
                      <h2 class="mdl-card__title-text" style="color:grey;font-size:17px">${data.articles[i].title}</h2>
                    </div>
                    <img src=${imageInnerHtml}>
                    <div class="mdl-card__supporting-text">
                     ${data.articles[i].description}
                    </div>
                    <div class="mdl-card__actions mdl-card--border">
                        <a href=${data.articles[i].url} style='color:grey'>See full story</a>
                        <button onclick='playTitle("${titleSpeak.replace(/['']/g, '')}")'
                        style="border: none;background: none; float: right; background-color: #055b6e; color: white;" 
                        class="mdl-button mdl-js-button mdl-button--fab">
                            <i class="material-icons">microphone</i>
                        </button>
                    </div>

                  </div>;
                  `
                //   append news card to page
                  document.getElementById('output').innerHTML += newsCard
                }

            }))
            }
    
            
            
        }))
    }
    catch(error){
        console.log('news API request failed')
    };
    
}

/**
 * Text to speech for titles
 * :param title: the title string to speak
 */
function playTitle(title){

  let synth = window.speechSynthesis;
  let utterance = new SpeechSynthesisUtterance(title);

  if (synth.speaking) {
      synth.cancel();
  }
  else{
      synth.speak(utterance);
  }
}


/*
get user's address and display news on load
*/
getNews();


