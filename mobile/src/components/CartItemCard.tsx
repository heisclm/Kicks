import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { Trash2, Minus, Plus } from 'lucide-react-native';
import { CartItem, Product } from '../types';
import { colors, spacing, radius, typography, shadows } from '../theme';

interface CartItemCardProps {
  cartItem: CartItem;
  product: Product;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemCard({ cartItem, product, onIncrease, onDecrease, onRemove }: CartItemCardProps) {
  return (
    <View style={[styles.card, shadows.soft]}>
      <View style={styles.imageContainer}>
        <ExpoImage source={product.image} style={styles.image} contentFit="contain" cachePolicy="disk" transition={300} />
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.topRow}>
          <View style={styles.titleArea}>
            <Text style={styles.brand} numberOfLines={1}>{product.brand.toUpperCase()}</Text>
            <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          </View>
          <Pressable 
            onPress={onRemove} 
            hitSlop={10} 
            style={styles.removeButton}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${product.name} from cart`}
          >
            <Trash2 color={colors.textMuted} size={18} strokeWidth={2} />
          </Pressable>
        </View>

        <Text style={styles.size}>Size {cartItem.size}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>${(product.price * cartItem.quantity).toFixed(2)}</Text>
          
          <View style={styles.quantitySelector}>
            <Pressable 
              onPress={onDecrease} 
              style={styles.qtyButton} 
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Decrease quantity"
            >
              <Minus color={colors.textPrimary} size={14} strokeWidth={2.5} />
            </Pressable>
            <Text style={styles.qtyText} accessibilityLabel={`Quantity ${cartItem.quantity}`}>{cartItem.quantity}</Text>
            <Pressable 
              onPress={onIncrease} 
              style={styles.qtyButton} 
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Increase quantity"
            >
              <Plus color={colors.textPrimary} size={14} strokeWidth={2.5} />
            </Pressable>
          </View>
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
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 90,
    height: 90,
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '110%',
    height: '110%',
    transform: [{ rotate: '-15deg' }],
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
    height: 90,
    paddingVertical: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleArea: {
    flex: 1,
    paddingRight: spacing.sm,
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
  },
  removeButton: {
    padding: 2,
  },
  size: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  qtyButton: {
    padding: 4,
  },
  qtyText: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    marginHorizontal: spacing.md,
  }
});
