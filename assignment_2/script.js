var API_URL = "https://content.guardianapis.com/";
var API_KEY = "b2535bfe-c69b-44e5-8583-9d088cc11b21";

/*
To do: 
jQuery
Implement advanced features
Have world button be a dropdown with a couple of regions
Improve search capabilites
Choose how many articles to return
*/


$(document).ready(function () {
    // applies sectionClick method to all nav links
    $(".section-btn").on("click", function (e) {
        sectionClick(this, e)
    });

    // performs a search when clicked
    $("#searchButton").on("click", function (e) {
        searchForArticle($("#searchBox").val(), $("#searchOrder").val());
    });

    // makes the search help appear when the search text box is active
    $("#searchBox").focus(function () {
        $("#searchHelp").toggle(300)
    });

    // makes the search help dissappear when the search text box is not active
    $("#searchBox").blur(function () {
        $("#searchHelp").toggle(300)
    });

    //Get an initial list of articles to give the user
    getRecentArticles(undefined, 20)
    getPopular(undefined, 20)
});




/*Changes the page to a section with recent and popular articles*/
function sectionClick(item, e) {
    $(item).parent().addClass("active").siblings().removeClass("active");
    var section = encodeURI(e.target.attributes[1].nodeValue)
    if (section == "home") {
        getPopular(undefined, 20);
        getRecentArticles(undefined, 20);
    } else {
        getPopular(section, 20);
        getRecentArticles(section, 20);
    }
    displayArea("articleListings");
    var clicked = $(item).text()
    if (clicked == "Home") {
        clicked = ""
    }
    $("#mostPopularTitle").text("Popular " + clicked + " Stories")
    $("#recentArticlesTitle").text("Recent " + clicked + " Stories")
}


/*Hides all sections then displays the desired section */
function displayArea(area) {
    $("#articleListings").hide();
    $("#articleContent").hide();
    $("#searchResults").hide();

    if (area == "articleListings") {
        $("#articleListings").show();

    } else if (area == "articleContent") {
        $("#articleContent").show();

    } else if (area == "searchResults") {
        $("#searchResults").show();
    }
}


/*rebinds event methods so new links loaded will work when clicked.
  When new links are added to the page they do not have any event methods binded.*/
function remapClicks() {
    //Unbinds event methods
    $(".article-link").off()
    $(".section-btn").off()

    //Binds new clicks
    $(".article-link").on("click", function (e) {
        getArticle(e.target.id);
    });
    $(".section-btn").on("click", function (e) {
        sectionClick(this, e)
    });
}

/* API AND FORMATTING METHODS*/

/* Fetches an article based on the ID provided. Formats and appends content to html.*/
function getArticle(articleID) {
    //Create API request url
    var url = API_URL + articleID + "?show-blocks=all&" + "api-key=" + API_KEY;

    //Uses getJSON to make ajax request to API.
    $.getJSON(url, function (data) {

        //Gets article content from js object that was returned.
        data = data.response.content;
        var articleTitle = data.webTitle;
        var articleImageAndCaption = getArticleImageCaption(data);
        var articleContent = data.blocks.body["0"].bodyHtml;
        var articleURL = data.webUrl;
        var articleDate = makeDateReadable(data.webPublicationDate)

        //Gets the previous section id and name to add to back button
        var section = $(".active").find($(".nav-item").children());
        var prevSectTitle = section.text();
        var prevSectValue = section["0"].attributes[1].value;

        //Creates article page
        $('#articleContent').html('<button type="button" value="' + prevSectValue + '"class="btn btn-primary btn-lg section-btn">' + prevSectTitle + '</button>');
        $('#articleContent').append("<h3>" + articleTitle + "</h3>");
        $('#articleContent').append("<h5>Published on " + articleDate + "</h5>");
        $('#articleContent').append(articleImageAndCaption);
        $('#articleContent').append(articleContent);
        $('#articleContent').append("<a href='" + articleURL + "'>Source Article </a>");

        //Rebinds clicks to make up for new button link.
        remapClicks()
        displayArea("articleContent");
    });
}

/*fetches the most recent articles for a section. Then formats returned article info and appends it to page.*/
function getRecentArticles(section, pageSize) {

    //Create API url query
    var url = createURL(false, section);
    if (pageSize != undefined) {
        url = url + "&page-size=" + String(pageSize)
    }

    //Make ajax call to API
    $.getJSON(url, function (data) {
        data = data.response.results;

        $("#recentArticlesListings").html(" ");
        //Iterates through each element returned and creates a bootstrap card which it appends to the page.
        for (var x in data) {
            var articleTitle = data[x].webTitle;
            var articleSection = data[x].sectionName;
            var articleImage = getImageFromData(data[x])

            var line1 = '<div class="col-3"><div class="card">'
            var line2 = '<img class="card-img-top  rounded mx-auto d-block article-link" href="#" id="' + data[x].id + '" src="' + articleImage + '" width="100%" alt="Card image cap">'
            var line3 = '<div class="card-body">'
            var line4 = '<h5 class="card-text"><a href="#" class="article-link" id="' + data[x].id + '">' + articleTitle + '  content.</a></h5></div></div></div>'
            $("#recentArticlesListings").append(line1 + line2 + line3 + line4)
        }
        remapClicks()
    });
}


/*Fetches the most popular articles for a section. Then formats returned article info and appends it to page.*/
function getPopular(section, pageSize) {

    //Create API url query
    var url = createURL(true, section);
    if (pageSize) {
        url = url + "&page-size=" + String(pageSize)
    }

    //Make ajax call to API
    $.getJSON(url, function (data) {
        data = data.response.mostViewed;
        $("#popularListings").html("");
        var count = 1
        /*Iterates through info returned and appends it as a link.*/
        for (var x in data) {
            $("#popularListings").append('<hr><a class="article-link" href="#" id="' + data[x].id + '">' + count + ": " + data[x].webTitle + '</a>');
            count = count + 1
        }
        remapClicks()
    });
}


/* Makes a search through the API then returns items found and appends it to a Bootstrap list*/
function searchForArticle(query, order) {
    //Create API url query
    var url = API_URL + "search?";

    //If user doesnt enter anything to search for then tell them.
    if (query == "") {
        $("#searchResults").html("<h4> No search query entered. Please refer to the help box for more information.</h4>")
    } else {
        url = url + "q=" + query + "&show-blocks=all" + "&order-by=" + order + "&api-key=" + API_KEY;

        //Ajax request to get search results
        $.getJSON(url, function (data) {
            $("#searchResults").html("<h4> Search Results for : " + query + "</h4><ul class='list-group'>")
            // Iterates through data, appends to bootstrap list
            for (var x in data.response.results) {
                var i = data.response.results[x]
                var brief = i.blocks.body["0"].bodyTextSummary
                var dataPub = 'Published: ' + makeDateReadable(i.webPublicationDate)

                //Limits news article to 120 characters.
                brief = brief.substring(0, 120) + '...'
                $('#searchResults').append('<li class="list-group-item"><a href="#" class="article-link" id ="' + i['id'] + '" >' + data['response']['results'][x]['webTitle'] + '</a><p>' + brief + '</p><p>' + dataPub + '</p> </li>')
            }
            $('#searchResults').append('</ul>')
            remapClicks()
        })
    }
    displayArea("searchResults");
}


/* HELPER METHODS */

/*Creates a URL for getting articles from guardian API*/
function createURL(popular, section) {
    var url = undefined

    if (popular == true) {
        url = 'uk?'
        if (section != undefined) {
            url = 'uk/' + section + '?'
        }
        url = API_URL + url + 'show-most-viewed=true'

    } else {
        url = 'search?'
        if (section != undefined) {
            url = url + 'section=' + section + '&'
        }
        url = API_URL + url + 'order-by=newest' +  '&show-blocks=all'
    }
    url = url  + '&api-key=' + API_KEY
    return url
}


/* Converts the date from an ISO date into a readable format */
function makeDateReadable(dateString) {
    return dateString.substring(0, 10) + ' at ' + dateString.substring(11, 19)
}


/* Finds an image to use for an article listing.
    Used as Guardian API does not always return an image for articles */
function getImageFromData(data) {
    var articleImage = 'images/news-placeholder.jpg'
    try {
        articleImage = data.blocks.main.elements["0"].assets["0"].file;
    } catch (err) {}
    return articleImage
}


/* Finds the main article image and corresponding caption for an article */
function getArticleImageCaption(data) {
    var content = ""
    try {
        content = data.blocks.main.bodyHtml;

    } catch (err) {
        content = data.blocks.body["0"].bodyHtml;

    }
    return content
}