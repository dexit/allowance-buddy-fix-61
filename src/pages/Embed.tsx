import { useEffect } from 'react';
import Index from './Index';

export default function Embed() {
  useEffect(() => {
    document.body.classList.add('embedded');
    
    return () => {
      document.body.classList.remove('embedded');
    };
  }, []);

  return (
    <div className="embedded-calculator">
      <Index />
    </div>
  );
}