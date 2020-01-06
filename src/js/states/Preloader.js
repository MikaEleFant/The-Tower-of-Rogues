(function () {
	'use strict';

	GameCtrl.Preloader = function () {
		this.background = null;
		this.preloadBar = null;
		this.ready = false;
	};

	GameCtrl.Preloader.prototype = {

		preload: function () {		
			this.background = this.add.sprite(this.game.width / 2 - 250, this.game.height / 2 - 70, 'preloaderBackground');
			this.preloadBar = this.add.sprite(this.game.width / 2 - 250, this.game.height / 2 - 70, 'preloaderBar');
			this.load.setPreloadSprite(this.preloadBar);
			this.load.image('forest-tiles', 'assets/images/foresttiles_0.png');

			this.load.spritesheet('forest-tiles', 'assets/images/foresttiles_0.png', 32, 32);
			this.load.spritesheet('hero', 'assets/images/hero.png', 32, 32);
			this.load.spritesheet('orc', 'assets/images/orc.png', 32, 32);

		},

		create: function () {
			this.preloadBar.cropEnabled = false;
		},

		update: function () {
			this.game.state.start('Arena');
		}
	};
})();