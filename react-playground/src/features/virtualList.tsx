import type React from 'react';
import { useThrottledState } from '../helpers/useThrottle';

type VirtualListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  height: number;
  itemHeight: number;
};

export function VirtualList<T>({
  items,
  renderItem,
  height,
  itemHeight,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useThrottledState(0, 16);

  const visibleCount = Math.ceil(height / itemHeight);
  const overscan = 5;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    startIndex + visibleCount + overscan * 2
  );

  const visibleItems = items.slice(startIndex, endIndex);

  const offsetY = startIndex * itemHeight;
  const totalHeight = itemHeight * items.length;

  return (
    <div
      style={{ height, overflowY: 'auto' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            willChange: 'transform',
          }}
        >
          {visibleItems.map((item) => renderItem(item))}
        </div>
      </div>
    </div>
  );
}
