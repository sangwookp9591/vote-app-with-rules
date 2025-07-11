'use client';
import React, { useState } from 'react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>({ items, itemHeight, height, renderItem }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const totalCount = items.length;
  const visibleCount = Math.ceil(height / itemHeight);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight));
  const endIndex = Math.min(totalCount, startIndex + visibleCount);
  const visibleItems = items.slice(startIndex, endIndex);

  const topPadding = startIndex * itemHeight;
  const bottomPadding = (totalCount - endIndex) * itemHeight;

  return (
    <div
      style={{ overflowY: 'auto', height, position: 'relative' }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: topPadding }} />
      {visibleItems.map((item, i) => (
        <div key={startIndex + i} style={{ height: itemHeight }}>
          {renderItem(item, startIndex + i)}
        </div>
      ))}
      <div style={{ height: bottomPadding }} />
    </div>
  );
}
