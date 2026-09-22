import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { Skeleton } from './Skeleton';
import { colors, radius, spacing } from '../theme';

export function ProductGridCardSkeleton() {
    const { theme } = useStyles();
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Skeleton width={30} height={14} borderRadius={theme.radius.sm} />
        <Skeleton width={20} height={20} borderRadius={theme.radius.round} />
      </View>
      
      <View style={styles.imageContainer}>
        <Skeleton width="80%" height={90} borderRadius={theme.radius.md} />
      </View>

      <View style={styles.details}>
        <Skeleton width="40%" height={12} style={{ marginBottom: 4 }} />
        <Skeleton width="80%" height={16} style={{ marginBottom: theme.spacing.sm }} />
        
        <View style={styles.bottomRow}>
          <Skeleton width={50} height={16} />
          <Skeleton width={24} height={24} borderRadius={theme.radius.round} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.sm,
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
    marginVertical: theme.spacing.xs,
  },
  details: {
    marginTop: theme.spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
}));
