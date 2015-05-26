/**
 * Manages the game loop.
 *
 * It delegates all responsibilities besides the game loop to the gameState
 * which it creates when it initializes.
 */

var PS = PS || {};

(function() {
    PS.gameOver = false;
    PS.kill = function() { PS.gameOver = true; };

    PS.endGame = function() {
        console.log("game over!");
        PS.gameOver = true;
    };

    PS.createGameManager = function(renderer, input) {
        var prevTime = null;
        var gameState = PS.createGameState(renderer);

        input.setClickHandler(gameState.player.handleClick);

        // TODO(ddoucet): right now it seems like there's a slight padding
        // on the collision when it's game over.
        var gameLoop = function() {
            if (PS.gameOver)
                return;

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
