/**
 * Manages the game loop.
 *
 * It delegates all responsibilities besides the game loop to the gameState
 * which it creates when it initializes.
 */

var PS = PS || {};

(function() {
    PS.gameOver = true;
    PS.gameOverTime = 0;

    var isHighScore = function(score) {
        var highScore = PS.HighScore.get();
        return !highScore || score > highScore;
    };

    PS.endGame = function() {
        PS.gameOver = true;
        PS.gameOverTime = Date.now();
    };

    // Returns whether the score is the new high score
    var handleHighScore = function(score) {
        if (isHighScore(score)) {
            PS.HighScore.set(score);
            return true;
        }
        return false;
    }

    PS.createGameManager = function(renderer, input) {
        PS.gameOver = false;

        var prevTime = null;
        var gameState = PS.createGameState(renderer);

        var id = input.addClickHandler(gameState.player.handleClick);

        var gameLoop = function() {
            if (PS.gameOver) {
                input.removeClickHandler(id);
                gameState.render();

                var score = Math.floor(gameState.getScore());
                var isHigh = handleHighScore(score);
                renderer.writeGameOver(score, isHigh);
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
