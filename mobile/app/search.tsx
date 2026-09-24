import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, Clock } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../src/theme';
import { products } from '../src/data';
import { ProductGridCard } from '../src/components/ProductGridCard';
import { useCartStore } from '../src/store/useCartStore';
import { useToastStore } from '../src/store/useToastStore';

const RECENT_SEARCHES = ['Nike Air Max', 'Jordan', 'Running Shoes', 'Yeezy'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const addToCart = useCartStore(state => state.addToCart);
  
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(lowerQuery) || p.brand.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  const { width } = useWindowDimensions();
  const numColumns = width > 1000 ? 4 : width > 600 ? 3 : 2;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.searchBar}>
          <Search color={colors.textMuted} size={20} strokeWidth={2} />
          <TextInput
            style={styles.input}
            placeholder="Search for sneakers..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <X color={colors.textMuted} size={18} strokeWidth={2} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => router.back()} style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      {query.length === 0 ? (
        <View style={styles.recentContainer}>
          <Text style={styles.recentTitle}>RECENT SEARCHES</Text>
          {RECENT_SEARCHES.map((item, index) => (
            <Pressable 
              key={index} 
              style={styles.recentItem}
              onPress={() => setQuery(item)}
            >
              <Clock color={colors.textMuted} size={16} strokeWidth={2} />
              <Text style={styles.recentItemText}>{item}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={searchResults}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultsList}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Search color={colors.textMuted} size={40} strokeWidth={1.5} />
              <Text style={styles.emptyText}>No results found for "{query}"</Text>
            </View>
          }
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 44,
    borderRadius: radius.round,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  cancelButton: {
    marginLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  cancelText: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  recentContainer: {
    padding: spacing.xl,
  },
  recentTitle: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.lg,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  recentItemText: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  resultsList: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.md,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    marginTop: spacing.md,
  }
});
