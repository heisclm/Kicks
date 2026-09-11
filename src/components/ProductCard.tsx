import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
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
  // Determine background color based on product color/brand from mock
  let bgColor = colors.cardPeach;
  if (item.color === '#E04A3A') bgColor = colors.cardRed;
  if (item.color === '#7AC06D') bgColor = colors.cardGreen;

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

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxxl,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
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
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.extrabold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    width: '60%',
  },
  priceContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
  },
  price: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
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
    top: spacing.lg,
    right: spacing.lg,
    width: 60,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountText: {
    fontFamily: typography.families.extrabold,
    fontSize: 10,
    color: colors.textPrimary,
  },
  gender: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 1,
    marginBottom: 4,
  }
});
