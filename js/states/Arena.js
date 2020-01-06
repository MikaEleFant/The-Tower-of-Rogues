'use strict';

const ROWS = 50,
	COLS = 50;

const ACTORS = 25;

let player,
	actorList,
	playerHUD;

let actorMap;

function generateMap (keyName, _cache, width, height, tilewidth, tileheight) {
	let _map = new ROT.Map.Rogue(width, height);

	let jsonmap = {
		layers: [{
			data: new Array(width * height),
			height: height,
			name: 'ground',
			opacity: 1,
			type: 'tilelayer',
			visible: true,
			width: width,
			x: 0,
			y: 0
		}, {
			data: [],
			height: height,
			name: 'decoration',
			opacity: 1,
			type: 'tilelayer',
			visible: true,
			width: width,
			x: 0,
			y: 0
		}
		],
		orientation: 'orthogonal',
		properties: {},
		tileheight: tileheight,
		tilesets: [{
			firstgid: 1,
			image: 'assets/images/foresttiles_0.png',
			imagewidth: 160,
			imageheight: 224,
			margin: 0,
			name: 'forest-tiles',
			properties: {},
			spacing: 0,
			tileheight: tileheight,
			tilewidth: tilewidth
		}],
		tilewidth: tilewidth,
		version: 1,
		height: tileheight,
		width: tilewidth
	};

	const ARENA = 35;
	let tilepos;

	_map.create(function (x, y, v) {
		jsonmap.layers[0].data[y * width + x] = (v === 1) ? 0 : ARENA;
	});

	_cache.addTilemap(keyName, '', jsonmap);

	let _exist = function (x, y) {
		return (
			   typeof _map.map[x] !== 'undefined'
			&& typeof _map.map[x][y] !== 'undefined'
			&& _map.map[x][y] === 0
		)
			? '1'
			: '0';
	};

	let cbSetBackground = function (tile) {
		return function () {
			jsonmap.layers[0].data[tilepos] = ARENA;
			jsonmap.layers[1].data[tilepos] = tile;
		};
	};

	let patternArray = [];
	let addPattern = function (pattern, cb) {
		patternArray.push({
			regex: new RegExp(pattern.replace(/\*/g, '[0-1]')),
			cb: cb
		});
	};


	addPattern(
		'000' +
		'0*0' +
		'*1*', function (tilepos, x, y) {
			cbSetBackground(14)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 9;
			}

		});

	addPattern(
		'000' +
		'0*0' +
		'1*1', function (tilepos, x, y) {
			cbSetBackground(14)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 9;
			}

		});

	addPattern(
		'000' +
		'0*0' +
		'001', function (tilepos, x, y) {
			cbSetBackground(6)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 1;
			}

		});

	addPattern(
		'00*' +
		'0*1' +
		'*11', function (tilepos, x, y) {
			cbSetBackground(15)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 10;
			}
		});

	addPattern(
		'00*' +
		'0*1' +
		'101', function (tilepos, x, y) {
			cbSetBackground(15)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 10;
			}
		});

	addPattern(
		'000' +
		'0*0' +
		'100', function (tilepos, x, y) {
			cbSetBackground(7)();
			if (y > 0) {
				jsonmap.layers[1].data[(y - 1) * width + x] = 2;
			}
		});

	addPattern(
		'00*' +
		'0*1' +
		'00*', cbSetBackground(10));

	addPattern(
		'*1*' +
		'0*0' +
		'000', cbSetBackground(4));


	addPattern(
		'**1' +
		'0*0' +
		'000', cbSetBackground(11));

	addPattern(
		'111' +
		'0**' +
		'001', cbSetBackground(5));


	addPattern(
		'*00' +
		'1*0' +
		'*00', cbSetBackground(8));


	addPattern(
		'*00' +
		'**0' +
		'11*', cbSetBackground(13));

	addPattern(
		'*1*' +
		'1*0' +
		'*00', cbSetBackground(3));

	addPattern(
		'1**' +
		'**0' +
		'*00', cbSetBackground(12));

	addPattern(
		'**1' +
		'0**' +
		'00*', cbSetBackground(5));
	addPattern(
		'001' +
		'0*0' +
		'111', cbSetBackground(15));


	addPattern(
		'*00' +
		'1*0' +
		'1*1', cbSetBackground(13));

	addPattern(
		'*1*' +
		'***' +
		'*1*', function () {
			jsonmap.layers[0].data[tilepos] = ARENA;
			let f = [18, 23, 18];
			f = f[Math.floor((Math.random() * 3))];
			jsonmap.layers[1].data[tilepos] = f;
		});
	addPattern(
		'***' +
		'1*1' +
		'***', function () {
			jsonmap.layers[0].data[tilepos] = ARENA;
			let f = [18, 23, 18];
			f = f[Math.floor((Math.random() * 3))];
			jsonmap.layers[1].data[tilepos] = f;
		});


	for (let y = 0; y < _map._height; y++) {
		for (let x = 0; x < _map._width; x++) {
			jsonmap.layers[1].data.push(0);
			if (_map.map[x][y] === 0) {
				continue;
			}

			tilepos = y * width + x;

			let direction =
				_exist(x - 1, y - 1) + _exist(x, y - 1) + _exist(x + 1, y - 1) +
				_exist(x - 1, y) + '1' + _exist(x + 1, y) +
				_exist(x - 1, y + 1) + _exist(x, y + 1) + _exist(x + 1, y + 1);

			for (let i = 0, len = patternArray.length; i < len; i++) {
				if (patternArray[i].regex.test(direction)) {
					patternArray[i].cb(tilepos, x, y);
					break;
				}
			}

		}
	}

	return _map;

}

(function () {

	let Map = {
		tiles: null,
		rotmap: null,
		phaserMap: null,
		lightDict: {},
		exist: function (x, y) {
			return (typeof this.rotmap.map[x] !== 'undefined' && typeof this.rotmap.map[x][y] !== 'undefined' && this.rotmap.map[x][y] === 0) ? '1' : '0';
		},
		initMap: function (rotmap, phaserMap) {
			this.rotmap = rotmap;
			this.phaserMap = phaserMap;
			this.tiles = JSON.parse(JSON.stringify(rotmap.map));

		},
		canGo: function (actor, dir) {
			return actor.x + dir.x >= 0 &&
				actor.x + dir.x < COLS &&
				actor.y + dir.y >= 0 &&
				actor.y + dir.y < ROWS &&
				Map.tiles[actor.x + dir.x][actor.y + dir.y] === 0;
		},
		light: function () {
			let lightPasses = function (x, y) {
				return typeof Map.tiles[x] === 'undefined' || typeof Map.tiles[x][y] === 'undefined' || Map.tiles[x][y] === 0;
			};

			this.resetLight();

			this.fov = new ROT.FOV.PreciseShadowcasting(lightPasses);
			this.computeLight();
		},
		resetLight: function () {
			let tile, x, y;
			for (x = 0; x < COLS; x++) {
				for (y = 0; y < ROWS; y++) {

					tile = Map.phaserMap.getTile(x, y, 0);
					if (tile) {
						tile.alpha = 0;
					}


					tile = Map.phaserMap.getTile(x, y, 1);
					if (tile) {
						tile.alpha = 0;
					}

				}
			}
		},
		computeLight: function () {
			this.resetLight();

			actorList.forEach(function (a) {
				a.sprite.alpha = 0;
			});
			actorList[0].sprite.alpha = 1;
			this.fov.compute(actorList[0].x, actorList[0].y, 10, function (x, y, r, visibility) {
				let tile = Map.phaserMap.getTile(x, y, 0);
				if (tile) {
					tile.alpha = visibility;
				}
				tile = Map.phaserMap.getTile(x, y, 1);
				if (tile) {
					tile.alpha = visibility;
				}
				if (actorMap.hasOwnProperty(x + '_' + y)) {
					actorMap[x + '_' + y].sprite.alpha = visibility;
				}
			});

			Map.phaserMap.layers[0].dirty = true;
			Map.phaserMap.layers[1].dirty = true;
		}
	};

	let HUD = {
		game: null,
		msg: function (text, sprite, speed, color) {
			let y = sprite.y - 15;
			let x = sprite.x + sprite.width / 3;

			color = (color) ? color : '#ff0044';

			let style = {font: 'bold 19px Courier New, Courier', fill: color, align: 'center'};
			text = this.game.add.text(x, y, text, style);
			this.game.add.tween(text)
				.to(
					{alpha: 1},
					Math.floor(speed * 0.75),
					Phaser.Easing.Linear.None,
					true
				)
				.to(
					{alpha: 0},
					Math.floor(speed * 0.25),
					Phaser.Easing.Linear.None,
					true
				);
			setTimeout(function (t, _self) {
				_self.world.remove(t);
			}, speed, text, this.game);
		}
	};

	GameCtrl.Arena = function () {
	};

	GameCtrl.Arena.prototype = {
		create: function () {
			this.game.stage.backgroundColor = '#2e203c';
			this.cursors = game.input.keyboard.createCursorKeys();

			HUD.game = this;

			this.mapData = generateMap('ROTmap', this.cache, COLS, ROWS, 32, 32);

			let map = this.add.tilemap('ROTmap');

			map.addTilesetImage('forest-tiles', 'forest-tiles');
			let layer1 = map.createLayer('ground');
			layer1.resizeWorld();
			let layer2 = map.createLayer('decoration');
			layer2.resizeWorld();

			this.input.keyboard.addCallbacks(null, null, this.onKeyUp);

			this.input.setMoveCallback(this.mouseCallback, this);


			Map.initMap(this.mapData, map);

			initActors(this);

			Map.light();

			let style = {font: '16px monospace', fill: '#fff'};
			playerHUD = this.add.text(0, 0, 'Player life: ' + actorList[0].hp, style);
			playerHUD.fixedToCamera = true;
			playerHUD.cameraOffset.setTo(500, 50);


		},
		clickeable: true,
		mouseCallback: function () {

			if (this.clickeable && this.input.mousePointer.isDown) {
				this.clickeable = false;

				setTimeout(function (g) {
					g.clickeable = true;
				}, 400, this);

				let x = this.input.activePointer.worldX;
				let y = this.input.activePointer.worldY;
				let dx = Math.abs(player.sprite.x - x);
				let dy = Math.abs(player.sprite.y - y);
				if (dx > dy) {
					if (x > player.sprite.x) {
						this.onKeyUp({keyCode: Phaser.Keyboard.RIGHT});
					} else {
						this.onKeyUp({keyCode: Phaser.Keyboard.LEFT});
					}
				} else {
					if (y > player.sprite.y) {
						this.onKeyUp({keyCode: Phaser.Keyboard.DOWN});
					} else {
						this.onKeyUp({keyCode: Phaser.Keyboard.UP});
					}
				}
			}
		},
		onKeyUp: function (event) {
			if (!actorList[0].isPlayer) {
				return;
			}

			let acted = false;

			if (event.keyCode === Phaser.Keyboard.LEFT) {
				acted = moveTo(player, {x: -1, y: 0});
			} else if (event.keyCode === Phaser.Keyboard.RIGHT) {
				acted = moveTo(player, {x: 1, y: 0});
			} else if (event.keyCode === Phaser.Keyboard.UP) {
				acted = moveTo(player, {x: 0, y: -1});
			} else if (event.keyCode === Phaser.Keyboard.DOWN) {
				acted = moveTo(player, {x: 0, y: 1});
			}

			if (acted) {
				Map.computeLight();

				let enemy;

				for (let i = 1; i < actorList.length; i++) {
					enemy = actorList[i];
					aiAct(enemy);
				}
			}
		}
	};

	Actor.prototype.setXY = function (x, y) {
		this.x = x;
		this.y = y;

		this.game.add.tween(this.sprite).to(
			{
				x: x * 32,
				y: y * 32
			},
			150,
			Phaser.Easing.Linear.None,
			true
		);

	};

	Player.prototype = new Actor();

	Enemy.prototype = new Actor();

	function moveTo (actor, dir) {
		if (!Map.canGo(actor, dir)) {
			return false;
		}

		if (dir.x === 1) {
			actor.sprite.frame = 2;
		} else if (dir.x === -1) {
			actor.sprite.frame = 3;
		} else if (dir.y === -1) {
			actor.sprite.frame = 1;
		} else if (dir.y === 1) {
			actor.sprite.frame = 0;
		}

		let newKey = (actor.x + dir.x) + '_' + (actor.y + dir.y);

		if (actorMap.hasOwnProperty(newKey) && actorMap[newKey]) {
			let victim = actorMap[newKey];

			if (!actor.isPlayer && !victim.isPlayer) {
				return;
			}

			let damage = diceRoll('d8+2').total;
			victim.hp -= damage;

			let axis = (actor.x === victim.x)
				? 'y'
				: 'x';

			dir = victim[axis] - actor[axis];
			dir = dir / Math.abs(dir);

			let pos1 = {}, pos2 = {};

			pos1[axis] = (dir * 15).toString();
			pos2[axis] = (dir * 15 * (-1)).toString();

			game.camera.follow(false);

			game.add.tween(actor.sprite)
				.to(pos1, 100, Phaser.Easing.Linear.None, true)
				.to(pos2, 100, Phaser.Easing.Linear.None, true)
				.onComplete.add(function () {
					game.camera.follow(actor.sprite);
				}, this);

			let color = victim.isPlayer ? null : '#fff';

			HUD.msg(damage.toString(), victim.sprite, 450, color);

			if (victim.isPlayer) {
				playerHUD.setText('Player life: ' + victim.hp);
			}

			if (victim.hp <= 0) {
				victim.sprite.kill();
				delete actorMap[newKey];
				actorList.splice(actorList.indexOf(victim), 1);
				if (victim !== player) {
					if (actorList.length === 1) {
						let victory = game.add.text(
							game.world.centerX,
							game.world.centerY,
							'Victory!\nCtrl+r to restart', {
								fill: '#2e2',
								align: 'center'
							}
						);
						victory.anchor.setTo(0.5, 0.5);
					}
				}
			}
		} else {
			delete actorMap[actor.x + '_' + actor.y];
			actor.setXY(actor.x + dir.x, actor.y + dir.y);
			actorMap[actor.x + '_' + actor.y] = actor;
		}
		return true;
	}

	function Actor (game, x, y, keySprite) {
		this.hp = 3;
		this.x = x;
		this.y = y;
		this.isPlayer = null;
		this.damage = 'd8+2';

		if (game) {
			this.game = game;
			this.sprite = game.add.sprite(x * 32, y * 32, keySprite);
		} else {
			this.game = null;
			this.sprite = null;
		}
	}

	function Player (game, x, y) {
		Actor.call(this, game, x, y, 'hero');
		this.hp = 100;
		this.isPlayer = true;
		this.damage = 'd6+2';
	}

	function Enemy (game, x, y) {
		Actor.call(this, game, x, y, 'orc');
		this.hp = 10;
		this.isPlayer = false;
		this.damage = 'd4+2';
	}

	function initActors (game) {
		actorList = [];
		actorMap = {};
		let actor, x, y;

		let random = function (max) {
			return Math.floor(Math.random() * max);
		};

		let validpos = [];
		for (x = 0; x < COLS; x++) {
			for (y = 0; y < ROWS; y++) {
				if (!Map.tiles[x][y]) {
					validpos.push({x: x, y: y});
				}
			}
		}

		for (let e = 0; e < ACTORS; e++) {
			do {
				let r = validpos[random(validpos.length)];
				x = r.x;
				y = r.y;
			} while (actorMap[x + '_' + y]);

			actor = (e === 0)
				? new Player(game, x, y)
				: new Enemy(game, x, y);
			actorMap[actor.x + '_' + actor.y] = actor;
			actorList.push(actor);
		}
		player = actorList[0];
		game.camera.follow(player.sprite);

	}

	function aiAct (actor) {
		let directions = [
			{x: -1, y: 0},
			{x: 1, y: 0},
			{x: 0, y: -1},
			{x: 0, y: 1}
		];

		let dx = player.x - actor.x,
			dy = player.y - actor.y;

		let moveToRandomPos = function () {
			let rndDirections = shuffleArray(directions);
			for (let i = 0; i < rndDirections.length; i++) {
				if (moveTo(actor, rndDirections[i])) {
					break;
				}
			}
		};

		if (Math.abs(dx) + Math.abs(dy) > 6) {
			moveToRandomPos();
		} else {
			directions = directions.map(function (e) {
				return {
					x: e.x,
					y: e.y,
					dist: Math.pow(dx + e.x, 2) + Math.pow(dy + e.y, 2)
				};
			}).sort(function (a, b) {
				return b.dist - a.dist;
			});

			for (let d = 0, len = directions.length; d < len; d++) {
				if (moveTo(actor, directions[d])) {
					break;
				}
			}

		}

		if (player.hp < 1) {
			let gameOver = game.add.text(0, 0, 'Game Over\nCtrl+r to restart', {fill: '#e22', align: 'center'});
			gameOver.fixedToCamera = true;
			gameOver.cameraOffset.setTo(500, 500);
		}
	}

	function shuffleArray (array) {
		for (let i = array.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1)),
				temp = array[i];

			array[i] = array[j];
			array[j] = temp;
		}

		return array;
	}

	function diceRoll (data) {
		data = ' ' + data;

		let dataSplit = data.split(/-|\+|d/g);
		let dices = parseInt(dataSplit[0], 10);

		if (!dices) {
			dices = 1;
		}

		let sides = parseInt(dataSplit[1], 10);

		let ret = {diceRoll: [], number: 0, bonus: 0};

		ret.number = 0;

		let n;
		for (let i = 0; i < dices; i++) {
			n = 1 + Math.floor(Math.random() * sides);
			ret.diceRoll.push(n);
			ret.number += n;
		}

		if (dataSplit[2]) {
			ret.bonus = parseInt(dataSplit[2], 10);
			if (data.indexOf('-') > -1) {
				ret.bonus = ret.bonus * -1;
			}
		}

		ret.total = ret.number + ret.bonus;

		return ret;
	}

}());