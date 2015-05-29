/**
 * The renderer guarantees the same aspect ratio (4:3) no matter the screen
 * size.
 *
 * createRenderer(canvas) should be called once (on initializiation).
 * Then, at the beginning of each frame, reset() should be called, and then
 * any methods needed for drawing that particular frame.
 *
 * x-coordinates should be given as a percent of the width.
 * y-coordinates should be given as a percent of the height.
 * sizes (e.g. radii) should be given as a percent of the height.
 */

var PS = PS || {};

(function() {
    var X_PADDING = 10, Y_PADDING = 20;

    PS.createRenderer = function(canvasWrapper) {
        var PADDING_PERCENT = canvasWrapper.PADDING_PERCENT;
        context = canvasWrapper.getContext();

        var createPolygonPoints = function(
                centerX, centerY, orientation, radius, sides) {
            var percentPoints = PS.Polygons.polygonPoints(
                centerX, centerY, orientation, radius, sides);

            return _.map(percentPoints, function(pt) {
                return {
                    x: pt.x * canvasWrapper.width(),
                    y: pt.y * canvasWrapper.height()
                };
            });
        };

        var makeCircle = function(centerX, centerY, radius, shouldFill, color) {
            // adjust coordinates
            centerX *= canvasWrapper.width();
            centerY *= canvasWrapper.height();
            radius *= canvasWrapper.height();

            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2*Math.PI);

            if (shouldFill) {
                context.fillStyle = color;
                context.fill();
            }
            else {
                context.strokeStyle = color;
                context.stroke();
            }
        };

        var SPLASH_FONT = "3em Share Tech Mono",
            SUBTEXT_FONT = "1.5em Share Tech Mono";
        var writeLine = function(y, str, lineHeight) {
            var size = context.measureText(str);
            var x = (canvasWrapper.width() - size.width) / 2;
            context.fillText(str, x, y);
            y += lineHeight;
            return y;
        };

        var BLACK = "#000",
            GRAY = "#ccc",
            RED = "#a00";
        return {
            BLACK: BLACK,
            GRAY: GRAY,
            RED: RED,

            canvasWrapper: function() { return canvasWrapper; },

            reset: function() {
                canvasWrapper.reset();
                var w = canvasWrapper.width(),
                    h = canvasWrapper.height();
                context.clearRect(0, 0, w, h);

                context.strokeStyle = GRAY;
                context.strokeRect(
                    PADDING_PERCENT * w,
                    PADDING_PERCENT * h,
                    (1 - 2 * PADDING_PERCENT) * w,
                    (1 - 2 * PADDING_PERCENT) * h);
                context.strokeStyle = BLACK;
            },

            drawCircle: function(centerX, centerY, radius, color) {
                makeCircle(centerX, centerY, radius, false, color);
            },

            fillCircle: function(centerX, centerY, radius) {
                var color = PS.gameOver ? GRAY : BLACK;
                makeCircle(centerX, centerY, radius, true, color);
            },

            // The first point is at angle orientation (standard trig)
            drawPolygon: function(centerX, centerY,
                    orientation, radius, sides, color) {
                var points = createPolygonPoints(
                    centerX, centerY, orientation, radius, sides);

                context.strokeStyle = color;
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (var i = 1, len = sides; i < len; i++)
                    context.lineTo(points[i].x, points[i].y);
                context.closePath();
                context.stroke();
            },

            writeTopRightCorner: function(str) {
                context.font = "1.1em Share Tech Mono";
                var size = context.measureText(str);
                var x = canvasWrapper.width() - size.width - X_PADDING,
                    y = Y_PADDING;

                context.fillText(str, x, y);
            },

            writeSplash: function() {
                context.fillStyle = BLACK;

                var y = 0.3 * canvasWrapper.height();
                var padding = 0.1 * canvasWrapper.height();

                context.font = SPLASH_FONT;
                y = writeLine(y, "polyshooter", padding);

                context.font = SUBTEXT_FONT;
                y = writeLine(y, "WASD to move, click to shoot", padding / 2);
                y = writeLine(y, "click anywhere to begin", 0);
            },

            writeGameOver: function(score, isHighScore) {
                context.fillStyle = BLACK;

                var y = 0.3 * canvasWrapper.height();
                var padding = 0.1 * canvasWrapper.height();

                context.font = SPLASH_FONT;
                y = writeLine(y, "game over", padding);

                context.font = SUBTEXT_FONT;
                var scoreMessage = "score: " + score;
                if (isHighScore)
                    scoreMessage += " (high score!)";

                y = writeLine(y, scoreMessage, padding / 2);
                y = writeLine(y, "high score: " + PS.HighScore.get(), padding);
                y = writeLine(y, "click anywhere to play again", 0);
            }
        };
    };
})();
