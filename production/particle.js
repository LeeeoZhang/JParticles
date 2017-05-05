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
    isNull = utils.isNull,
    on = utils.on,
    off = utils.off,
    orientationSupport = utils.orientationSupport,
    _resize = utils.resize,
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
                range = _set.range;


            if (num > 0) {
                this.attrNormalize();

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
        key: 'attrNormalize',
        value: function attrNormalize() {
            var cw = this.cw,
                set = this.set;

            ['num', 'proximity', 'range'].forEach(function (attr) {
                set[attr] = pInt(scaleValue(set[attr], cw));
            });

            // 设置触发事件的元素
            if (!isElement(set.eventElem) && set.eventElem !== document) {
                set.eventElem = this.c;
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

            var dots = this.dots = [];

            while (num--) {
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

                    // 自然碰撞反向，视差事件移动反向
                    if (x + r >= cw) {
                        dot.vx = -abs(dot.vx);
                    } else if (x - r <= 0) {
                        dot.vx = abs(dot.vx);
                    }

                    if (y + r >= ch) {
                        dot.vy = -abs(dot.vy);
                    } else if (y - r <= 0) {
                        dot.vy = abs(dot.vy);
                    }
                }
            });
        }
    }, {
        key: 'setElemOffset',
        value: function setElemOffset() {
            return this.elemOffset = this.set.eventElem === document ? null : offset(this.set.eventElem);
        }
    }, {
        key: 'proxyEvent',
        value: function proxyEvent(move, rientation) {
            var _this3 = this;

            var eventElem = this.set.eventElem;

            var orientationHandler = null;

            if (orientationSupport) {
                orientationHandler = function orientationHandler(e) {
                    if (_this3.paused || isNull(e.beta)) return;

                    // 转换 beta 范围 [-180, 180] 成 [-90, 90]
                    rientation(Math.min(Math.max(e.beta, -90), 90), e.gamma);
                };

                on(window, 'deviceorientation', orientationHandler);
            }

            var moveHandler = function moveHandler(e) {
                if (_this3.paused) return;

                var left = e.pageX;
                var top = e.pageY;

                if (_this3.setElemOffset()) {

                    // 动态判断祖先节点是否具有固定定位，有则使用 client 计算
                    if (checkParentsProperty(eventElem, 'position', 'fixed')) {
                        left = e.clientX;
                        top = e.clientY;
                    }
                    left -= _this3.elemOffset.left;
                    top -= _this3.elemOffset.top;
                }
                move(left, top);
            };

            on(eventElem, 'mousemove', moveHandler);
            this.onDestroy(function () {
                off(eventElem, 'mousemove', moveHandler);
                off(window, 'deviceorientation', orientationHandler);
            });
        }
    }, {
        key: 'positionEvent',
        value: function positionEvent() {
            var _this4 = this;

            var range = this.set.range;

            // 性能优化

            if (range > this.cw && range > this.ch) return;

            // 鼠标移动事件
            this.proxyEvent(function (left, top) {
                _this4.positionX = left;
                _this4.positionY = top;

                // 陀螺仪事件
            }, function (beta, gamma) {
                _this4.positionY = -(beta - 90) / 180 * _this4.ch;
                _this4.positionX = -(gamma - 90) / 180 * _this4.cw;
            });
        }
    }, {
        key: 'parallaxEvent',
        value: function parallaxEvent() {
            var _this5 = this;

            if (!this.set.parallax) return;

            this.proxyEvent(function (left, top) {
                _this5.mouseX = left - _this5.cw / 2;
                _this5.mouseY = top - _this5.ch / 2;
            }, function (beta, gamma) {

                // 一半高度或宽度的对应比例值
                // mouseX: - gamma / 90 * cw / 2;
                // mouseY: - beta / 90 * ch / 2;
                _this5.mouseX = -gamma * _this5.cw / 180;
                _this5.mouseY = -beta * _this5.ch / 180;
            });
        }
    }, {
        key: 'resize',
        value: function resize() {
            var _this6 = this;

            _resize(this, function (scaleX, scaleY) {
                var _set6 = _this6.set,
                    num = _set6.num,
                    range = _set6.range;

                if (num > 0 && range > 0) {
                    _this6.positionX *= scaleX;
                    _this6.positionY *= scaleY;
                    _this6.mouseX *= scaleX;
                    _this6.mouseY *= scaleY;
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
    // 0 是没有意义的
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
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    proximity: .2,

    // 定位点的范围，范围越大连线越多
    // 当 range 等于 0 时，不连线，相关值无效
    // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
    range: .2,

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
defineReadOnlyProperty(Particle, 'particle'); }();
//# sourceMappingURL=maps/particle.js.map
