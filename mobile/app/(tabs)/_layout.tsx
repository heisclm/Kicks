import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Search, Heart, ShoppingCart, User } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomTabBar } from '../../src/components/BottomTabBar';
import { colors, spacing, radius, typography } from '../src/theme';
import { useCartStore } from '../../src/store/useCartStore';

function HouseBlank({ color, size, strokeWidth }: any) {
    const theme = { colors, spacing, radius, typography };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Svg>
  );
}

function CartIconWithBadge({ focused, color, size }: any) {
    const theme = { colors, spacing, radius, typography };
  const cartItems = useCartStore((state) => state.items);
  const cartQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View>
      <ShoppingCart color={color} size={size} strokeWidth={2} />
      {cartQuantity > 0 && (
        <View style={[styles.badgeContainer, focused && styles.badgeContainerFocused]}>
          <Text style={styles.badgeText}>{cartQuantity > 99 ? '99+' : cartQuantity}</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
    const theme = { colors, spacing, radius, typography };
  return (
    <Tabs
      tabBar={props => <BottomTabBar {...(props as any)} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HouseBlank color={color} size={size} strokeWidth={2} />
          )
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <Search color={color} size={size} strokeWidth={1.5} />
          )
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => (
            <Heart color={color} size={size} strokeWidth={2} />
          )
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: CartIconWithBadge,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={2} />
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  badgeContainerFocused: {
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.textInverse,
    fontFamily: typography.families.semibold,
    fontSize: 9,
    lineHeight: 11,
  },
});
