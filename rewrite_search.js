const fs = require('fs');

let content = `import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, useWindowDimensions, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, Clock, TrendingUp, Trash2 } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../src/theme';
import { useProducts } from '../src/hooks/useProducts';
import { ProductGridCard } from '../src/components/ProductGridCard';
import { useSearchHistoryStore } from '../src/store/useSearchHistoryStore';

const TRENDING_SEARCHES = ['Nike Air Max', 'Jordan 1', 'Running Shoes', 'Yeezy Boost'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { data: products = [], isLoading } = useProducts();
  const { recentSearches, addSearch, clearHistory } = useSearchHistoryStore();
  
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return products.filter(
      p => p.name.toLowerCase().includes(lowerQuery) || 
           p.brand.toLowerCase().includes(lowerQuery) || 
           p.category?.toLowerCase().includes(lowerQuery) ||
           p.subtitle?.toLowerCase().includes(lowerQuery)
    );
  }, [query, products]);

  const { width } = useWindowDimensions();
  const numColumns = width > 1000 ? 4 : width > 600 ? 3 : 2;

  const handleSearchSubmit = () => {
    if (query.trim().length > 1) {
      addSearch(query);
    }
  };

  const handleSelectHistory = (item: string) => {
    setQuery(item);
    addSearch(item);
  };

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
            placeholder="Search for sneakers, brands..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
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
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {recentSearches.length > 0 && (
            <View style={styles.recentContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.recentTitle}>RECENT SEARCHES</Text>
                <Pressable onPress={clearHistory} hitSlop={10}>
                  <Trash2 color={colors.textMuted} size={16} strokeWidth={1.5} />
                </Pressable>
              </View>
              {recentSearches.map((item, index) => (
                <Pressable 
                  key={index} 
                  style={styles.recentItem}
                  onPress={() => handleSelectHistory(item)}
                >
                  <Clock color={colors.textMuted} size={16} strokeWidth={2} />
                  <Text style={styles.recentItemText}>{item}</Text>
                  <View style={{ flex: 1 }} />
                  <X color={colors.border} size={16} strokeWidth={2} />
                </Pressable>
              ))}
            </View>
          )}

          <View style={[styles.recentContainer, { paddingTop: recentSearches.length > 0 ? 0 : spacing.xl }]}>
            <Text style={styles.recentTitle}>TRENDING SEARCHES</Text>
            {TRENDING_SEARCHES.map((item, index) => (
              <Pressable 
                key={index} 
                style={styles.recentItem}
                onPress={() => handleSelectHistory(item)}
              >
                <TrendingUp color={colors.primary} size={16} strokeWidth={2} />
                <Text style={[styles.recentItemText, { color: colors.primary }]}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
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
              {isLoading ? (
                <ActivityIndicator size="large" color={colors.primary} />
              ) : (
                <>
                  <Search color={colors.textMuted} size={40} strokeWidth={1.5} />
                  <Text style={styles.emptyText}>No results found for "{query}"</Text>
                  <Text style={styles.emptySubText}>Try searching for a different brand or category.</Text>
                </>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductGridCard 
                item={item} 
                onPress={() => {
                  handleSearchSubmit();
                  router.push(\`/details/\${item.id}\`);
                }}
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
    backgroundColor: colors.backgroundLight,
    zIndex: 10,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  recentTitle: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: 0,
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
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  emptySubText: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  }
});
`;

fs.writeFileSync('mobile/app/search.tsx', content, 'utf8');

// I also need to add ScrollView to imports if it's missing (yes it was missing).
content = content.replace("ActivityIndicator } from 'react-native';", "ActivityIndicator, ScrollView } from 'react-native';");
fs.writeFileSync('mobile/app/search.tsx', content, 'utf8');

