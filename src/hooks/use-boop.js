import { useEffect, useRef, useState } from 'preact/hooks';
import { useTwitchChat } from './use-twitch-chat.js';

let engine;
let runner;

export function useBoop() {
  const ref = useRef();
  const [createBoop, setCreateBoop] = useState(false);
  const { chat } = useTwitchChat('jlengstorf');

  console.log({ chat });

  useEffect(() => {
    if (!window || !window.Matter || createBoop) {
      return;
    }

    if (!engine) {
      engine = window.Matter.Engine.create();
    }

    if (!runner) {
      runner = window.Matter.Runner.create();
    }

    setCreateBoop((url) => {
      const boop = window.Matter.Bodies.circle(
        Math.round(Math.random() * 1280),
        -30,
        20,
        {
          angle: Math.PI * (Math.random() * 2 - 1),
          friction: 0.001,
          frictionAir: 0.01,
          restitution: 0.8,
          render: {
            sprite: {
              texture: url,
              xScale: 0.5,
              yScale: 0.5,
            },
          },
        },
      );

      setTimeout(() => {
        window.Matter.World.remove(engine.world, boop);
      }, 30000);

      window.Matter.World.add(engine.world, [boop]);
    });

    const canvas = ref.current;
    const height = ref.current.clientHeight;
    const width = ref.current.clientWidth;

    const render = window.Matter.Render.create({
      element: 'div',
      canvas,
      engine: engine,
      options: {
        height,
        width,
        background: 'transparent',
        wireframes: false,
      },
    });

    const boundaries = {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'transparent',
      },
    };
    const ground = window.Matter.Bodies.rectangle(
      width / 2,
      height,
      width + 20,
      4,
      boundaries,
    );
    const leftWall = window.Matter.Bodies.rectangle(
      0,
      height / 2,
      4,
      height + 60,
      boundaries,
    );
    const rightWall = window.Matter.Bodies.rectangle(
      width,
      height / 2,
      4,
      height + 60,
      boundaries,
    );

    window.Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    window.Matter.Render.run(render);
    window.Matter.Runner.run(runner, engine);
  }, [ref]);

  useEffect(() => {
    if (!window) {
      return;
    }

    const [message] = chat.slice(-1);
    if (!message?.emotes) return;

    message.emotes.forEach((emote) => {
      console.log({ emote });
      if (emote.name === 'jlengsBOOP') {
        emote.locations.forEach(() => {
          if (typeof createBoop === 'function') {
            createBoop(emote.images.large);
          }
        });
      }
    });
  }, [chat.length]);

  return ref;
}
