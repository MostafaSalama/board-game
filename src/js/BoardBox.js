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
