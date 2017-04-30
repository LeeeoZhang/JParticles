
                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        window.JParticles.particle = function(){};
                        window.JParticles.particle.prototype.open = function(){};
window.JParticles.particle.prototype.pause = function(){};
window.JParticles.particle.prototype.setOptions = function(){};
                        return;
                    }
                    'use strict';

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
    ceil = Math.ceil;

var twicePI = PI * 2;
var pInt = utils.pInt,
    limitRandom = utils.limitRandom,
    calcSpeed = utils.calcSpeed,
    scaleValue = utils.scaleValue,
    getCss = utils.getCss,
    offset = utils.offset,
    isElement = utils.isElement,
    isFunction = utils.isFunction,
    defineReadOnlyProperty = utils.defineReadOnlyProperty;

/**
 * 检查元素或其祖先节点的属性是否等于预给值
 * @param elem {element} 起始元素
 * @param property {string} css属性
 * @param value {string} css属性值
 * @returns {boolean}
 */

function checkParentsProperty(elem, property, value) {
    while (elem = elem.offsetParent) {
        if (getCss(elem, property) === value) {
            return true;
        }
    }
    return false;
}

var Particle = function (_Base) {
    _inherits(Particle, _Base);

    _createClass(Particle, [{
        key: 'version',
        get: function get() {
            return '3.0.0';
        }
    }]);

    function Particle(selector, options) {
        _classCallCheck(this, Particle);

        return _possibleConstructorReturn(this, (Particle.__proto__ || Object.getPrototypeOf(Particle)).call(this, Particle, selector, options));
    }

    _createClass(Particle, [{
        key: 'init',
        value: function init() {
            var _set = this.set,
                num = _set.num,
                range = _set.range,
                eventElem = _set.eventElem;


            if (num > 0) {

                // 设置触发事件的元素
                if (!isElement(eventElem) && eventElem !== document) {
                    this.set.eventElem = this.c;
                }

                if (range > 0) {

                    // 定位点坐标
                    this.positionX = random() * this.cw;
                    this.positionY = random() * this.ch;
                    this.defineLineShape();
                    this.positionEvent();
                }

                // 初始化鼠标在视差上的坐标
                this.mouseX = this.mouseY = 0;

                this.createDots();
                this.draw();
                this.parallaxEvent();
            }
        }
    }, {
        key: 'defineLineShape',
        value: function defineLineShape() {
            var _this2 = this;

            var _set2 = this.set,
                proximity = _set2.proximity,
                range = _set2.range,
                lineShape = _set2.lineShape;

            switch (lineShape) {
                case 'cube':
                    this.lineShapeMaker = function (x, y, sx, sy, cb) {
                        var positionX = _this2.positionX,
                            positionY = _this2.positionY;

                        if (abs(x - sx) <= proximity && abs(y - sy) <= proximity && abs(x - positionX) <= range && abs(y - positionY) <= range && abs(sx - positionX) <= range && abs(sy - positionY) <= range) {
                            cb();
                        }
                    };
                    break;
                default:
                    this.lineShapeMaker = function (x, y, sx, sy, cb) {
                        var positionX = _this2.positionX,
                            positionY = _this2.positionY;

                        if (abs(x - sx) <= proximity && abs(y - sy) <= proximity && (abs(x - positionX) <= range && abs(y - positionY) <= range || abs(sx - positionX) <= range && abs(sy - positionY) <= range)) {
                            cb();
                        }
                    };
            }
        }
    }, {
        key: 'createDots',
        value: function createDots() {
            var cw = this.cw,
                ch = this.ch,
                color = this.color;
            var _set3 = this.set,
                num = _set3.num,
                maxR = _set3.maxR,
                minR = _set3.minR,
                maxSpeed = _set3.maxSpeed,
                minSpeed = _set3.minSpeed;

            var realNumber = pInt(scaleValue(num, cw));
            var dots = this.dots = [];

            while (realNumber--) {
                var r = limitRandom(maxR, minR);
                dots.push({
                    r: r,
                    x: limitRandom(cw - r, r),
                    y: limitRandom(ch - r, r),
                    vx: calcSpeed(maxSpeed, minSpeed),
                    vy: calcSpeed(maxSpeed, minSpeed),
                    color: color(),

                    // 定义粒子在视差图层里的层级关系
                    // 值越小视差效果越强烈：1, 2, 3
                    layer: ceil(limitRandom(3, 1)),

                    // 定义粒子视差的偏移值
                    parallaxOffsetX: 0,
                    parallaxOffsetY: 0
                });
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var cw = this.cw,
                ch = this.ch,
                cxt = this.cxt;
            var _set4 = this.set,
                num = _set4.num,
                range = _set4.range,
                lineWidth = _set4.lineWidth,
                opacity = _set4.opacity;


            if (num <= 0) return;

            cxt.clearRect(0, 0, cw, ch);

            // 当canvas宽高改变的时候，全局属性需要重新设置
            cxt.lineWidth = lineWidth;
            cxt.globalAlpha = opacity;

            // 更新粒子坐标
            this.updateXY();

            // 绘制粒子
            this.dots.forEach(function (dot) {
                var x = dot.x,
                    y = dot.y,
                    r = dot.r,
                    parallaxOffsetX = dot.parallaxOffsetX,
                    parallaxOffsetY = dot.parallaxOffsetY;

                cxt.save();
                cxt.beginPath();
                cxt.arc(x + parallaxOffsetX, y + parallaxOffsetY, r, 0, twicePI);
                cxt.fillStyle = dot.color;
                cxt.fill();
                cxt.restore();
            });

            // 当连接范围小于 0 时，不连接线段
            if (range > 0) {
                this.connectDots();
            }

            this.requestAnimationFrame();
        }
    }, {
        key: 'connectDots',
        value: function connectDots() {
            var dots = this.dots,
                cxt = this.cxt,
                lineShapeMaker = this.lineShapeMaker;

            var length = dots.length;

            dots.forEach(function (dot, i) {
                var x = dot.x + dot.parallaxOffsetX;
                var y = dot.y + dot.parallaxOffsetY;

                var _loop = function _loop() {
                    var sibDot = dots[i];
                    var sx = sibDot.x + sibDot.parallaxOffsetX;
                    var sy = sibDot.y + sibDot.parallaxOffsetY;

                    lineShapeMaker(x, y, sx, sy, function () {
                        cxt.save();
                        cxt.beginPath();
                        cxt.moveTo(x, y);
                        cxt.lineTo(sx, sy);
                        cxt.strokeStyle = dot.color;
                        cxt.stroke();
                        cxt.restore();
                    });
                };

                while (++i < length) {
                    _loop();
                }
            });
        }
    }, {
        key: 'setElemOffset',
        value: function setElemOffset() {
            return this.elemOffset = this.set.eventElem === document ? null : offset(this.set.eventElem);
        }
    }, {
        key: 'updateXY',
        value: function updateXY() {
            var paused = this.paused,
                mouseX = this.mouseX,
                mouseY = this.mouseY,
                cw = this.cw,
                ch = this.ch;
            var _set5 = this.set,
                parallax = _set5.parallax,
                parallaxPerspective = _set5.parallaxPerspective;


            this.dots.forEach(function (dot) {

                // 暂停的时候，vx 和 vy 保持不变，
                // 防止自适应窗口变化时出现粒子移动
                if (!paused) {

                    if (parallax) {

                        // https://github.com/jnicol/particleground
                        var divisor = parallaxPerspective * dot.layer;
                        dot.parallaxOffsetX += (mouseX / divisor - dot.parallaxOffsetX) / 10;
                        dot.parallaxOffsetY += (mouseY / divisor - dot.parallaxOffsetY) / 10;
                    }

                    dot.x += dot.vx;
                    dot.y += dot.vy;

                    var x = dot.x,
                        y = dot.y,
                        r = dot.r,
                        parallaxOffsetX = dot.parallaxOffsetX,
                        parallaxOffsetY = dot.parallaxOffsetY;

                    x += parallaxOffsetX;
                    y += parallaxOffsetY;

                    if (x + r >= cw || x - r <= 0) {
                        dot.vx *= -1;
                    }

                    if (y + r >= ch || y - r <= 0) {
                        dot.vy *= -1;
                    }
                }
            });
        }
    }, {
        key: 'positionEvent',
        value: function positionEvent() {
            var _this3 = this;

            var _set6 = this.set,
                eventElem = _set6.eventElem,
                range = _set6.range;

            // 性能优化

            if (range > this.cw && range > this.ch) return;

            // 更新定位点的坐标
            var updatePositionHandler = function updatePositionHandler(e) {
                if (_this3.paused) return;

                _this3.positionX = e.pageX;
                _this3.positionY = e.pageY;

                // 动态计算 elemOffset 值
                if (_this3.setElemOffset()) {

                    // 动态判断祖先节点是否具有固定定位，有则使用 client 计算
                    if (checkParentsProperty(eventElem, 'position', 'fixed')) {
                        _this3.positionX = e.clientX;
                        _this3.positionY = e.clientY;
                    }
                    _this3.positionX -= _this3.elemOffset.left;
                    _this3.positionY -= _this3.elemOffset.top;
                }
            };

            utils.on(eventElem, 'mousemove', updatePositionHandler);
            this.onDestroy(function () {
                utils.off(eventElem, 'mousemove', updatePositionHandler);
            });
        }
    }, {
        key: 'parallaxEvent',
        value: function parallaxEvent() {
            var _this4 = this;

            var _set7 = this.set,
                parallax = _set7.parallax,
                eventElem = _set7.eventElem;

            if (!parallax) return;

            var parallaxHandler = function parallaxHandler(e) {
                if (_this4.paused) return;

                var left = e.pageX;
                var top = e.pageY;

                if (_this4.setElemOffset()) {

                    // 动态判断祖先节点是否具有固定定位，有则使用 client 计算
                    if (checkParentsProperty(eventElem, 'position', 'fixed')) {
                        left = e.clientX;
                        top = e.clientY;
                    }
                    left -= _this4.elemOffset.left;
                    top -= _this4.elemOffset.top;
                }

                var cw = _this4.cw,
                    ch = _this4.ch;

                _this4.mouseX = left - cw / 2;
                _this4.mouseY = top - ch / 2;
            };

            utils.on(eventElem, 'mousemove', parallaxHandler);
            this.onDestroy(function () {
                utils.off(eventElem, 'mousemove', parallaxHandler);
            });
        }
    }, {
        key: 'resize',
        value: function resize() {
            var _this5 = this;

            utils.resize(this, function (scaleX, scaleY) {
                var _set8 = _this5.set,
                    num = _set8.num,
                    range = _set8.range;

                if (num > 0 && range > 0) {
                    _this5.positionX *= scaleX;
                    _this5.positionY *= scaleY;
                }
            });
        }
    }]);

    return Particle;
}(Base);

// 挂载插件到 JParticles 对象上。


Particle.defaultConfig = {

    // 粒子个数，默认为容器宽度的 0.12 倍
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    // 0 是没有意义的，下同
    num: .12,

    // 粒子最大半径(0, +∞)
    maxR: 2.4,

    // 粒子最小半径(0, +∞)
    minR: .6,

    // 粒子最大运动速度(0, +∞)
    maxSpeed: 1,

    // 粒子最小运动速度(0, +∞)
    minSpeed: 0,

    // 两点连线的最大值
    // 在 range 范围内的两点距离小于 proximity，则两点之间连线
    proximity: 130,

    // 定位点的范围，范围越大连线越多
    // 当 range 等于 0 时，不连线，相关值无效
    range: 160,

    // 线段的宽度
    lineWidth: .2,

    // 连线的形状
    // spider: 散开的蜘蛛状
    // cube: 合拢的立方体状
    lineShape: 'spider',

    // 改变定位点坐标的事件元素
    // null 表示 canvas 画布，或传入原生元素对象，如 document 等
    eventElem: null,

    // 视差效果
    parallax: false,

    // 视差景深，值越小视差效果越强烈
    parallaxPerspective: 3
};
defineReadOnlyProperty(Particle, 'particle');
                }();
            
//# sourceMappingURL=maps/particle.js.map
