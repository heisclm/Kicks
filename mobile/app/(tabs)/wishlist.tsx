import React from 'react';
import { View, Text, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter, Head } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { colors, spacing, typography, radius } from '../../src/theme';
import { ProductGridCard } from '../../src/components/ProductGridCard';
import { useWishlistStore } from '../../src/store/useWishlistStore';
import { useCartStore } from '../../src/store/useCartStore';
import { useProducts } from '../../src/hooks/useProducts';

export default function WishlistScreen() {
  return (
    <>
      <Head>
        <title>Wishlist - Kicks</title>
      </Head>
      <WishlistScreenContent />
    </>
  );
}

function WishlistScreenContent() {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const savedProductIds = useWishlistStore((state) => state.savedProductIds);
  const addToCart = useCartStore((state) => state.addToCart);
  
  const { data: allProducts = [] } = useProducts();

  // Derive full products from the saved IDs
  const savedProducts = allProducts.filter(p => savedProductIds.includes(p.id));

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Heart color={theme.colors.textInverse} size={40} strokeWidth={2} fill={theme.colors.textInverse} />
      </View>
      <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Curate your personal KICKS collection. Tap the heart icon on any sneaker to save it here for later.
      </Text>
      <Pressable 
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)/discover')}
      >
        <Text style={styles.exploreButtonText}>DISCOVER SNEAKERS</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerSubtitle}>CURATED BY YOU</Text>
        <Text style={styles.title}>Wishlist</Text>
      </View>
      {savedProducts.length > 0 && (
        <View style={styles.itemCountPill}>
          <Text style={styles.itemCountText}>
            {savedProducts.length} {savedProducts.length === 1 ? 'ITEM' : 'ITEMS'}
          </Text>
        </View>
      )}
    </View>
  );

  const { width } = useWindowDimensions();
  const numColumns = width > 1000 ? 4 : width > 600 ? 3 : 2;

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.md }]}>
      {savedProducts.length === 0 ? (
        <View style={styles.emptyWrapper}>
          {renderHeader()}
          {renderEmptyState()}
        </View>
      ) : (
        <FlashList estimatedItemSize={250}
          key={numColumns}
          data={savedProducts}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          
          ListHeaderComponent={renderHeader}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} // Space for tab bar
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductGridCard 
                item={item} 
                onPress={() => router.push(`/details/${item.id}`)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  emptyWrapper: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  headerSubtitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 3,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 34,
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
    letterSpacing: -1.5,
  },
  itemCountPill: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  itemCountText: {
    fontSize: 10,
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    marginTop: -40, // Reduced offset
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  emptyTitle: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: 28,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
  },
  exploreButton: {
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.xxxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  exploreButtonText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: 12,
    color: theme.colors.textInverse,
    letterSpacing: 1.5,
  }
}));
