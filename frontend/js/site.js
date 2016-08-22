$(function(){
    //common
    function loadjs( url, callback ){
        var script = document.createElement('script');
        script.onload = callback;
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild( script );
    }
    function loadcss( url, callback ){
        var link = document.createElement('link');
        link.onload = callback;
        link.href = url;
        link.rel = 'stylesheet';
        document.getElementsByTagName('head')[0].appendChild( link );
    }
    function setActive( $parent, $this ){
        $parent.find('.active').removeClass('active');
        $this.addClass('active');
    }

    //nav
    function nav(){
        var $nav = $('.header .nav');
        var $active = $nav.find('.active');
        var $slideblock = $nav.find('.slideblock');

        setSlideblock( $active );
        setTimeout(function(){
            $slideblock.addClass('animation').removeClass('hidden');
        }, 0 );

        $nav.find('a').hover(function(){
            changeActive( $(this) );
        }, function(){
            changeActive( $active );
        });

        $(window).resize(function(){
            clearTimeout( this.timer );
            this.timer = setTimeout(function(){
                setSlideblock( $nav.find('.active') );
            }, 400 );
        });

        function changeActive( $el ){
            setActive( $nav, $el );
            setSlideblock( $el );
        }

        function setSlideblock( $el ){
            var l = $el.position().left + parseInt($el.css('paddingLeft')) + .5;
            $slideblock.css({
                width: $el.width(),
                transform: 'translate('+ l +'px,0)'
            });
        }
    }
    nav();

    //footer 当页面不够高时，设置页脚为相对定位到底部
    setFooter();
    function setFooter(){
        if( $('body').height() > $('.page-header').outerHeight() +
            $('.page-content').outerHeight() +
            $('.page-footer').outerHeight() ){
            $('.page-footer').css({
                width: '100%',
                position: 'absolute',
                bottom: 0
            });
        }
        $('.page-footer').show();
    }

    $('#open').click(function(){
        d.open();
    });
    $('#pause').click(function(){
        d.pause();
    });

    //load & prettify code templates
    loadcss( '//cdn.bootcss.com/prettify/r298/prettify.min.css' );
    loadjs( '//cdn.bootcss.com/prettify/r298/prettify.min.js', function(){
        if( $('.prettyprint').length ){
            prettyPrint();
        }else if( $('.quick-getting').length ){
            'import use use-method config-default'.split(' ').forEach(function( v ){
                $.get('/code-tpl/'+ v +'.html', function( msg ){
                    $( '.' + v ).text( msg ).addClass( 'prettyprint' );
                    prettyPrint();
                    if( v === 'use' ){
                        window.d = new Particleground.particle( '#demo', {
                            dis: 80,
                            range: 60
                        });
                    }
                });
            });
        }
    });

    //必读flag的显示与否
    if( !/\/examples\/quick-getting/i.test( location.href ) ){
        if( !window.localStorage.getItem( 'read' ) ){
            $('.eg-container >.menu >h5:eq(1)').append('<i class="essential pa">必读</i>');
        }
    }else{
        window.localStorage.setItem( 'read', true );
    }

    //route
    if( $('#i-bg').length ){
        pageIndex();
    }else if( $('#changelog').length ){
        pageChangelog();
    }

    function pageIndex(){
        new Particleground.particle( '#i-bg', {
            eventElem: document
        });
    }

    function pageChangelog(){
        $('#changelog').on('click', '.accordion > .header', function(){
            $(this).next().stop().slideToggle(600);
        });
    }

});