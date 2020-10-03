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
