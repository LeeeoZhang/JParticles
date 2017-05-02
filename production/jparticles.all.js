/**
 * JParticles v3.0.0 (https://github.com/Barrior/JParticles)
 * Copyright 2016-present Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/MIT)
 */
+function(){"use strict";function e(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function n(e){return parseInt(e,10)}function t(e){return e.replace(P.trimAll,"")}function r(){return"#"+j().toString(16).slice(-6)}function i(e,n){return e===n?e:j()*(e-n)+n}function o(){var e=arguments,n=e[0]||{},t=!1,r=e.length,i=1,u=void 0,a=void 0;for(l(n)&&(t=n,n=e[1]||{},i++);i<r;i++)for(a in e[i])u=e[i][a],t&&(s(u)||q(u))?n[a]=o(t,q(u)?[]:{},u):n[a]=u;return n}function u(e,n){return Object.prototype.toString.call(e)===n}function a(e){return u(e,"[object Function]")}function s(e){return u(e,"[object Object]")}function c(e){return!(!e||1!==e.nodeType)}function f(e){return"string"==typeof e}function l(e){return"boolean"==typeof e}function d(e,t){var r=O.getComputedStyle(e)[t];return P.styleValue.test(r)?n(r):r}function v(e){for(var n=e.offsetLeft||0,t=e.offsetTop||0;e=e.offsetParent;)n+=e.offsetLeft,t+=e.offsetTop;return{left:n,top:t}}function h(e,n,t){e.addEventListener(n,t)}function m(e,n,t){e.removeEventListener(n,t)}function p(e){e.cw=e.c.width=d(e.container,"width")||x,e.ch=e.c.height=d(e.container,"height")||M}function y(e,n){return e>0&&e<1?n*e:e}function g(e,n){return(i(e,n)||e)*(j()>.5?1:-1)}function b(e){for(var n=arguments.length,t=Array(n>1?n-1:0),r=1;r<n;r++)t[r-1]=arguments[r];for(var i=0;i<t.length;i++)a(t[i])&&e.push(t[i])}function w(e){var n=!!q(e)&&e.length,t=function(){return e[F(j()*n)]};return f(e)?function(){return e}:n?t:r}function A(e,n){e.canvasRemoved||!e.set||e.paused||(a(n)&&n.call(e,"pause"),e.paused=!0)}function z(e,n){!e.canvasRemoved&&e.set&&e.paused&&(a(n)&&n.call(e,"open"),e.paused=!1,e.draw())}function R(e,n){e.set.resize&&(e._resizeHandler=function(){var t=e.cw,r=e.ch;p(e);var i=e.cw/t,o=e.ch/r;q(e.dots)&&e.dots.forEach(function(e){s(e)&&(e.x*=i,e.y*=o)}),a(n)&&n.call(e,i,o),e.paused&&e.draw()},h(O,"resize",e._resizeHandler))}function C(e,n,r){t(n).split(",").forEach(function(n){e[n]=function(){H[n](this,r)}})}function E(e,n){var t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:D;Object.defineProperty(t,n,{value:e,writable:!1,enumerable:!0,configurable:!1})}var L=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),O=window,k=document,j=Math.random,F=Math.floor,q=Array.isArray,x=485,M=300,P={trimAll:/\s/g,styleValue:/^\d+(\.\d+)?[a-z]+$/i},S=function(){function n(t,r,i){e(this,n),(this.container=c(r)?r:k.querySelector(r))&&(this.set=o(!0,{},D.commonConfig,t.defaultConfig,i),this.c=k.createElement("canvas"),this.cxt=this.c.getContext("2d"),this.paused=!1,p(this),this.container.innerHTML="",this.container.appendChild(this.c),this.color=w(this.set.color),this.observeCanvasRemoved(),this.init(),this.resize())}return L(n,[{key:"requestAnimationFrame",value:function(){this.canvasRemoved||this.paused||O.requestAnimationFrame(this.draw.bind(this))}},{key:"observeCanvasRemoved",value:function(){var e=this;this.destructionListeners=[],T(this.c,function(){e.canvasRemoved=!0,e._resizeHandler&&m(O,"resize",e._resizeHandler),e.destructionListeners.forEach(function(e){e()})})}},{key:"onDestroy",value:function(){return b.apply(void 0,[this.destructionListeners].concat(Array.prototype.slice.call(arguments))),this}},{key:"pause",value:function(){A(this)}},{key:"open",value:function(){z(this)}},{key:"resize",value:function(){R(this)}}]),n}();O.requestAnimationFrame=function(e){return e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||function(n){e.setTimeout(n,1e3/60)}}(O);var T=function(){var e=O.MutationObserver||O.WebKitMutationObserver,n=function e(n,t){if(n===t)return!0;if(c(n))for(var r=n.children,i=r.length;i--;)if(e(r[i],t))return!0;return!1},t=function(t,r){new e(function(e,i){for(var o=e.length;o--;)for(var u=e[o].removedNodes,a=u.length;a--;)if(n(u[a],t))return i.disconnect(),r()}).observe(document,{childList:!0,subtree:!0})},r=function(e,t){var r=function r(i){n(i.target,e)&&(document.removeEventListener("DOMNodeRemoved",r),t())};document.addEventListener("DOMNodeRemoved",r)};return e?t:r}(),H={regExp:P,pInt:n,trimAll:t,randomColor:r,limitRandom:i,extend:o,typeChecking:u,isPlainObject:s,isFunction:a,isArray:q,isString:f,isBoolean:l,isElement:c,observeElementRemoved:T,getCss:d,offset:v,on:h,off:m,scaleValue:y,calcSpeed:g,pause:A,open:z,resize:R,modifyPrototype:C,defineReadOnlyProperty:E,registerListener:b},I={opacity:1,color:[],resize:!0},_={linear:function(e,n,t,r,i){return t+(r-t)*e},swing:function(){return _.easeInOutQuad.apply(_,arguments)},easeInOutQuad:function(e,n,t,r,i){return(n/=i/2)<1?r/2*n*n+t:-r/2*(--n*(n-2)-1)+t}},D={version:"3.0.0",utils:H,Base:S};!function e(n){for(var t in n){var r=n[t];E(r,t,n),s(r)&&e(r)}}(D),E(I,"commonConfig"),E(_,"easing"),O.JParticles=D,"function"==typeof define&&define.amd?define(function(){return D}):"object"==typeof module&&module.exports&&(module.exports=D)}();
+function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),o=JParticles,i=o.utils,a=o.Base,u=(Math.random,Math.abs,Math.PI,Math.sin,Math.ceil,i.pInt,i.limitRandom,i.calcSpeed,i.scaleValue,i.randomColor,i.isArray,i.isFunction,i.isPlainObject,i.resize,i.defineReadOnlyProperty),c=function(o){function i(n,r){return e(this,i),t(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,i,n,r))}return n(i,o),r(i,[{key:"version",get:function(){return"3.0.0"}}]),r(i,[{key:"init",value:function(){}},{key:"createDots",value:function(){}},{key:"draw",value:function(){this.requestAnimationFrame()}}]),i}(a);c.defaultConfig={},u(c,"lowpoly")}();
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

                var vx = null;
                if (realNumber == 0) {
                    vx = 1;
                }

                dots.push({
                    r: r,
                    x: limitRandom(cw - r, r),
                    y: limitRandom(ch - r, r),
                    vx: vx || calcSpeed(maxSpeed, minSpeed),
                    vy: calcSpeed(maxSpeed, minSpeed),
                    color: vx ? '#000' : color(),

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

                    if (x + r >= cw || x - r <= 0) {
                        dot.vx *= -1;
                    }

                    /*if (x + r >= cw) {
                        dot.vx = -abs(dot.vx);
                    } else if (x - r <= 0) {
                        dot.vx = abs(dot.vx);
                    }*/

                    if (y + r >= ch || y - r <= 0) {
                        dot.vy *= -1;
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
defineReadOnlyProperty(Particle, 'particle'); }();
//# sourceMappingURL=maps/particle.js.map

+function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=JParticles,i=r.utils,a=r.Base,s=Math.random,c=Math.abs,u=Math.PI,l=2*u,f=i.pInt,h=i.limitRandom,p=i.calcSpeed,y=i.defineReadOnlyProperty,v=function(r){function i(n,o){return e(this,i),t(this,(i.__proto__||Object.getPrototypeOf(i)).call(this,i,n,o))}return n(i,r),o(i,[{key:"version",get:function(){return"3.0.0"}}]),o(i,[{key:"init",value:function(){this.dots=[],this.createDots(),this.draw()}},{key:"snowShape",value:function(){var e=this.set,t=e.maxR,n=e.minR,o=e.maxSpeed,r=e.minSpeed,i=h(t,n);return{r:i,x:s()*this.cw,y:-i,vx:p(o,r),vy:c(i*p(o,r)),color:this.color()}}},{key:"createDots",value:function(){for(var e=f(6*s());e--;)this.dots.push(this.snowShape())}},{key:"draw",value:function(){var e=this,t=this.cxt,n=this.cw,o=this.ch,r=this.paused,i=this.set.opacity;t.clearRect(0,0,n,o),t.globalAlpha=i,this.dots.forEach(function(i,a,c){var u=i.x,f=i.y,h=i.r;t.save(),t.beginPath(),t.arc(u,f,h,0,l),t.fillStyle=i.color,t.fill(),t.restore(),r||(i.x+=i.vx,i.y+=i.vy,s()>.99&&s()>.5&&(i.vx*=-1),u<0||u-h>n?c.splice(a,1,e.snowShape()):f-h>o&&c.splice(a,1))}),!r&&s()>.9&&this.createDots(),this.requestAnimationFrame()}}]),i}(a);v.defaultConfig={color:"#fff",maxR:6.5,minR:.4,maxSpeed:.6,minSpeed:0},y(v,"snow")}();
+function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=function(){function e(e,t){for(var i=0;i<t.length;i++){var o=t[i];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,i,o){return i&&e(t.prototype,i),o&&e(t,o),t}}(),r=JParticles,s=r.utils,a=r.Base,l=Math.random,f=(Math.abs,Math.PI),c=Math.sin,u=2*f,h=(s.pInt,s.limitRandom),p=(s.calcSpeed,s.scaleValue),y=s.randomColor,d=s.isArray,m=s.isPlainObject,b=s.defineReadOnlyProperty,v=function(r){function a(i,o){return e(this,a),t(this,(a.__proto__||Object.getPrototypeOf(a)).call(this,a,i,o))}return i(a,r),n(a,[{key:"version",get:function(){return"3.0.0"}}]),n(a,[{key:"init",value:function(){this.set.num>0&&(this.rippleLength=[],this.attrNormalize(),this.createDots(),this.draw())}},{key:"attrNormalize",value:function(){var e=this;["fill","fillColor","line","lineColor","lineWidth","offsetLeft","offsetTop","crestHeight","rippleNum","speed"].forEach(function(t){return e.attrProcessor(t)})}},{key:"attrProcessor",value:function(e){var t=this.set.num,i=this.set[e],n=i,r="offsetLeft"===e?this.cw:this.ch;for(d(i)||(n=this.set[e]=[]);t--;){var s=d(i)?i[t]:i;n[t]="undefined"===(void 0===s?"undefined":o(s))?this.generateDefaultValue(e):this.scaleValue(e,s,r),"rippleNum"===e&&(this.rippleLength[t]=this.cw/n[t])}}},{key:"generateDefaultValue",value:function(e){var t=this.cw,i=this.ch;switch(e){case"lineColor":case"fillColor":e=y();break;case"lineWidth":e=h(2,.2);break;case"offsetLeft":e=l()*t;break;case"offsetTop":case"crestHeight":e=l()*i;break;case"rippleNum":e=h(t/2,1);break;case"speed":e=h(.4,.1);break;case"fill":e=!1;break;case"line":e=!0}return e}},{key:"scaleValue",value:function(e,t,i){return"offsetTop"===e||"offsetLeft"===e||"crestHeight"===e?p(t,i):t}},{key:"dynamicProcessor",value:function(e,t){var i=this,n="offsetLeft"===e?this.cw:this.ch,r=d(t);this.set[e].forEach(function(s,a,l){var f=r?t[a]:t;f=i.scaleValue(e,f,n),"undefined"===(void 0===f?"undefined":o(f))&&(f=s),l[a]=f})}},{key:"setOptions",value:function(e){if(this.set.num>0&&m(e))for(var t in e)"opacity"===t&&e[t]?this.set.opacity=e[t]:-1!==this.dynamicOptions.indexOf(t)&&this.dynamicProcessor(t,e[t])}},{key:"createDots",value:function(){for(var e=this.cw,t=this.rippleLength,i=this.set.num,o=this.dots=[];i--;)for(var n=o[i]=[],r=u/t[i],s=0;s<=e;s++)n.push({x:s,y:s*r})}},{key:"draw",value:function(){var e=this.cxt,t=this.cw,i=this.ch,o=this.paused,n=this.set,r=n.num,s=n.opacity;r<=0||(e.clearRect(0,0,t,i),e.globalAlpha=s,this.dots.forEach(function(r,s){var a=n.crestHeight[s],l=n.offsetLeft[s],f=n.offsetTop[s],u=n.speed[s];e.save(),e.beginPath(),r.forEach(function(t,i){e[i?"lineTo":"moveTo"](t.x,a*c(t.y+l)+f),!o&&(t.y-=u)}),n.fill[s]&&(e.lineTo(t,i),e.lineTo(0,i),e.closePath(),e.fillStyle=n.fillColor[s],e.fill()),n.line[s]&&(e.lineWidth=n.lineWidth[s],e.strokeStyle=n.lineColor[s],e.stroke()),e.restore()}),this.requestAnimationFrame())}},{key:"resize",value:function(){var e=this;s.resize(this,function(t,i){e.set.num>0&&e.dots.forEach(function(e){e.forEach(function(e){e.x*=t,e.y*=i})})})}}]),a}(a);v.defaultConfig={num:3,fill:!1,fillColor:[],line:!0,lineColor:[],lineWidth:[],offsetLeft:[],offsetTop:[],crestHeight:[],rippleNum:[],speed:[]},v.prototype.dynamicOptions=["fill","fillColor","line","lineColor","lineWidth","offsetLeft","offsetTop","crestHeight","speed"],b(v,"wave")}();
+function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function i(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},o=function(){function t(t,e){for(var i=0;i<e.length;i++){var s=e[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(t,s.key,s)}}return function(e,i,s){return i&&t(e.prototype,i),s&&t(e,s),e}}(),r=JParticles,n=r.utils,a=r.Base,l=(Math.random,Math.abs,Math.PI),f=Math.sin,h=Math.ceil,c=2*l,u=(n.pInt,n.limitRandom,n.calcSpeed,n.scaleValue),p=(n.randomColor,n.isArray,n.isFunction,n.isPlainObject),y=n.resize,m=n.defineReadOnlyProperty,d=n.registerListener,v=function(r){function n(i,s){return t(this,n),e(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,n,i,s))}return i(n,r),o(n,[{key:"version",get:function(){return"3.0.0"}}]),o(n,[{key:"init",value:function(){this.c.style.borderRadius="50%",this.progress=0,this.set.offsetTop=this.ch,this.halfCH=this.ch/2,this.progressListeners=[],this.finishedListeners=[],this.attrNormalize(),this.createDots(),this.draw()}},{key:"attrNormalize",value:function(){var t=this;["offsetLeft","crestHeight"].forEach(function(e){t.set[e]=u(t.set[e],"offsetLeft"===e?t.cw:t.ch)})}},{key:"createDots",value:function(){for(var t=this.cw,e=this.dots=[],i=t/this.set.rippleNum,s=c/i,o=0;o<=t;o++)e.push({x:o,y:o*s})}},{key:"draw",value:function(){this.calcOffsetTop(),this.drawWave(),this.drawText(),this.calcProgress(),this.progress<=100?this.requestAnimationFrame():(this.progress=100,this.calcOffsetTop(),this.drawWave(),this.drawText(),this.finishedListeners.forEach(function(t){return t()}))}},{key:"drawWave",value:function(){var t=this.cxt,e=this.cw,i=this.ch,s=this.set,o=s.opacity,r=s.crestHeight,n=s.offsetLeft,a=s.offsetTop,l=s.fillColor,h=s.speed;t.clearRect(0,0,e,i),t.globalAlpha=o,t.save(),t.beginPath(),this.dots.forEach(function(e,i){t[i?"lineTo":"moveTo"](e.x,r*f(e.y+n)+a),e.y-=h}),t.lineTo(e,i),t.lineTo(0,i),t.closePath(),t.fillStyle=l,t.fill(),t.restore()}},{key:"drawText",value:function(){var t=this,e=this.cxt,i=this.cw,o=this.halfCH,r=this.progress,n=this.set,a=n.font,l=n.smallFont,f=n.color,c=n.smallFontOffsetTop,u="%",y=h(r);this.progressListeners.forEach(function(e){var i=e(t.progress);"undefined"!==(void 0===i?"undefined":s(i))&&(p(i)?(y=i.text,u=i.smallText||""):(y=i,u=""))}),e.font=a;var m=e.measureText(y).width;e.font=l;var d=e.measureText(u).width,v=(i-m-d)/2;e.textBaseline="middle",e.fillStyle=f,e.font=a,e.fillText(y,v,o),e.font=l,e.fillText(u,v+m,o+c)}},{key:"calcProgress",value:function(){if(this.immediatelyComplete)return this.progress+=this.immediatelyComplete,void(this.immediatelyComplete+=.5);if(!(this.progress>=99)){var t=this.set,e=t.easing,i=t.duration;this.startTime||(this.startTime=Date.now());var s=Date.now()-this.startTime,o=s/i;o<=1&&(this.progress=JParticles.easing[e](o,s,0,100,i),this.progress>=99&&(this.progress=99))}}},{key:"calcOffsetTop",value:function(){(this.immediatelyComplete||99!==this.progress)&&(100===this.progress?this.set.offsetTop=-this.set.crestHeight:this.set.offsetTop=h((100-this.progress)/100*this.ch+this.set.crestHeight))}},{key:"resize",value:function(){var t=this;y(this,function(){t.halfCH=t.ch/2})}},{key:"setOptions",value:function(t){if(p(t))for(var e in t)"offsetTop"!==e&&e in this.set&&(this.set[e]=t[e])}},{key:"done",value:function(){this.immediatelyComplete||(this.immediatelyComplete=1)}},{key:"onProgress",value:function(){return d.apply(void 0,[this.progressListeners].concat(Array.prototype.slice.call(arguments))),this}},{key:"onFinished",value:function(){return d.apply(void 0,[this.finishedListeners].concat(Array.prototype.slice.call(arguments))),this}}]),n}(a);v.defaultConfig={font:"normal 900 20px Arial",smallFont:"normal 900 14px Arial",smallFontOffsetTop:1,color:"#333",fillColor:"#27C9E5",offsetLeft:0,crestHeight:4,rippleNum:1,speed:.3,duration:5e3,easing:"swing"},delete v.prototype.pause,delete v.prototype.open,m(v,"waveLoading")}();