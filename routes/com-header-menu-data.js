var examplesInfo = require('../db/examples');
var preface = examplesInfo.preface;
var list = examplesInfo.list;
var menuData = {};

[ preface, list ].forEach(function( obj ){
    for( var key in obj ){
        menuData[ key ] = obj[ key ];
    }
});

module.exports = menuData;