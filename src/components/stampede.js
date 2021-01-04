import { h } from 'preact';
import { useEffect } from 'preact/hooks';

export function Stampede() {
  useEffect(() => {
    import('/web_modules/splitting.js').then((importedModule) => {
      const splitting = importedModule.default;

      splitting({ by: 'chars' });
    });
  }, []);

  return (
    <div className="stampede">
      <p data-splitting>STAMPEDE!</p>
    </div>
  );
}
