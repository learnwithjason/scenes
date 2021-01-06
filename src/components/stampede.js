import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';

export function Stampede() {
  const [initialized, setInitialized] = useState(false);
  const [text, setText] = useState();

  useEffect(() => {
    if (initialized) {
      return;
    }

    import('/web_modules/splitting.js').then((importedModule) => {
      const splitting = importedModule.default;

      // doing it this way avoids an issue where Splitting and React get
      // out of sync and end up duplicating text
      const htmlToSplit = `
        <p data-splitting>STAMPEDE!</p>
      `;

      setText(splitting.html({ content: htmlToSplit, by: 'chars' }));
      setInitialized(true);
    });
  }, []);

  return (
    <div className="stampede" dangerouslySetInnerHTML={{ __html: text }} />
  );
}
