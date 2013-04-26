define([
  'underscore'
], function (){

  PianoKeyboard = function (noteOnCallback, noteSlideCallback, noteOffCallback){

    this.octave = 5;

    _this = this;
    
    // this.frequency = this.notes[this.rootKey + this.octave];

    this.heldNote = '';

    this.noteOnCallback = noteOnCallback;

    this.noteSlideCallback = noteSlideCallback;

    this.noteOffCallback = noteOffCallback;

    this.keyElements = document.querySelectorAll('#piano-keys .key');

    _.each(this.keyElements,function(keyElement){

      keyElement.ontouchstart = function(event){

        _this.noteOn(event.target.dataset['note'] + _this.octave);

      }

      keyElement.ontouchmove = function(event){
        
        var element = document.elementFromPoint(
          event.changedTouches[0].clientX, 
          event.changedTouches[0].clientY
        );

        if(element.dataset['note']){

          var note = element.dataset['note'] + _this.octave;

          if(note!=_this.heldNote)
            _this.noteOn(note);

        }
        else{

          _this.noteOff();

        }

      }

       keyElement.ontouchend = function(event){

        if(event.touches.length==0)
          _this.noteOff();
      }

    });

  }

  PianoKeyboard.prototype.noteOn = function(note){

    if(this.heldNote!='')
      this.noteSlideCallback(note);
    else
      this.noteOnCallback(note);

    this.heldNote = note;

  }

  PianoKeyboard.prototype.noteOff = function(note){
    
    _this.noteOffCallback();   
        
    _this.heldNote = '';

  }

  return PianoKeyboard;

}
);