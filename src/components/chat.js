/** @jsx h */
import { h } from 'preact';
import { useTwitchChat } from '@socket-studio/preact';
import rehype from 'rehype';
import sanitize from 'rehype-sanitize';

function getUsernameColor(roles) {
  if (roles.includes('BROADCASTER')) {
    return 'var(--yellow)';
  }

  if (roles.includes('MODERATOR')) {
    return 'var(--pink-text)';
  }

  if (roles.includes('SUBSCRIBER')) {
    return 'var(--blue)';
  }

  return 'var(--text)';
}

export function Chat() {
  const { chat } = useTwitchChat(process.env.TOAST_TWITCH_CHANNEL);

  return (
    <div className="chat">
      <ul className="chat-container">
        {chat.map((message) => {
          if (!message.html) {
            return;
          }

          const text = rehype()
            .data('settings', { fragment: true })
            .use(sanitize, {
              strip: ['script'],
              protocols: {
                src: ['https'],
              },
              tagNames: ['img', 'marquee'],
              attributes: {
                img: ['src'],
                '*': ['alt'],
              },
            })
            .processSync(message.html)
            .toString();

          if (!text.length) {
            return;
          }

          return (
            <li
              key={`${message.time}:${message.author.username}`}
              className="chat-message"
            >
              <strong style={{ color: getUsernameColor(message.author.roles) }}>
                {message.author.username}:
              </strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: text }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
