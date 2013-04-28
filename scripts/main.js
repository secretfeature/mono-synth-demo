require.config({
  shim: {
  },

  paths: {
    underscore: '../components/underscore/underscore-min',
  }
});
 
require([
  'MonoSynth',
  'synthModules/PianoKeyboard'
  ], 
  function(MonoSynth,PianoKeyboard) {
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

    document.querySelector('.touch-move-scroll-blocker').addEventListener('touchmove', function(event) {                                                                                                                                                                                                                
        event.preventDefault();                                                                                                                                                                                                                                           
    }, false); 

    var audioContext = new webkitAudioContext();

    var synth = new MonoSynth(audioContext);

    var keyboard = new PianoKeyboard(
      audioContext,
      function(note){
        synth.noteOn(note, 1);
      },
      function(note){
        synth.noteSlide(note, 1);
      },
      function(){
        synth.noteOff();
      });

});