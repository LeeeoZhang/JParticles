/*!
 * Yuncaijing UI v1.0.0
 * Copyright 2016 WWW.YUNCAIJING.COM, Inc.
 */

if (typeof jQuery === 'undefined') {
    throw new Error('Yuncaijing UI\'s JavaScript requires jQuery')
}

+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
        throw new Error('Yuncaijing UI\'s JavaScript requires jQuery version 1.9.1 or higher')
    }
}(jQuery);


//transition.js v1.0.0
+function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('yui')

        var transEndEventNames = {
            WebkitTransition : 'webkitTransitionEnd',
            MozTransition    : 'transitionend',
            OTransition      : 'oTransitionEnd otransitionend',
            transition       : 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return { end: transEndEventNames[name] }
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('yuiTransitionEnd', function () { called = true })
        var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.yuiTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);

/**
 * throttle.js
 * @param  {Function} fn
 * @param  {Number}   delay 可选，值 >= 0
 * @param  {Number}   must  可选，值 >= 0
 * @return {Function}       run When trigger it's event
 */
+function ( $ ) {
    'use strict';
    $.uiThrottle = function( fn, delay, must ){
        if( !delay && !must ){
            return fn;
        }

        var startTime = new Date(),
            timer;

        return function( e ){
            var context = this;

            if( delay ){
                clearTimeout( timer );
                timer = setTimeout(function(){

                    fn.call( context, e );

                }, delay );

            }else if( new Date() - startTime > must ){

                startTime = new Date();
                fn.call( context, e );
            }
        };
    };
}(jQuery);

/**
 * clickToggle.js
 * 当指定元素被点击时，在两个函数之间轮流切换。
 * @param  {Function} fnFirst		The first fn.
 * @param  {Function} fnSecond		The second fn.
 * @param  {Number} delay			可选，延迟时间执行函数
 * @param  {Number} must			可选，一定时间执行函数
 */
+function ( $ ) {
    'use strict';
    $.fn.clickToggle = function( fnFirst, fnSecond, delay, must ){

        return this.each(function(){

            var toggle;

            $( this ).on( 'click', $.uiThrottle(function( e ){

                ( toggle ? fnSecond : fnFirst ).call( this, e );
                toggle = !toggle;

            }, delay, must ) );

        });
    };
}(jQuery);

//dropdown.js
+function ( $ ) {
    'use strict';
    $(document).on( 'click.dropdown', '[data-toggle="dropdown"]', function () {
        var parent = $(this).parent();

        if( parent.hasClass('open') ){

            parent.removeClass( 'open' );

        }else{
            parent.addClass( 'open' );
        }
    });
}(jQuery);

//tooltip.js
+function ( $ ) {
    'use strict';
    var $body = $( 'body' );
    var tDefault = {
        placement: 'top',
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        html: false
    };
    var TRANSITION_DURATION = 400;

    $.fn.tooltip = function ( options ) {
        var set = $.extend( {}, tDefault, options );
        var event = 'hover';
        if( set.trigger === 'click' ){
            event = 'clickToggle';
        }
        return this.each(function(){
            var $this = $( this );
            var placement = $this.attr( 'data-placement') || set.placement;
            var $tooltip =$( set.template );
            var complete = function () {
                if( $tooltip.hasClass( 'out' ) ){
                    $tooltip.remove();
                }
            };
            $tooltip.addClass( placement )
                .find( '.tooltip-inner')[set.html ? 'html' : 'text']( $this.attr( 'data-title' ) || set.title );

            $this[ event ](function(){
                var offset = $this.offset();
                var height = $this.outerHeight();
                var width = $this.outerWidth();

                $body.append( $tooltip.removeClass('out') );

                var tipHight = $tooltip.outerHeight();
                var tipWidth = $tooltip.outerWidth();
                var left = offset.left - tipWidth;
                var top = offset.top + (height - tipHight)/2;

                switch ( placement ){
                    case 'right':
                        left = offset.left + width;
                        break;
                    case 'top':
                        left = offset.left + (width - tipWidth)/2;
                        top = offset.top - tipHight;
                        break;
                    case 'bottom':
                        left = offset.left + (width - tipWidth)/2;
                        top = offset.top + height;
                        break;
                }

                $tooltip.css({
                    left: left,
                    top: top
                });
            }, function () {
                $.support.transition ?
                    $tooltip.addClass( 'out' )
                        .one('yuiTransitionEnd', complete)
                        .emulateTransitionEnd(TRANSITION_DURATION) :
                    $tooltip.remove();
            });
        });
    };
}(jQuery);

//tab.js
+function ( $ ) {
    'use strict';
    $( document).on( 'click.tabs', '.tabs .tab-nav>li', function () {
        if( !$(this).hasClass('disabled') && !$(this).hasClass('active') ){
            $(this).addClass('active').siblings().removeClass( 'active' )
                .parents( '.tabs' )
                .find( '.tab-content')
                .find( $(this).attr( 'data-tab' ) )
                .addClass( 'active' )
                .siblings().removeClass( 'active' );
        }
    });
}(jQuery);

//layer.js
+function ( $ ) {
    'use strict';
    var $body = $( 'body' );
    var layerDefault = {
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        html: false
    };
    var TRANSITION_DURATION = 400;

}(jQuery);
