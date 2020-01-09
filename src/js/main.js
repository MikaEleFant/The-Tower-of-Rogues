'use strict';

const game = new Phaser.Game(800, 768, Phaser.AUTO, 'game',false,false);

game.state.add('Boot', GameCtrl.Boot);
game.state.add('Preloader', GameCtrl.Preloader);
game.state.add('Arena', GameCtrl.Arena);
game.state.start('Boot');