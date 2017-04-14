
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
    calcSpeed = utils.calcSpeed,
    scaleValue = utils.scaleValue;
var getCss = utils.getCss,
    offset = utils.offset,
    isElement = utils.isElement,
    modifyPrototype = utils.modifyPrototype;
var random = Math.random,
    abs = Math.abs,
    PI = Math.PI;

var twicePI = PI * 2;

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

function eventHandler(eventType) {
    var _set = this.set,
        num = _set.num,
        range = _set.range,
        eventElem = _set.eventElem;


    if (num > 0 && range > 0) {

        // 使用传递过来的关键字判断绑定事件还是移除事件
        eventType = eventType === 'pause' ? 'off' : 'on';
        utils[eventType](eventElem, 'mousemove', this.moveHandler);
        utils[eventType](eventElem, 'touchmove', this.moveHandler);
    }
}

JParticles.particle = (_temp = _class = function (_Base) {
    _inherits(Particle, _Base);

    _createClass(Particle, [{
        key: 'version',
        get: function get() {
            return '2.0.0';
        }
    }]);

    function Particle(selector, options) {
        _classCallCheck(this, Particle);

        return _possibleConstructorReturn(this, (Particle.__proto__ || Object.getPrototypeOf(Particle)).call(this, Particle, selector, options));
    }

    _createClass(Particle, [{
        key: 'init',
        value: function init() {
            var _set2 = this.set,
                num = _set2.num,
                range = _set2.range,
                eventElem = _set2.eventElem;


            if (num > 0) {
                if (range > 0) {

                    // 设置移动事件元素
                    if (!isElement(eventElem) && eventElem !== document) {
                        this.set.eventElem = this.c;
                    }

                    // 定位点坐标
                    this.posX = random() * this.cw;
                    this.posY = random() * this.ch;
                    this.event();
                }
                this.createDots();
                this.draw();
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
            var r = void 0;

            while (realNumber--) {
                r = limitRandom(maxR, minR);
                dots.push({
                    r: r,
                    x: limitRandom(cw - r, r),
                    y: limitRandom(ch - r, r),
                    vx: calcSpeed(maxSpeed, minSpeed),
                    vy: calcSpeed(maxSpeed, minSpeed),
                    color: color()
                });
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var cw = this.cw,
                ch = this.ch,
                cxt = this.cxt,
                paused = this.paused;
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

            this.dots.forEach(function (dot) {
                var r = dot.r;

                cxt.save();
                cxt.beginPath();
                cxt.arc(dot.x, dot.y, r, 0, twicePI);
                cxt.fillStyle = dot.color;
                cxt.fill();
                cxt.restore();

                // 暂停的时候，vx和vy保持不变，
                // 处理自适应窗口变化时出现粒子移动的状态
                if (!paused) {
                    dot.x += dot.vx;
                    dot.y += dot.vy;

                    var x = dot.x;
                    var y = dot.y;

                    if (x + r >= cw || x - r <= 0) {
                        dot.vx *= -1;
                    }

                    if (y + r >= ch || y - r <= 0) {
                        dot.vy *= -1;
                    }
                }
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
                posX = this.posX,
                posY = this.posY;
            var _set5 = this.set,
                distance = _set5.distance,
                range = _set5.range;

            var length = dots.length;

            dots.forEach(function (dot, i) {
                var x = dot.x;
                var y = dot.y;
                var color = dot.color;

                while (++i < length) {
                    var sibDot = dots[i];
                    var sx = sibDot.x;
                    var sy = sibDot.y;

                    if (abs(x - sx) <= distance && abs(y - sy) <= distance && (abs(x - posX) <= range && abs(y - posY) <= range || abs(sx - posX) <= range && abs(sy - posY) <= range)) {
                        cxt.save();
                        cxt.beginPath();
                        cxt.moveTo(x, y);
                        cxt.lineTo(sx, sy);
                        cxt.strokeStyle = color;
                        cxt.stroke();
                        cxt.restore();
                    }
                }
            });
        }
    }, {
        key: 'getElemOffset',
        value: function getElemOffset() {
            return this.elemOffset = this.elemOffset ? offset(this.set.eventElem) : null;
        }
    }, {
        key: 'event',
        value: function event() {
            var eventElem = this.set.eventElem;


            if (eventElem !== document) {
                this.elemOffset = true;
            }

            // move 事件处理函数
            this.moveHandler = function (e) {
                this.posX = e.pageX;
                this.posY = e.pageY;

                // 动态计算 elemOffset 值
                if (this.getElemOffset()) {

                    // 动态判断祖先节点是否具有固定定位，有则使用client计算
                    if (checkParentsProperty(eventElem, 'position', 'fixed')) {
                        this.posX = e.clientX;
                        this.posY = e.clientY;
                    }
                    this.posX -= this.elemOffset.left;
                    this.posY -= this.elemOffset.top;
                }
            }.bind(this);

            // 添加 move 事件
            eventHandler.call(this);
        }
    }, {
        key: 'resize',
        value: function resize() {
            var _this2 = this;

            utils.resize(this, function (scaleX, scaleY) {
                var _set6 = _this2.set,
                    num = _set6.num,
                    range = _set6.range;

                if (num > 0 && range > 0) {
                    _this2.posX *= scaleX;
                    _this2.posY *= scaleY;
                    _this2.getElemOffset();
                }
            });
        }
    }]);

    return Particle;
}(Base), _class.defaultConfig = {

    // 粒子个数，默认为容器宽度的 0.12 倍
    // 传入 (0, 1) 显示容器宽度相应倍数的个数，传入 [1, +∞) 显示具体个数
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
    // 在 range 范围内的两点距离小于 distance，则两点之间连线
    distance: 130,

    // 线段的宽度
    lineWidth: .2,

    // 定位点的范围，范围越大连线越多，当 range 等于 0 时，不连线，相关值无效
    range: 160,

    // 改变定位点坐标的事件元素，null 表示 canvas 画布，或传入原生元素对象，如 document 等
    eventElem: null
}, _temp);

// 修改原型 pause, open 方法
modifyPrototype(JParticles.particle.prototype, 'pause, open', eventHandler);
                }();
            
//# sourceMappingURL=maps/particle.js.map
