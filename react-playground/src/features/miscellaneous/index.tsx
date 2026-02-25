import { useEffect, useState } from 'react';
import { useDebounce } from '../../helpers/useDebounce';
import { useThrottle } from '../../helpers/useThrottle';

export function Random() {
  const [text, setText] = useState('');

  const debouncedText = useDebounce((value: string) => {
    setText(value);
  }, 300);

  const handleScroll = useThrottle(() => {
    console.log(document.documentElement.scrollTop);
  }, 1000);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => debouncedText(e.target.value)}
    />
  );
}
