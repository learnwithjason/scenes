/** @jsx h */
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useTwitchChat } from '@socket-studio/preact';

export function Submarine() {
  const [image, setImage] = useState('submarine');
  const { currentCommand: command } = useTwitchChat(
    process.env.TOAST_TWITCH_CHANNEL,
  );
  const ref = useRef();

  useEffect(() => {
    if (command && command.command === 'pet') {
      console.log({ command });
      const pets = ['submarine', 'dumpster-fire'];
      const newPet = pets.includes(command.args[0])
        ? command.args[0]
        : 'submarine';

      setImage(newPet);
      return;
    }

    if (
      !command ||
      !['up', 'down', 'left', 'right'].includes(command.command)
    ) {
      return;
    }

    const wrapper = ref.current;
    const submarine = wrapper.querySelector('.submarine');
    const styles = window.getComputedStyle(submarine);

    const MOVEMENT_DISTANCE = 30;

    switch (command.command) {
      case 'left':
        const currentLeft = parseInt(styles.getPropertyValue('left')); // => '0px' -> 0
        const newLeft =
          currentLeft > MOVEMENT_DISTANCE ? currentLeft - MOVEMENT_DISTANCE : 0;
        submarine.style.left = `${newLeft}px`;
        submarine.style.transform = 'scaleX(1)';
        return;

      case 'right':
        const current = parseInt(styles.getPropertyValue('left'));
        const maxLeft = wrapper.getBoundingClientRect().width - 100;
        const newLeft2 =
          current < maxLeft - MOVEMENT_DISTANCE
            ? current + MOVEMENT_DISTANCE
            : maxLeft;

        submarine.style.left = `${newLeft2}px`;
        submarine.style.transform = 'scaleX(-1)';
        return;

      case 'up':
      case 'down':
        const direction = command.command === 'up' ? -1 : 1;
        const distance = MOVEMENT_DISTANCE * direction;

        const currentTop = parseInt(styles.getPropertyValue('top'));
        const maxTop = wrapper.getBoundingClientRect().height - 30;

        let newTop = currentTop;
        if (currentTop + distance < maxTop && currentTop + distance > 0) {
          newTop = currentTop + distance;
        }

        submarine.style.top = `${newTop}px`;
        return;
    }
  }, [command]);

  return (
    <div ref={ref} className="submarine-wrapper">
      <img className="submarine" src={`/${image}.png`} alt={image} />
    </div>
  );
}
