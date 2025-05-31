import { useEffect, useState } from 'react';

const AdsTxtPage = () => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch('/ads.txt')
      .then(response => response.text())
      .then(text => setContent(text))
      .catch(error => console.error('Error loading ads.txt:', error));
  }, []);

  return (
    <pre className="whitespace-pre-wrap break-words p-4">
      {content}
    </pre>
  );
};

export default AdsTxtPage; 