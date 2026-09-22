export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28,
    huge: 32,
    mega: 120, // For the giant watermark
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
  families: {
    regular: 'font-regular',
    semibold: 'font-semibold',
    extrabold: 'font-extrabold',
  }
};
