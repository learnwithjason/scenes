/** @jsx h */
import { h } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { useTwitchChat } from "@socket-studio/preact";

// (x, y) directions for various commands
const directions = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export function Submarine() {
  const [image, setImage] = useState("submarine");
  const { currentCommand: command } = useTwitchChat(
    process.env.TOAST_TWITCH_CHANNEL
  );
  const ref = useRef();

  useEffect(() => {
    if (command && command.command === "pet") {
      console.log({ command });
      const pets = ["submarine", "dumpster-fire"];
      const newPet = pets.includes(command.args[0])
        ? command.args[0]
        : "submarine";

      setImage(newPet);
      return;
    }

    if (!command || !Object.keys(directions).includes(command.command)) {
      return;
    }

    const currentCommand = command.command;
    const wrapper = ref.current;
    const submarine = wrapper.querySelector(".submarine");
    const styles = window.getComputedStyle(submarine);

    const MOVEMENT_DISTANCE = 30;

    const wrapperRect = wrapper.getBoundingClientRect();
    const maxLeft = wrapperRect.width - 100;
    const maxTop = wrapperRect.height - 30;

    const currentLeft = parseInt(styles.getPropertyValue("left"), 10);
    const currentTop = parseInt(styles.getPropertyValue("top"), 10);

    const nextLeft =
      currentLeft + directions[currentCommand][0] * MOVEMENT_DISTANCE;
    const nextTop =
      currentTop + directions[currentCommand][1] * MOVEMENT_DISTANCE;

    if (nextLeft !== currentLeft && nextLeft > 0 && nextLeft < maxLeft) {
      submarine.style.left = `${nextLeft}px`;
      submarine.style.transform = `scaleX(${
        -1 * directions[currentCommand][0]
      })`;
    }
    if (nextTop !== currentTop && nextTop > 0 && nextTop < maxTop) {
      submarine.style.top = `${nextTop}px`;
      submarine.style.transform = `rotate(${
        -90 * directions[currentCommand][1]
      }deg)`;
    }
  }, [command]);

  return (
    <div ref={ref} className="submarine-wrapper">
      <img className="submarine" src={`/${image}.png`} alt={image} />
    </div>
  );
}
