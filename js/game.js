// we get the names of the players
const player1Name = localStorage.getItem('player1_name') ;
const player2Name = localStorage.getItem('player2_name') ;
const player1NameElement = document.getElementById('player1_name');
const player2NameElement = document.getElementById('player2_name');
player1NameElement.textContent = player1Name ;
player2NameElement.textContent = player2Name ;
const player1HealthElement = document.getElementById('health1');
const player2HealthElement = document.getElementById('health2');

// select the element of each player own board
const player1StatusSection = document.getElementById('player1');
const player2StatusSection = document.getElementById('player2');
const Player1PowerElement = document.querySelector('#power1');
const Player2PowerElement = document.querySelector('#power2');

// player 1 and 2 weapons images
const player1WeaponImage = document.getElementById('player_1_weapon_image');
const player2WeaponImage = document.getElementById('player_2_weapon_image');
const gameContainer = document.getElementById('game-container');
// get fight buttons
const attack1 = document.getElementById('attack1');
const defend1 = document.getElementById('defend1');

const attack2 = document.getElementById('attack2');
const defend2 = document.getElementById('defend2');
const ButtonsArray = [attack1, defend1, attack2, defend2];
// store all the weapons and their power

// default and the main weapon for each player
const defaultWeapon = {
	name: 'main',
	power: 10,
};

const weapons = [
	{
		name: 'weapon1',
		power: 20,
	},
	{
		name: 'weapon2',
		power: 50,
	},
	{
		name: 'weapon3',
		power: 70,
	},
	{
		name: 'weapon4',
		power: 35,
	},
];



class ItemTypes {
	static PLAYER = 'PLAYER';
	static OBSTACLE = 'OBSTACLE';
	static WEAPON = 'WEAPON';
}

const actionTypes = {
	DEFEND: 'DEFEND',
	ATTACK: 'ATTACK',
};
/**
 * store the position of an item using its x and y
 */
class ItemPosition {
	/**
	 *
	 * @param x {number} x-axis position (row)
	 * @param y {number} y-axis position (column)
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}
class BoardBox {
	/**
	 *
	 * @param position {ItemPosition}
	 * @param element {HTMLElement}
	 * @param index {number}
	 */
	constructor(position, element, index) {
		this.position = position;
		this.element = element;
		this.index = index;
		this.isEmpty = true;
		this.filledWith = null;
		this.weapon = null;
		this.player = null;
	}
}

class Weapon {
	/**
	 * @param name {string} the weapon name used for css classes
	 * @param position {ItemPosition} the weapon position (x,y)
	 * @param power {number} the weapon power
	 * @param index {number} the weapon index at the weapons Array;
	 */
	constructor(name, position, power, index) {
		this.position = position;
		this.power = power;
		this.name = name;
		this.index = index;
	}
}

class Player {
	/**
	 *
	 * @param name {string}
	 * @param title {string}
	 * @param turn {boolean}
	 */
	constructor(name, title, turn) {
		this.name = name;
		this.title = title;
		this.health = 100;
		this.power = 10;
		this.position = null;
		this.currentBox = null;

		this.currentWeapon = new Weapon(
			defaultWeapon.name,
			null,
			defaultWeapon.power,
			-1,
		);
		this.oldWeapon = null;
		this.oldBox = null;
		this.currentAction = null;
	}
}
class Game {
	constructor() {
		this.container = document.getElementById('game-container');
		/**
		 *
		 * @type {BoardBox[]}
		 */
		this.boxes = [];
		this.players = this.initializePlayers();

		this.generateMap();
		this.placeObstacles(10);
		this.placeWeapons();
		this.placePlayers();

		this.currentPlayer = this.players[0];
		/**
		 *
		 * @type {HTMLElement[]}
		 */
		this.currentElementsToMoveIn = [];
		this.boxesToMoveIn = this.calculateAvailableBoxes();
		this.makeHoverEffect();
	}
	generateMap() {
		let itemIndex = 0;
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				const element = document.createElement('div');
				element.className = 'grid-item';
				const box = new BoardBox(new ItemPosition(i, j), element, itemIndex);
				this.boxes.push(box);
				this.container.append(box.element);
				itemIndex++;
			}
		}
	}

	/**
	 *
	 * @param numberOfObstacles {number} number of obstacles to place in the board
	 */
	placeObstacles = (numberOfObstacles) => {
		// creating number of walls
		let numberOfObstaclesCreated = 0;
		while (numberOfObstaclesCreated < numberOfObstacles) {
			// getting random cell selections by (x,y)

			const randomX = Utils.randomNumber(1, 8);
			const randomY = Utils.randomNumber(1, 8);
			const box = this.getBoxItemAtPosition(randomX, randomY);
			if (box.isEmpty) {
				box.isEmpty = false;
				box.filledWith = ItemTypes.OBSTACLE;
				box.element.classList.add('unavailable');
				numberOfObstaclesCreated++;
			}
		}
	};
	placeWeapons = () => {
		let numberOfCreatedWeapons = 0;
		while (numberOfCreatedWeapons < 4) {
			// getting random cell selections by (x,y)
			const randomX = Utils.randomNumber(1, 8);
			const randomY = Utils.randomNumber(1, 8);
			const box = this.getBoxItemAtPosition(randomX, randomY);
			if (box.isEmpty) {
				const currentWeapon = weapons[numberOfCreatedWeapons];
				box.isEmpty = false;
				box.filledWith = ItemTypes.WEAPON;
				box.weapon = new Weapon(
					currentWeapon.name,
					new ItemPosition(box.position.x, box.position.y),
					currentWeapon.power,
					numberOfCreatedWeapons,
				);
				box.element.classList.add(currentWeapon.name);
				numberOfCreatedWeapons++;
			}
		}
	};
	placePlayers = () => {
		// getting random cell selections by (x,y)
		// player 1
		let numberOfPlayersCreated = 0;
		while (numberOfPlayersCreated < 2) {
			// player 1
			const randomXPlayer1 = Utils.randomNumber(0, 9);
			const randomYPlayer1 = Utils.randomNumber(0, 1);
			// player 2
			const randomXPlayer2 = Utils.randomNumber(1, 9);
			const randomYPlayer2 = Utils.randomNumber(9, 0);

			const box1 = this.getBoxItemAtPosition(randomXPlayer1, randomYPlayer1);
			const box2 = this.getBoxItemAtPosition(randomXPlayer2, randomYPlayer2);
			if (box1.isEmpty) {
				box1.isEmpty = false;
				box1.element.classList.add(this.players[0].name);
				box1.filledWith = ItemTypes.PLAYER;
				box1.player = this.players[0].title;
				// add player 1  new position
				this.players[0].position = new ItemPosition(
					box1.position.x,
					box1.position.y,
				);
				this.players[0].currentBox = box1;
				numberOfPlayersCreated++;
			}
			if (box2.isEmpty) {
				box2.isEmpty = false;
				box2.element.classList.add(this.players[1].name);
				box2.filledWith = ItemTypes.PLAYER;
				box2.player = this.players[1].title;
				// add player 2 new position
				this.players[1].position = new ItemPosition(
					box2.position.x,
					box2.position.y,
				);
				this.players[1].currentBox = box2;
				numberOfPlayersCreated++;
			}
		}
	};
	/**
	 *
	 * @param x {number}
	 * @param y {number}
	 * @returns {BoardBox}
	 */
	getBoxItemAtPosition(x, y) {
		return this.boxes.find(
			(box) => box.position.x === x && box.position.y === y,
		);
	}

	/**
	 *
	 * @returns {Player[]}
	 */
	initializePlayers() {
		const p1 = new Player('player_one', 'player1', true);
		const p2 = new Player('player_two', 'player2', false);
		return [p1, p2];
	}

	calculateAvailableBoxes() {
		this.clearUIEffects();
		const boxesToMoveIn = {
			top: [],
			left: [],
			right: [],
			bottom: [],
		};
		const { x, y } = this.currentPlayer.currentBox.position;
		// availableTopBoxes
		for (let i = 1; i < 4; i++) {
			const nextTopBox = this.getBoxItemAtPosition(x - i, y);
			if (!nextTopBox) {
				break;
			}
			if (nextTopBox.player) {
				break;
			}
			// we can't move if we find obstacles
			if (nextTopBox.filledWith === ItemTypes.OBSTACLE) {
				break;
			}
			if (nextTopBox.isEmpty || nextTopBox.filledWith === ItemTypes.WEAPON) {
				boxesToMoveIn.top.push(nextTopBox);
				this.currentElementsToMoveIn.push(nextTopBox.element);
			}
		}
		// availableBottomBoxes
		for (let i = 1; i < 4; i++) {
			const nextTopBox = this.getBoxItemAtPosition(x + i, y);

			if (!nextTopBox) {
				break;
			}
			if (nextTopBox.player) {
				break;
			}
			// we can't move if we find obstacles
			if (nextTopBox.filledWith === ItemTypes.OBSTACLE) {
				break;
			}
			if (nextTopBox.isEmpty || nextTopBox.filledWith === ItemTypes.WEAPON) {
				boxesToMoveIn.bottom.push(nextTopBox);
				this.currentElementsToMoveIn.push(nextTopBox.element);
			}
		}
		// availableLeftBoxes
		for (let i = 1; i < 4; i++) {
			const nextTopBox = this.getBoxItemAtPosition(x, y - i);

			if (!nextTopBox) {
				break;
			}
			if (nextTopBox.player) {
				break;
			}
			// we can't move if we find obstacles
			if (nextTopBox.filledWith === ItemTypes.OBSTACLE) {
				break;
			}
			if (nextTopBox.isEmpty || nextTopBox.filledWith === ItemTypes.WEAPON) {
				boxesToMoveIn.left.push(nextTopBox);
				this.currentElementsToMoveIn.push(nextTopBox.element);
			}
		}
		// availableRightBoxes
		for (let i = 1; i < 4; i++) {
			const nextTopBox = this.getBoxItemAtPosition(x, y + i);

			if (!nextTopBox) {
				break;
			}
			if (nextTopBox.player) {
				break;
			}
			// we can't move if we find obstacles
			if (nextTopBox.filledWith === ItemTypes.OBSTACLE) {
				break;
			}
			if (nextTopBox.isEmpty || nextTopBox.filledWith === ItemTypes.WEAPON) {
				boxesToMoveIn.right.push(nextTopBox);
				this.currentElementsToMoveIn.push(nextTopBox.element);
			}
		}
		return boxesToMoveIn;
	}

	makeHoverEffect() {
		if (this.currentElementsToMoveIn) {
			this.currentElementsToMoveIn.forEach((element) => {
				element.classList.add('box-hover');
				element.addEventListener('click', this.clickHandler);
			});
		}
	}
	clearUIEffects() {
		if (this.currentElementsToMoveIn) {
			this.currentElementsToMoveIn.forEach((element) => {
				element.classList.remove('box-hover');
				element.removeEventListener('click', this.clickHandler);
			});
		}
		this.currentElementsToMoveIn = [];
	}

	/**
	 * return a BoardBox with the specified element
	 * @param element {HTMLElement}
	 * @returns {BoardBox}
	 */
	getBoxItemWithElement(element) {
		return this.boxes.find((box) => box.element === element);
	}

	// make Audio
	makeSound(source) {
		const audioName = new Audio();
		const src = './audio/';
		audioName.src = `${src + source}.mp3`;
		return audioName;
	}
	clickHandler = (e) => {
		this.makeSound('move1').play();
		const elementBox = this.getBoxItemWithElement(e.target);
		if (elementBox.filledWith === ItemTypes.WEAPON) {
			console.log('time to update');
			this.updatePlayerWeapon(elementBox);
		}
		this.updatePlayerBox(elementBox);
		if (this.isAttackTime()) {
			this.startAttack();
			return;
		}

		this.changeTurns();
	};
	isAttackTime() {
		const { x: x1, y: y1 } = this.players[0].position;
		const { x: x2, y: y2 } = this.players[1].position;
		if (x1 === x2 && Math.abs(y1 - y2) === 1) return true;
		return y1 === y2 && Math.abs(x1 - x2) === 1;
	}
	/**
	 * update the player current and old box
	 * @param elementBox {BoardBox}
	 */
	updatePlayerBox(elementBox) {
		// remove the player picture from the old box
		this.currentPlayer.currentBox.element.classList.remove(
			this.currentPlayer.name,
		);
		// change current box
		this.currentPlayer.oldBox = this.currentPlayer.currentBox;
		this.currentPlayer.currentBox = elementBox;
		this.currentPlayer.position.x = elementBox.position.x;
		this.currentPlayer.position.y = elementBox.position.y;

		// change boxes isEmpty for validation of available boxes
		if (this.currentPlayer.oldBox.player) {
			this.currentPlayer.oldBox.player = null;
			this.currentPlayer.oldBox.isEmpty = true ;
		}
		this.currentPlayer.currentBox.player = this.currentPlayer;
		this.currentPlayer.currentBox.isEmpty = false ;
		// add the picture of the new player to the box
		elementBox.element.classList.add(this.currentPlayer.name);
	}

	/**
	 * update the current player current and old weapon
	 * @param elementBox {BoardBox}
	 *
	 */
	updatePlayerWeapon(elementBox) {
		this.currentPlayer.oldWeapon = this.currentPlayer.currentWeapon;
		this.currentPlayer.currentWeapon = elementBox.weapon;

		// update the player status
		if (this.currentPlayer.title === this.players[0].title) {
			Player1PowerElement.innerHTML = elementBox.weapon.power;
			player1WeaponImage.src = `./assets/${elementBox.weapon.name}.png`
		} else {
			Player2PowerElement.innerHTML = elementBox.weapon.power;
			player2WeaponImage.src = `./assets/${elementBox.weapon.name}.png`

		}

		elementBox.element.classList.remove(elementBox.weapon.name);
		elementBox.weapon = this.currentPlayer.oldWeapon;
		elementBox.element.classList.add(elementBox.weapon.name);
	}

	changeTurns() {
		this.currentPlayer =
			this.currentPlayer === this.players[0]
				? this.players[1]
				: this.players[0];
		this.boxesToMoveIn = this.calculateAvailableBoxes();
		this.makeHoverEffect();
	}

	// setup Ui for the fight
	uiFightGround = () => {
		// clear the map
		gameContainer.innerHTML = '';
		// change player fight turn
		this.changeFightTurns();
		// display the buttons
		ButtonsArray.forEach((btn) => btn.classList.remove('fight'));
		//

	};

	// attack
	startAttack = () => {
		this.uiFightGround();

		// need to loop till one of the player loss

		// attack
		attack1.addEventListener('click', () => {
			game.updateUI(actionTypes.ATTACK);
			game.changeFightTurns();
		});
		defend1.addEventListener('click', () => {
			game.updateUI(actionTypes.DEFEND);
			game.changeFightTurns();
		});
		defend2.addEventListener('click', () => {
			game.updateUI(actionTypes.DEFEND);
			game.changeFightTurns();
		});
		attack2.addEventListener('click', () => {
			game.updateUI(actionTypes.ATTACK);
			game.changeFightTurns();
		});
		// this.changeTurns();
		// }
	};

	// get other player status and values info, ex: health,power,current weapon
	noCurrentPlayer() {
		return this.currentPlayer === this.players[0]
			? this.players[1]
			: this.players[0];
	}

	updateUI(actionType) {
		const currentPlayerPower = this.currentPlayer.currentWeapon.power;
		this.currentPlayer.currentAction = actionType;
		const notCurrentPlayer = this.noCurrentPlayer();

		let damage = currentPlayerPower;
		if (notCurrentPlayer.currentAction === actionTypes.DEFEND) {
			damage = damage / 2;
		}

		if (actionType === actionTypes.ATTACK) {
			notCurrentPlayer.health -= damage;
		}

		player1HealthElement.innerHTML = this.players[0].health;
		player2HealthElement.innerHTML = this.players[1].health;
		this.checkForWinning();
	}
	changeFightTurns() {
		this.currentPlayer =
			this.currentPlayer === this.players[0]
				? this.players[1]
				: this.players[0];

		if (this.currentPlayer.title === 'player1') {
			document.getElementById('player1').classList.add('current_player');
			document.getElementById('player2').classList.remove('current_player');
			attack1.disabled = false;
			defend1.disabled = false;
			attack2.disabled = true;
			defend2.disabled = true;
		}
		if (this.currentPlayer.title === 'player2') {
			document.getElementById('player2').classList.add('current_player');
			document.getElementById('player1').classList.remove('current_player');
			attack1.disabled = true;
			defend1.disabled = true;
			attack2.disabled = false;
			defend2.disabled = false;
		}
	}
	checkForWinning() {
		if (this.players[0].health <= 0) {
			this.announcePlayer(player2Name);
		}
		if (this.players[1].health <= 0) {
			this.announcePlayer(player1Name);
		}
	}
	announcePlayer(name) {
		document.querySelector('main').style.display = 'none';
		document.getElementById('game-over').style.display = 'flex';
		const span = document.getElementById('winner-name');
		span.textContent = name;
	}
}
// end of game class

// generate new game
const game = new Game();
const setPlayerValues = () => {
	player1HealthElement.innerHTML = game.players[0].health;
	player2HealthElement.innerHTML = game.players[1].health;
	Player1PowerElement.innerHTML = game.players[0].power;
	Player2PowerElement.innerHTML = game.players[1].power;
};

setPlayerValues();
