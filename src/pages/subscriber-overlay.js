import { h } from 'preact';
import { Helmet } from 'react-helmet';

export default function SubscriberOverlay() {
  return (
    <div class="subscriber-overlay-wrapper">
      <Helmet>
        <link rel="stylesheet" href="/styles/subscriber-overlay.css" />
      </Helmet>
      <video
        src="https://res.cloudinary.com/jlengstorf/video/upload/w_600,q_auto,f_auto/v1610042569/lwj/subscription-overlay.mp4"
        title="tiny Jason wanders out on screen and is delighted by lots of floating hearts"
        autoplay
        muted
      ></video>
    </div>
  );
}
