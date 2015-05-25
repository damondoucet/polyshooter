var PS = PS || {};

// TODO(ddoucet): I could just do all collision checking here?
// aka monsfact would get the gamestate, which exports player, bullets,
// and monsters

(function() {
    var MONSTER_RADIUS = 0.08;

    PS.createMonsterFactory = function(player, monsterManager, renderer) {
        var createMonster = function(sides, speed, centerX, centerY) {
            var angleToPlayer = function() {
                // TODO(ddoucet): player needs to export this stuff
                return Math.atan2(player.y() - centerY, player.x() - centerX);
            }

            return {
                update: function(monsterIndex, deltaTime) {
                    var angle = angleToPlayer();
                    centerX += speed * Math.cos(angle);
                    centerY += speed * Math.sin(angle);

                    // TODO(ddoucet): check for collision with player
                },

                render: function() {
                    // TODO(ddoucet): this might look better not filled? I think so
                    renderer.drawPolygon(
                        centerX, centerY,
                        angleToPlayer(), MONSTER_RADIUS, sides);
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
