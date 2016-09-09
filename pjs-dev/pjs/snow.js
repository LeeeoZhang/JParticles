// snow.js
+function ( win, Particleground ) {
    'use strict';

    var util = Particleground.util,
        random = Math.random,
        pi2 = Math.PI * 2;

    function Snow( selector, options ){
        util.createCanvas( this, Snow, selector, options );
    }

    Snow.defaultConfig = {
        // 雪花颜色
        color: '#fff',
        // 雪花最大半径
        max: 6.5,
        // 雪花最小半径
        min: .4,
        // 运动速度
        speed: .4
    };

    var fn = Snow.prototype = {
        version: '1.0.0',
        init: function(){
            this.dots = [];
            this.createDots();
            this.draw();
            this.resize();
        },
        snowShape: function(){
            var color = this.color,
                cw = this.cw,
                set = this.set,
                speed = set.speed,
                r = util.limitRandom( set.max, set.min );
            return {
                x: random() * cw,
                y: -r,
                r: r,
                vx: random() || .4,
                vy: r * speed,
                color: color()
            };
        },
        createDots: function(){
            // 随机创建0-6个雪花
            var count = util.pInt( random() * 6 );
            var dots = this.dots;
            while ( count-- ){
                dots.push( this.snowShape() );
            }
        },
        draw: function(){
            var self = this,
                set = self.set,
                cxt = self.cxt,
                cw = self.cw,
                ch = self.ch,
                paused = self.paused;

            cxt.clearRect( 0, 0, cw, ch );
            cxt.globalAlpha = set.opacity;

            self.dots.forEach(function( v, i, array ){
                var x = v.x;
                var y = v.y;
                var r = v.r;

                cxt.save();
                cxt.beginPath();
                cxt.arc( x, y, r, 0, pi2 );
                cxt.fillStyle = v.color;
                cxt.fill();
                cxt.restore();

                if( !paused ){
                    v.x += v.vx;
                    v.y += v.vy;

                    // 雪花反方向飘落
                    if( random() > .99 && random() > .5 ){
                        v.vx *= -1;
                    }

                    // 雪花从侧边出去，删除
                    if( x < 0 || x - r > cw ){
                        array.splice( i, 1, self.snowShape() );

                        // 雪花从底部出去，删除
                    }else if( y - r >= ch ){
                        array.splice( i, 1 );
                    }
                }
            });

            // 添加雪花
            if( !paused && random() > .9 ){
                self.createDots();
            }

            self.requestAnimationFrame();
        }
    };

    // 继承公共方法，如pause，open
    Particleground.extend( fn );

    // 添加实例
    Particleground.snow = fn.constructor = Snow;

}( window, Particleground );