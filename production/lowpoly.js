+function () { 'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _JParticles = JParticles,
    utils = _JParticles.utils,
    Base = _JParticles.Base;
var random = Math.random,
    abs = Math.abs,
    PI = Math.PI,
    sin = Math.sin,
    ceil = Math.ceil;

var twicePI = PI * 2;
var UNDEFINED = 'undefined';
var pInt = utils.pInt,
    limitRandom = utils.limitRandom,
    calcSpeed = utils.calcSpeed,
    scaleValue = utils.scaleValue,
    randomColor = utils.randomColor,
    isArray = utils.isArray,
    isFunction = utils.isFunction,
    isPlainObject = utils.isPlainObject,
    resize = utils.resize,
    defineReadOnlyProperty = utils.defineReadOnlyProperty;

var Lowpoly = function (_Base) {
    _inherits(Lowpoly, _Base);

    _createClass(Lowpoly, [{
        key: 'version',
        get: function get() {
            return '3.0.0';
        }
    }]);

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
}(Base);

Lowpoly.defaultConfig = {};


defineReadOnlyProperty(Lowpoly, 'lowpoly'); }();
//# sourceMappingURL=maps/lowpoly.js.map
