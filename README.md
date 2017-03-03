# PL3_WebApp

This repo has three folders: Client, SC_System, and Server; there is also currently a separate repo, "PL3_WebApp_Backend", which contains a c++ (oF) backend app that is responsible for communication and client tracking between multiple layers. At some point, either the c++ backend or the Server/ws_server.js will be absorbed by the other, reducing the complexity of the project.

## Client

This contains the client-side webapp. Should be hosted using MAMP or a similar local server system. Once it's running, the user can browse to the app by going to "localhost:8888" or "[systemname].local:8888" (if on a separate machine on the local network)

The client currently does not generate any sound on it's own. It runs Three.JS for graphics.

It receives messages from the backend that pertain to specific graphical instructions.

Attempts were made to integrate Flocking.JS, a web audio synthesis library that is loosely structured in a way similar to super collider. While the examples included with FlockingJS work on mobile devices, I was not successful in getting it running on iPhone and iPad devices. (It did work for all laptop/desktop browsers, as well as Android based tablets that were tested). It has currently been removed as other solutions are tested.

All messages are relayed from the Client to the Server via WebSocket connection.

## Server

Node Server (middle-layer) has been removed (no longer needed). See PL3_WebApp_Backend repo, backend, including websockets connections to client browsers are now handed entirely in C++ with openFrameworks, ofxLibwebsockets, and jsoncpp.

## SC_System

Currently testing SuperCollider as the backend audio solution for all server-side generated audio content. This content is triggered by Clients who are connected on laptops and/or mobile devices. Triggered via OSC messages delivered from one of the middle layers.
