
                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        return;
                    }
                    'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _JParticles = JParticles,
    utils = _JParticles.utils,
    Base = _JParticles.Base;
var pInt = utils.pInt,
    limitRandom = utils.limitRandom,
    calcSpeed = utils.calcSpeed;
var random = Math.random,
    abs = Math.abs,
    PI = Math.PI;

var twicePI = PI * 2;

JParticles.meteor = (_temp = _class = function (_Base) {
    _inherits(Meteor, _Base);

    _createClass(Meteor, [{
        key: 'version',
        get: function get() {
            return '2.0.0';
        }
    }]);

    function Meteor(selector, options) {
        _classCallCheck(this, Meteor);

        return _possibleConstructorReturn(this, (Meteor.__proto__ || Object.getPrototypeOf(Meteor)).call(this, Meteor, selector, options));
    }

    _createClass(Meteor, [{
        key: 'init',
        value: function init() {}
    }, {
        key: 'createDots',
        value: function createDots() {}
    }, {
        key: 'draw',
        value: function draw() {

            this.requestAnimationFrame();
        }
    }]);

    return Meteor;
}(Base), _class.defaultConfig = {
    color: '#fff',
    maxR: 6.5,
    minR: .4,
    maxSpeed: .6,
    minSpeed: 0
}, _temp);
                }();
            
//# sourceMappingURL=maps/meteor.js.map
