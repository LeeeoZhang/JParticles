'use strict';

// meteor.js
+function (JParticles) {
    'use strict';

    var utils = JParticles.utils,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    function Meteor(selector, options) {
        utils.createCanvas(this, Meteor, selector, options);
    }

    Meteor.defaultConfig = {
        maxR: 6.5,
        minR: .4,
        maxSpeed: .6,
        minSpeed: 0
    };

    var fn = Meteor.prototype = {
        version: '1.0.0',
        init: function init() {},
        createDots: function createDots() {},
        draw: function draw() {

            this.requestAnimationFrame();
        }
    };

    JParticles.extend(fn);

    JParticles.meteor = fn.constructor = Meteor;
}(JParticles);
//# sourceMappingURL=maps/meteor.js.map
