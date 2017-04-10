const {utils, Base} = JParticles;
const {pInt, limitRandom, calcSpeed} = utils;
const {random, abs, PI} = Math;
const twicePI = PI * 2;

JParticles.meteor = class Meteor extends Base {

    static defaultConfig = {
        color: '#fff',
        maxR: 6.5,
        minR: .4,
        maxSpeed: .6,
        minSpeed: 0
    };

    constructor(selector, options) {
        super(Meteor, selector, options);
    }

    init() {

    }

    createDots() {

    }

    draw() {

        this.requestAnimationFrame();
    }
};

JParticles.meteor.prototype.version = '2.0.0';