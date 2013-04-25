require.config({
  shim: {
  },

  paths: {
    jquery: 'vendor/jquery.min',
    underscore: '../components/underscore/underscore-min',
  }
});
 
require(['PolySynth', 'KikiStarField'], function(PolySynth, KikiStarField) {
  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var audioContext = new webkitAudioContext();

  var synth = new PolySynth(audioContext);
  // var keyboard = new KikiKeyboard(synth);
  var starField = new KikiStarField(synth);

});