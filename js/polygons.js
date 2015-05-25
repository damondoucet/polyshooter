var PS = PS || {};

(function() {
    var sqDist = function(x1, y1, x2, y2) {
        var dx = x1 - x2,
            dy = y1 - y2;
        return dx * dx + dy * dy;
    }

    var polygonPoints = function(
            centerX, centerY, orientation, radius, sides) {
        // The first point is at
        // (centerX,centerY)+radius*(cos(O), sin(O)). Then, we add
        // 360.0/sides to the orientation, and loop sides times.
        var points = [];

        for (var i = 0; i < sides; i++) {
            var angle = orientation + i * 2*Math.PI / sides;
            var xRadius = radius / PS.WIDTH_TO_HEIGHT_RATIO;
            var x = centerX + xRadius * Math.cos(angle),
                y = centerY + radius * Math.sin(angle);
            points.push({x: x, y: y});
        }

        return points;
    };

    // Adapted from
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var pointInPolygon = function(points, x, y) {
        var sides = points.length;
        var c = false;
        for (var i = 0, j = sides - 1; i < sides; j = i++) {
            var sideXLength = points[j].x - points[i].x;
            var sideYLength = points[j].y - points[i].y;
            if ((x - points[i].x) * sideYLength < sideXLength * (y - points[i].y))
                c = !c;
        }
        return c;
    };

    var pointInCircle = function(centerX, centerY, radius, x, y) {
        return sqDist(centerX, centerY, x, y) <= radius * radius;
    };

    PS.Polygons = {
        polygonPoints: polygonPoints,

        // circle: x, y, radius
        // polygon: x, y, orientation, radius, sides
        circlePolygonCollide: function(cX, cY, cR, pX, pY, pO, pR, pS) {
            var points = polygonPoints(pX, pY, pO, pR, pS);

            // does the polygon contain the circle's center?
            if (pointInPolygon(pX, pY, pO, pR, pS, cX, cY))
                return true;

            // does the circle contain any of the polygon's points?
            for (var i = 0, len = points.length; i < len; i++)
                if (pointInCircle(cX, cY, cR, points[i].x, points[i].y))
                    return true;

            return false;
        }
    };
})();
