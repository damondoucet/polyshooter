/**
 * Handles bullets (creating, updating, collision detection).
 *
 * Exports a createBulletFactory(bulletManager, renderer) function, which
 * creates an object that creates bullets.
 */

(function() {
    var BULLET_RADIUS = 0.01;
    var BULLET_VELOCITY = 0.001;  // TODO(ddoucet)

    // TODO(ddoucet): how to handle collisions? what is it checking against?
    PS.createBulletFactory = function(bulletManager, renderer) {
        var createBullet = function(centerX, centerY, angle) {
            var xUnit = Math.cos(angle);
            var yUnit = Math.sin(angle);

            return {
                update: function(bulletIndex, deltaTime) {
                    centerX += xUnit * deltaTime * BULLET_VELOCITY;
                    centerY += yUnit * deltaTime * BULLET_VELOCITY;

                    if (renderer.canvasWrapper().circleIsOutsideBounds(
                            centerX, centerY, BULLET_RADIUS)) {
                        bulletManager.remove(bulletIndex);
                    }
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
                bulletManager.add(createBullet(centerX, centerY, angle));
            }
        }
    }
})();
