/**
 * Manages the game loop.
 *
 * It delegates all responsibilities besides the game loop to the gameState
 * which it creates when it initializes.
 */

var PS = PS || {};

(function() {
    PS.gameOver = false;

    var gameState = null;

    var isHighScore = function(score) {
        var highScore = PS.HighScore.get();
        return !highScore || score > highScore;
    };

    PS.endGame = function() {
        PS.gameOver = true;

        console.log("game over!");
        var score = gameState.getScore();
        if (isHighScore(score)) {
            PS.HighScore.set(score);
            console.log("New high score! " + score);
        }
    };

    PS.createGameManager = function(renderer, input) {
        PS.gameOver = false;

        var prevTime = null;
        gameState = PS.createGameState(renderer);

        var id = input.addClickHandler(gameState.player.handleClick);

        var gameLoop = function() {
            if (PS.gameOver) {
                input.removeClickHandler(id);
                return;
            }

            var time = Date.now();
            if (!prevTime)
                prevTime = time;

            gameState.player.handleKeys(input.getKeysDown(), time - prevTime);
            gameState.update(time - prevTime);
            gameState.render();

            window.requestAnimationFrame(gameLoop);
            prevTime = time;
        };

        window.requestAnimationFrame(gameLoop);
    }
})();
