+function () { 'use strict';

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

JParticles.lowpoly = (_temp = _class = function (_Base) {
    _inherits(Lowpoly, _Base);

    function Lowpoly(selector, options) {
        _classCallCheck(this, Lowpoly);

        return _possibleConstructorReturn(this, (Lowpoly.__proto__ || Object.getPrototypeOf(Lowpoly)).call(this, Lowpoly, selector, options));
    }

    _createClass(Lowpoly, [{
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

    return Lowpoly;
}(Base), _class.defaultConfig = {
    color: '#fff',
    maxR: 6.5,
    minR: .4,
    maxSpeed: .6,
    minSpeed: 0
}, _temp);

JParticles.lowpoly.prototype.version = '2.0.0'; }();
//# sourceMappingURL=maps/lowpoly.js.map
