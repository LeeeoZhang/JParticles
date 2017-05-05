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
var pInt = utils.pInt,
    limitRandom = utils.limitRandom,
    calcSpeed = utils.calcSpeed,
    scaleValue = utils.scaleValue,
    randomColor = utils.randomColor,
    isArray = utils.isArray,
    isFunction = utils.isFunction,
    isPlainObject = utils.isPlainObject,
    isUndefined = utils.isUndefined,
    _resize = utils.resize,
    defineReadOnlyProperty = utils.defineReadOnlyProperty,
    registerListener = utils.registerListener;

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
            this.halfCH = this.ch / 2;
            this.progressListeners = [];
            this.finishedListeners = [];
            this.attrNormalize();
            this.createDots();
            this.draw();
        }
    }, {
        key: 'attrNormalize',
        value: function attrNormalize() {
            var _this2 = this;

            ['offsetLeft', 'crestHeight'].forEach(function (attr) {
                _this2.set[attr] = scaleValue(_this2.set[attr], attr === 'offsetLeft' ? _this2.cw : _this2.ch);
            });
        }
    }, {
        key: 'createDots',
        value: function createDots() {
            var cw = this.cw;

            var dots = this.dots = [];

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
            this.calcOffsetTop();
            this.drawWave();
            this.drawText();
            this.calcProgress();

            if (this.progress <= 100) {
                this.requestAnimationFrame();
            } else {
                this.progress = 100;
                this.calcOffsetTop();
                this.drawWave();
                this.drawText();
                this.finishedListeners.forEach(function (cb) {
                    return cb();
                });
            }
        }
    }, {
        key: 'drawWave',
        value: function drawWave() {
            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch;
            var _set = this.set,
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
                dot.y -= speed;
            });

            cxt.lineTo(cw, ch);
            cxt.lineTo(0, ch);
            cxt.closePath();
            cxt.fillStyle = fillColor;
            cxt.fill();
            cxt.restore();
        }
    }, {
        key: 'drawText',
        value: function drawText() {
            var _this3 = this;

            var cxt = this.cxt,
                cw = this.cw,
                halfCH = this.halfCH,
                progress = this.progress;
            var _set2 = this.set,
                font = _set2.font,
                smallFont = _set2.smallFont,
                color = _set2.color,
                smallFontOffsetTop = _set2.smallFontOffsetTop;


            var percentText = '%';
            var progressText = ceil(progress);

            this.progressListeners.forEach(function (callback) {
                var res = callback(_this3.progress);
                if (!isUndefined(res)) {
                    if (isPlainObject(res)) {
                        progressText = res.text;
                        percentText = res.smallText || '';
                    } else {
                        progressText = res;
                        percentText = '';
                    }
                }
            });

            cxt.font = font;
            var progressWidth = cxt.measureText(progressText).width;

            cxt.font = smallFont;
            var percentWidth = cxt.measureText(percentText).width;

            var x = (cw - progressWidth - percentWidth) / 2;

            cxt.textBaseline = 'middle';
            cxt.fillStyle = color;
            cxt.font = font;
            cxt.fillText(progressText, x, halfCH);
            cxt.font = smallFont;
            cxt.fillText(percentText, x + progressWidth, halfCH + smallFontOffsetTop);
        }
    }, {
        key: 'calcProgress',
        value: function calcProgress() {
            if (this.immediatelyComplete) {
                this.progress += this.immediatelyComplete;
                this.immediatelyComplete += 0.5;
                return;
            }

            if (this.progress >= 99) return;

            var _set3 = this.set,
                easing = _set3.easing,
                duration = _set3.duration;


            if (!this.startTime) {
                this.startTime = Date.now();
            }

            // x: percent Complete      percent Complete: elapsedTime / duration
            // t: current time          elapsed time: currentTime - startTime
            // b: beginning value       start value
            // c: change in value       finish value
            // d: duration              duration
            var time = Date.now() - this.startTime;
            var percent = time / duration;

            if (percent <= 1) {
                this.progress = JParticles.easing[easing](

                // x, t, b, c, d
                percent, time, 0, 100, duration);

                if (this.progress >= 99) {
                    this.progress = 99;
                }
            }
        }
    }, {
        key: 'calcOffsetTop',
        value: function calcOffsetTop() {

            // enhance performance when the loading progress continue for 99%
            if (!this.immediatelyComplete && this.progress === 99) return;

            if (this.progress === 100) {
                this.set.offsetTop = -this.set.crestHeight;
            } else {
                this.set.offsetTop = ceil((100 - this.progress) / 100 * this.ch + this.set.crestHeight);
            }
        }
    }, {
        key: 'resize',
        value: function resize() {
            var _this4 = this;

            _resize(this, function () {
                _this4.halfCH = _this4.ch / 2;
            });
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
        value: function done() {
            if (!this.immediatelyComplete) {
                this.immediatelyComplete = 1;
            }
        }
    }, {
        key: 'onProgress',
        value: function onProgress() {
            registerListener.apply(undefined, [this.progressListeners].concat(Array.prototype.slice.call(arguments)));
            return this;
        }
    }, {
        key: 'onFinished',
        value: function onFinished() {
            registerListener.apply(undefined, [this.finishedListeners].concat(Array.prototype.slice.call(arguments)));
            return this;
        }
    }]);

    return WaveLoading;
}(Base);

WaveLoading.defaultConfig = {

    // [font style][font weight][font size][font family]
    // 文本样式，同css一样，必须包含 [font size] 和 [font family]
    font: 'normal 900 20px Arial',

    // 小字体样式，如：“%”
    smallFont: 'normal 900 14px Arial',

    // 小字体相对于中点向下的偏移值，
    // 细节的处理，为了让显示更好看。
    smallFontOffsetTop: 1,

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

    // 波浪的运动速度
    speed: .3,

    // 加载到 99% 的时长，单位毫秒(ms)
    // 用时越久，越慢加载到 99%。
    duration: 5000,

    // 加载过程的运动效果，
    // 目前支持匀速(linear)，先加速再减速(swing)，两种
    easing: 'swing'
};


delete WaveLoading.prototype.pause;
delete WaveLoading.prototype.open;

defineReadOnlyProperty(WaveLoading, 'waveLoading'); }();
//# sourceMappingURL=maps/wave_loading.js.map
