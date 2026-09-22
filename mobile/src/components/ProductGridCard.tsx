import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Product } from '../types';
import { colors, spacing, radius, typography } from '../theme';
import { useWishlistStore } from '../store/useWishlistStore';

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

interface ProductGridCardProps {
  item: Product;
  onPress: () => void;
}

export function ProductGridCard({ item, onPress }: ProductGridCardProps) {
    const theme = { colors, spacing, radius, typography };
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(item.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);

  const handleToggleWishlist = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleWishlist(item.id);
  };

  return (
    <Pressable 
      style={[styles.card, theme.shadows.soft]} 
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${item.name}`}
    >
      {/* Top Bar: New tag & Discount */}
      <View style={styles.topRow}>
        {item.isNew ? (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        ) : <View />}
        {item.discount ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}% OFF</Text>
          </View>
        ) : <View />}
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <AnimatedExpoImage 
          sharedTransitionTag={`image-${item.id}`}
          source={item.image} 
          style={styles.image} 
          contentFit="contain"
          cachePolicy="disk"
        />
      </View>
      
      {/* Product Details */}
      <View style={styles.details}>
        <Text style={styles.gender} numberOfLines={1}>{item.gender?.toUpperCase() || item.subtitle.toUpperCase()}</Text>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.bottomRow}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Pressable 
            hitSlop={15} 
            style={styles.wishlistButton}
            onPress={handleToggleWishlist}
            accessibilityRole="button"
            accessibilityLabel={`${isInWishlist ? 'Remove' : 'Add'} ${item.name} from wishlist`}
          >
            <Heart 
              color={isInWishlist ? colors.primary : colors.textMuted} 
              size={16} 
              strokeWidth={2} 
              fill={isInWishlist ? colors.primary : 'transparent'}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
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
  newBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  newText: {
    color: colors.textInverse,
    fontFamily: typography.families.extrabold,
    fontSize: 8,
  },
  imageContainer: {
    height: 110,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
    transform: [{ rotate: '-15deg' }, { scale: 1.1 }],
  },
  details: {
    paddingTop: spacing.xs,
  },
  brand: {
    fontFamily: typography.families.semibold,
    fontSize: 9,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  wishlistButton: {
    padding: 4,
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.round,
  },
  discountBadge: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  discountText: {
    fontFamily: typography.families.extrabold,
    fontSize: 9,
    color: colors.textPrimary,
  },
  gender: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  }
});
