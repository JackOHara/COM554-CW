$(document).ready(function () {

    // Create canvas
    var canvas = $("#game")[0];
    var ctx = canvas.getContext("2d");

    //Load wallet image and set initial co-ordinates
    var walletImage = $("#wallet_img")[0]
    var walletY = canvas.height - walletImage.height - 50
    var walletX = canvas.width / 2 - walletImage.width / 2

    //Load coin image and set initial co-ordinates
    var coinImage = $("#coin_img")[0]
    var coinY = 0 - coinImage.height
    var coinX = Math.random() * canvas.width;

    //Game properties
    var gameStart = false
    var playerScore = 0


    $("#game").mousemove(function (event) {
        //Every time the mouse moves over canvas the x co-ordinate of the mouse is retrieved.
        walletX = getWalletX(getMousePos(canvas, event))

        //Game begins when mouse is moved over canvas for first time.
        gameStart = true

    });


    //Game loop
    setInterval(function () {

        //Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //Draw background
        ctx.fillStyle = "lightgray";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Write score
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Coins: " + playerScore, 20, 40);

        //Draw wallet
        ctx.drawImage(walletImage, walletX, walletY);


        if (gameStart == true) {
            //coinY is the coin image y co-ordinate. When the player score increases then the movement speed increases.
            coinY = coinY + 5 + playerScore * 2

            //Draw Coin
            ctx.drawImage(coinImage, coinX, coinY);

            //Below variables contain the left side and right side co-ordinates of the coin and wallet images.
            //I did this to avoid confusion when writing the IF which follows.
            var walletLeft = walletX
            var walletRight = walletX + walletImage.width
            var coinLeft = coinX
            var coinRight = coinX + coinImage.width

            //If the bottom of the coin is at the wallets top or lower
            if (coinY + coinImage.height >= walletY) {

                // If the left or right co-ord of the coin is within the left and right co-ord of the wallet then the wallet and coin has collided.
                if ((coinLeft > walletLeft && coinLeft < walletRight) || (coinRight < walletRight && coinRight > walletLeft)) {
                    restartCoin()
                    playerScore = playerScore + 1
                }
            }

            //If coin misses wallet and gets to the bottom of canvas then restart coin
            if (coinY > canvas.height) {
                restartCoin()
            }

            //Reset score if it reaches 25
            if (playerScore == 25) {
                playerScore = 0
            }
        }
    }, 35); //Game refreshes every 35 milliseconds. This gives it a refresh rate of 28.5


    // Coin restarts at top with random x position
    function restartCoin() {
        coinY = 0 - coinImage.height
        coinX = Math.random() * canvas.width;
    }


    // Returns the x co-ordinate that the wallet img should be drawn on
    // Doesn't allow for wallet to go outside of canvas.
    function getWalletX(mouseLocation) {
        walletX = mouseLocation["x"] - (walletImage.width / 2)

        if (mouseLocation["x"] - walletImage.width / 2 < 0) {
            return 0
        }

        if (mouseLocation["x"] + walletImage.width / 2 > canvas.width) {
            return canvas.width - walletImage.width
        }
        return walletX

    }


    // Returns the mouse x and y coordinates in relation to the canvas
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
})