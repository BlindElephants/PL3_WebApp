
(
OSCdef(\testrecv, { |msg, time, addr, recv|
	Synth(\testSynth, [\freq, msg[1], \pan, msg[2], \amp, msg[3], \dur, msg[4]]);
}, '/test');
)

NetAddr("localhost", 57120).sendMsg("/test", "hello", "world")

(
SynthDef(\testSynth, {
	arg freq = 4000, pan = 0.0, amp = 0.1, dur = 0.04;
	// var grain = Impulse.ar(freq, 0, amp, 0) * EnvGen.kr(Env.perc(dur*0.5, dur*0.5), 1, 1, doneAction:2);
	var grain = SinOsc.ar(freq, 0, amp, 0) *EnvGen.kr(Env.perc(dur*0.25, dur*0.5), 1, 1, doneAction:2) ;
	Out.ar(0, Pan2.ar((grain), pan, 1.0))
}).add;
)



a = Synth(\testSynth)

(
SynthDef(\roto, {
	arg freq = 10, amp=0.1, gate = 1;
	// var sound = Pulse.ar(freq, 0.5, 1) * EnvGen.kr(Env.adsr(2, 0, 1.0, 2), gate, doneAction:2);
	var sound = Pulse.ar(freq, 0.5, 1) * EnvGen.kr(Env.linen(2.0, 5, 2.0, 1.0, 'welch'), doneAction:2);
	Out.ar(0, Pan2.ar(sound, SinOsc.kr(Rand(0.1, 3))));
}).add;
)


b = Synth(\roto);


b.set(\gate, 0)

b.free

b.release(5.0);

b.release(0.0)

Env.linen(1, 2, 3, 0.6, [[\sine, \welch, \lin, \exp]]).plot;


Env.linen(1, 2, 3, 0.6, \welch).test.plot;
