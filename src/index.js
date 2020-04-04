console.log("hello");

import Matter from "matter-js";
import Tone from "tone";

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

var synthTest = new Tone.PolySynth(50, Tone.Synth, {
  oscillator: {
    type: "fmsquare",
    modulationType: "sawtooth",
    modulationIndex: 3,
    harmonicity: 3.4,
  },
  envelope: {
    attack: 0.001,
    decay: 0.5,
    sustain: 2,
    release: 5,
  },
}).toMaster();

const testTone = (note) => {
  synthTest.voices.map(
    (voice) => (voice.oscillator.modulationIndex.value = Math.random() * 100)
  );
  synthTest.triggerAttackRelease(note, "8n");
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
  var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  const lWall = Bodies.rectangle(0, 305, 40, 610, { isStatic: true });
  const rWall = Bodies.rectangle(810, 305, 40, 610, { isStatic: true });
  const tWall = Bodies.rectangle(405, 0, 810, 60, { isStatic: true });
  const ballA = Bodies.circle(150, 0, 50, {
    restitution: 1,
  });

  // add all of the bodies to the world
  World.add(engine.world, [ground, lWall, rWall, tWall, ballA]);
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
  testTone();

  Matter.Events.on(engine, "collisionStart", (event) => {
    const pairs = event.pairs;
    for (const pair of pairs) {
      if (pair.bodyA === lWall && pair.bodyB === ballA) {
        testTone("C4");
      }
      if (pair.bodyA === ground && pair.bodyB === ballA) {
        testTone("G3");
      }
      if (pair.bodyA === tWall && pair.bodyB === ballA) {
        testTone("E4");
      }
      if (pair.bodyA === rWall && pair.bodyB === ballA) {
        testTone("D4");
      }
    }
  });
};
