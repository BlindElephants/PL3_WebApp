(
var numClients=0;

(
OSCdef(\client_connected, {|msg, time, addr, recvPort|
	"client connected".postln;
	msg.postln;
	Synth(\pl3_connected);
	numClients= numClients+1 ;
}, '/client/connected');
);

(
OSCdef(\client_disconnected, {|msg, time, addr, recvPort|
	"client disconnected".postln;
	msg.postln;
	numClients= numClients-1;
	Synth(\pl3_disconnected);
}, '/client/disconnected');
);

(
OSCdef(\add_object, { |msg, time, addr, recvPort|
	//arguments= [clientId, position.x, position.y]
	//position values are normalized [0-1]

	// pl3_object_add
	Synth(\pl3_object_add, [\positionX, msg[2], \positionY, msg[3]]);
	"object added".postln;
	msg.postln;
}, '/client/object_added');
);

(
OSCdef(\move_object, { |msg, time, addr, recvPort|
	//arguments= [clientId, startPosition.x, startPosition.y, endPosition.x, endPosition.y]
	//position values are normalized [0-1]

	"object moved".postln;
	msg.postln;
}, '/client/object_moved');
);

(
OSCdef(\remove_object, { |msg, time, addr, recvPort|
	//arguments= [clientId, position.x, position.y]
	//position values are normalized [0-1]
	"object removed".postln;
	msg.postln;
}, '/client/object_removed');
);

(
OSCdef(\add_instr, { |msg, time, addr, recvPort|
	//arguments= [position.x, position.y, duration, delay]
	//position values are normalized [0-1]

	"instr add".postln;
	msg.postln;
	Routine({
		msg[5].postln;
		msg[5].wait;
		Synth(\pl3_instr_add, [\duration, msg[4]]);
	}).play;
	// Synth(\pl3_instr_add);
}, '/instruction/add');
);

(
OSCdef(\move_instr, { |msg, time, addr, recvPort|
	//arguments= [startPosition.x, startPosition.y, endPosition.x, endPosition.y, duration, delay]
	//position values are normalized [0-1]

	"instr move".postln;
	msg.postln;
}, '/instruction/move');
);

(
OSCdef(\remove_instr, { |msg, time, addr, recvPort|
	//arguments= [position.x, position.y, duration, delay]
	//position values are normalized [0-1]

	"instr remove".postln;
	msg.postln;
}, '/instruction/remove');
);


(
OSCdef(\goal_gen, { |msg, time, addr, recvPort|
	//arguments= [clientId, numberOfGoalPoints]
	"gen goal".postln;
	msg.postln;
}, '/client/goal_generated');
);

(
OSCdef(\set_objects, {|msg, time, addr, recvPort|
	//arguments= [clientId, numberOfObjects, x..., y...]
	//positions are values are normalize [0-1]
	//there will be pairs (x, y) of arguments for each object
	"set objects".postln;
	msg.postln;
}, '/client/allobjects');
);
);