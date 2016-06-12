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