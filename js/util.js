class Utils {
    /**
     *
     * @param from {number}
     * @param to {number}
     *  @returns {number} the random generated number
     */
    static randomNumber(from, to) {
        return Math.floor(Math.random() * to) + from;
    }
}
