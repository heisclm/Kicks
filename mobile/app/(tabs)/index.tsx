import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, RefreshControl } from 'react-native';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell } from 'lucide-react-native';
import Head from 'expo-router/head';
import {  useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { ProductCard } from '../../src/components/ProductCard';
import { ProductCardSkeleton } from '../../src/components/ProductCardSkeleton';
import { SneakerLoader } from '../../src/components/SneakerLoader';
import { ErrorState } from '../../src/components/ErrorState';
import { IconButton } from '../../src/components/IconButton';
import { BrandPill } from '../../src/components/BrandPill';
import { FeaturedCarousel } from '../../src/components/FeaturedCarousel';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useProducts } from '../../src/hooks/useProducts';
import { useNotifications } from '../../src/hooks/useNotifications';
import { useBrands } from '../../src/hooks/useTaxonomy';

export default function HomeScreen() {
  return (
    <>
      <Head>
        <title>Home - Kicks</title>
        <meta name="description" content="Explore the latest premium sneakers." />
      </Head>
      <HomeScreenContent />
    </>
  );
}

function HomeScreenContent() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  
  const { data: products = [], isLoading, isError, refetch: refetchProducts } = useProducts();
  const { data: notifications, refetch: refetchNotifications } = useNotifications();
  const { data: brands = [], refetch: refetchBrands } = useBrands();

  const hasUnread = notifications?.some(n => !n.isRead);

  const onRefresh = async () => {
    setRefreshing(true);
    if (refetchProducts) await refetchProducts();
    if (refetchNotifications) await refetchNotifications();
    if (refetchBrands) await refetchBrands();
    setRefreshing(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={[styles.productList, { justifyContent: 'center', minHeight: 300 }]}>
          <SneakerLoader label="Curating Kicks..." transparent />
        </View>
      );
    }

    if (isError) {
      return <ErrorState onRetry={refetch} />;
    }

    const filteredProducts = products.filter(item => {
      const activeBrand = brands.find(b => b.id === selectedBrand);
      const matchesBrand = !activeBrand || activeBrand.name.toLowerCase() === 'all' 
        ? true 
        : item.brand.toLowerCase() === activeBrand.name.toLowerCase();
      
      const isTrendingOrNew = item.isNew || item.rating >= 4.5;
      return matchesBrand && isTrendingOrNew;
    }).slice(0, 4);

    return (
      <View style={styles.productList}>
        {filteredProducts.map((item) => (
           <ProductCard 
             key={item.id} 
             item={item} 
             onPress={() => router.push(`/details/${item.id}`)} 
           />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <IconButton 
            icon={<Bell color={colors.iconDark} size={24} />} 
            onPress={() => router.push('/profile/notifications' as any)} 
            accessibilityLabel="Notifications"
          />
          {hasUnread && <View style={styles.notificationDot} />}
        </View>
        <Text style={styles.headerTitle}>KICKS</Text>
        <IconButton 
          icon={<Search color={colors.iconDark} size={24} />} 
          onPress={() => router.push('/search' as any)} 
          accessibilityLabel="Search sneakers"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />}>
        
        
          {/* Featured Banner Carousel */}
          <FeaturedCarousel products={products} />

          {/* Brands */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsContainer} contentContainerStyle={{ paddingHorizontal: spacing.xxl }}>
          {brands.map((brand) => (
            <BrandPill 
              key={brand.id}
              brand={brand}
              isSelected={selectedBrand === brand.id}
              onPress={() => setSelectedBrand(brand.id)}
            />
          ))}
        </ScrollView>

        {/* Product List */}
        {renderContent()}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.families.extrabold,
    color: colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1.5,
    borderColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: spacing.huge,
  },
  featuredContainer: {
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.xl,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  featuredBanner: {
    borderRadius: radius.xxxl,
    flexDirection: 'row',
    height: 180,
  },
  featuredContent: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
  },
  featuredLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: typography.sizes.xs,
    marginBottom: spacing.sm,
  },
  featuredTitle: {
    color: colors.textInverse,
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.extrabold,
    marginBottom: spacing.lg,
  },
  shopNowButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: colors.textPrimary,
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.xs,
  },
  featuredImage: {
    width: 200,
    height: 200,
    position: 'absolute',
    right: -40,
    top: -10,
    transform: [{ rotate: '-15deg' }]
  },
  brandsContainer: {
    marginTop: spacing.xxxl,
    flexDirection: 'row',
  },
  productList: {
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.xxxl,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  }
});
