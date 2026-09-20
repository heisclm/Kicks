import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import Animated from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import { Product } from '../types';
import { colors, spacing, radius, typography } from '../theme';

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

interface ProductCardProps {
  item: Product;
  onPress: () => void;
}

export function ProductCard({ item, onPress }: ProductCardProps) {
    const { theme } = useStyles();
  // Determine background color based on product color/brand from mock
  let bgColor = theme.colors.cardPeach;
  if (item.color === '#E04A3A') bgColor = theme.colors.cardRed;
  if (item.color === '#7AC06D') bgColor = theme.colors.cardGreen;

  return (
    <Pressable 
      style={[styles.card, { backgroundColor: bgColor }]} 
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name}`}
    >
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.gender}>{item.gender?.toUpperCase() || item.subtitle.toUpperCase()}</Text>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
      
      <AnimatedExpoImage 
        sharedTransitionTag={`image-${item.id}`}
        source={item.image} 
        style={styles.image} 
        contentFit="contain" 
        cachePolicy="disk"
      />
      
      {item.discount ? (
        <View style={styles.bagIconContainer}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: {
    borderRadius: theme.radius.xxxl,
    padding: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
    height: 200,
    position: 'relative',
  },
  infoContainer: {
    flex: 1,
    zIndex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    width: '60%',
  },
  priceContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    alignSelf: 'flex-start',
  },
  price: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  image: {
    position: 'absolute',
    width: 250,
    height: 180,
    right: -50,
    bottom: -20,
    transform: [{ rotate: '-15deg' }],
  },
  bagIconContainer: {
    position: 'absolute',
    top: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 60,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: 10,
    color: theme.colors.textPrimary,
  },
  gender: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 10,
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 1,
    marginBottom: 4,
  }
}));
