var PS = PS || {};

(function() {
    var MAX_DELTA_ANGLE_PER_MS = Math.PI / 2000;

    var RADIUS = 0.03;
    var FARTHEST_FROM_SCREEN = 0.1;
    var SPEED = 0.000075;
    var MIN_SIDES = 3;
    var MAX_SIDES = 5;

    var SIDES_TO_MIN_TIME = {
        3: 0,
        4: 3000,
        5: 10000
    };

    PS.createMonsterFactory = function(
            player, bulletManager, monsterManager, renderer) {
        var currentTime = 0;
        var difficulty = 0;

        var createMonster = function(sides, speed, centerX, centerY) {
            var killedPlayer = false;

            var getColor = function() {
                if (PS.gameOver)
                    return killedPlayer ? renderer.RED : renderer.GRAY;
                return renderer.BLACK;
            };

            var clampAngle = function(angle) {
                while (angle < 0)
                    angle += 2 * Math.PI;
                while (angle > 2 * Math.PI)
                    angle -= 2 * Math.PI;
                return angle;
            };

            var angleToPlayer = function() {
                var angle = Math.atan2(
                    player.y() - centerY,
                    player.x() - centerX);
                return clampAngle(angle);
            }

            var angle = angleToPlayer();

            var findCollidingBullets = function() {
                var bullets = bulletManager.get();
                var indices = [];
                for (var i = 0, len = bullets.length; i < len; i++) {
                    if (bulletManager.hasBeenRemoved(i))
                        continue;

                    var bullet = bullets[i];
                    if (PS.Polygons.circlePolygonCollide(
                            bullet.x(), bullet.y(), bullet.radius(),
                            centerX, centerY, angle, RADIUS, sides))
                        indices.push(i);
                }

                return indices;
            };

            var collidesWithPlayer = function() {
                return PS.Polygons.circlePolygonCollide(
                    player.x(), player.y(), player.radius() * 0.9,
                    centerX, centerY, angle, RADIUS, sides);
            };

            // a1 - a2; 0 <= a1,a2 < 2pi
            var subtractAngles = function(a1, a2) {
                var res = clampAngle(a1 - a2);
                if (res > Math.PI)
                    res = -(2 * Math.PI - res);
                return res;
            };

            var updateAngle = function(deltaTime) {
                var fullDelta = subtractAngles(angleToPlayer(), angle);
                var max = MAX_DELTA_ANGLE_PER_MS * deltaTime;
                var deltaAngle = PS.util.clampSign(
                    fullDelta, 0, max);
                angle = clampAngle(angle + deltaAngle);
            };

            return {
                update: function(monsterIndex, deltaTime) {
                    updateAngle(deltaTime);

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
                        killedPlayer = true;
                        PS.endGame();
                    }
                },

                render: function() {
                    if (sides >= 3)
                        renderer.drawPolygon(
                            centerX, centerY,
                            angle, RADIUS, sides,
                            getColor());
                }
            };
        };

        // We want to spawn a few triangles early on to ease the player into
        // the game.
        var FIRST_SPAWN_TIMES = [200, 1000, 2000, 2500];
        var firstSpawnIndex = 0;
        var computeNumToSpawn = function(deltaTime) {
            if (firstSpawnIndex < FIRST_SPAWN_TIMES.length &&
                    currentTime >= FIRST_SPAWN_TIMES[firstSpawnIndex]) {
                firstSpawnIndex++;
                return 1;
            }

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
            var generateSides = function() {
                return ~~rand(MIN_SIDES, MAX_SIDES + 1);
            };
            var sides = generateSides();
            while (SIDES_TO_MIN_TIME[sides] > currentTime)
                sides = generateSides();
            return sides;
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
                currentTime += deltaTime;
                var numMonsters = computeNumToSpawn(deltaTime);
                for (var i = 0; i < numMonsters; i++)
                    spawnMonster();
            },
        };
    };
})();
