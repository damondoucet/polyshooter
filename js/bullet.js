/**
 * Handles
 */

(function() {
    var BULLET_RADIUS = 0.01;
    var BULLET_VELOCITY = 0.001;  // TODO(ddoucet)

    // TODO(ddoucet): how to handle collisions? what is it checking against?
    PS.createBulletFactory = function(addBullet, renderer) {
        var createBullet = function(centerX, centerY, angle) {
            var xUnit = Math.cos(angle);
            var yUnit = Math.sin(angle);

            return {
                update: function(deltaTime) {
                    centerX += xUnit * deltaTime * BULLET_VELOCITY;
                    centerY += yUnit * deltaTime * BULLET_VELOCITY;

                    // TODO(ddoucet): need to be removed if outside of bounds
                },
                render: function() {
                    renderer.fillCircle(centerX, centerY, BULLET_RADIUS);
                }
            };
        }

        return {
            createBullet: function(playerX, playerY, playerRadius, angle) {
                var r = (playerRadius + BULLET_RADIUS);
                var centerX = playerX + r * Math.cos(angle);
                var centerY = playerY + r * Math.sin(angle);
                addBullet(createBullet(centerX, centerY, angle));
            }
        }
    }
})();
