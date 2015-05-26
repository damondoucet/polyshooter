var PS = PS || {};

(function() {
    var NUM_GAME_OVER_FRAMES = 3;
    var RADIUS = 0.05;
    var FARTHEST_FROM_SCREEN = 0.1;
    var MIN_SPEED = 0.001;
    var DIFFICULTY_TO_SPEED = 0.00001;
    var MIN_SIDES = 3;
    var MAX_SIDES = 5;

    PS.createMonsterFactory = function(
            player, bulletManager, monsterManager, renderer) {
        var difficulty = 0;

        var createMonster = function(sides, speed, centerX, centerY) {
            var angleToPlayer = function() {
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
                    if (sides >= 3)
                        renderer.drawPolygon(
                            centerX, centerY,
                            angleToPlayer(), RADIUS, sides);
                }
            };
        };

        // TODO(ddoucet):
        var time = 0;
        var numSpawned = 0;
        var computeNumToSpawn = function(deltaTime) {
            time += deltaTime;
            if (numSpawned < time / 1000) {
                numSpawned++;
                return 1;
            }
            return 0;
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

        // TODO(ddoucet): should speed be semi-random?
        var spawnMonster = function() {
            var sides = randomSides();
            var position = randomPosition();
            var speed = Math.max(MIN_SPEED, difficulty * DIFFICULTY_TO_SPEED);
            monsterManager.add(
                createMonster(sides, speed, position.x, position.y));
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
