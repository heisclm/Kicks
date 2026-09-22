import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export function CartAddIcon({ color = 'currentColor', size = 24, strokeWidth = 2.5 }: { color?: string, size?: number, strokeWidth?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="9" cy="21" r="1" />
      <Circle cx="20" cy="21" r="1" />
      <Path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      <Path d="M13.5 10.5h5" />
      <Path d="M16 8v5" />
    </Svg>
  );
}
