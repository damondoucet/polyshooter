/**
 * Handles bullets (creating, updating, collision detection).
 *
 * Exports a createBulletFactory(bulletManager, renderer) function, which
 * creates an object that creates bullets.
 */

(function() {
    var RADIUS = 0.01;
    var SPEED = 0.001;

    PS.createBulletFactory = function(bulletManager, renderer) {
        return {
            radius: function() {
                return RADIUS;
            },

            createBullet: function(centerX, centerY, angle) {
                var xUnit = Math.cos(angle);
                var yUnit = Math.sin(angle);

                var bullet = {
                    x: function() { return centerX; },
                    y: function() { return centerY; },
                    radius: function() { return RADIUS; },

                    update: function(bulletIndex, deltaTime) {
                        centerX += xUnit * deltaTime * SPEED;
                        centerY += yUnit * deltaTime * SPEED;

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
