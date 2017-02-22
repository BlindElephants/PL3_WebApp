// "use strict";

console.log("loaded SoundSetup.js");

(function() {
  // "use strict";

  fluid.registerNamespace("soundEngine");

  var enviro = flock.init();

  soundEngine.play = function() {
    var mySynth = flock.synth({
      synthDef: {
        ugen: "flock.ugen.sin",
        freq: {
          ugen: "flock.ugen.lfNoise",
          freq: 10,
          mul: 380,
          add: 60
        },
        mul: 0.3
      }
    });
    enviro.start();
  };
}());

soundEngine.play();
