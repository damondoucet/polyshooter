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

// TODO(ddoucet): should it be black on white or white on black?

var PS = PS || {};

(function() {
    PS.createRenderer = function(canvasWrapper) {
        context = canvasWrapper.getContext();

        var createPolygonPoints = function(
                centerX, centerY, orientation, radius, sides) {
            var percentPoints = PS.Polygons.polygonPoints(
                centerX, centerY, orientation, radius, sides);

            var points = [];
            for (var i = 0, len = percentPoints.length; i < len; i++)
                points.push({
                    x: percentPoints[i].x * canvasWrapper.width(),
                    y: percentPoints[i].y * canvasWrapper.height()
                });
            return points;
        };

        return {
            canvasWrapper: function() { return canvasWrapper; },

            reset: function() {
                canvasWrapper.reset();
                context.clearRect(0, 0,
                    canvasWrapper.width(),
                    canvasWrapper.height());
            },

            fillCircle: function(centerX, centerY, radius) {
                // adjust coordinates
                centerX *= canvasWrapper.width();
                centerY *= canvasWrapper.height();
                radius *= canvasWrapper.height();

                context.beginPath();
                context.arc(centerX, centerY, radius, 0, 2*Math.PI);
                context.fill();
            },

            // The first point is at angle orientation (standard trig)
            drawPolygon: function(centerX, centerY,
                    orientation, radius, sides) {
                var points = createPolygonPoints(
                    centerX, centerY, orientation, radius, sides);

                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                for (var i = 1, len = sides; i < len; i++)
                    context.lineTo(points[i].x, points[i].y);
                context.closePath();
                context.stroke();
            },
        };
    };
})();
