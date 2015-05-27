var PS = PS || {};

(function() {
    var RADIUS = 0.03;
    var FARTHEST_FROM_SCREEN = 0.1;
    var SPEED = 0.000075;
    var MIN_SIDES = 3;
    var MAX_SIDES = 5;

    PS.createMonsterFactory = function(
            player, bulletManager, monsterManager, renderer) {
        var difficulty = 0;

        var createMonster = function(sides, speed, centerX, centerY) {
            var angleToPlayer = function() {
                return Math.atan2(player.y() - centerY, player.x() - centerX);
            }

            var findCollidingBullets = function() {
                var bullets = bulletManager.get();
                var indices = [];
                for (var i = 0, len = bullets.length; i < len; i++) {
                    var bullet = bullets[i];
                    if (PS.Polygons.circlePolygonCollide(
                            bullet.x(), bullet.y(), bullet.radius(),
                            centerX, centerY, angleToPlayer(), RADIUS, sides))
                        indices.push(i);
                }

                return indices;
            };

            var collidesWithPlayer = function() {
                return PS.Polygons.circlePolygonCollide(
                    player.x(), player.y(), player.radius(),
                    centerX, centerY, angleToPlayer(), RADIUS, sides);
            };

            return {
                update: function(monsterIndex, deltaTime) {
                    var angle = angleToPlayer();
                    centerX += speed * Math.cos(angle) * deltaTime;
                    centerY += speed * Math.sin(angle) * deltaTime;

                    var bullets = findCollidingBullets();
                    $(bullets).each(function(_, index) {
                        if (sides >= 3) {
                            bulletManager.remove(index);
                            sides--;
                        }
                    });

                    if (sides < 3) {
                        monsterManager.remove(monsterIndex);
                        return;
                    }

                    if (collidesWithPlayer()) {
                        centerX += speed * Math.cos(angle);
                        centerY += speed * Math.sin(angle);
                        PS.endGame();
                    }
                },

                render: function() {
                    if (sides >= 3)
                        renderer.drawPolygon(
                            centerX, centerY,
                            angleToPlayer(), RADIUS, sides);
                }
            };
        };

        // TODO(ddoucet): this should technically evaluate whether it should
        // spawn over a number of epochs and return the number of times that
        // evaluated to true, but I'll assume that delta times are short enough
        // for it to not matter here.
        var currentTime = 0;
        var numSpawned = 0;
        var computeNumToSpawn = function(deltaTime) {
            currentTime += deltaTime;

            var monstersPerSec = 1 + 0.05 * currentTime / 1000;
            return Math.random() < monstersPerSec * deltaTime / 1000;
        };

        var rand = function(min, max) {
            return Math.random() * (max - min) + min;
        };

        // We want to spawn the monster off the screen. So we randomly choose
        // for them to be off the x side or the y side, and randomly off the
        // negative (left/top) or positive (right/bottom) sides.
        // Then we choose values corresponding to those.
        var randomPosition = function() {
            var isX = Math.random() < 0.5;
            var isNegative = Math.random() < 0.5;
            var delta = rand(0, FARTHEST_FROM_SCREEN);
            var otherCoord = rand(-FARTHEST_FROM_SCREEN, 1 + FARTHEST_FROM_SCREEN);

            var coord = isNegative ? -delta : 1 + delta;
            if (isX)
                return { x: coord, y: otherCoord };
            return { x: otherCoord, y: coord };
        }

        var randomSides = function() {
            return ~~rand(MIN_SIDES, MAX_SIDES + 1);
        }

        var spawnMonster = function() {
            var sides = randomSides();
            var position = randomPosition();
            monsterManager.add(
                createMonster(sides, SPEED, position.x, position.y));
        };

        return {
            setDifficulty: function(diff) {
                difficulty = diff;
            },

            // Spawns a number of monsters based on the elapsed time since the
            // last spawning, and the current difficulty.
            update: function(deltaTime) {
                var numMonsters = computeNumToSpawn(deltaTime);
                for (var i = 0; i < numMonsters; i++)
                    spawnMonster();
            },
        };
    };
})();
