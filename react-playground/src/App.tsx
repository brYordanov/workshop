import { useCallback } from 'react';
import './App.css';
import { PostCard, type Post } from './features/postFeed';
import { VirtualList } from './features/virtualList';

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
  return (
    <>
      <VirtualList
        height={973}
        itemHeight={150}
        items={testPosts}
        renderItem={renderItem}
      />
      {/* <MultiStepForm /> */}
      {/* <PostFeed /> */}
      {/* <div>{debouncedText}</div> */}
      {/* <input type="text" value={text} onChange={handleChange} /> */}
      {/* <BeginChat /> */}
    </>
  );
}

export default App;
