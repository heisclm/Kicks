import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import { Skeleton } from './Skeleton';
import { colors, spacing, radius, typography } from '../theme';

export function ProductGridCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Skeleton width={30} height={14} borderRadius={radius.sm} />
        <Skeleton width={20} height={20} borderRadius={radius.round} />
      </View>
      
      <View style={styles.imageContainer}>
        <Skeleton width="80%" height={90} borderRadius={radius.md} />
      </View>

      <View style={styles.details}>
        <Skeleton width="40%" height={12} style={{ marginBottom: 4 }} />
        <Skeleton width="80%" height={16} style={{ marginBottom: spacing.sm }} />
        
        <View style={styles.bottomRow}>
          <Skeleton width={50} height={16} />
          <Skeleton width={24} height={24} borderRadius={radius.round} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.sm,
    flex: 1,
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  imageContainer: {
    height: 110,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  details: {
    marginTop: spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
});
