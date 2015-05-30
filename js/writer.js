/**
 * For writing messages to the canvas. Handles scaling fonts so that messages
 * fit comfortably in the canvas.
 */

var PS = PS || {};

(function() {
    var TITLE_MESSAGE = "polyshooter";
    var CONTROLS_MESSAGE = "WASD to move, click to shoot";
    var START_MESSAGE = "click anywhere to begin";
    var GAME_OVER_MESSAGE = "game over";
    var PLAY_AGAIN_MESSAGE = "click anywhere to play again";

    var SPLASH_START_SIZE = 3,
        SUBTEXT_START_SIZE = 1.5;
    PS.createWriter = function(renderer) {
        var canvasWrapper = renderer.canvasWrapper();
        var context = canvasWrapper.getContext();

        var writeLine = function(y, str, lineHeight) {
            var size = context.measureText(str);
            var x = (canvasWrapper.width() - size.width) / 2;
            context.fillText(str, x, y);
            y += lineHeight;
            return y;
        };

        // startSize is ems, desiredPadding is pixels
        // This is a pretty expensive function, but we only call it once per
        // splash and end-game screen, so it shouldn't be a problem.
        var findFont = function(msg, startSize, desiredPadding) {
            var getFont = function(size) {
                return size + "em Share Tech Mono";
            };
            var measureFont = function(font) {
                context.font = font;
                return context.measureText(msg).width;
            };
            var size = startSize;
            var maxSize = canvasWrapper.width() - desiredPadding * 2;

            while (measureFont(getFont(size)) > maxSize)
                size *= 0.9;

            console.log(getFont(size));
            return getFont(size);
        };

        return {
            writeTopRightCorner: function(str) {
                var X_PADDING = 10, Y_PADDING = 20;

                context.fillStyle = renderer.BLACK;
                context.font = "1.1em Share Tech Mono";

                var size = context.measureText(str);
                var x = canvasWrapper.width() - size.width - X_PADDING,
                    y = Y_PADDING;

                context.fillText(str, x, y);
            },

            writeSplash: function() {
                context.fillStyle = renderer.BLACK;

                var X_PADDING = 0.15 * canvasWrapper.width();
                var y = 0.3 * canvasWrapper.height();
                var padding = 0.1 * canvasWrapper.height();

                context.font = findFont(
                    TITLE_MESSAGE, SPLASH_START_SIZE, X_PADDING);
                y = writeLine(y, TITLE_MESSAGE, padding);

                // START_MESSAGE is longer than CONTROLS_MESSAGE, so we just
                // pick that one to measure.
                context.font = findFont(
                    START_MESSAGE, SUBTEXT_START_SIZE, X_PADDING);
                y = writeLine(y, CONTROLS_MESSAGE, padding / 2);
                y = writeLine(y, START_MESSAGE, 0);
            },

            writeGameOver: function(score, isHighScore) {
                context.fillStyle = renderer.BLACK;

                var X_PADDING = 0.05 * canvasWrapper.width();
                var y = 0.3 * canvasWrapper.height();
                var padding = 0.1 * canvasWrapper.height();

                context.font = findFont(
                    GAME_OVER_MESSAGE, SPLASH_START_SIZE, X_PADDING);
                y = writeLine(y, GAME_OVER_MESSAGE, padding);

                var scoreMessage = "score: " + score;
                if (isHighScore)
                    scoreMessage += " (high score!)";

                // Similarly, PLAY_AGAIN_MESSAGE should be longer than either
                // of the score messages, so we just pick that one to measure.
                context.font = findFont(
                    PLAY_AGAIN_MESSAGE, SUBTEXT_START_SIZE, X_PADDING);
                y = writeLine(y, scoreMessage, padding / 2);
                y = writeLine(y, "high score: " + PS.HighScore.get(), padding);
                y = writeLine(y, PLAY_AGAIN_MESSAGE, 0);
            },
        };
    }
})();
