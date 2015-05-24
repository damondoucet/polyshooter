/*
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
    var WIDTH_TO_HEIGHT_RATIO = 4.0/3;
    var WIDTH_FACTOR = 0.7, HEIGHT_FACTOR = 0.5;

    PS.createRenderer = function(canvas) {
        // TODO(ddoucet): replace these with drawMonster, drawBullet, drawPlayer
        // TODO(ddoucet): possibly use the word render instead of draw?
        context = canvas.getContext("2d");
        context.fillStyle = "rgb(0,0,0)";

        var setCanvasSize = function(width, height) {
            $(canvas).width(width);
            $(canvas).height(height);

            canvas.width = width;
            canvas.height = height;
        }

        var resizeCanvas = function() {
            var displayWidth = window.innerWidth * WIDTH_FACTOR,
                displayHeight = window.innerHeight * HEIGHT_FACTOR;

            if (displayWidth < displayHeight * WIDTH_TO_HEIGHT_RATIO)
                displayHeight = displayWidth / WIDTH_TO_HEIGHT_RATIO;
            else
                displayWidth = displayHeight * WIDTH_TO_HEIGHT_RATIO;

            setCanvasSize(displayWidth, displayHeight);
        };

        var gameCenterRadiusAngleToCanvasPoint = function(
                centerX, centerY, radius, angle) {
            // adjust coordinates
            centerX *= canvas.width;
            centerY *= canvas.height;
            radius *= canvas.height;

            var x = centerX + radius * Math.cos(angle),
                y = centerY + radius * Math.sin(angle);

            return {x: Math.round(x), y: Math.round(y)};
        }

        var createPolygonPoints = function(
                centerX, centerY, orientation, radius, sides) {
            // The first point is at
            // (centerX,centerY)+radius*(cos(O), sin(O)). Then, we add
            // 360.0/sides to the orientation, and loop sides times.
            var points = [];

            for (var i = 0; i < sides; i++) {
                var angle = orientation + i * 2*Math.PI / sides;
                points.push(gameCenterRadiusAngleToCanvasPoint(
                    centerX, centerY, radius, angle));
            }

            return points;
        }

        return {
            reset: function() {
                resizeCanvas();
                context.clearRect(0, 0, canvas.width, canvas.height);
            },

            fillCircle: function(centerX, centerY, radius) {
                // adjust coordinates
                centerX *= canvas.width;
                centerY *= canvas.height;
                radius *= canvas.height;

                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2*Math.PI);
                context.fill();
            },

            // The first point is at angle orientation (standard trig)
            fillPolygon: function(centerX, centerY, orientation, radius, sides) {
                var points = createPolygonPoints(
                    centerX, centerY, orientation, radius, sides);

                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (var i = 1, len = sides; i < len; i++)
                    context.lineTo(points[i].x, points[i].y);
                context.fill();
            },
        };
    };
})();