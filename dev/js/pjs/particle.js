
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        event = Particleground.event,
        on = event.on,
        off = event.off,
        math = Math,
        random = math.random,
        floor = math.floor,
        abs = math.abs,
        pi2 = math.PI * 2;

    function Particle( selector, options ){
        if( !util.createCanvas( selector, this ) ){
            return;
        }
        this.set = util.extend( {}, Particle.configDefault, options );

        //设置事件元素对象
        if( typeof this.set.eventElem !== 'object' ){
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
        //粒子颜色数组，默认随机色
        color: [],
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
        r: 160,
        //触发移动事件的元素，false为canvas，或传入原生元素对象，如document
        eventElem: false,
        //自适应窗口尺寸变化
        resize: true
    };

    var fn = Particle.prototype = {
        version: '1.0.0',
        createDot: function(){
            var cw = this.cw,
                ch = this.ch,
                set = this.set,
                speed = set.speed,
                num = cw * set.num,
                color = util.randomColor,
                colorLength = set.color.length,
                dots = [],
                i = 0;

            if( set.num >= 1 ){
                num = set.num;
            }

            if( colorLength ){
                color = function(){
                    return set.color[ floor( random() * colorLength ) ];
                };
            }

            for( ; i < num; i++ ){
                var r = util.limitRandom( set.max, set.min );
                dots.push({
                    x: util.limitRandom( cw - r, r ),
                    y: util.limitRandom( ch - r, r ),
                    r: r,
                    vx: util.limitRandom( speed, -speed * .5 ) || speed,
                    vy: util.limitRandom( speed, -speed * .5 ) || speed,
                    color: color()
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
            //resize属性没有在默认配置configDefault里声明，以减小文件大小，但在文档里说明
            if( set.resize ){
                cxt.lineWidth = set.lineWidth;
                cxt.globalAlpha = set.opacity;
            }

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

                var	x = v.x,
                    y = v.y;

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
                posR = set.r,
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
            this.handler = function ( e ) {
                this.posX = e.clientX;
                this.posY = e.clientY;
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
        });
    };

    //添加实例
    Particleground.particle = fn.constructor = Particle;

}( window, Particleground );

