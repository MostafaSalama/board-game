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
