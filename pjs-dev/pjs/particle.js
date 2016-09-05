// particle.js
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

    function eventHandler( eventType, context ){
        event[ eventType ]( context.set.eventElem, 'mousemove', context.handler );
        event[ eventType ]( context.set.eventElem, 'touchmove', context.handler );
    }

    function Particle( selector, options ){
        if( util.createCanvas.call( this, selector, Particle, options ) ){
            //this.set = util.extend( {}, Particle.configDefault, options );

            // 设置事件元素对象
            if( !util.isElem( this.set.eventElem ) && this.set.eventElem !== document ){
                this.set.eventElem = this.c;
            }

            // 移动鼠标点X,Y坐标
            this.posX = random() * this.cw;
            this.posY = random() * this.ch;

            this.init();
        }

        // -- --- --
        /*if( !util.createCanvas( selector, this ) ){
            return;
        }

        this.set = util.extend( {}, Particle.configDefault, options );

        // 设置事件元素对象
        if( !util.isElem( this.set.eventElem ) && this.set.eventElem !== document ){
            this.set.eventElem = this.c;
        }

        // 移动鼠标点X,Y坐标
        this.posX = random() * this.cw;
        this.posY = random() * this.ch;

        this.createDot();
        this.draw();
        this.resize();

        if( this.set.range > 0 ){
            this.event();
        }*/
    }

    Particle.configDefault = {
        // 全局透明度
        opacity: .6,
        // 粒子颜色，null随机色，或随机给定数组的颜色
        color: null,
        // 粒子运动速度
        speed: 1,
        // 粒子个数，默认为容器的0.1倍
        // 传入[0, 1)显示容器相应倍数的值，或传入具体个数[1, +∞)
        num: .12,
        // 粒子最大半径
        max: 2.4,
        // 粒子最小半径
        min: .6,
        // 连接线段最大距离，即鼠标点的方圆几里的点连接在一起
        dis: 130,
        // 连接线段的宽度
        lineWidth: .2,
        // 范围越大，连接的点越多，当range等于0或false时，不连接线段
        range: 160,
        // 触发移动事件的元素，null为canvas，或传入原生元素对象，如document
        eventElem: null,
        // 自适应窗口尺寸变化
        resize: true
    };

    var fn = Particle.prototype = {
        version: '1.0.0',
        init: function(){
            this.createDot();
            this.draw();
            this.resize();

            if( this.set.range > 0 ){
                this.event();
            }
        },
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
        draw: function( condition ){
            condition = condition || {};
            var isResize = condition.isResize;
            var set = this.set;
            var cw = this.cw;
            var ch = this.ch;
            var cxt = this.cxt;

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

                // 如果是窗口尺寸变化，vx和vy保持不变
                if( !isResize ){
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
            eventHandler( 'on', this );
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( fn );

    fn.pause = function () {
        util.pause( this, function(){
            if( this.set.range > 0 ){
                eventHandler( 'off', this );
            }
        });
    };

    fn.open = function () {
        util.open( this, function(){
            if( this.set.range > 0 ){
                eventHandler( 'on', this );
            }
        });
    };

    /*util.resize( fn, function( scaleX, scaleY ){
        if( this.set.range > 0 ){
            this.posX *= scaleX;
            this.posY *= scaleY;
            this.elemOffset = this.elemOffset ? util.offset( this.set.eventElem ) : '';
        }
    });*/

    fn.resize = function () {
        util.resize( this, function( scaleX, scaleY ){
            if( this.set.range > 0 ){
                this.posX *= scaleX;
                this.posY *= scaleY;
                this.elemOffset = this.elemOffset ? util.offset( this.set.eventElem ) : '';
            }
        });
    };

    // 添加实例
    Particleground.particle = fn.constructor = Particle;

}( window, Particleground );

