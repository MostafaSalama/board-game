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
