
                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        window.JParticles.wave_loading = function(){};
                        window.JParticles.wave_loading.prototype.open = function(){};
window.JParticles.wave_loading.prototype.pause = function(){};
window.JParticles.wave_loading.prototype.setOptions = function(){};
                        return;
                    }
                    'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
    defineReadOnlyProperty = utils.defineReadOnlyProperty;

var WaveLoading = function (_Base) {
    _inherits(WaveLoading, _Base);

    _createClass(WaveLoading, [{
        key: 'version',
        get: function get() {
            return '3.0.0';
        }
    }]);

    function WaveLoading(selector, options) {
        _classCallCheck(this, WaveLoading);

        return _possibleConstructorReturn(this, (WaveLoading.__proto__ || Object.getPrototypeOf(WaveLoading)).call(this, WaveLoading, selector, options));
    }

    _createClass(WaveLoading, [{
        key: 'init',
        value: function init() {
            this.c.style.borderRadius = '50%';
            this.progress = 0;
            this.set.offsetTop = this.ch;
            this.halfCW = this.cw / 2;
            this.halfCH = this.ch / 2;
            this.dots = [];
            this.createDots();
            this.draw();
        }
    }, {
        key: 'createDots',
        value: function createDots() {
            var cw = this.cw,
                dots = this.dots;

            // 线条波长，每个周期(2π)在canvas上的实际长度

            var rippleLength = cw / this.set.rippleNum;

            // 点的y轴步进
            var step = twicePI / rippleLength;

            // 一条线段所需的点
            for (var i = 0; i <= cw; i++) {
                dots.push({
                    x: i,
                    y: i * step
                });
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                halfCW = this.halfCW,
                halfCH = this.halfCH,
                paused = this.paused;
            var _set = this.set,
                font = _set.font,
                color = _set.color,
                opacity = _set.opacity,
                crestHeight = _set.crestHeight,
                offsetLeft = _set.offsetLeft,
                offsetTop = _set.offsetTop,
                fillColor = _set.fillColor,
                speed = _set.speed;


            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = opacity;

            cxt.save();
            cxt.beginPath();

            this.dots.forEach(function (dot, i) {
                cxt[i ? 'lineTo' : 'moveTo'](dot.x,

                // y = A sin ( ωx + φ ) + h
                crestHeight * sin(dot.y + offsetLeft) + offsetTop);
                !paused && (dot.y -= speed);
            });

            cxt.lineTo(cw, ch);
            cxt.lineTo(0, ch);
            cxt.closePath();
            cxt.fillStyle = fillColor;
            cxt.fill();
            cxt.restore();

            var progressText = ceil(this.progress) + '%';
            if (this.progressListeners) {
                var response = this.progressListeners(this.progress);
                if ((typeof response === 'undefined' ? 'undefined' : _typeof(response)) !== UNDEFINED) {
                    progressText = response;
                }
            }

            cxt.font = font;
            cxt.textAlign = 'center';
            cxt.textBaseline = 'middle';
            cxt.fillStyle = color;
            cxt.fillText(progressText, halfCW, halfCH, cw);

            this.progress += 0.5;

            if (this.progress >= 99) {
                this.progress = 99;
            }

            this._setOffsetTop();
            this.requestAnimationFrame();
        }
    }, {
        key: '_setOffsetTop',
        value: function _setOffsetTop() {
            this.set.offsetTop = ceil((100 - this.progress) / 100 * this.ch);
        }
    }, {
        key: 'setOptions',
        value: function setOptions(newOptions) {
            if (isPlainObject(newOptions)) {
                for (var name in newOptions) {
                    if (name !== 'offsetTop' && name in this.set) {
                        this.set[name] = newOptions[name];
                    }
                }
            }
        }
    }, {
        key: 'done',
        value: function done() {}
    }, {
        key: 'onProgress',
        value: function onProgress(callback) {
            if (isFunction(callback)) {
                this.progressListeners = callback;
            }
        }
    }]);

    return WaveLoading;
}(Base);

WaveLoading.defaultConfig = {

    // [font style][font weight][font size][font family]
    // 同css一样，但必须包含 [font size] 和 [font family]
    // 进度文本颜色
    font: 'normal 900 20px Arial',

    // 文本颜色
    color: '#333',

    // 填充的背景色
    fillColor: '#27C9E5',

    // 线条横向偏移值，距离canvas画布左边的偏移值
    // (0, 1)表示容器宽度的倍数，0 & [1, +∞)表示具体数值
    offsetLeft: 0,

    // 波峰高度，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
    crestHeight: 4,

    // 波纹个数，即正弦周期个数
    rippleNum: 1,

    // 运动速度
    speed: .3
};


defineReadOnlyProperty(WaveLoading, 'waveLoading');
                }();
            
//# sourceMappingURL=maps/wave_loading.js.map
