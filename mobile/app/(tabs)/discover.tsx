import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet } from 'react-native';
import Head from 'expo-router/head';
import {  useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { categories } from '../../src/data';
import { ProductGridCard } from '../../src/components/ProductGridCard';
import { ProductGridCardSkeleton } from '../../src/components/ProductGridCardSkeleton';
import { SneakerLoader } from '../../src/components/SneakerLoader';
import { ErrorState } from '../../src/components/ErrorState';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';
import { useProducts } from '../../src/hooks/useProducts';

export default function DiscoverScreen() {
  return (
    <>
      <Head>
        <title>Discover - Kicks</title>
      </Head>
      <DiscoverScreenContent />
    </>
  );
}

function DiscoverScreenContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const { data: products = [], isLoading, isError, refetch } = useProducts();
  const { width } = useWindowDimensions();
  const numColumns = width > 1000 ? 4 : width > 600 ? 3 : 2;

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View>
          <Text style={styles.headerSubtitle}>EXPLORE KICKS</Text>
          <Text style={styles.title}>Discover</Text>
        </View>
        <IconButton 
          icon={<SlidersHorizontal color={colors.textPrimary} size={24} strokeWidth={2} />} 
          onPress={() => useToastStore.getState().showToast('Filters', 'Advanced filtering coming soon', 'info')}
        />
      </View>
      <Pressable style={styles.searchContainer} onPress={() => router.push('/search' as any)}>
        <Search color={colors.textMuted} size={20} strokeWidth={2} />
        <Text style={styles.searchPlaceholder}>Search for sneakers...</Text>
      </Pressable>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item }) => {
          const isActive = activeCategory === item.id;
          return (
            <Pressable 
              style={[styles.categoryPill, isActive && styles.categoryPillActive]}
              onPress={() => setActiveCategory(item.id)}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );

  const renderItem = useCallback(({ item }: { item: any }) => {
    return (
      <View style={styles.cardWrapper}>
        <ProductGridCard 
          item={item} 
          onPress={() => router.push(`/details/${item.id}`)}
        />
      </View>
    );
  }, [router]);

  if (isError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {renderHeader()}
        <ErrorState onRetry={refetch} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {renderHeader()}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <SneakerLoader label="Discovering Kicks..." transparent />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <FlatList
        key={numColumns}
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.round,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: typography.families.regular,
    color: colors.textMuted,
  },
  categoriesList: {
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontFamily: typography.families.semibold,
    color: colors.textPrimary,
  },
  categoryTextActive: {
    color: colors.textInverse,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.lg,
  }
});
