
                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        window.JParticles.snow = function(){};
                        window.JParticles.snow.prototype.open = function(){};
window.JParticles.snow.prototype.pause = function(){};
window.JParticles.snow.prototype.setOptions = function(){};
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

JParticles.snow = (_temp = _class = function (_Base) {
    _inherits(Snow, _Base);

    _createClass(Snow, [{
        key: 'version',
        get: function get() {
            return '2.0.0';
        }
    }]);

    function Snow(selector, options) {
        _classCallCheck(this, Snow);

        return _possibleConstructorReturn(this, (Snow.__proto__ || Object.getPrototypeOf(Snow)).call(this, Snow, selector, options));
    }

    _createClass(Snow, [{
        key: 'init',
        value: function init() {
            this.createDots();
            this.draw();
        }
    }, {
        key: 'snowShape',
        value: function snowShape() {
            var _set = this.set,
                maxR = _set.maxR,
                minR = _set.minR,
                maxSpeed = _set.maxSpeed,
                minSpeed = _set.minSpeed;

            var r = limitRandom(maxR, minR);

            return {
                r: r,
                x: random() * this.cw,
                y: -r,
                vx: calcSpeed(maxSpeed, minSpeed),

                // r 越大，设置垂直速度越快，这样比较有近快远慢的层次效果
                vy: abs(r * calcSpeed(maxSpeed, minSpeed)),
                color: this.color()
            };
        }
    }, {
        key: 'createDots',
        value: function createDots() {

            // 随机创建 0-6 个雪花
            var count = pInt(random() * 6);
            var dots = this.dots = [];
            while (count--) {
                dots.push(this.snowShape());
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var _this2 = this;

            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                paused = this.paused;
            var opacity = this.set.opacity;


            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = opacity;

            console.log(cw, ch, this.dots);

            this.dots.forEach(function (dot, i, array) {
                var x = dot.x,
                    y = dot.y,
                    r = dot.r;


                cxt.save();
                cxt.beginPath();
                cxt.arc(x, y, r, 0, twicePI);
                cxt.fillStyle = dot.color;
                cxt.fill();
                cxt.restore();

                if (!paused) {
                    dot.x += dot.vx;
                    dot.y += dot.vy;

                    // 雪花反方向飘落
                    if (random() > .99 && random() > .5) {
                        dot.vx *= -1;
                    }

                    // 雪花从侧边出去，删除再添加
                    if (x < 0 || x - r > cw) {
                        array.splice(i, 1, _this2.snowShape());

                        // 雪花从底部出去，删除
                    } else if (y - r >= ch) {
                        array.splice(i, 1);
                    }
                }
            });

            // 添加雪花
            if (!paused && random() > .9) {
                this.createDots();
            }

            this.requestAnimationFrame();
        }
    }]);

    return Snow;
}(Base), _class.defaultConfig = {

    // 雪花颜色
    color: '#fff',
    maxR: 6.5,
    minR: .4,
    maxSpeed: .6,
    minSpeed: 0
}, _temp);
                }();
            
//# sourceMappingURL=maps/snow.js.map
