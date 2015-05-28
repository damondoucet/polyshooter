var PS = PS || {};

(function() {
    var sqDist = function(x1, y1, x2, y2) {
        var dx = x1 - x2,
            dy = y1 - y2;
        return dx * dx + dy * dy;
    };

    var polygonPoints = function(
            centerX, centerY, orientation, radius, sides) {
        // The first point is at
        // (centerX,centerY)+radius*(cos(O), sin(O)). Then, we add
        // 360.0/sides to the orientation, and loop sides times.

        var xRadius = radius / PS.WIDTH_TO_HEIGHT_RATIO;
        return _.map(_.range(sides),
            function(i) {
                var angle = orientation + i * 2*Math.PI / sides;
                var x = centerX + xRadius * Math.cos(angle),
                    y = centerY + radius * Math.sin(angle);
                return {x: x, y: y};
            });
    };

    var sub = function(p1, p2) {
        return {x: p1.x - p2.x, y: p1.y - p2.y};
    };

    var dot = function(p1, p2) {
        return p1.x * p2.x + p1.y * p2.y;
    };

    var magnitude = function(pt) {
        return Math.sqrt(dot(pt, pt));
    };

    var unit = function(pt) {
        var mag = 1.0 * magnitude(pt);
        return {x: pt.x / mag, y: pt.y / mag};
    };

    PS.Polygons = {
        polygonPoints: polygonPoints,

        // circle: x, y, radius
        // polygon: x, y, orientation, radius, sides
        // TODO(ddoucet): there's a bug here because this is testing circle
        // collision, even though we're technically ellipses.
        circlePolygonCollide: function(cX, cY, cR, pX, pY, pO, pR, pS) {
            var circleCenter = {x: cX, y: cY},
                polyCenter = {x: pX, y: pY};
            var polyToCircle = sub(circleCenter, polyCenter);
            var axis = unit(polyToCircle);

            var points = polygonPoints(pX, pY, pO, pR, pS);
            var best = _.max(_.map(points, function(pt) {
                return dot(sub(pt, polyCenter), axis);
            }));

            return !(magnitude(polyToCircle) > 0 &&
                magnitude(polyToCircle) - best - cR > 0);
        }
    };
})();
