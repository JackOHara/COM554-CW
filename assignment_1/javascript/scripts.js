$(document).ready(function () {


    // Navbar tab switcher
    $(".tab").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        $(".tabcontent").hide();
        console.log($(this).siblings())
        var tab = $(this).html();
        $("#" + tab).show();
        $('#EthereumVideo')[0].pause()

        if (tab == "Game") {
            $("#GameTitle").animate({
                opacity: 0.9,
                fontSize: "3em"
            }, 1500);
        }
    });


    //Display dropdown on hover
    $(".dropdown").hover(
        function () {
            $("#MenuDropdown").toggle(200);
        },
        function () {
            $("#MenuDropdown").toggle(200);
        }
    );


    //Accordion open/close
    $(".accordion").click(function () {
        var panel = this.nextElementSibling;
        $(panel).toggle(200);
    })

    //Retreive price info from api and update every five seconds
    retrievePriceInfo()
    setInterval(function () {
        retrievePriceInfo()
    }, 5000);


    //Return the current price of ethereum in GBP and USD via api and update live price and add it to table.
    function retrievePriceInfo() {
        $.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=GBP,USD", function (data, status) {
            $("#EthereumPrice").html("£" + data['GBP'] + " | $" + data['USD']);

            if ($("#EthPriceTable tr").length == 10) {
                $("table#EthPriceTable tr:nth-child(10)").remove();
            }

            var now = String(new Date(Date.now()));
            now = now.slice(0, 25)
            $("#EthPriceTable tr:first").after("<tr><td>" + now + "</td><td>£" + data['GBP'] + "</td><td>$" + data['USD'] + "</td></tr>");
        });
    }


    // Get facts from JSON and add to list
    $.getJSON("json/ethereumfacts.json", function (data) {
        for (var k in data) {
            $("#EthFacts").append("<li>" + data[k] + "</li>");
        }
    })


    // Get how to buy info from JSON and add to page
    $.getJSON("json/howtobuy.json", function (data) {
        for (var k in data) {
            $("#HowToBuy").append("<li><p>" + k + ": " + data[k] + "</p></li>");
        }
    })


    //Get FAQ section titles from JSON and add as select options
    $.getJSON("json/ethereumfaq.json", function (data) {
        for (var k in data) {
            $("#FAQSelect").append("<option value='"+k+"'>" + k + "</option>");
        }
    })


    //Change which FAQ section from JSON is shown.
    $("#FAQSelect").change(function () {
        option = $('#FAQSelect option:selected').val()
        $("#FAQSection").empty()
        if (option != "Select..") {
            $.getJSON("json/ethereumfaq.json", function (data) {
                for (var k in data[option]) {
                    $("#FAQSection").append("<hr> <h3>" + k + "</h3><p> " + data[option][k] + "<\p>  ");
                }
            })
        }
    });


    //Add HTML5 video
    $('#VideoBox').append(
        '<video id="EthereumVideo" width="900" controls>' +
        ' <source src="ethereum.mp4" type="video/mp4"> Your browser does not support the video tag.</video>'
    )


    //Hide/Show video
    $("#HideShowVideo").click(function () {
        $("#EthereumVideo").toggle(400)
        $('#EthereumVideo')[0].pause()
    });


    //Small/Large video player size
    $("#ChangeVideoSize").click(function () {
        if ($("#EthereumVideo").css("width") == "900px") {
            $("#EthereumVideo").css("width", "500px")
        } else {
            $("#EthereumVideo").css("width", "900px")
        }
    });


    //Add a tooltip with video title upon mouse moving over. 
    $("#EthereumVideo").mousemove(function (event) {
        $("body #ToolTip").remove();
        $("body").append("<p id='ToolTip'>Ethereum Vs. Bitcoin: What Sets Them Apart? | CNBC</p>");

        $("#ToolTip")
            .css("top", (event.pageY) + "px")
            .css("left", (event.pageX) + "px");
    });


    //Remove tooltip when mouse moves off video
    $("#EthereumVideo").mouseout(function () {
        $("body #ToolTip").remove();
    });

})