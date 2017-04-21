
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        factory();
    }
}(function () {
    // Compatible with old browsers, such as IE8.
    // Prevent them from throwing an error.
    // This is not a good way, will be removed in the future.
    if (!document.createElement('canvas').getContext) {
        window.JParticles = {};
        if (typeof define === 'function' && define.amd) {
            define(function () {
                return window.JParticles;
            });
        }
        return;
    }
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 规定：
 *  defaultConfig：默认配置项，需挂载到构造函数对象上
 *
 * 对象的属性
 *  set: 参数配置
 *  set.opacity 透明度
 *  set.color: 颜色
 *  set.resize: 自适应
 *
 *  c: canvas对象
 *  cw: canvas宽度
 *  ch: canvas高度
 *  cxt: canvas 2d 绘图环境
 *  container: {DOM Element} 包裹canvas的容器
 *  dots: {array} 通过arc绘制的粒子对象集
 *  [dot].x: 通过arc绘制的粒子的x值
 *  [dot].y: 通过arc绘制的粒子的y值
 *  paused: {boolean} 是否暂停
 *  canvasRemoved: {boolean} canvas从DOM中被移除
 *
 * 对象的方法
 *  color：返回随机或设定好的粒子颜色
 *
 * 子类原型对象的方法
 *  init: 初始化配置或方法调用
 *  draw: 绘图函数
 *
 * 继承 Base 父类的方法
 *  pause: 暂停粒子运动
 *  open: 开启粒子运动
 *  resize: 自适应窗口，需手动调用
 *
 * 继承 Base 父类的事件
 *  onDestroy: 动画被销毁后执行的事件
 */
// 编译构建时通过 package.json 的 version 生成版本
var version = '2.0.0';
var win = window;
var doc = document;
var random = Math.random,
    floor = Math.floor;
var isArray = Array.isArray;


var defaultCanvasWidth = 485;
var defaultCanvasHeight = 300;
var regExp = {
    trimAll: /\s/g,
    styleValue: /^\d+(\.\d+)?[a-z]+$/i
};

function pInt(str) {
    return parseInt(str, 10);
}

function trimAll(str) {
    return str.replace(regExp.trimAll, '');
}

function randomColor() {
    // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
    return '#' + random().toString(16).slice(-6);
}

/**
 * 限制随机数的范围
 * @param max {number}
 * @param min {number}
 * @returns {number}
 */
function limitRandom(max, min) {
    return max === min ? max : random() * (max - min) + min;
}

/**
 * 对象的复制，跟jQuery extend方法一致（站在jQuery的肩膀之上）。
 * extend( target [, object1 ] [, objectN ] )
 * extend( [ deep ,] target, object1 [, objectN ] )
 * @returns {object}
 */
function extend() {
    var arg = arguments,
        target = arg[0] || {},
        deep = false,
        length = arg.length,
        i = 1,
        value = void 0,
        attr = void 0;

    if (isBoolean(target)) {
        deep = target;
        target = arg[1] || {};
        i++;
    }

    for (; i < length; i++) {
        for (attr in arg[i]) {

            value = arg[i][attr];

            if (deep && (isPlainObject(value) || isArray(value))) {

                target[attr] = extend(deep, isArray(value) ? [] : {}, value);
            } else {
                target[attr] = value;
            }
        }
    }

    return target;
}

/**
 * 对象的检测
 * @param obj {*} 需要检测的对象
 * @param type {string} 对象所属类型
 * @returns {boolean}
 */
function typeChecking(obj, type) {
    // 直接使用 toString.call(obj) 在 ie 会下报错
    return Object.prototype.toString.call(obj) === type;
}

function isFunction(obj) {
    return typeChecking(obj, '[object Function]');
}

function isPlainObject(obj) {
    return typeChecking(obj, '[object Object]');
}

function isElement(obj) {
    // document(nodeType===9)不能是element，因为它没有很多element该有的属性
    // 如用getComputedStyle获取不到它的宽高，就会报错
    // 当传入0的时候，不加!!会返回0，而不是Boolean值
    return !!(obj && obj.nodeType === 1);
}

function isString(val) {
    return typeof val === 'string';
}

function isBoolean(val) {
    return typeof val === 'boolean';
}

/**
 * 获取对象的css属性值
 * @param elem {element}
 * @param attr {string}
 * @returns {string|number}
 */
function getCss(elem, attr) {
    var val = win.getComputedStyle(elem)[attr];

    // 对于属性值是 200px 这样的形式，返回 200 这样的数字值
    return regExp.styleValue.test(val) ? pInt(val) : val;
}

/**
 * 获取对象距离页面的top、left值
 * @param elem {element}
 * @returns {{left: (number), top: (number)}}
 */
function offset(elem) {
    var left = elem.offsetLeft || 0;
    var top = elem.offsetTop || 0;
    while (elem = elem.offsetParent) {
        left += elem.offsetLeft;
        top += elem.offsetTop;
    }
    return {
        left: left,
        top: top
    };
}

function on(elem, evtName, handler) {
    elem.addEventListener(evtName, handler);
}

function off(elem, evtName, handler) {
    elem.removeEventListener(evtName, handler);
}

function setCanvasWH(context) {
    context.cw = context.c.width = getCss(context.container, 'width') || defaultCanvasWidth;
    context.ch = context.c.height = getCss(context.container, 'height') || defaultCanvasHeight;
}

/**
 * 计算刻度值
 * @param val {number} 乘数，(0, 1)表示被乘数的倍数，0 & [1, +∞)表示具体数值
 * @param scale {number} 被乘数
 * @returns {number}
 */
function scaleValue(val, scale) {
    return val > 0 && val < 1 ? scale * val : val;
}

/**
 * 计算速度值
 * @param max {number}
 * @param min {number}
 * @returns {number}
 */
function calcSpeed(max, min) {
    return (limitRandom(max, min) || max) * (random() > .5 ? 1 : -1);
}

/**
 * 生成 color 函数，用于给粒子赋予颜色
 * @param color {string|array} 颜色数组
 * @returns {function}
 */
function generateColor(color) {
    var colorLength = isArray(color) ? color.length : false;
    var recolor = function recolor() {
        return color[floor(random() * colorLength)];
    };
    return isString(color) ? function () {
        return color;
    } : colorLength ? recolor : randomColor;
}

// 暂停粒子运动
function _pause(context, callback) {

    // 没有set表示实例创建失败，防止错误调用报错
    if (!context.canvasRemoved && context.set && !context.paused) {

        // 传递 pause 关键字供特殊使用
        isFunction(callback) && callback.call(context, 'pause');
        context.paused = true;
    }
}

// 开启粒子运动
function _open(context, callback) {
    if (!context.canvasRemoved && context.set && context.paused) {
        isFunction(callback) && callback.call(context, 'open');
        context.paused = false;
        context.draw();
    }
}

// 自适应窗口，重新计算粒子坐标
function _resize(context, callback) {
    if (context.set.resize) {
        context._resizeHandler = function () {
            var oldCW = context.cw;
            var oldCH = context.ch;

            // 重新设置canvas宽高
            setCanvasWH(context);

            // 计算比例
            var scaleX = context.cw / oldCW;
            var scaleY = context.ch / oldCH;

            // 重新赋值
            if (isArray(context.dots)) {
                context.dots.forEach(function (v) {
                    if (isPlainObject(v)) {
                        v.x *= scaleX;
                        v.y *= scaleY;
                    }
                });
            }

            if (isFunction(callback)) {
                callback.call(context, scaleX, scaleY);
            }

            context.paused && context.draw();
        };
        on(win, 'resize', context._resizeHandler);
    }
}

/**
 * 修改插件原型上的方法
 * 使用：modifyPrototype(Particle.prototype, 'pause', function(){})
 * @param prototype {Object} 原型对象
 * @param names {string} 方法名，多个方法名用逗号隔开
 * @param callback {function} 回调函数
 */
function modifyPrototype(prototype, names, callback) {
    trimAll(names).split(',').forEach(function (name) {
        prototype[name] = function () {
            utils[name](this, callback);
        };
    });
}

/**
 * 使用此方法挂载插件到 JParticles 对象上，防止被修改。
 * function.name 的兼容性并不高，所以插件需手动传递 name 值。
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
 *
 * eg:
 * defineReadOnlyProperty(Particle, 'particle')
 * defineReadOnlyProperty(regExp, 'regExp', utils)
 *
 * @param value {Class|*} 插件类或其他值
 * @param name  {string} 属性名称
 * @param target {object} 要在其上定义属性的对象
 */
function defineReadOnlyProperty(value, name) {
    var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : JParticles;

    Object.defineProperty(target, name, {
        value: value,
        writable: false,
        enumerable: true,
        configurable: false
    });
}

var Base = function () {
    function Base(constructor, selector, options) {
        _classCallCheck(this, Base);

        if (this.container = isElement(selector) ? selector : doc.querySelector(selector)) {
            this.set = extend(true, {}, Base.commonConfig, constructor.defaultConfig, options);
            this.c = doc.createElement('canvas');
            this.cxt = this.c.getContext('2d');
            this.paused = false;

            setCanvasWH(this);

            this.container.innerHTML = '';
            this.container.appendChild(this.c);

            this.color = generateColor(this.set.color);

            this.observeCanvasRemoved();
            this.init();
            this.resize();
        }
    }

    _createClass(Base, [{
        key: 'requestAnimationFrame',
        value: function requestAnimationFrame() {
            if (!this.canvasRemoved && !this.paused) {
                win.requestAnimationFrame(this.draw.bind(this));
            }
        }
    }, {
        key: 'observeCanvasRemoved',
        value: function observeCanvasRemoved() {
            var _this = this;

            this.destructionListeners = [];
            observeElementRemoved(this.c, function () {

                // canvas 从DOM中被移除
                // 1、停止 requestAnimationFrame，避免性能损耗
                _this.canvasRemoved = true;

                // 2、移除外在事件
                if (_this._resizeHandler) {
                    off(win, 'resize', _this._resizeHandler);
                }

                // 3、触发销毁回调事件
                _this.destructionListeners.forEach(function (callback) {
                    callback();
                });
            });
        }
    }, {
        key: 'onDestroy',
        value: function onDestroy() {
            for (var i = 0; i < arguments.length; i++) {
                if (isFunction(arguments[i])) {
                    this.destructionListeners.push(arguments[i]);
                }
            }
        }
    }, {
        key: 'pause',
        value: function pause() {
            _pause(this);
        }
    }, {
        key: 'open',
        value: function open() {
            _open(this);
        }
    }, {
        key: 'resize',
        value: function resize() {
            _resize(this);
        }
    }]);

    return Base;
}();

// requestAnimationFrame 兼容处理


Base.commonConfig = {

    // 画布全局透明度 {number}
    // 取值范围：[0-1]
    opacity: 1,

    // 粒子颜色 {string|array}
    // 1、空数组表示随机取色。
    // 2、在特定颜色的数组里随机取色，如：['red', 'blue', 'green']。
    // 3、当为 string 类型时，如：'red'，则表示粒子都填充为红色。
    color: [],

    // 自适应窗口尺寸变化 {boolean}
    resize: true
};
win.requestAnimationFrame = function (win) {
    return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || function (fn) {
        win.setTimeout(fn, 1000 / 60);
    };
}(win);

// 不管是 MutationObserver 还是 DOMNodeRemoved，
// 当监听某个具体的元素时，如果父祖级被删除了，并不会触发该元素被移除的事件，
// 所以要监听整个文档，每次移除事件都得递归遍历要监听的元素是否被删除。
var observeElementRemoved = function () {
    var MutationObserver = win.MutationObserver || win.WebKitMutationObserver;
    var checkElementRemoved = function checkElementRemoved(node, element) {
        if (node === element) {
            return true;
        } else if (isElement(node)) {
            var children = node.children;
            var length = children.length;
            while (length--) {
                if (checkElementRemoved(children[length], element)) {
                    return true;
                }
            }
        }
        return false;
    };
    var useMutation = function useMutation(element, callback) {
        var observer = new MutationObserver(function (mutations, observer) {
            var i = mutations.length;
            while (i--) {
                var removeNodes = mutations[i].removedNodes;
                var j = removeNodes.length;
                while (j--) {
                    if (checkElementRemoved(removeNodes[j], element)) {
                        observer.disconnect();
                        return callback();
                    }
                }
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    };
    var useDOMNodeRemoved = function useDOMNodeRemoved(element, callback) {
        var DOMNodeRemoved = function DOMNodeRemoved(e) {
            if (checkElementRemoved(e.target, element)) {
                document.removeEventListener('DOMNodeRemoved', DOMNodeRemoved);
                callback();
            }
        };
        document.addEventListener('DOMNodeRemoved', DOMNodeRemoved);
    };
    return MutationObserver ? useMutation : useDOMNodeRemoved;
}();

// 工具箱
var utils = {
    regExp: regExp,
    pInt: pInt,
    trimAll: trimAll,

    randomColor: randomColor,
    limitRandom: limitRandom,

    extend: extend,
    typeChecking: typeChecking,
    isPlainObject: isPlainObject,
    isFunction: isFunction,
    isArray: isArray,
    isString: isString,
    isBoolean: isBoolean,
    isElement: isElement,

    observeElementRemoved: observeElementRemoved,
    getCss: getCss,
    offset: offset,
    on: on,
    off: off,

    scaleValue: scaleValue,
    calcSpeed: calcSpeed,

    pause: _pause,
    open: _open,
    resize: _resize,
    modifyPrototype: modifyPrototype,
    defineReadOnlyProperty: defineReadOnlyProperty
};

var JParticles = {
    version: version,
    utils: utils,
    Base: Base
};

// 设置对外提供的对象的属性及方法
// 为只读，可枚举，不允许修改及删除。
(function defineProperties(object) {
    for (var name in object) {
        var value = object[name];
        defineReadOnlyProperty(value, name, object);
        if (isPlainObject(value)) {
            defineProperties(value);
        }
    }
})(JParticles);

win.JParticles = JParticles;
    // AMD 加载方式放在头部，factory 函数会比后面的插件延迟执行
    // 导致后面的插件找不到 JParticles 对象而报错
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return JParticles;
        });
    } else {
        return JParticles;
    }
}));

//# sourceMappingURL=maps/jparticles.js.map


                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        window.JParticles.lowpoly = function(){};
                        window.JParticles.lowpoly.prototype.open = function(){};
window.JParticles.lowpoly.prototype.pause = function(){};
window.JParticles.lowpoly.prototype.setOptions = function(){};
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

JParticles.lowpoly = (_temp = _class = function (_Base) {
    _inherits(Lowpoly, _Base);

    _createClass(Lowpoly, [{
        key: 'version',
        get: function get() {
            return '2.0.0';
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
}(Base), _class.defaultConfig = {
    color: '#fff',
    maxR: 6.5,
    minR: .4,
    maxSpeed: .6,
    minSpeed: 0
}, _temp);
                }();
            
//# sourceMappingURL=maps/lowpoly.js.map


                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        window.JParticles.meteor = function(){};
                        window.JParticles.meteor.prototype.open = function(){};
window.JParticles.meteor.prototype.pause = function(){};
window.JParticles.meteor.prototype.setOptions = function(){};
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
    PI = Math.PI;

var twicePI = PI * 2;
var pInt = utils.pInt,
    limitRandom = utils.limitRandom,
    calcSpeed = utils.calcSpeed,
    scaleValue = utils.scaleValue,
    getCss = utils.getCss,
    offset = utils.offset,
    isElement = utils.isElement,
    isFunction = utils.isFunction,
    modifyPrototype = utils.modifyPrototype,
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

function eventHandler(eventType) {
    var _set = this.set,
        num = _set.num,
        range = _set.range,
        eventElem = _set.eventElem;


    if (num > 0 && range > 0) {

        // 使用传递过来的关键字判断绑定事件还是移除事件
        eventType = eventType === 'pause' ? 'off' : 'on';
        utils[eventType](eventElem, 'mousemove', this.moveHandler);
    }
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

            while (realNumber--) {
                var r = limitRandom(maxR, minR);
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
            var _this2 = this;

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

            this.onDestroy(function () {
                utils.off(eventElem, 'mousemove', _this2.moveHandler);
            });
        }
    }, {
        key: 'resize',
        value: function resize() {
            var _this3 = this;

            utils.resize(this, function (scaleX, scaleY) {
                var _set6 = _this3.set,
                    num = _set6.num,
                    range = _set6.range;

                if (num > 0 && range > 0) {
                    _this3.posX *= scaleX;
                    _this3.posY *= scaleY;
                    _this3.getElemOffset();
                }
            });
        }
    }]);

    return Particle;
}(Base);

// 修改原型 pause, open 方法


Particle.defaultConfig = {

    // 粒子个数，默认为容器宽度的 0.12 倍
    // (0, 1) 显示为容器宽度相应倍数的个数，[1, +∞) 显示具体个数
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

    // 定位点的范围，范围越大连线越多
    // 当 range 等于 0 时，不连线，相关值无效
    range: 160,

    // 改变定位点坐标的事件元素
    // null 表示 canvas 画布，或传入原生元素对象，如 document 等
    eventElem: null
};
modifyPrototype(Particle.prototype, 'pause, open', eventHandler);

// 使用防止属性被更改的 appendProperty 方法，
// 挂载插件到 JParticles 对象上。
defineReadOnlyProperty(Particle, 'particle');
                }();
            
//# sourceMappingURL=maps/particle.js.map


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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _JParticles = JParticles,
    utils = _JParticles.utils,
    Base = _JParticles.Base;
var random = Math.random,
    abs = Math.abs,
    PI = Math.PI;

var twicePI = PI * 2;
var pInt = utils.pInt,
    limitRandom = utils.limitRandom,
    calcSpeed = utils.calcSpeed,
    defineReadOnlyProperty = utils.defineReadOnlyProperty;

var Snow = function (_Base) {
    _inherits(Snow, _Base);

    _createClass(Snow, [{
        key: 'version',
        get: function get() {
            return '3.0.0';
        }
    }]);

    function Snow(selector, options) {
        _classCallCheck(this, Snow);

        return _possibleConstructorReturn(this, (Snow.__proto__ || Object.getPrototypeOf(Snow)).call(this, Snow, selector, options));
    }

    _createClass(Snow, [{
        key: 'init',
        value: function init() {
            this.dots = [];
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
            while (count--) {
                this.dots.push(this.snowShape());
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
                    } else if (y - r > ch) {
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
}(Base);

Snow.defaultConfig = {

    // 雪花颜色
    color: '#fff',
    maxR: 6.5,
    minR: .4,
    maxSpeed: .6,
    minSpeed: 0
};


defineReadOnlyProperty(Snow, 'snow');
                }();
            
//# sourceMappingURL=maps/snow.js.map


                +function () {
                    // Compatible with old browsers, such as IE8.
                    // Prevent them from throwing an error.
                    if (!document.createElement('canvas').getContext) {
                        window.JParticles.wave = function(){};
                        window.JParticles.wave.prototype.open = function(){};
window.JParticles.wave.prototype.pause = function(){};
window.JParticles.wave.prototype.setOptions = function(){};
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
    sin = Math.sin;

var twicePI = PI * 2;
var UNDEFINED = 'undefined';
var pInt = utils.pInt,
    limitRandom = utils.limitRandom,
    calcSpeed = utils.calcSpeed,
    _scaleValue = utils.scaleValue,
    randomColor = utils.randomColor,
    isArray = utils.isArray,
    isPlainObject = utils.isPlainObject,
    defineReadOnlyProperty = utils.defineReadOnlyProperty;

var Wave = function (_Base) {
    _inherits(Wave, _Base);

    _createClass(Wave, [{
        key: 'version',
        get: function get() {
            return '3.0.0';
        }
    }]);

    function Wave(selector, options) {
        _classCallCheck(this, Wave);

        return _possibleConstructorReturn(this, (Wave.__proto__ || Object.getPrototypeOf(Wave)).call(this, Wave, selector, options));
    }

    _createClass(Wave, [{
        key: 'init',
        value: function init() {
            if (this.set.num > 0) {

                // 线条波长，每个周期(2π)在canvas上的实际长度
                this.rippleLength = [];

                this.attrNormalize();
                this.createDots();
                this.draw();
            }
        }
    }, {
        key: 'attrNormalize',
        value: function attrNormalize() {
            var _this2 = this;

            ['fill', 'fillColor', 'line', 'lineColor', 'lineWidth', 'offsetLeft', 'offsetTop', 'crestHeight', 'rippleNum', 'speed'].forEach(function (attr) {
                return _this2.attrProcessor(attr);
            });
        }
    }, {
        key: 'attrProcessor',
        value: function attrProcessor(attr) {
            var num = this.set.num;
            var attrValue = this.set[attr];
            var stdValue = attrValue;
            var scale = attr === 'offsetLeft' ? this.cw : this.ch;

            if (!isArray(attrValue)) {
                stdValue = this.set[attr] = [];
            }

            // 将数组、字符串、数字、布尔类型属性标准化，例如 num = 3：
            // crestHeight: []或[2]或[2, 2], 标准化成: [2, 2, 2]
            // crestHeight: 2, 标准化成: [2, 2, 2]
            // 注意：(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值，其他属性同理
            // scaleValue 用于处理属性值为 (0, 1) 或 [1, +∞) 这样的情况，返回计算好的数值。
            while (num--) {
                var val = isArray(attrValue) ? attrValue[num] : attrValue;

                stdValue[num] = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === UNDEFINED ? this.generateDefaultValue(attr) : this.scaleValue(attr, val, scale);

                if (attr === 'rippleNum') {
                    this.rippleLength[num] = this.cw / stdValue[num];
                }
            }
        }

        // 以下为缺省情况，属性对应的默认值

    }, {
        key: 'generateDefaultValue',
        value: function generateDefaultValue(attr) {
            var cw = this.cw,
                ch = this.ch;


            switch (attr) {
                case 'lineColor':
                case 'fillColor':
                    attr = randomColor();
                    break;
                case 'lineWidth':
                    attr = limitRandom(2, .2);
                    break;
                case 'offsetLeft':
                    attr = random() * cw;
                    break;
                case 'offsetTop':
                case 'crestHeight':
                    attr = random() * ch;
                    break;
                case 'rippleNum':
                    attr = limitRandom(cw / 2, 1);
                    break;
                case 'speed':
                    attr = limitRandom(.4, .1);
                    break;
                case 'fill':
                    attr = false;
                    break;
                case 'line':
                    attr = true;
                    break;
            }
            return attr;
        }
    }, {
        key: 'scaleValue',
        value: function scaleValue(attr, value, scale) {
            if (attr === 'offsetTop' || attr === 'offsetLeft' || attr === 'crestHeight') {
                return _scaleValue(value, scale);
            }
            return value;
        }
    }, {
        key: 'dynamicProcessor',
        value: function dynamicProcessor(name, newValue) {
            var _this3 = this;

            var scale = name === 'offsetLeft' ? this.cw : this.ch;
            var isArrayType = isArray(newValue);

            this.set[name].forEach(function (curValue, i, array) {

                var value = isArrayType ? newValue[i] : newValue;
                value = _this3.scaleValue(name, value, scale);

                // 未定义部分保持原有值
                if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === UNDEFINED) {
                    value = curValue;
                }

                array[i] = value;
            });
        }
    }, {
        key: 'setOptions',
        value: function setOptions(newOptions) {
            if (this.set.num > 0 && isPlainObject(newOptions)) {
                for (var name in newOptions) {

                    // 不允许 opacity 为 0
                    if (name === 'opacity' && newOptions[name]) {
                        this.set.opacity = newOptions[name];
                    } else if (this.dynamicOptions.indexOf(name) !== -1) {
                        this.dynamicProcessor(name, newOptions[name]);
                    }
                }
            }
        }
    }, {
        key: 'createDots',
        value: function createDots() {
            var cw = this.cw,
                rippleLength = this.rippleLength;
            var num = this.set.num;

            var dots = this.dots = [];

            while (num--) {
                var line = dots[num] = [];

                // 点的y轴步进
                var step = twicePI / rippleLength[num];

                // 创建一条线段所需的点
                for (var i = 0; i < cw; i++) {
                    line.push({
                        x: i,
                        y: i * step
                    });
                }
            }
        }
    }, {
        key: 'draw',
        value: function draw() {
            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                paused = this.paused,
                set = this.set;
            var num = set.num,
                opacity = set.opacity;


            if (num <= 0) return;

            cxt.clearRect(0, 0, cw, ch);
            cxt.globalAlpha = opacity;

            this.dots.forEach(function (line, i) {
                var crestHeight = set.crestHeight[i];
                var offsetLeft = set.offsetLeft[i];
                var offsetTop = set.offsetTop[i];
                var speed = set.speed[i];

                cxt.save();
                cxt.beginPath();

                line.forEach(function (dot, j) {
                    cxt[j ? 'lineTo' : 'moveTo'](dot.x,

                    // y = A sin ( ωx + φ ) + h
                    crestHeight * sin(dot.y + offsetLeft) + offsetTop);
                    !paused && (dot.y -= speed);
                });

                if (set.fill[i]) {
                    cxt.lineTo(cw, ch);
                    cxt.lineTo(0, ch);
                    cxt.closePath();
                    cxt.fillStyle = set.fillColor[i];
                    cxt.fill();
                }

                if (set.line[i]) {
                    cxt.lineWidth = set.lineWidth[i];
                    cxt.strokeStyle = set.lineColor[i];
                    cxt.stroke();
                }

                cxt.restore();
            });

            this.requestAnimationFrame();
        }
    }, {
        key: 'resize',
        value: function resize() {
            var _this4 = this;

            utils.resize(this, function (scaleX, scaleY) {
                if (_this4.set.num > 0) {
                    _this4.dots.forEach(function (line) {
                        line.forEach(function (dot) {
                            dot.x *= scaleX;
                            dot.y *= scaleY;
                        });
                    });
                }
            });
        }
    }]);

    return Wave;
}(Base);

// 仅允许 opacity 和以下选项动态设置


Wave.defaultConfig = {

    // 线条个数
    num: 3,

    // 是否填充背景色，设置为false相关值无效
    fill: false,

    // 填充的背景色，当fill设置为true时生效
    fillColor: [],

    // 是否绘制边框，设置为false相关值无效
    line: true,

    // 边框颜色，当stroke设置为true时生效，下同
    lineColor: [],

    // 边框宽度
    lineWidth: [],

    // 线条横向偏移值，距离canvas画布左边的偏移值
    // (0, 1)表示容器宽度的倍数，[1, +∞)表示具体数值
    offsetLeft: [],

    // 线条纵向偏移值，线条中点到canvas画布顶部的距离
    // (0, 1)表示容器高度的倍数，[1, +∞)表示具体数值
    offsetTop: [],

    // 波峰高度，(0, 1)表示容器高度的倍数，[1, +∞)表示具体数值
    crestHeight: [],

    // 波纹个数，即正弦周期个数
    rippleNum: [],

    // 运动速度
    speed: []
};
Wave.prototype.dynamicOptions = ['fill', 'fillColor', 'line', 'lineColor', 'lineWidth', 'offsetLeft', 'offsetTop', 'crestHeight', 'speed'];

defineReadOnlyProperty(Wave, 'wave');
                }();

//# sourceMappingURL=maps/wave.js.map
