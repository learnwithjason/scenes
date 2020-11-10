/** @jsx h */
import { h } from 'preact';
import { useTwitchChat } from '@socket-studio/preact';
// import { useTwitchChat } from '../socket-studio/index.js';

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
  const { chat } = useTwitchChat('jlengstorf');

  console.log({ chat });

  return (
    <div className="chat">
      <ul className="chat-container">
        {chat.map((message) => {
          return (
            <li
              key={`${message.time}:${message.author.username}`}
              className="chat-message"
            >
              <strong style={{ color: getUsernameColor(message.author.roles) }}>
                {message.author.username}:
              </strong>{' '}
              <span dangerouslySetInnerHTML={{ __html: message.html }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
