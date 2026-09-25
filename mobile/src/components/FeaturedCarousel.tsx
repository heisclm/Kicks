import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Product } from '../types';
import { colors, spacing, radius, typography } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Determine if we are on a wide screen (tablet/web)
const isWideScreen = SCREEN_WIDTH > 700;
const ITEM_WIDTH = isWideScreen ? 700 : SCREEN_WIDTH;

interface FeaturedCarouselProps {
  products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Get top 3 trending products
  const featuredProducts = products.slice(0, 3);
  
  if (featuredProducts.length === 0) return null;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = e.nativeEvent.layoutMeasurement.width;
    const index = Math.round(e.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  };

  const renderItem = ({ item }: { item: Product }) => {
    // Generate an aesthetically pleasing gradient based on index or product
    // We can use a deterministic random or just hardcode some premium gradients
    const gradients = [
      [colors.primary, colors.secondary],
      ['#1A2980', '#26D0CE'],
      ['#FF416C', '#FF4B2B']
    ];
    const gradient = gradients[featuredProducts.indexOf(item)] || gradients[0];

    return (
      <View style={styles.slideContainer}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredBanner}
        >
          <View style={styles.featuredContent}>
            <Text style={styles.featuredLabel}>New Release</Text>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {item.name}
            </Text>
            <Pressable style={styles.shopNowButton} onPress={() => router.push(`/details/${item.id}`)}>
              <Text style={styles.shopNowText}>Shop now</Text>
            </Pressable>
          </View>
          <Image 
            source={typeof item.image === 'string' ? { uri: item.image } : item.image as any} 
            style={styles.featuredImage} 
            resizeMode="contain"
          />
        </LinearGradient>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={featuredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={onScroll}
        style={styles.flatList}
      />
      
      {/* Pagination Indicators */}
      <View style={styles.paginationContainer}>
        {featuredProducts.map((_, index) => (
          <View 
            key={index} 
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot
            ]} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  flatList: {
    width: isWideScreen ? 700 : '100%',
    flexGrow: 0, // prevents flatlist from taking more height than its content
  },
  slideContainer: {
    width: isWideScreen ? 700 : SCREEN_WIDTH,
    paddingHorizontal: isWideScreen ? 0 : spacing.xxl,
  },
  featuredBanner: {
    borderRadius: radius.xxxl,
    flexDirection: 'row',
    height: 180,
    width: '100%',
    overflow: 'hidden', // to ensure gradient doesn't bleed
  },
  featuredContent: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
    zIndex: 10,
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
    width: 220,
    height: 220,
    position: 'absolute',
    right: -40,
    top: -20,
    transform: [{ rotate: '-15deg' }],
    zIndex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 20,
    backgroundColor: colors.primary,
  }
});
