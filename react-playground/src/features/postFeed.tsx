import { useInfiniteScroll } from '../helpers/useInifiniteScroll';

export type Post = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  createdBy: string;
};

export function PostFeed() {
  const {
    items: posts,
    sentinelRef,
    isLoading,
  } = useInfiniteScroll<Post>(async (page: number): Promise<Post[]> => {
    const response = await fetch(`http://localhost:3214?page=${page}`);
    const newPosts = await response.json();

    return newPosts;
  });

  return (
    <div>
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
      <div ref={sentinelRef} style={{ height: 1 }}></div>
      {isLoading && <div>loading....</div>}
    </div>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <div>
      <h3>{post.name}</h3>
      <h4>{post.description}</h4>
      <div style={{ display: 'flex', gap: '10px' }}>
        <p>{post.id}</p>
        <p>{String(post.createdAt)}</p>
        <p>{post.createdBy}</p>
      </div>
    </div>
  );
}
