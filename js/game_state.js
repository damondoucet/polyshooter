/**
 * Handles the game state, aka player, monsters, bullets. It is responsible for
 * rendering and updating each of the objects.
 */

var PS = PS || {};

(function() {
    var BULLET_VELOCITY = 1;  // TODO(ddoucet)

    PS.createGameState = function(renderer) {
        var lastTime = null;

        var player = PS.createPlayer(renderer);
        var bullets = [];
        var monsters = [];

        var createBullet = function(centerX, centerY, angle) {
            // TODO(ddoucet)
        }

        return {
            player: player,

            update: function(deltaTime) {
            },

            render: function() {
                renderer.reset();
                player.render();
            }
        };
    };
})();
