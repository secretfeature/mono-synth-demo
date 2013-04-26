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

        _this.noteOn(event.target.dataset['note'] + _this.octave, event.target);

      }

      keyElement.ontouchmove = function(event){

        event.preventDefault();
        
        var element = document.elementFromPoint(
          event.changedTouches[0].clientX, 
          event.changedTouches[0].clientY
        );

        if(element.dataset['note']){

          var note = element.dataset['note'] + _this.octave;

          if(note!=_this.heldNote)
            _this.noteOn(note, element);

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

  PianoKeyboard.prototype.noteOn = function(note, element){

    if(this.heldNote!=''){
      this.noteSlideCallback(note);
    }
    else{
      this.noteOnCallback(note);
    }

    if(this.heldKeyElement)
      this.heldKeyElement.classList.remove('held');

    this.heldNote = note;
    this.heldKeyElement = element;
    this.heldKeyElement.classList.add('held');

  }

  PianoKeyboard.prototype.noteOff = function(note){
    
    this.noteOffCallback();   
        
    this.heldNote = '';
    this.heldKeyElement.classList.remove('held');

  }

  return PianoKeyboard;

}
);