console.log("hello");

import Matter from "matter-js";
import Tone from "tone";

const AudioContext = window.AudioContext;
let audioCtx;

audioCtx = new AudioContext();

const s = audioCtx.createOscillator();
s.connect(audioCtx.destination);

//create a synth and connect it to the master output (your speakers)
var monoSynth = new Tone.Synth({
  oscillator: {
    type: "fmsquare",
    modulationType: "sawtooth",
    modulationIndex: 3,
    harmonicity: 3.4,
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 2,
    release: 5,
  },
}).toMaster();

var synthTest = new Tone.PolySynth(20, Tone.Synth, {
  oscillator: {
    type: "fmsquare",
    modulationType: "sawtooth",
    modulationIndex: 3,
    harmonicity: 3.4,
    volume: 0.1,
  },
  envelope: {
    attack: 0.001,
    decay: 0.5,
    sustain: 2,
    release: 1,
  },
}).toMaster();

var membraneDrum = new Tone.MembraneSynth().toMaster();

const playDrum = () => {
  console.log("DRUM");
  //membraneDrum.triggerAttackRelease("E2", "8n");
};

const testTone = (note) => {
  //   synthTest.voices.map((voice) => {
  //     voice.oscillator.modulationIndex.value = Math.random() * 100;
  //     console.log(voice.oscillator.modulationIndex.value);
  //   });
  synthTest.volume.value = -40;
  synthTest.set({
    oscillator: {
      type: "fmsquare",
      modulationType: "sawtooth",
      modulationIndex: Math.random() * 4,
      harmonicity: Math.floor(Math.random() * 15),
    },
    envelope: {
      attack: 0.001,
      decay: 0.5,
      sustain: 2,
      release: 5,
    },
  });
  //synthTest.triggerAttackRelease(note, "1n");
  let s = audioCtx.createOscillator();
  s.frequency.value = note;
  s.start(audioCtx.currentTime);
  s.connect(audioCtx.destination);
  setTimeout(() => {
    s.stop(audioCtx.currentTime);
    s.disconnect(audioCtx.destination);
    s = null;
  }, 1000);
};

const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Render = Matter.Render;

window.onload = () => {
  // create an engine
  var engine = Engine.create();

  // create a renderer
  var render = Render.create({
    element: document.body,
    engine: engine,
  });

  // create two boxes and a ground
  var boxA = Bodies.rectangle(400, 200, 80, 80);
  var boxB = Bodies.rectangle(450, 50, 80, 80);
  var ground = Bodies.rectangle(400, 1050, 810, 1000, { isStatic: true });
  const lWall = Bodies.rectangle(-400, 305, 1000, 610, { isStatic: true });
  const rWall = Bodies.rectangle(1250, 305, 1000, 610, { isStatic: true });
  const tWall = Bodies.rectangle(405, -400, 810, 1000, { isStatic: true });
  const ballA = Bodies.circle(150, 0, 10, {
    restitution: 1,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 1,
  });
  const drum = Bodies.circle(405, 305, 60, {
    restitution: 1,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 1,
  });

  // add all of the bodies to the world
  World.add(engine.world, [ground, lWall, rWall, tWall, drum, ballA]);
  engine.world.gravity.y = 0;

  const mouse = Matter.Mouse.create(render.canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
  });

  World.add(engine.world, mouseConstraint);

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  Matter.Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    for (const pair of pairs) {
      if (pair.bodyA === lWall && pair.bodyB === ballA) {
        testTone(100);
      }
      if (pair.bodyA === ground && pair.bodyB === ballA) {
        testTone(200);
      }
      if (pair.bodyA === tWall && pair.bodyB === ballA) {
        testTone(300);
      }
      if (pair.bodyA === rWall && pair.bodyB === ballA) {
        testTone(400);
      }
      if (pair.bodyA === drum && pair.bodyB === ballA) {
        playDrum();
      }
      if (pair.bodyB === drum && pair.bodyA === ballA) {
        playDrum();
      }
    }
  });
};
