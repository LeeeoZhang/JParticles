/**
 * Particleground.js v1.0.0 (https://github.com/Barrior/Particleground.js)
 * Copyright 2016 Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/mit-license.php)
 * test-5556
 */
(function ( factory ){
    // AMD 加载方式放在头部，factory函数会比后面的插件延迟执行
    // 导致后面的插件找不到Particleground对象，报错
    /*if ( typeof define === 'function' && define.amd ) {
        define( factory );
     }else */
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

    //public function
	function pInt( s ){
		return parseInt( s, 10 );
	}
	function randomColor(){
		//http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
		return "#" + random().toString( 16 ).slice( -6 );
	}
	function limitRandom( max, min ){
		return random() * (max - min) + min;
	}
    function extend(){
        //站在jQuery的肩膀之上
        var arg = arguments,
            target = arg[0] || {},
            deep = false,
            length = arg.length,
            i = 1,
            value, attr;

        if( typeof target === 'boolean' ){
            deep = target;
            target = arg[1] || {};
            i++;
        }

        for( ; i < length; i++ ){
            for( attr in arg[i] ){

                value = arg[i][attr];

                if( deep && (isPlainObject( value ) || isArray( value )) ){

                    target[attr] =
                        extend( deep, isArray( value ) ? [] : {}, value );

                }else{
                    target[attr] = value;
                }

            }
        }

        return target;
    }
    function typeChecking( obj, type ){
        return Object.prototype.toString.call( obj ) === type;
    }
    function isPlainObject( obj ){
        return typeChecking( obj, '[object Object]' );
    }
    function isElem( arg ){
        //document不能是element，因为它没有很多element该具有属性
        //如用getComputedStyle获取不到它的宽高，就会报错
        return arg && typeof arg === 'object' && arg.nodeType === 1;
    }

    //DOM function
    var getCssReg = /^\d+(\.\d+)?[a-z]+$/i;
    function getCss( elem, attr ){
        var val = win.getComputedStyle( elem )[ attr ];
        return getCssReg.test( val ) ? pInt( val ) : val;
    }
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

    //addons function
    function createColor( setColor ){
        var colorLength = setColor instanceof Array ? setColor.length : false;
        var color = function(){
            return setColor[ floor( random() * colorLength ) ];
        };
        return colorLength ? color : randomColor;
    }
	function createCanvas( selector, context ){
        if( !canvasSupport ){
            return false;
        }
        if( isElem( selector ) ){
            context.container = selector;
        }else if( !(context.container = doc.querySelector( selector )) ){
            throw new Error( selector + ' is not defined' );
        }
        context.c = doc.createElement( 'canvas' );
		context.cw = context.c.width = getCss( context.container, 'width' );
		context.ch = context.c.height = getCss( context.container, 'height' );
		context.cxt = context.c.getContext( '2d' );
        context.paused = false;

        context.container.innerHTML = '';
        return !!context.container.appendChild( context.c );
    }
	function pause( context, fn ){
		if( canvasSupport && !context.paused ){
			context.paused = true;
			fn && fn.call( context );
		}
	}
	function open( context, fn ){
		if( canvasSupport && context.paused ){
			fn && fn.call( context );
			context.paused = false;
			context.draw();
		}
	}
    function resize( context, fn ){
        if( context.set.resize ){
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

                fn && fn.call( context, scaleX, scaleY );

                context.paused && context.draw();
            });
        }
    }

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
            createColor: createColor,
            limitRandom: limitRandom,
            extend: extend,
            typeChecking: typeChecking,
            isPlainObject: isPlainObject,
            isElem: isElem,
            getCss: getCss,
            offset: offset,
            createCanvas: createCanvas,
            pause: pause,
            open: open,
            resize: resize
        },
        inherit: {
            color: function(){
                this.color = createColor( this.set.color );
                return this.color();
            },
            pause: function(){
                pause( this );
            },
            open: function(){
                open( this );
            },
            resize: function(){
                resize( this );
            },
            requestAnimationFrame: function(){
                !this.paused && win.requestAnimationFrame( this.draw.bind( this ) );
            }
        },
        event: {
            on: on,
            off: off
        },
        extend: function( obj ){
            return extend( obj, this.inherit ), this;
        }
    };

    // AMD. Register as an anonymous module.
    if ( typeof define === 'function' && define.amd ) {
        define( function() {
            return Particleground;
        } );
    }

    win.Particleground = Particleground;
	return Particleground;
}));

/**
 * 规定：
 *  set: 参数配置
 *  set.color: 颜色
 *  set.resize: 自适应
 *
 *  c: canvas对象
 *  cw: canvas宽度
 *  ch: canvas高度
 *  cxt: canvas 2d 绘图环境
 *  container: 包裹canvas的容器
 *  dots: 通过arc绘制的粒子对象
 *  dot.x: 通过arc绘制的粒子的x值
 *  dot.y: 通过arc绘制的粒子的y值
 *  paused: 是否暂停
 *  draw: 绘图函数
 *
 */
//particle.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        event = Particleground.event,
        on = event.on,
        off = event.off,
        math = Math,
        random = math.random,
        abs = math.abs,
        pi2 = math.PI * 2;

    function Particle( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Particle.configDefault, options );

        //设置事件元素对象
        if( !util.isElem( this.set.eventElem ) && this.set.eventElem !== document ){
            this.set.eventElem = this.c;
        }
        //移动鼠标点X,Y坐标
        this.posX = random() * this.cw;
        this.posY = random() * this.ch;

        this.createDot();
        this.draw();
        this.event();
        this.resize();
    }

    Particle.configDefault = {
        //全局透明度
        opacity: .6,
        //粒子颜色，null随机色，或随机给定数组的颜色
        color: null,
        //粒子运动速度
        speed: 1,
        //粒子个数，默认为容器的0.1倍
        //传入[0, 1)显示容器相应倍数的值，或传入具体个数[1, +∞)
        num: .12,
        //粒子最大半径
        max: 2.4,
        //粒子最小半径
        min: .6,
        //连接线段最大距离，即鼠标点的方圆几里的点连接在一起
        dis: 130,
        //连接线段的宽度
        lineWidth: .2,
        //范围越大，连接的点越多
        range: 160,
        //触发移动事件的元素，null为canvas，或传入原生元素对象，如document
        eventElem: null,
        //自适应窗口尺寸变化
        resize: true
    };

    var fn = Particle.prototype = {
        version: '1.0.0',
        createDot: function(){
            var set = this.set,
                speed = set.speed,
                num = set.num >= 1 ? set.num : this.cw * set.num,
                dots = [],
                i = 0;

            for( ; i < num; i++ ){
                var r = util.limitRandom( set.max, set.min );
                dots.push({
                    x: util.limitRandom( this.cw - r, r ),
                    y: util.limitRandom( this.ch - r, r ),
                    r: r,
                    vx: util.limitRandom( speed, -speed * .5 ) || speed,
                    vy: util.limitRandom( speed, -speed * .5 ) || speed,
                    color: this.color()
                });
            }

            this.dots = dots;
        },
        draw: function(){
            var set = this.set,
                cw = this.cw,
                ch = this.ch,
                cxt = this.cxt;

            cxt.clearRect( 0, 0, cw, ch );

            //当canvas宽高改变的时候，全局属性需要重新设置
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
            });

            this.connectDot().requestAnimationFrame();
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

            return this;
        },
        event: function() {
            if( this.set.eventElem !== document ){
                this.elemOffset = util.offset( this.set.eventElem );
            }
            this.handler = function ( e ) {
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
            }.bind( this );
            on( this.set.eventElem, 'mousemove', this.handler );
        }
    };

    //继承公共方法，如pause，open
    Particleground.extend( fn );

    fn.pause = function () {
        util.pause( this, function(){
            off( this.set.eventElem, 'mousemove', this.handler );
        });
    };

    fn.open = function () {
        util.open( this, function(){
            on( this.set.eventElem, 'mousemove', this.handler );
        });
    };

    fn.resize = function () {
        util.resize( this, function( scaleX, scaleY ){
            this.posX *= scaleX;
            this.posY *= scaleY;
            this.elemOffset = this.elemOffset ? util.offset( this.set.eventElem ) : '';
        });
    };

    //添加实例
    Particleground.particle = fn.constructor = Particle;

}( window, Particleground );


//snow.js
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

    Snow.configDefault = {
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

    //继承公共方法，如pause，open
    Particleground.extend( Snow.prototype );
    //添加实例
    Particleground.snow = Snow.prototype.constructor = Snow;
}( window, Particleground );
//wave.js
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

    Wave.configDefault = {
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
                    topVal *= ch;
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

    //继承公共方法，如pause，open
    Particleground.extend( Wave.prototype );
    //添加实例
    Particleground.wave = Wave.prototype.constructor = Wave;
}( window, Particleground );