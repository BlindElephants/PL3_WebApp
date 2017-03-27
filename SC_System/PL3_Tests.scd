a=Synth(\pl3_connected);

{ Crackle.ar(0.05, 0.5) }.play;

a=Synth(\pl3_disconnected);

a=Synth(\pl3_instr_add);

a=Synth(\pl3_instr_move, [\freq, 500, \pan, -0.125]);

