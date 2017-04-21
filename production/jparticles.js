
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
