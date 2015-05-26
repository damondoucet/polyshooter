var PS = PS || {};

// TODO(ddoucet): I could just do all collision checking here?
// aka monsfact would get the gamestate, which exports player, bullets,
// and monsters

(function() {
    var NUM_GAME_OVER_FRAMES = 3;
    var RADIUS = 0.08;

    PS.createMonsterFactory = function(
            player, bulletManager, monsterManager, renderer) {
        var createMonster = function(sides, speed, centerX, centerY) {
            var angleToPlayer = function() {
                // TODO(ddoucet): player needs to export this stuff
                return Math.atan2(player.y() - centerY, player.x() - centerX);
            }

            var findCollidingBullet = function() {
                var bullets = bulletManager.get();
                for (var i = 0, len = bullets.length; i < len; i++) {
                    var bullet = bullets[i];
                    if (PS.Polygons.circlePolygonCollide(
                            bullet.x(), bullet.y(), bullet.radius(),
                            centerX, centerY, angleToPlayer(), RADIUS, sides))
                        return i;
                }

                return -1;
            };

            var collidesWithPlayer = function() {
                return PS.Polygons.circlePolygonCollide(
                    player.x(), player.y(), player.radius(),
                    centerX, centerY, angleToPlayer(), RADIUS, sides);
            };

            return {
                update: function(monsterIndex, deltaTime) {
                    var angle = angleToPlayer();
                    centerX += speed * Math.cos(angle);
                    centerY += speed * Math.sin(angle);

                    var bulletIndex = findCollidingBullet();
                    if (bulletIndex != -1) {
                        bulletManager.remove(bulletIndex);
                        sides--;

                        if (sides < 3) {
                            monsterManager.remove(monsterIndex);
                            return;
                        }
                    }

                    if (collidesWithPlayer()) {
                        centerX += speed * Math.cos(angle) * NUM_GAME_OVER_FRAMES;
                        centerY += speed * Math.sin(angle) * NUM_GAME_OVER_FRAMES;
                        PS.endGame();
                    }
                },

                render: function() {
                    renderer.drawPolygon(
                        centerX, centerY,
                        angleToPlayer(), RADIUS, sides);
                }
            };
        };

        return {
            // TODO(ddoucet)
            create: function(sides, speed, cx, cy) {
                monsterManager.add(createMonster(sides, speed, cx, cy));
            }
        };
    };
})();
