import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, radius, typography } from '../theme';

export function ProductCardSkeleton() {
    const theme = { colors, spacing, radius, typography };
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View>
          <Skeleton width="50%" height={24} style={{ marginBottom: spacing.xs }} />
          <Skeleton width="40%" height={24} />
        </View>
        
        <Skeleton width={80} height={36} borderRadius={radius.xl} style={{ marginTop: spacing.lg }} />
      </View>

      <View style={styles.bagIconContainer}>
        <Skeleton width={30} height={30} borderRadius={radius.round} />
      </View>
      
      {/* Mock Image area */}
      <Skeleton 
        width={180} 
        height={130} 
        borderRadius={radius.xl} 
        style={styles.imagePlaceholder} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxxl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    height: 200,
    backgroundColor: colors.surfaceVariant,
    position: 'relative',
    overflow: 'hidden',
  },
  infoContainer: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'space-between',
  },
  bagIconContainer: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    zIndex: 2,
  },
  imagePlaceholder: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    transform: [{ rotate: '-15deg' }],
  },
});
