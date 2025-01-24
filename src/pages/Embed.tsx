import { useEffect } from 'react';
import Index from './Index';

export default function Embed() {
  useEffect(() => {
    // Add embedded class to body for styling
    document.body.classList.add('embedded');
    
    // Handle messages from parent window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'theme') {
        // Handle theme updates if needed
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      document.body.classList.remove('embedded');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <div className="embedded-calculator">
      <Index />
    </div>
  );
}