const {utils, Base} = JParticles;
const {random, abs, PI, sin, ceil} = Math;
const twicePI = PI * 2;
const UNDEFINED = 'undefined';
const {
    pInt, limitRandom, calcSpeed,
    scaleValue, randomColor, isArray,
    isFunction, isPlainObject, resize,
    defineReadOnlyProperty
} = utils;

class Lowpoly extends Base {

    static defaultConfig = {
    };

    get version() {
        return '3.0.0';
    }

    constructor(selector, options) {
        super(Lowpoly, selector, options);
    }

    init() {

    }

    createDots() {

    }

    draw() {
        this.requestAnimationFrame();
    }
}

defineReadOnlyProperty(Lowpoly, 'lowpoly');