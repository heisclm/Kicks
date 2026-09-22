import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, useWindowDimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter, Head } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { colors, spacing, typography, radius } from '../../src/theme';
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
    const { theme } = useStyles();
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
          icon={<SlidersHorizontal color={theme.colors.textPrimary} size={24} strokeWidth={2} />} 
          onPress={() => useToastStore.getState().showToast('Filters', 'Advanced filtering coming soon', 'info')}
        />
      </View>
      <Pressable style={styles.searchContainer} onPress={() => router.push('/search' as any)}>
        <Search color={theme.colors.textMuted} size={20} strokeWidth={2} />
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
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.md }]}>
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.round,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.families.regular,
    color: theme.colors.textMuted,
  },
  categoriesList: {
    paddingHorizontal: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surface,
  },
  categoryPillActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontFamily: theme.typography.families.semibold,
    color: theme.colors.textPrimary,
  },
  categoryTextActive: {
    color: theme.colors.textInverse,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
    // Note: removed maxWidth: '48%' to allow Flex to split columns dynamically
  }
}));
