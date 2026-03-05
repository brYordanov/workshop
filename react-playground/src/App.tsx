import { useState, type ChangeEvent } from 'react';
import './App.css';
import { BeginChat } from './features/chat';
import { useFancyDeb } from './helpers/useDebounce';

function App() {
  const [text, setText] = useState('');
  // const debouncedText = useDebouncedState(text);
  const { debouncedFn: debouncedLogs } = useFancyDeb(
    (text) => console.log(text),
    1000
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setText(e.target.value);
    debouncedLogs(e.target.value);
  }
  return (
    <>
      {/* <div>{debouncedText}</div> */}
      <input type="text" value={text} onChange={handleChange} />
      <BeginChat />
    </>
  );
}

export default App;
