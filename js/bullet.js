/**
 * Handles bullets (creating, updating, collision detection).
 *
 * Exports a createBulletFactory(bulletManager, renderer) function, which
 * creates an object that creates bullets.
 */

(function() {
    var RADIUS = 0.01;
    var VELOCITY = 0.001;  // TODO(ddoucet)

    // TODO(ddoucet): how to handle collisions? what is it checking against?
    PS.createBulletFactory = function(bulletManager, renderer) {
        return {
            radius: function() {
                return RADIUS;
            },

            createBullet: function(centerX, centerY, angle) {
                var xUnit = Math.cos(angle);
                var yUnit = Math.sin(angle);

                var bullet = {
                    update: function(bulletIndex, deltaTime) {
                        centerX += xUnit * deltaTime * VELOCITY;
                        centerY += yUnit * deltaTime * VELOCITY;

                        if (renderer.canvasWrapper().circleIsOutsideBounds(
                                centerX, centerY, RADIUS)) {
                            bulletManager.remove(bulletIndex);
                        }
                    },
                    render: function() {
                        renderer.fillCircle(centerX, centerY, RADIUS);
                    }
                };
                bulletManager.add(bullet);
            }
        }
    }
})();
