/**
 * Handles the game state, aka player, monsters, bullets. It is responsible for
 * rendering and updating each of the objects.
 */

var PS = PS || {};

(function() {
    PS.createGameState = function(renderer) {
        var lastTime = null;

        var bullets = [];
        var monsters = [];

        var addBullet = function(bullet) {
            bullets.push(bullet);
        }

        var bulletFactory = PS.createBulletFactory(addBullet, renderer);
        var player = PS.createPlayer(renderer, bulletFactory);

        return {
            player: player,

            update: function(deltaTime) {
                for (var i = 0, len = bullets.length; i < len; i++)
                    bullets[i].update(deltaTime);
            },

            render: function() {
                renderer.reset();
                player.render();
                for (var i = 0, len = bullets.length; i < len; i++)
                    bullets[i].render();
            }
        };
    };
})();
