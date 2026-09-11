import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ShoppingBag, MoreHorizontal } from 'lucide-react-native';
import { colors, spacing, typography, radius } from '../../src/theme';
import { useProducts } from '../../src/hooks/useProducts';
import { CartItemCard } from '../../src/components/CartItemCard';
import { IconButton } from '../../src/components/IconButton';
import { Button } from '../../src/components/Button';
import { useCartStore } from '../../src/store/useCartStore';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { data: allProducts = [] } = useProducts();
  
  const { 
    items, 
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart, 
    subtotal, 
    deliveryFee, 
    discount, 
    total 
  } = useCartStore();

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <ShoppingBag color={colors.textInverse} size={40} strokeWidth={2} />
      </View>
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added anything to your cart yet. Discover your next pair of sneakers today.
      </Text>
      <Pressable 
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)/discover')}
      >
        <Text style={styles.exploreButtonText}>SHOP SNEAKERS</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerSubtitle}>SHOPPING BAG</Text>
        <Text style={styles.title}>My Cart</Text>
      </View>
      <IconButton icon={<MoreHorizontal color={colors.textPrimary} size={24} strokeWidth={2} />} />
    </View>
  );

  const renderOrderSummary = () => {
    if (items.length === 0) return null;
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>
            {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={styles.summaryValue}>-${discount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotalLabel}>Total</Text>
          <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      {items.length === 0 ? (
        <View style={styles.emptyWrapper}>
          {renderHeader()}
          {renderEmptyState()}
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderOrderSummary}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 220 }]} // Extra space for sticky button + tab bar
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const product = allProducts.find(p => p.id === item.productId);
              if (!product) return null;

              return (
                <CartItemCard
                  cartItem={item}
                  product={product}
                  onIncrease={() => increaseQuantity(item.productId, item.size)}
                  onDecrease={() => decreaseQuantity(item.productId, item.size)}
                  onRemove={() => removeFromCart(item.productId, item.size)}
                />
              );
            }}
          />
          
          <View style={[styles.stickyFooter, { paddingBottom: insets.bottom + 100 }]}>
            <Button 
              size="lg" 
              label="Proceed to Checkout"
              onPress={() => router.push('/checkout' as any)}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  emptyWrapper: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  header: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontFamily: typography.families.semibold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 3,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontFamily: typography.families.extrabold,
    color: colors.textPrimary,
    letterSpacing: -1.5,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginTop: -80,
  },
  emptyIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.textPrimary, // Dark contrast circle
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  emptyTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.xxl,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  exploreButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: radius.round,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  exploreButtonText: {
    fontFamily: typography.families.extrabold,
    fontSize: 12,
    color: colors.textInverse,
    letterSpacing: 1,
  },

  // Order Summary
  summaryContainer: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  summaryTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryLabel: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
  },
  summaryValue: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: spacing.sm,
  },
  summaryTotalLabel: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  summaryTotalValue: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },

  // Sticky Footer
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: radius.round,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  checkoutButtonText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textInverse,
  }
});
