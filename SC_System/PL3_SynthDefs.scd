(
SynthDef(\pl3_connected, {
	var sound=SinOsc.ar(Rand(50, 500), 0, 1.0, 0.0);
	var env=EnvGen.ar(Env.linen(0.01, 0.01, 0.01, 1.0, 'lin'), Impulse.ar(Rand(3.5, 9), Rand(0, 1)));
	var envb=EnvGen.ar(Env.linen(0.02, 0, 3.0, 1.0, 'lin'), 1, doneAction:2);
	var pan=SinOsc.ar(Rand(0.2, 0.5), Rand(0, 1));
	Out.ar(0, Pan2.ar(sound*env*envb, Rand(0, 1), pan));
}).add;
);

(
SynthDef(\pl3_disconnected, {
	var mod=SinOsc.ar(Rand(1, 2), Rand(0, 1), 0.5, 0.5);
	var env=EnvGen.ar(Env.linen(0.01, 0.2, 0.01, 1, 'lin'), doneAction:2);
	Out.ar(0, Pan2.ar(Crackle.ar(mod, 1.0)*env, Rand(0.2, 0.5), Rand(0.0, 0.5)));
}).add;
);

(
SynthDef(\pl3_instr_add, {|duration=0|
	var pulse =  Pulse.ar(3.0, 0.5, 1, 0);
	var env   = EnvGen.ar(Env.linen(0.06*duration, 0.88*duration, 0.06*duration, 1, 'lin'), doneAction:2);
	var sin   = SinOsc.ar(Rand(120, 140), Rand(0, 1), 1, 0);
	var envB  = EnvGen.ar(Env.linen(0.005, 0.01, 0.005, 1, 'lin'), pulse);
	Out.ar(0, Pan2.ar(sin*envB*env, 0.0, 1.0));
}).add;
);

(
SynthDef(\pl3_instr_move, {|out=0, pan=0|
	var osc, env, sig;
	osc = SinOsc.ar(\freq.ar(5000, 0.5), Rand(0, 1), 1, 0);
	env = EnvGen.ar(Env.perc(0.5, 4.0, 1.0, -4), 1, doneAction:2);
	sig = Resonz.ar(osc*env, 500);
	Out.ar(out, PanAz.ar(8, sig, pan));
}).add;
);

(SynthDef(\pl3_object_add, {
	arg positionX, positionY;
	var osc, env, sig;
	osc= SinOsc.ar(Rand(30, 90), Rand(0, 1), 1, 0);
	env= EnvGen.ar(Env.perc(0.75, 0.25, 1.0, -2), doneAction:2);
	sig = osc*env;
	Out.ar(0, Pan2.ar(sig, positionX, 1));
}).add;
);