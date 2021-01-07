import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Helmet } from 'react-helmet';
import {
  createSocketStudioClient,
  SocketStudioProvider,
  useTwitchChat,
} from '@socket-studio/preact';

function Video() {
  const [visible, setVisible] = useState(false);
  const { events, currentCommand } = useTwitchChat(
    process.env.TOAST_TWITCH_CHANNEL,
  );

  const commandTime = (currentCommand && currentCommand.time) || false;

  console.log({ events, currentCommand });

  // TODO use subscription events instead
  useEffect(() => {
    if (!commandTime) {
      return;
    }

    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 10000);
  }, [commandTime]);

  return (
    visible && (
      <div class="subscriber-overlay-wrapper">
        <video
          src="https://res.cloudinary.com/jlengstorf/video/upload/w_600,q_auto,f_auto/v1610042569/lwj/subscription-overlay.mp4"
          title="tiny Jason wanders out on screen and is delighted by lots of floating hearts"
          autoplay
          muted
          loop
          playsinline
        ></video>
      </div>
    )
  );
}

export default function SubscriberOverlay() {
  const client = createSocketStudioClient(process.env.TOAST_SOCKET_STUDIO_URL);

  return (
    <SocketStudioProvider client={client}>
      <Helmet>
        <link rel="stylesheet" href="/styles/subscriber-overlay.css" />
      </Helmet>
      <Video />
    </SocketStudioProvider>
  );
}
