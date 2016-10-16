function bind( id, run ){
    var effect = run();
    var btnBox = document.querySelector(id).nextElementSibling;
    btnBox.querySelector('[data-open]').onclick = function(){
        effect.open();
    };
    btnBox.querySelector('[data-pause]').onclick = function(){
        effect.pause();
    };
}