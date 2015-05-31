# Polyshooter

2D shooter in which the player is a circle, shooting polygons that spawn from
the edge of the screen.

![alt tag](http://damondoucet.net/img/polyshooter.png)

You can play the game [here](http://damondoucet.net/polyshooter).

## Software Architecture

The entry point is `game.js`. `game_manager.js` and `game_state.js` handle
general game flow. `canvas_wrapper.js`, `renderer.js`, and `writer.js` handle
drawing to the canvas. `player.js`, `bullet.js`, and `monster.js` are all game
objects used by the game state. `input.js` handles input (clicks and key
presses), and the rest of the files (`util.js`, `polygons.js`, `rAF.js`,
`high_score.js`) all provide utilities for the game.

