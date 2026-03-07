import { useCallback, useState, type ChangeEvent } from 'react';
import './App.css';
import { PostCard, type Post } from './features/postFeed';
import {
  useDebouncedState,
  useThrottle,
  useThrottledState,
} from './helpers/try';

const post = {
  name: 'Test Post Name',
  description: 'awdwadawdawdawdawdawd',
  createdAt: new Date(),
  createdBy: 'Brani',
};
const testPosts = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  ...post,
}));

function App() {
  const renderItem = useCallback((post: Post) => <PostCard post={post} />, []);

  const [text, setText] = useState('');

  const debouncedText = useDebouncedState(text, 1000);
  const [throttledSate, setThrottledState] = useThrottledState(text, 1000);
  const throttledLogs = useThrottle((text) => {
    console.log(text);
  }, 1000);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setThrottledState(e.target.value);
    throttledLogs(e.target.value);
  };

  return (
    <>
      {/* <VirtualList
        height={973}
        itemHeight={150}
        items={testPosts}
        renderItem={renderItem}
      /> */}
      {/* <MultiStepForm /> */}
      {/* <PostFeed /> */}
      <div>{debouncedText}</div>
      <input type="text" value={text} onChange={handleChange} />
      <div>{throttledSate}</div>
      {/* <BeginChat /> */}
    </>
  );
}

export default App;
