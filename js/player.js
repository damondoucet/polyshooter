/**
 * Handles the player, which involves handling input and rendering.
 */

var PS = PS || {};

(function() {
    var RADIUS = 0.03;
    var SPEED = 0.0004;
    var FRICTION = 0.000004;

    var KEY_TO_SPEED = {
        "W": {x: 0, y: -SPEED},
        "A": {x: -SPEED, y: 0},
        "S": {x: 0, y: SPEED},
        "D": {x: SPEED, y: 0}
    };

    PS.createPlayer = function(renderer, bulletFactory) {
        var centerX = 0.5,
            centerY = 0.5;

        var xSpeed = 0.0,
            ySpeed = 0.0;

        var sign = function(v) {
            return v == 0 ? 0 : v / Math.abs(v);
        }

        var applyFriction = function(value, frictionAmount) {
            var valueSign = sign(value);

            value -= valueSign * frictionAmount;
            if (sign(value) != valueSign)
                value = 0;

            return value;
        };

        return PS.player = {
            x: function() { return centerX; },
            y: function() { return centerY; },
            radius: function() { return RADIUS; },

            handleKeys: function(keysDown, deltaTime) {
                $.each(keysDown, function(key, isDown) {
                    if (isDown) {
                        var speed = KEY_TO_SPEED[key] || {x: 0, y: 0};
                        if (speed.x !== 0)
                            xSpeed = speed.x;
                        if (speed.y !== 0)
                            ySpeed = speed.y;
                    }
                });
            },

            handleClick: function(x, y) {
                var r = (RADIUS + bulletFactory.radius()),
                    angle = Math.atan2(y - centerY, x - centerX);

                var x = centerX + r * Math.cos(angle),
                    y = centerY + r * Math.sin(angle);

                bulletFactory.createBullet(x, y, angle);
            },

            update: function(deltaTime) {
                centerX += xSpeed * deltaTime;
                centerY += ySpeed * deltaTime;

                var center = renderer
                    .canvasWrapper()
                    .clampCircle(centerX, centerY, RADIUS);
                if (centerX != center.x) {
                    xSpeed = 0;
                    centerX = center.x;
                }
                if (centerY != center.y) {
                    ySpeed = 0;
                    centerY = center.y;
                }

                xSpeed = applyFriction(xSpeed, FRICTION * deltaTime);
                ySpeed = applyFriction(ySpeed, FRICTION * deltaTime);
            },

            render: function() {
                renderer.drawCircle(centerX, centerY, RADIUS);
            }
        };
    };
})();
