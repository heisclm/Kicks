import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, Clock } from 'lucide-react-native';
import { colors, spacing, typography, radius } from '../src/theme';
import { products } from '../src/data';
import { ProductGridCard } from '../src/components/ProductGridCard';
import { useCartStore } from '../src/store/useCartStore';
import { useToastStore } from '../src/store/useToastStore';

const RECENT_SEARCHES = ['Nike Air Max', 'Jordan', 'Running Shoes', 'Yeezy'];

export default function SearchScreen() {
    const { theme } = useStyles();
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
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.sm }]}>
        <View style={styles.searchBar}>
          <Search color={theme.colors.textMuted} size={20} strokeWidth={2} />
          <TextInput
            style={styles.input}
            placeholder="Search for sneakers..."
            placeholderTextColor={theme.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <X color={theme.colors.textMuted} size={18} strokeWidth={2} />
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
              <Clock color={theme.colors.textMuted} size={16} strokeWidth={2} />
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
              <Search color={theme.colors.textMuted} size={40} strokeWidth={1.5} />
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    height: 44,
    borderRadius: theme.radius.round,
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  cancelButton: {
    marginLeft: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  cancelText: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  recentContainer: {
    padding: theme.spacing.xl,
  },
  recentTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginBottom: theme.spacing.lg,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  recentItemText: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.md,
  },
  resultsList: {
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  cardWrapper: {
    flex: 1,
    paddingHorizontal: theme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  }
}));
