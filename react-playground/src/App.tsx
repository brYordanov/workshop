import { useCallback } from 'react';
import './App.css';
import { PostCard, type Post } from './features/postFeed';

const post = {
  name: 'Test Post Name',
  description: 'awdwadawdawdawdawdawd',
  createdAt: new Date(),
  createdBy: 'Brani',
};
const testPosts = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  ...post,
}));

function App() {
  const renderItem = useCallback(
    (post: Post) => <PostCard post={post} key={post.id} />,
    []
  );

  return (
    <>
      {/* <VirtualList
        height={1000}
        itemHeight={200}
        items={testPosts}
        renderItem={renderItem}
      /> */}
      {/* <MultiStepForm /> */}
      {/* <PostFeed /> */}
      {/* <div>{debouncedText}</div>
      <input type="text" value={text} onChange={handleChange} />
      <div>{throttledSate}</div> */}
      {/* <BeginChat /> */}
    </>
  );
}

export default App;
