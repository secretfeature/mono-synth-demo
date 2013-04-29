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
    audioContext.sampleRate = 44100;

    var synth = new MonoSynth(audioContext);

    //setup sliders
    var oscShapeSlider = document.querySelector('#osc-shape');
    oscShapeSlider.onchange = function(event){
      synth.oscillator.type = event.target.value;
    }

    var lpfCutoffSlider = document.querySelector('#lpf-freq');
    lpfCutoffSlider.onchange = function(event){
      synth.setFilterFrequency(event.target.value);
    }

    var lpfResonanceSlider = document.querySelector('#lpf-res');
    lpfResonanceSlider.onchange = function(event){
      synth.setFilterResonance(event.target.value);
    }

    var attackSlider = document.querySelector('#env-attack');
    attackSlider.onchange = function(event){
      synth.envelope[0] = event.target.value;
    }

    var decaySlider = document.querySelector('#env-decay');
    decaySlider.onchange = function(event){
      synth.envelope[1] = event.target.value;
    }

    var sustainSlider = document.querySelector('#env-sustain');
    sustainSlider.onchange = function(event){
      synth.envelope[2] = event.target.value;
    }

    var releaseSlider = document.querySelector('#env-release');
    releaseSlider.onchange = function(event){
      console.log(event.target.value);
      synth.envelope[3] = event.target.value;
    }

    var lfoShapeSlider = document.querySelector('#lfo-shape');
    lfoShapeSlider.onchange = function(event){
      synth.lfo.type = event.target.value;
    }

    var lfoRateSlider = document.querySelector('#lfo-rate');
    lfoRateSlider.onchange = function(event){
      console.log(event.target.value);
      synth.lfo.frequency.value = event.target.value * 100 ;
    }

    var oscLFOSlider = document.querySelector('#osc-lfo');
    oscLFOSlider.onchange = function(event){
      console.log(event.target.value);
      synth.oscLFOGain.gain.value = event.target.value  * -1000;
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