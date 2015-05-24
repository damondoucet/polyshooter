/**
 * Entry point into the game. Creates the renderer, sets up input handlers,
 * then starts the game loop.
 */

var PS = PS || {};

$(function() {
    var canvas = document.getElementById('game');
    if (!canvas.getContext) {
        console.log("Unsupported browser!");
        return;
    }

    canvas.focus();

    var renderer = PS.createRenderer(canvas);
    var input = PS.registerInput(canvas);
    PS.createGameManager(renderer, input);
});
