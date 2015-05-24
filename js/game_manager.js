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

    PS.createGameManager = function(renderer, input) {
        var prevTime = null;
        var gameState = PS.createGameState(renderer);

        input.setClickHandler(gameState.player.handleClick);

        var gameLoop = function(time) {
            if (PS.gameOver)
                return;
            if (!prevTime)
                prevTime = time;

            window.requestAnimationFrame(gameLoop);
            gameState.player.handleKeys(input.getKeysDown());
            gameState.update(time - prevTime);
            gameState.render();

            prevTime = time;
        };

        window.requestAnimationFrame(gameLoop);
    }
})();
