import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Helmet } from 'react-helmet';
import {
  createSocketStudioClient,
  SocketStudioProvider,
  useTwitchChat,
} from '@socket-studio/preact';

function Video() {
  const [event, setEvent] = useState(false);
  const { events } = useTwitchChat(
    'nickmercs',
    // process.env.TOAST_TWITCH_CHANNEL,
  );

  // TODO use subscription events instead
  useEffect(() => {
    const [event] = events.slice(-1);

    console.log({ event });

    if (!event || !event.type) {
      return;
    }

    setEvent(event);
    // setTimeout(() => {
    //   setEvent(false);
    // }, 10000);
  }, [events.length]);

  return (
    event && (
      <div class="subscriber-overlay-wrapper">
        <p>{event.details}</p>
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
        <link rel="stylesheet" href="/styles/stream-blitz-overlay.css" />
      </Helmet>
      <Video />
    </SocketStudioProvider>
  );
}
