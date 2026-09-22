import React from 'react';
import { View } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { Skeleton } from './Skeleton';
import { colors, radius, spacing } from '../theme';

export function ProductCardSkeleton() {
    const { theme } = useStyles();
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View>
          <Skeleton width="50%" height={24} style={{ marginBottom: theme.spacing.xs }} />
          <Skeleton width="40%" height={24} />
        </View>
        
        <Skeleton width={80} height={36} borderRadius={theme.radius.xl} style={{ marginTop: theme.spacing.lg }} />
      </View>

      <View style={styles.bagIconContainer}>
        <Skeleton width={30} height={30} borderRadius={theme.radius.round} />
      </View>
      
      {/* Mock Image area */}
      <Skeleton 
        width={180} 
        height={130} 
        borderRadius={theme.radius.xl} 
        style={styles.imagePlaceholder} 
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.radius.xxxl,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
    height: 200,
    backgroundColor: theme.colors.surfaceVariant,
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
    top: theme.spacing.xl,
    right: theme.spacing.xl,
    zIndex: 2,
  },
  imagePlaceholder: {
    position: 'absolute',
    right: -20,
    bottom: -10,
    transform: [{ rotate: '-15deg' }],
  },
}));
