/**
 * 规定：
 * defaultConfig：默认配置项，需挂载到构造函数对象上
 *
 * 对象的属性
 *  set: 参数配置
 *  set.color: 颜色
 *  set.resize: 自适应
 *
 *  c: canvas对象
 *  cw: canvas宽度
 *  ch: canvas高度
 *  cxt: canvas 2d 绘图环境
 *  container: 包裹canvas的容器
 *  dots: {array} 通过arc绘制的粒子对象集
 *  [dot].x: 通过arc绘制的粒子的x值
 *  [dot].y: 通过arc绘制的粒子的y值
 *  paused: {boolean} 是否暂停
 *
 * 对象的方法
 *  color：返回随机或设定好的粒子颜色
 *
 * 原型对象的方法
 *  init: 初始化配置或方法调用
 *  draw: 绘图函数
 */
/**
 * 注释说明：
 *  {object}里的object只表示json格式的对象，其他相应格式对象用function，null，array...
 *  {Object}表示对象，如prototype等难以形容的对象
 */
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        factory();
    }
}(function () {
    'use strict';
    var win = window;
    var doc = document;
    var random = Math.random;
    var floor = Math.floor;
    var isArray = Array.isArray;
    var canvasSupport = !!doc.createElement('canvas').getContext;
    var defaultCanvasWidth = 485;
    var defaultCanvasHeight = 300;
    var regTrimAll = /\s/g;

    function pInt(str) {
        return parseInt(str, 10);
    }

    function trimAll(str) {
        return str.replace(regTrimAll, '');
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
        return max === min ? max : (random() * (max - min) + min);
    }

    /**
     * 对象的复制，跟jQuery extend方法一致
     * extend( target [, object1 ] [, objectN ] )
     * extend( [ deep ,] target, object1 [, objectN ] )
     * @returns {object}
     */
    function extend() {
        // 站在jQuery的肩膀之上
        var arg = arguments,
            target = arg[0] || {},
            deep = false,
            length = arg.length,
            i = 1,
            value, attr;

        if (typeof target === 'boolean') {
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
        // ie 下直接调用 toString 报错
        return Object.prototype.toString.call(obj) === type;
    }

    function isFunction(obj) {
        return typeChecking(obj, '[object Function]');
    }

    function isPlainObject(obj) {
        return typeChecking(obj, '[object Object]');
    }

    /**
     * 检测对象是否是一个DOM元素
     * @param arg {*}
     * @returns {boolean}
     */
    function isElem(arg) {
        // document(nodeType===9)不能是element，因为它没有很多element该有的属性
        // 如用getComputedStyle获取不到它的宽高，就会报错
        // 当传入0的时候，不加!!会返回0，而不是Boolean值
        return !!(arg && arg.nodeType === 1);
    }

    /**
     * 获取对象的css属性值
     * @param elem {element}
     * @param attr {string}
     * @returns {*|string|number}
     */
    var regGetCss = /^\d+(\.\d+)?[a-z]+$/i;

    function getCss(elem, attr) {
        var val = win.getComputedStyle(elem)[attr];

        // 对于属性值是200px这样的形式，返回200这样的数字值
        return regGetCss.test(val) ? pInt(val) : val;
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
     * 插件公共属性继承
     * @param context {this} 实例对象的上下文环境
     * @param constructor {function} 插件构造函数
     * @param selector {string|element} 装裹canvas画布的容器选择器
     * @param options {object} 用户配置选项
     * @returns {boolean} 供插件判断是否创建成功，成功继续执行相应代码，不成功则静默失败
     */
    function createCanvas(context, constructor, selector, options) {
        if (canvasSupport &&
            (context.container = isElem(selector) ? selector : doc.querySelector(selector))) {

            context.set = extend(true, {}, Particleground.commonConfig, constructor.defaultConfig, options);
            context.c = doc.createElement('canvas');
            context.cxt = context.c.getContext('2d');
            context.paused = false;

            setCanvasWH(context);

            context.container.innerHTML = '';
            context.container.appendChild(context.c);
            context.color = setColor(context.set.color);
            context.init();
        }
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
     * 设置color函数
     * @param color {string|array} 颜色数组
     * @returns {function}
     */
    function setColor(color) {
        var colorLength = isArray(color) ? color.length : false;
        var recolor = function () {
            return color[floor(random() * colorLength)];
        };
        return typeof color !== 'string' ? colorLength ? recolor : randomColor :
            function () {
                return color;
            };
    }

    // 暂停粒子运动
    function pause(context, callback) {
        // 没有set表示实例创建失败，防止错误调用报错
        if (context.set && !context.paused) {
            // 传递关键字供特殊使用
            isFunction(callback) && callback.call(context, 'pause');
            context.paused = true;
        }
    }

    // 开启粒子运动
    function open(context, callback) {
        if (context.set && context.paused) {
            isFunction(callback) && callback.call(context, 'open');
            context.paused = false;
            context.draw();
        }
    }

    // 自适应窗口，重新计算粒子坐标
    function resize(context, callback) {
        if (context.set.resize) {
            // 不采用函数节流，会出现延迟——很不爽的效果
            on(win, 'resize', function () {
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

                isFunction(callback) && callback.call(context, scaleX, scaleY);

                context.paused && context.draw();
            });
        }
    }

    /**
     * 修改原型在 Particleground.inherit 上的方法
     * 使用：util.modifyPrototype( fn, 'pause', function(){})
     * @param prototype {Object} 原型对象
     * @param names {string} 方法名，多个方法名用逗号隔开
     * @param callback {function} 回调函数
     */
    function modifyPrototype(prototype, names, callback) {
        // 将方法名转成数组格式，如：'pause, open'
        if (canvasSupport) {
            trimAll(names).split(',').forEach(function (name) {
                prototype[name] = function () {
                    util[name](this, callback);
                };
            });
        }
    }

    // requestAnimationFrame兼容处理
    win.requestAnimationFrame = (function (win) {
        return win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            function (fn) {
                win.setTimeout(fn, 1000 / 60);
            };
    })(win);

    // 工具箱
    var util = {
        pInt: pInt,
        trimAll: trimAll,
        randomColor: randomColor,
        limitRandom: limitRandom,
        extend: extend,
        typeChecking: typeChecking,
        isFunction: isFunction,
        isPlainObject: isPlainObject,
        isElem: isElem,
        getCss: getCss,
        offset: offset,
        createCanvas: createCanvas,
        scaleValue: scaleValue,
        calcSpeed: calcSpeed,
        setColor: setColor,
        pause: pause,
        open: open,
        resize: resize,
        modifyPrototype: modifyPrototype
    };

    var Particleground = {
        version: '1.1.0',
        canvasSupport: canvasSupport,
        commonConfig: {
            // 画布全局透明度
            opacity: 1,
            // 粒子颜色，空数组表示随机取色，或赋值特定颜色的数组，如：['red', 'blue', 'green']
            color: [],
            // 默认true: 自适应窗口尺寸变化
            resize: true
        },
        util: util,
        inherit: {
            requestAnimationFrame: function () {
                !this.paused && win.requestAnimationFrame(this.draw.bind(this));
            },
            pause: function () {
                pause(this);
            },
            open: function () {
                open(this);
            },
            resize: function () {
                resize(this);
            }
        },
        event: {
            on: on,
            off: off
        },
        extend: function (prototype) {
            return extend(prototype, this.inherit), this;
        }
    };

    win.Particleground = Particleground;

    // AMD 加载方式放在头部，factory函数会比后面的插件延迟执行
    // 会导致后面的插件找不到Particleground对象而报错
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Particleground;
        });
    }

    return Particleground;
}));