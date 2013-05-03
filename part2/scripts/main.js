require.config({
  shim: {
  },

  paths: {
    underscore: '../../thirdparty/underscore/underscore-min',
  }
});
 
require([
  'MonoSynth',
  '../../scripts/synthModules/PianoKeyboard'
  ], 
  function(MonoSynth,PianoKeyboard) {

    document.querySelector('.touch-move-scroll-blocker').addEventListener('touchmove', function(event) {                                                                                                                                                                                                                
        event.preventDefault();                                                                                                                                                                                                                                           
    }, false); 

    var audioContext = new webkitAudioContext();

    var synth = new MonoSynth(audioContext);

    //setup sliders
    var oscShapeSlider = document.querySelector('#osc-shape');
    oscShapeSlider.onchange = function(event){
      console.log(event);
      synth.oscillator.type = parseInt(event.target.value);
    }

    var lpfCutoffSlider = document.querySelector('#lpf-freq');
    lpfCutoffSlider.onchange = function(event){
      console.log(event);
      synth.setFilterFrequency(event.target.value);
    }

    var lpfResonanceSlider = document.querySelector('#lpf-res');
    lpfResonanceSlider.onchange = function(event){
      console.log(event);
      synth.setFilterResonance(event.target.value);
    }

    // setup piano keyboard
    var noteOnCallback = function(note){
      
      synth.noteOn(note);
    
    };

    var noteSlideCallback = function(note){
    
      synth.noteSlide(note);
    
    };

    var noteOffCallback = function(){
    
      synth.noteOff();
    
    };

    var keyboard = 
    new PianoKeyboard(
      audioContext,
      noteOnCallback,
      noteSlideCallback,
      noteOffCallback      
    );

});