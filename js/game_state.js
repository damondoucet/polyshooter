/**
 * Handles the game state, aka player, monsters, bullets. It is responsible for
 * rendering and updating each of the objects.
 */

var PS = PS || {};

(function() {
    // Manages a set of objects for the game.
    // On any given frame, the set of objects is constant (so that there is no
    // confusion with iterating and removing). add() and remove() both store
    // updates for later, and then apply() actually applies the updates.
    var createObjectManager = function() {
        var objs = [];
        var removedIndices = [];
        var addedObjs = [];

        var apply = function() {
            // remove objects first
            PS.util.sortInts(removedIndices);
            var numRemoved = 0;
            var prev = null;
            while (removedIndices.length > 0) {
                var index = removedIndices.pop();
                if (index == prev)
                    continue;

                index -= numRemoved;
                numRemoved++;

                objs.splice(index, 1);  // remove the object
            }

            // then add the objects
            while (addedObjs.length > 0)
                objs.push(addedObjs.pop());
        };

        return {
            get: function() {
                return objs;
            },

            add: function(obj) {
                addedObjs.push(obj);
            },

            remove: function(index) {
                removedIndices.push(index);
            },

            update: function(deltaTime) {
                for (var i = 0, len = objs.length; i < len; i++)
                    objs[i].update(i, deltaTime);
                apply();
            },

            render: function() {
                for (var i = 0, len = objs.length; i < len; i++)
                    objs[i].render();
            }
        };
    }

    PS.createGameState = function(renderer) {
        var lastTime = null;

        var bulletManager = createObjectManager();
        var monsterManager = createObjectManager();

        var bulletFactory = PS.createBulletFactory(bulletManager, renderer);
        var player = PS.createPlayer(renderer, bulletFactory);

        return {
            player: player,

            update: function(deltaTime) {
                bulletManager.update(deltaTime);
            },

            render: function() {
                renderer.reset();
                bulletManager.render();
                player.render();
            }
        };
    };
})();