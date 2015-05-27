/**
 * Handles the player, which involves handling input and rendering.
 */

var PS = PS || {};

(function() {
    var RADIUS = 0.03;
    var MOVEMENT = 0.001;

    var KEY_TO_DELTA = {
        "W": {x: 0, y: -MOVEMENT},
        "A": {x: -MOVEMENT, y: 0},
        "S": {x: 0, y: MOVEMENT},
        "D": {x: MOVEMENT, y: 0}
    };

    PS.createPlayer = function(renderer, bulletFactory) {
        var centerX = 0.5,
            centerY = 0.5;

        return PS.player = {
            x: function() { return centerX; },
            y: function() { return centerY; },
            radius: function() { return RADIUS; },

            handleKeys: function(keysDown, deltaTime) {
                $.each(keysDown, function(key, isDown) {
                    if (isDown) {
                        var delta = KEY_TO_DELTA[key] || {x: 0, y: 0};
                        centerX += delta.x * deltaTime;
                        centerY += delta.y * deltaTime;
                    }
                });

                var center = renderer
                    .canvasWrapper()
                    .clampCircle(centerX, centerY, RADIUS);
                centerX = center.x;
                centerY = center.y;
            },

            handleClick: function(x, y) {
                var r = (RADIUS + bulletFactory.radius()),
                    angle = Math.atan2(y - centerY, x - centerX);

                var x = centerX + r * Math.cos(angle),
                    y = centerY + r * Math.sin(angle);

                bulletFactory.createBullet(x, y, angle);
            },

            render: function() {
                renderer.drawCircle(centerX, centerY, RADIUS);
            }
        };
    };
})();
