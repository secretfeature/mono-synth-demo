define([
  'PolySynth',
  'underscore',
], function (PolySynth){
  
  KikiKeyboard = function (synth){

    var _this = this;

    resizeUpdate();

    window.onresize = function(event) {

      resizeUpdate.call(_this);
    
    }

    function resizeUpdate(){

      _this.innerHeight = window.innerHeight;
      _this.innerWidth = window.innerWidth;
    
    }

    this.touchMap = {};

    this.synth = synth || new PolySynth();
    
    this.voiceLifespan = 1000 * _.reduce(this.synth.env1, function(memo, num){ return memo + num; }, 0);
        
    this.containerElement = document.querySelector('.container');
    
    this.keyElements = document.querySelectorAll('#kiki-keyboard .key');

    this.cloudElement = document.querySelector('#cloud');

    this.cloudActive = false;

    this.rainElement = document.querySelector('.rain');
    this.rainParticles = {};
    var makeItRain = _.throttle(function(x,y){
      rain.call(_this,x,y)
    },100);

    this.triangleWaveElement = document.querySelector('#waveform-selection .triangle');

    this.squareWaveElement = document.querySelector('#waveform-selection .square');

    this.sineWaveElement = document.querySelector('#waveform-selection .sine');

    selectWaveform(1, this.squareWaveElement);

    this.treeMan = document.querySelector('#tree-man');

    var dance = _.throttle(treeManDance, 250);

    this.sineWaveElement.ontouchstart = function(event){
     
      selectWaveform(0,this);

    }

    this.squareWaveElement.ontouchstart = function(event){

      selectWaveform(1,this);

    }

    this.triangleWaveElement.ontouchstart = function(event){

      selectWaveform(2,this);

    }

    function selectWaveform(value, element){
      if(_this.selectedWaveElement)
        _this.selectedWaveElement.classList.toggle('selected-item');
      _this.synth.setOscillatorType(value);
      _this.selectedWaveElement = element;
      _this.selectedWaveElement.classList.toggle('selected-item');

    }

    this.treeMan.ontouchstart = function(event){

      treeManDance.call(_this);

    }

    this.cloudElement.ontouchstart = function(event){

      _this.cloudElement.classList.add('sad');
      _this.cloudActive = true;
      _this.synth.setPitchLFOMod(Math.max((window.innerHeight/event.changedTouches[0].clientY) * .2, .1));

      _this.containerElement.classList.add('raining');

    }

    this.cloudElement.ontouchend = function(event){

      _this.cloudElement.classList.remove('sad');
      _this.cloudActive = false;
      _this.cloudElement.style.left = '300px';
      _this.cloudElement.style.top = '30px';
      _this.synth.setPitchLFOMod(0);

      _.delay(function(){

      _.each(_this.rainParticles, function(particle){
        console.log(Date.now() - particle.birthTime);
        if( (Date.now() - particle.birthTime) > 1000 ){
          _this.rainElement.removeChild(particle.element);
          delete _this.rainParticles[particle.birthTime];
        }

      });

      },1000);

      _this.containerElement.classList.remove('raining');


    }

    this.cloudElement.ontouchmove = function(event){

      var left = event.changedTouches[0].clientX - 150;
      var top = event.changedTouches[0].clientY - 100;
      _this.cloudElement.style.left = left + 'px';
      _this.cloudElement.style.top = top + 'px';

      makeItRain(left + 125, top + 100);

      _this.synth.setPitchLFOMod((1 - (event.changedTouches[0].clientY/window.innerHeight)));

    }


    this.touchList = [];

    var keyColors = ['#DA212F','#C40079','#60D8B9','#FFFF00','#28A8DA','#3BD374','#8CC63F','#F7931E'];

    _.each(this.keyElements,function(element,i){

      element.style.background = 'hsla('+keyColors[i]+', 100%, 80%, 1)';

    });

    function rain(x, y){

      var now = Date.now();
      _.each(_this.rainParticles, function(particle){
        if( (now - particle.birthTime) > 1000 ){
          _this.rainElement.removeChild(particle.element);
          delete _this.rainParticles[particle.birthTime];
        }

      });

      var rainDrop = document.createElement('div'),
          birthTime = now,
          xOffset = Math.random() * 50;

      rainDrop.classList.add('rain-drop');
      _this.rainParticles[birthTime] = {element:rainDrop,birthTime:birthTime};
      _this.rainElement.appendChild(rainDrop);
      _.extend(rainDrop.style,{
            '-webkit-transform':'translate3d(' + (x - 25 + xOffset) + 'px,' + y + 'px,0px)'
          });
      _.defer(
        function(){
          _.extend(rainDrop.style,{
            '-webkit-transform':'translate3d(' + x + 'px,' + (this.innerHeight + y) + 'px,0px)'
          });
        }
      );

    }

    function treeManDance(){

      _this.treeMan.classList.toggle('left');
      _this.treeMan.classList.toggle('right');

    }

    function updateEyes(event){
      
      var windowWidth = window.innerWidth,
          windowHeight = window.innerHeight,
          keyWidth = (windowWidth / 8),
          halfKeyWidth = (windowWidth / 8) * .5,
          touchAverageX = 0,
          touchAverageY = 0,
          eyes,
          eyesX,
          eyesY;

      _.each(event.touches, function(touch){
        touchAverageX += touch.clientX;
        // touchAverageY += touch.clientY;
      });
      touchAverageX = touchAverageX / event.touches.length;
      // touchAverageY = touchAverageY / event.touches.length;
      _.each(_this.keyElements, function(element,i){
        eyes = element.querySelector('.eyes');
        eyesX = (keyWidth * (8-i));
        if(eyesX >= touchAverageX)
          eyes.style.left = Math.round(-8 * (1 - (touchAverageX/eyesX))) + 'px';
        else
          eyes.style.left = Math.round(8 * (touchAverageX)/(windowWidth)) + 'px';

        // eyesY = windowHeight * .75;
        // if(eyesY < touchAverageY)
        //   eyes.style.top = Math.round(-5 * ( 1 - (touchAverageY/eyesY))) + 'px';
      });
    }
    

    document.ontouchmove = function(event){

      
      event.preventDefault();
      // console.log(event);
      var keyElement,
          element,
          hoveredKeyIndex,
          windowHeight,
          yOffset,
          touch;
          

      _.each(event.changedTouches,function(changedTouch){
        keyElement = _this.touchMap[changedTouch.identifier].element;
        hoveredKeyIndex = Math.floor((changedTouch.clientX/window.innerWidth) * 8);
        touch = _this.touchMap[changedTouch.identifier];

        if(hoveredKeyIndex != parseInt(keyElement.dataset.keyIndex)){
          keyElement.classList.remove('held');
          element = _this.keyElements.item(7-hoveredKeyIndex);
          element.classList.add('held');

          _this.synth.detune(touch.voiceId,hoveredKeyIndex,true);

          window.clearTimeout(touch.timeout);
          touch.timeout = window.setTimeout(
          function() {

            element.classList.remove('held');

          }, _this.voiceLifespan);

          touch.element = element;

          dance.call(_this);      
      
        }

        // if(changedTouch.clientY<(window.innerHeight * .75)){
        //   yOffset = Math.min(Math.max((((windowHeight * .75) - (changedTouch.clientY ))/(windowHeight * .75)),0),1);
        //   _this.synth.voices[touch.voiceId].mod = yOffset;

        //   _this.synth.setPitchLFOMod(touch.voiceId,yOffset);
        // }

      });
      
      updateEyes.call(_this,event);
    }

    document.ontouchstart = function(event){

      if(event.target != _this.squareWaveElement && event.target != _this.sineWaveElement && event.target != _this.triangleWaveElement){
      
            dance.call(_this);
      
            event.preventDefault();
            // console.log(event);
      
            var voiceId,
                hoveredKeyIndex,
                keyElement,
                detune;
      
            _.each(event.changedTouches,function(changedTouch){
      
              // console.log('start',touch.target.dataset.keyIndex,this.audioContext,webkitAudioContext);
              hoveredKeyIndex = Math.floor((changedTouch.clientX/window.innerWidth) * 8);
              keyElement = _this.keyElements[7-hoveredKeyIndex];
              keyElement.classList.add('held');
              // console.log('voice',lastVoice);
      
              voiceId = _this.synth.noteOnScale(hoveredKeyIndex);
      
              var timeout = window.setTimeout(
                function() {
      
                  keyElement.classList.remove('held');
      
                }, _this.voiceLifespan);
      
              _this.touchMap[changedTouch.identifier] = {element:keyElement,voiceId:voiceId,timeout:timeout};
      
            });
      
            this.touchList = event.touches;
      
            updateEyes.call(_this,event);
        }

    }

    document.ontouchend = function(event){

      event.preventDefault();
      // console.log(event);
      _.each(event.changedTouches,function(touch){

        noteOff(touch.identifier,'end');

      });
      if(event.touches.length<1){
          var eyes,
              eyesX,
              eyesY;
          _.each(_this.keyElements, function(element,i){
              eyes = element.querySelector('.eyes');
              eyes.style.left = 0 + 'px';
              eyes.style.top = 0 + 'px';
            });
        }
        else{
          updateEyes(event);
        }

    }

    function noteOff(id,o){

      _this.touchMap[id].element.classList.remove('held');

      window.clearTimeout(_this.touchMap[id].timeout);

      _this.synth.noteOff(_this.touchMap[id].voiceId);
        
      delete _this.touchMap[id];


    }

    function animloop(){

      requestAnimFrame(animloop);
      render();

    };
    
    function render(){



    }

    animloop();
    
  }


  return KikiKeyboard;
})