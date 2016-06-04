/**
 * Particleground.js v1.0.0 (https://github.com/Barrior/Particleground.js)
 * Copyright 2016 Barrior <Barrior@qq.com>
 * Licensed under the MIT (https://opensource.org/licenses/mit-license.php)
 */
(function ( factory ){
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define( [], factory );

    } else if ( typeof module === 'object' && module.exports ) {
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

	var win = window,
        doc = document,
		random = Math.random,
        floor = Math.floor,
        canvasSupport = !!doc.createElement('canvas').getContext;

    //public
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

                if( deep && (typeChecking( value, '[object Object]' ) ||
                    typeChecking( value, '[object Array]' )) ){

                    target[attr] =
                        extend( deep, typeChecking(value, '[object Array]') ? [] : {}, value );

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
    function isElem( arg ){
        return arg && typeof arg === 'object' &&
            (arg.nodeType === 1 || arg.nodeType === 9);
    }

    //about element
    var getCssReg = /^\d+[.a-z]+$/i;
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

    //about instance objects
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

    win.Particleground = Particleground;
	return Particleground;
}));

/**
 * 规定：
 *  set: 参数配置
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