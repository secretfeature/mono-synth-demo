define([
  'underscore'
], function (){

  FeedbackDelay = function (context, delayAmount, feedbackAmount, delayTime){

    this.feedback = context.createGainNode();
    this.feedback.gain.value = feedbackAmount;

    this.input = context.createGainNode();
    this.input.gain.value = delayAmount;

    this.output = context.createDelayNode();
    this.output.delayTime.value = delayTime;

    this.input.connect(this.output);
    this.output.connect(this.feedback);
    this.feedback.connect(this.output);

  }

}
);