/**
 * 规定：
 * configDefault：默认配置项，需挂载到构造函数对象上
 *
 * 原型对象的属性
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
 * 原型对象的方法
 *  init: 初始化配置或方法调用
 *  draw: 绘图函数
 */
/**
 * 注释说明：{object}里的object只表示json格式的对象，其他相应格式对象用function，null，array...
 */
(function ( factory ){
    if ( typeof module === 'object' && module.exports ) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser
        factory();
    }
}(function (){
	'use strict';
	var win = window;
    var doc = document;
	var	random = Math.random;
    var floor = Math.floor;
    var isArray = Array.isArray;
    var canvasSupport = !!doc.createElement('canvas').getContext;

	function pInt( str ){
		return parseInt( str, 10 );
	}

	function randomColor(){
		// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
		return '#' + random().toString( 16 ).slice( -6 );
	}

    /**
     * 限制随机数的范围
     * @param max {number}
     * @param min {number}
     * @returns {number}
     */
	function limitRandom( max, min ){
		return random() * ( max - min ) + min;
	}

    /**
     * 对象的复制，跟jQuery extend方法一致
     * extend( target [, object1 ] [, objectN ] )
     * extend( [ deep ,] target, object1 [, objectN ] )
     * @returns {object}
     */
    function extend(){
        // 站在jQuery的肩膀之上
        var arg = arguments,
            target = arg[ 0 ] || {},
            deep = false,
            length = arg.length,
            i = 1,
            value, attr;

        if( typeof target === 'boolean' ){
            deep = target;
            target = arg[ 1 ] || {};
            i++;
        }

        for( ; i < length; i++ ){
            for( attr in arg[ i ] ){

                value = arg[ i ][ attr ];

                if( deep && ( isPlainObject( value ) || isArray( value ) ) ){

                    target[ attr ] =
                        extend( deep, isArray( value ) ? [] : {}, value );

                }else{
                    target[ attr ] = value;
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
    function typeChecking( obj, type ){
        return toString.call( obj ) === type;
    }

    function isFunction( obj ){
        return typeChecking( obj, '[object Function]' );
    }

    function isPlainObject( obj ){
        return typeChecking( obj, '[object Object]' );
    }

    /**
     * 检测对象是否是一个DOM元素
     * @param arg {*}
     * @returns {boolean}
     */
    function isElem( arg ){
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
    var getCssReg = /^\d+(\.\d+)?[a-z]+$/i;
    function getCss( elem, attr ){
        var val = win.getComputedStyle( elem )[ attr ];

        // 对于属性值是200px这样的形式，返回200这样的数字值
        return getCssReg.test( val ) ? pInt( val ) : val;
    }

    /**
     * 获取对象距离页面的top、left值
     * @param elem {element}
     * @returns {{left: (number), top: (number)}}
     */
    function offset( elem ){
        var left = elem.offsetLeft || 0;
        var top  = elem.offsetTop || 0;
        while ( elem = elem.offsetParent ){
            left += elem.offsetLeft;
            top += elem.offsetTop;
        }
        return {
            left: left,
            top: top
        };
    }

    function on( elem, evtName, handler ){
        elem.addEventListener( evtName, handler );
    }

    function off( elem, evtName, handler ){
        elem.removeEventListener( evtName, handler );
    }

    /**
     * 插件公共属性继承
     * @param context {this} 实例对象的上下文环境
     * @param constructor {function} 插件构造函数
     * @param selector {string|element} 装裹canvas画布的容器选择器
     * @param options {object} 用户配置选项
     * @returns {boolean} 供插件判断是否创建成功，成功继续执行相应代码，不成功则静默失败
     */
    var commonConfig = {
        // 全局透明度
        opacity: 1,
        // 默认true: 自适应窗口尺寸变化
        resize: true
    };
	function createCanvas( context, constructor, selector, options ){
        if( canvasSupport &&
            (context.container = isElem( selector ) ? selector : doc.querySelector( selector )) ){

            context.set = extend( {}, commonConfig, constructor.defaultConfig, options );
            context.c = doc.createElement( 'canvas' );
            context.cw = context.c.width = getCss( context.container, 'width' );
            context.ch = context.c.height = getCss( context.container, 'height' );
            context.cxt = context.c.getContext( '2d' );
            context.paused = false;

            context.container.innerHTML = '';
            context.container.appendChild( context.c );
            context.init();
        }
    }

    /**
     * 计算刻度值
     * @param val {number} 乘数，(0, 1)表示被乘数的倍数，0 & [1, +∞)表示具体数值
     * @param scale {number} 被乘数
     * @returns {number}
     */
    function scaleValue( val, scale ){
        return val > 0 && val < 1 ? scale * val : val;
    }

    function createColor( setColor ){
        var colorLength = isArray( setColor ) ? setColor.length : false;
        var color = function(){
            return setColor[ floor( random() * colorLength ) ];
        };
        return colorLength ? color : randomColor;
    }

	function pause( context, callback ){
        // 没有set表示实例创建失败，防止错误调用报错
		if( context.set && !context.paused ){
            isFunction( callback ) && callback.call( context );
            context.paused = true;
        }
	}

	function open( context, callback ){
		if( context.set && context.paused ){
            isFunction( callback ) && callback.call( context );
			context.paused = false;
			context.draw();
		}
	}

    function resize( context, callback ){
        if( context.set && context.set.resize ){
            // 不采用函数节流，会出现延迟的很不爽的效果
            on( win, 'resize', function(){
                var oldCW = context.cw;
                var oldCH = context.ch;

                context.cw = context.c.width = getCss( context.container, 'width' );
                context.ch = context.c.height = getCss( context.container, 'height' );

                var scaleX = context.cw / oldCW;
                var scaleY = context.ch / oldCH;

                context.dots.forEach(function( v ){
                    v.x *= scaleX;
                    v.y *= scaleY;
                });

                isFunction( callback ) && callback.call( context, scaleX, scaleY );

                context.paused && context.draw();
            });
        }
    }

    // requestAnimationFrame兼容处理
	win.requestAnimationFrame = (function( win ) {
		return	win.requestAnimationFrame ||
				win.webkitRequestAnimationFrame ||
				win.mozRequestAnimationFrame ||
				function( fn ) {
		        	win.setTimeout( fn, 1000 / 60 );
		        };
	})( win );

    var Particleground = {
        version: '1.0.0',
        canvasSupport: canvasSupport,
        util: {
            pInt: pInt,
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
            createColor: createColor,
            pause: pause,
            open: open,
            resize: resize
        },
        inherit: {
            color: function(){
                this.color = createColor( this.set.color );
                return this.color();
            },
            requestAnimationFrame: function(){
                !this.paused && win.requestAnimationFrame( this.draw.bind( this ) );
            },
            pause: function(){
                pause( this );
            },
            open: function(){
                open( this );
            },
            resize: function(){
                resize( this );
            }
        },
        event: {
            on: on,
            off: off
        },
        extend: function( prototype ){
            extend( prototype, this.inherit );
            //obj.color();
        }
    };

    // AMD. Register as an anonymous module.
    // AMD 加载方式放在头部，factory函数会比后面的插件延迟执行
    // 导致后面的插件找不到Particleground对象，报错
    if ( typeof define === 'function' && define.amd ) {
        define( function() {
            return Particleground;
        } );
    }

    win.Particleground = Particleground;
	return Particleground;
}));
// particle.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        event = Particleground.event,
        random = Math.random,
        abs = Math.abs,
        pi2 = Math.PI * 2;

    function eventHandler( context, eventType ){
        event[ eventType ]( context.set.eventElem, 'mousemove', context.moveHandler );
        event[ eventType ]( context.set.eventElem, 'touchmove', context.moveHandler );
    }

    function Particle( selector, options ){
        util.createCanvas( this, Particle, selector, options );
    }

    Particle.defaultConfig = {
        // 粒子颜色，null随机色，或随机给定数组的颜色
        color: null,
        // 粒子运动速度
        speed: 1,
        // 粒子个数，默认为容器宽度的0.12倍
        // 传入(0, 1)显示容器宽度相应倍数的个数，传入[1, +∞)显示具体个数
        num: .12,
        // 粒子最大半径
        max: 2.4,
        // 粒子最小半径
        min: .6,
        // 两点连接线段的最大值
        // 在range范围内的两点距离小于dis，则两点之间连接一条线段
        dis: 130,
        // 线段的宽度
        lineWidth: .2,
        // 定位点的范围，范围越大连接的点越多，当range等于0时，不连接线段，相关值无效
        range: 160,
        // 改变定位点坐标的事件元素，null表示canvas画布，或传入原生元素对象，如document等
        eventElem: null
    };

    var fn = Particle.prototype = {
        version: '1.0.0',
        init: function(){
            if( this.set.num > 0 ){
                if( this.set.range > 0 ){

                    // 设置移动事件元素
                    if( !util.isElem( this.set.eventElem ) && this.set.eventElem !== document ){
                        this.set.eventElem = this.c;
                    }

                    // 定位点坐标
                    this.posX = random() * this.cw;
                    this.posY = random() * this.ch;
                    this.event();
                }
                this.createDot();
                this.draw();
                this.resize();
            }
        },
        createDot: function(){
            var cw = this.cw,
                ch = this.ch,
                set = this.set,
                limitRandom = util.limitRandom,
                speed = set.speed,
                max = set.max,
                min = set.min,
                num = util.pInt( util.scaleValue( set.num, cw ) ),
                dots = [], r;

            while ( num-- ){
                r = limitRandom( max, min );
                dots.push({
                    x: limitRandom( cw - r, r ),
                    y: limitRandom( ch - r, r ),
                    r: r,
                    vx: limitRandom( speed, -speed * .5 ) || speed,
                    vy: limitRandom( speed, -speed * .5 ) || speed,
                    // 涉及到指向，加对象调用
                    color: this.color()
                });
            }

            this.dots = dots;
        },
        draw: function(){
            var set = this.set;
            var cw = this.cw;
            var ch = this.ch;
            var cxt = this.cxt;
            var paused = this.paused;

            cxt.clearRect( 0, 0, cw, ch );

            // 当canvas宽高改变的时候，全局属性需要重新设置
            cxt.lineWidth = set.lineWidth;
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( v ){
                var r = v.r;
                cxt.save();
                cxt.beginPath();
                cxt.arc( v.x, v.y, r, 0, pi2 );
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                // 暂停的时候，vx和vy保持不变，这样自适应窗口变化的时候不会出现粒子移动的状态
                if( !paused ){
                    v.x += v.vx;
                    v.y += v.vy;

                    var	x = v.x;
                    var y = v.y;

                    if( x + r >= cw || x - r <= 0 ){
                        v.vx *= -1;
                    }
                    if( y + r >= ch || y - r <= 0 ){
                        v.vy *= -1;
                    }
                }
            });

            // 当连接范围小于0时，不连接线段，可以做出球体运动效果
            if( set.range > 0 ){
                this.connectDot();
            }

            this.requestAnimationFrame();
        },
        connectDot:function(){
            var cxt = this.cxt,
                set = this.set,
                dis = set.dis,
                posX = this.posX,
                posY = this.posY,
                posR = set.range,
                dots = this.dots;

            dots.forEach(function ( v ) {
                var vx = v.x;
                var vy = v.y;
                if( abs( vx - posX ) <= posR &&
                    abs( vy - posY ) <= posR ){
                    dots.forEach(function ( sib ) {
                        var sx = sib.x,
                            sy = sib.y;
                        if( abs( vx - sx ) <= dis &&
                            abs( vy - sy ) <= dis ){
                            cxt.save();
                            cxt.beginPath();
                            cxt.moveTo( vx, vy );
                            cxt.lineTo( sx, sy );
                            cxt.strokeStyle = v.color;
                            cxt.stroke();
                            cxt.restore();
                        }
                    });
                }
            });
        },
        event: function() {
            if( this.set.eventElem !== document ){
                this.elemOffset = util.offset( this.set.eventElem );
            }
            this.moveHandler = function ( e ) {
                if( !this.paused ){
                    this.posX = e.pageX;
                    this.posY = e.pageY;
                    if( this.elemOffset ){
                        if( util.getCss( this.set.eventElem, 'position' ) === 'fixed' ){
                            this.posX = e.clientX;
                            this.posX = e.clientY;
                        }else{
                            this.posX -= this.elemOffset.left;
                            this.posY -= this.elemOffset.top;
                        }
                    }
                }
            }.bind( this );

            //添加move事件
            eventHandler( this, 'on' );
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( fn );

    var rewrite = {
        pause: function(){
            eventHandler( this, 'off' );
        },
        open: function(){
            eventHandler( this, 'on' );
        },
        resize: function(){
            this.posX *= scaleX;
            this.posY *= scaleY;
            this.elemOffset = this.elemOffset ? util.offset( this.set.eventElem ) : null;
        }
    };

    for( var key in rewrite ){
        fn[ key ] = function(){
            var self = this;
            return function(){
                util[ key ]( self, function(){
                    if( this.set.range > 0 ){
                        rewrite[ key ].call( this );
                    }
                });
            };
        };
    }

    console.log( fn );

    /**
     * 原型方法 pause，open，resize 的重写优化
     * 原型方法 color 可否优化，不然每次都得带上 this 指向，不能单纯的使用，预先初始化一次或许可以搞定
     * connectDot 连接线嵌套循环算法优化
     */
    /*fn.pause = function () {
        util.pause( this, function(){
            //if( this.set.range > 0 ){
                eventHandler( this, 'off' );
            //}
        });
    };

    fn.open = function () {
        util.open( this, function(){
            //if( this.set.range > 0 ){
                eventHandler( this, 'on' );
            //}
        });
    };

    fn.resize = function () {
        util.resize( this, function( scaleX, scaleY ){
            if( this.set.range > 0 ){
                this.posX *= scaleX;
                this.posY *= scaleY;
                this.elemOffset = this.elemOffset ? util.offset( this.set.eventElem ) : '';
            }
        });
    };*/

    // 添加实例
    Particleground.particle = fn.constructor = Particle;

}( window, Particleground );


// snow.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        pi2 = Math.PI * 2;

    function Snow( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Snow.configDefault, options );

        this.dots = [];
        this.createDot();
        this.draw();
        this.resize();
    }

    Snow.defaultConfig = {
        //全局透明度
        opacity: 1,
        //雪花颜色
        color: ['#fff'],
        //雪花最大半径
        max: 6.5,
        //雪花最小半径
        min: .4,
        //运动速度
        speed: .4,
        //自适应窗口尺寸变化
        resize: true
    };

    Snow.prototype = {
        version: '1.0.0',
        snowShape: function(){
            var self = this,
                cw = self.cw,
                set = self.set,
                speed = set.speed,
                r = util.limitRandom( set.max, set.min );
            return {
                x: random() * cw,
                y: -r,
                r: r,
                vx: random() || .4,
                vy: r * speed,
                color: self.color()
            };
        },
        createDot: function(){
            //随机创建0-6个雪花
            var count = random() * 6;
            var dots = this.dots;
            for( var i = 0; i < count; i++ ){
                dots.push( this.snowShape() );
            }
        },
        draw: function(){
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch,
                dots = self.dots;

            cxt.clearRect( 0, 0, cw, ch );

            //当canvas宽高改变的时候，全局属性需要重新设置
            cxt.globalAlpha = set.opacity;

            dots.forEach(function( v, i ){
                var vx = v.x;
                var vy = v.y;
                var vr = v.r;

                cxt.save();
                cxt.beginPath();
                cxt.arc( vx, vy, vr, 0, pi2 );
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                v.x += v.vx;
                v.y += v.vy;

                //雪花反方向
                if( random() > .99 && random() > .5 ){
                    v.vx *= -1;
                }

                //雪花从侧边出去，删除
                if( vx < 0 || vx - vr > cw ){
                    dots.splice( i, 1 );
                    dots.push( self.snowShape() );
                    //雪花从底部出去
                }else if( vy - vr >= ch ){
                    dots.splice( i, 1 );
                }
            });
            //添加雪花
            if( random() > .9 ){
                self.createDot();
            }

            this.requestAnimationFrame();
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( Snow.prototype );

    // 添加实例
    Particleground.snow = Snow.prototype.constructor = Snow;

}( window, Particleground );
// wave.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        sin = Math.sin,
        pi2 = Math.PI * 2,
        UNDEFINED = 'undefined',
        isArray = Array.isArray;

    function Wave( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Wave.configDefault, options );

        this.initAttr();
        this.createDot();
        this.draw();
        this.resize();
    }

    Wave.defaultConfig = {
        //全局透明度
        opacity: 1,
        //线条颜色
        lineColor: [],
        //填充的背景颜色
        fillColor: [],
        //线条个数
        num: null,
        //线条宽度
        lineWidth: [],
        //线段的横向偏移值，(0, 1)表示波长的倍数，0 & [1, +∞)表示具体数值
        offsetLeft: [],
        //线条中点到元素顶部的距离，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
        offsetTop: [],
        //波峰数值，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
        crest: [],
        //波纹个数，即正弦周期个数
        rippleNum: [],
        //运动速度
        speed: [],
        //是否绘制成区域图
        area: false,
        //是否绘制边框
        stroke: true,
        //自适应窗口尺寸变化
        resize: true
    };


    Wave.prototype = {
        version: '1.0.0',
        initAttr: function(){
            var self = this;
            var cw = self.cw;
            var ch = self.ch;
            var set = self.set;
            var randomColor = util.randomColor;
            var limitRandom = util.limitRandom;
            //线条数量
            var num = set.num = set.num || limitRandom( ch / 2, 1 );
            //线条波长，每个周期(2π)在canvas上的实际长度
            var rippleLength = this.rippleLength = [];

            [
                'lineColor', 'fillColor', 'lineWidth',
                'offsetLeft', 'offsetTop', 'crest',
                'rippleNum', 'speed', 'area',
                'stroke'
            ]
            .forEach(function( attr ){
                attrNormalize( attr );
            });

            function attrNormalize( attr ){
                var val = set[ attr ];
                if( isArray( val ) ){
                    //将crest: []或[2]或[2, 2], 转换成crest: [2, 2, 2]
                    if( attr === 'offsetTop' || attr === 'crest' ||  attr === 'offsetLeft' ){
                        var arg = attr === 'offsetLeft' ? cw : ch;
                        for( var i = 0; i < num; i++ ){
                            val[i] = typeof val[i] === UNDEFINED ?
                                getAttr( attr ) : scale( val[i], arg );
                        }
                    }else if( val.length < num ){
                        for( var i = 0, len = num - val.length; i < len; i++ ){
                            val.push( getAttr( attr ) );
                        }
                    }
                }else {
                    set[ attr ] = [];
                    //将crest: 2, 转换成crest: [2, 2, 2]
                    if( typeof val === 'number' || typeof val === 'boolean' ||
                        typeof val === 'string' ){
                        for( var i = 0; i < num; i++ ){
                            if( attr === 'offsetTop' || attr === 'crest' ){
                                val = scale( val, ch );
                            }else if( attr === 'offsetLeft' ){
                                val = scale( val, cw );
                            }else if( attr === 'rippleNum' ){
                                rippleLength.push( cw / val );
                            }
                            set[ attr ].push( val );
                        }
                    }
                }
            }

            function getAttr( attr ){
                switch ( attr ){
                    case 'lineColor':
                    case 'fillColor':
                        attr = randomColor();
                        break;
                    case 'lineWidth':
                        attr = limitRandom( 2, .2 );
                        break;
                    case 'offsetLeft':
                        attr = random() * cw;
                        break;
                    case 'offsetTop':
                    case 'crest':
                        attr = random() * ch;
                        break;
                    case 'rippleNum':
                        attr = limitRandom( cw / 2, 1 );
                        rippleLength.push( cw / attr );
                        break;
                    case 'speed':
                        attr = limitRandom( .4, .1 );
                        break;
                    case 'area':
                        attr = false;
                        break;
                    case 'stroke':
                        attr = true;
                        break;
                }
                return attr;
            }
            function scale( val, scale ){
                return val > 0 && val < 1 ? val * scale : val;
            }
        },
        setOffsetTop: function( topVal ){
            if( isArray( topVal ) ){
                //如果传入的topVal数组少于自身数组的长度，则保持它的原有值，以保证不出现undefined
                this.set.offsetTop.forEach(function( v, i, array ){
                    array[ i ] = topVal[ i ] || v;
                });
            }else{
                if( topVal > 0 && topVal < 1 ){
                    topVal *= this.ch;
                }
                this.set.offsetTop.forEach(function( v, i, array ){
                    array[ i ] = topVal;
                });
            }
        },
        createDot: function(){
            var set = this.set,
                cw = this.cw,
                lineNum = set.num,
                dots = [];

            for( var i = 0; i < lineNum; i++ ){

                var	line = [];
                //一个点的高度
                var step = pi2 / this.rippleLength[i];

                //创建一条线段所需的点
                for( var j = 0; j < cw; j++ ){
                    line.push({
                        x: j,
                        y: j * step
                    });
                }

                dots.push( line );

            }
            this.dots = dots;
        },
        draw: function(){
            var cxt = this.cxt,
                cw = this.cw,
                ch = this.ch,
                set = this.set;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            this.dots.forEach(function( lineDots, i ){
                cxt.save();
                cxt.beginPath();

                var crest = set.crest[i];
                var offsetLeft = set.offsetLeft[i];
                var offsetTop = set.offsetTop[i];
                var speed = set.speed[i];
                lineDots.forEach(function( v, j ){
                    cxt[ j ? 'lineTo' : 'moveTo'](
                        v.x,
                        //y = A sin（ ωx + φ ）+ h
                        crest * sin( v.y + offsetLeft ) + offsetTop
                    );
                    v.y -= speed;
                });
                if( set.area[i] ){
                    cxt.lineTo( cw, ch );
                    cxt.lineTo( 0, ch );
                    cxt.closePath();
                    cxt.fillStyle = set.fillColor[i];
                    cxt.fill();
                }
                if( set.stroke[i] ){
                    cxt.lineWidth = set.lineWidth[i];
                    cxt.strokeStyle = set.lineColor[i];
                    cxt.stroke();
                }
                cxt.restore();
            });
            this.requestAnimationFrame();
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );

    // 添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;

}( window, Particleground );