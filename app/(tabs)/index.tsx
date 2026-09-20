import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { brands } from '../../src/data';
import { LinearGradient } from 'expo-linear-gradient';

import { ProductCard } from '../../src/components/ProductCard';
import { ProductCardSkeleton } from '../../src/components/ProductCardSkeleton';
import { SneakerLoader } from '../../src/components/SneakerLoader';
import { ErrorState } from '../../src/components/ErrorState';
import { IconButton } from '../../src/components/IconButton';
import { BrandPill } from '../../src/components/BrandPill';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useProducts } from '../../src/hooks/useProducts';
import { useNotifications } from '../../src/hooks/useNotifications';

export default function HomeScreen() {
    const { theme } = useStyles();
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const { data: notifications } = useNotifications();

  const hasUnread = notifications?.some(n => !n.isRead);

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
            icon={<Bell color={theme.colors.iconDark} size={24} />} 
            onPress={() => router.push('/profile/notifications' as any)} 
            accessibilityLabel="Notifications"
          />
          {hasUnread && <View style={styles.notificationDot} />}
        </View>
        <Text style={styles.headerTitle}>KICKS</Text>
        <IconButton 
          icon={<Search color={theme.colors.iconDark} size={24} />} 
          onPress={() => router.push('/search' as any)} 
          accessibilityLabel="Search sneakers"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Featured Banner */}
        <View style={styles.featuredContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuredBanner}
          >
            <View style={styles.featuredContent}>
              <Text style={styles.featuredLabel}>New Release</Text>
              <Text style={styles.featuredTitle}>Nike Unveil{'\n'}Joyride</Text>
              <Pressable style={styles.shopNowButton} onPress={() => router.push('/(tabs)/discover')}>
                <Text style={styles.shopNowText}>Shop now</Text>
              </Pressable>
            </View>
            <Image 
              source={require('../../assets/shoe-unveil.png')} 
              style={styles.featuredImage} 
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* Brands */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandsContainer} contentContainerStyle={{ paddingHorizontal: theme.spacing.xxl }}>
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    borderWidth: 1.5,
    borderColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    paddingBottom: theme.spacing.huge,
  },
  featuredContainer: {
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.xl,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  featuredBanner: {
    borderRadius: theme.radius.xxxl,
    flexDirection: 'row',
    height: 180,
  },
  featuredContent: {
    flex: 1,
    padding: theme.spacing.xxl,
    justifyContent: 'center',
  },
  featuredLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: theme.typography.sizes.xs,
    marginBottom: theme.spacing.sm,
  },
  featuredTitle: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.families.extrabold,
    marginBottom: theme.spacing.lg,
  },
  shopNowButton: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.xl,
    alignSelf: 'flex-start',
  },
  shopNowText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.xs,
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
    marginTop: theme.spacing.xxxl,
    flexDirection: 'row',
  },
  productList: {
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.xxxl,
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  }
}));
