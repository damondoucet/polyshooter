/**
 * Entry point into the game. Creates the renderer, sets up input handlers,
 * then starts the game loop.
 */

var PS = PS || {};

// window load, specifically, is important here because it ensures that the
// external css (our font) is loaded before calling our function. Without that,
// our splash screen would get written without the font.
$(window).load(function() {
    var canvas = document.getElementById('game');
    if (!canvas.getContext) {
        console.log("Unsupported browser!");
        return;
    }

    canvas.focus();

    var canvasWrapper = PS.createCanvasWrapper(canvas);
    var renderer = PS.createRenderer(canvasWrapper);
    var input = PS.registerInput(canvas);

    input.addClickHandler(function() {
        if (PS.gameOver && Date.now() - PS.gameOverTime > 1000) {
            PS.gameOver = false;
            PS.createGameManager(renderer, input);
        }
    });

    renderer.reset();
    PS.createWriter(renderer).writeSplash();
});
