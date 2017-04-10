const {utils, Base} = JParticles;
const {pInt, limitRandom, calcSpeed} = utils;
const {random, abs, PI} = Math;
const twicePI = PI * 2;

JParticles.lowpoly = class Lowpoly extends Base {

    static defaultConfig = {
        color: '#fff',
        maxR: 6.5,
        minR: .4,
        maxSpeed: .6,
        minSpeed: 0
    };

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
};

JParticles.lowpoly.prototype.version = '2.0.0';