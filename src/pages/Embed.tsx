import { useEffect } from 'react';
import Index from './Index';

export default function Embed() {
  useEffect(() => {
    // Add any embed-specific initialization here
    document.body.classList.add('embedded');
    
    return () => {
      document.body.classList.remove('embedded');
    };
  }, []);

  return <Index />;
}