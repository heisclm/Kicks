import React from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography, shadows } from '../theme';

// UIManager.setLayoutAnimationEnabledExperimental is a no-op in New Architecture (React Native 0.76+)
// LayoutAnimation works out of the box now.
export function BottomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  
  // Separate routes
  const mainRoutes = state.routes.filter((route: any) => route.name !== 'cart');
  const cartRoute = state.routes.find((route: any) => route.name === 'cart');
  const cartIndex = state.routes.findIndex((route: any) => route.name === 'cart');

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, spacing.md) }]}>
      
      {/* Main Pill */}
      <View style={[styles.mainPill, shadows.soft]}>
        {mainRoutes.map((route: any) => {
          const originalIndex = state.routes.findIndex((r: any) => r.key === route.key);
          const { options } = descriptors[route.key];
          const isFocused = state.index === originalIndex;
          
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

          const onPress = () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[styles.mainTabButton, isFocused && styles.mainTabButtonActive]}
            >
              {options.tabBarIcon ? options.tabBarIcon({
                focused: isFocused,
                color: isFocused ? colors.primary : colors.textMuted,
                size: 20,
              }) : null}
              {isFocused && (
                <Text style={styles.activeLabel} numberOfLines={1}>{label}</Text>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Cart Circle */}
      {cartRoute && (() => {
        const { options } = descriptors[cartRoute.key];
        const isFocused = state.index === cartIndex;
        const onPress = () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const event = navigation.emit({ type: 'tabPress', target: cartRoute.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(cartRoute.name, cartRoute.params);
          }
        };

        return (
          <Pressable onPress={onPress} style={[styles.cartCircle, shadows.soft, isFocused && styles.cartCircleActive]}>
            {options.tabBarIcon ? options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? colors.textInverse : colors.primary,
              size: 22,
            }) : null}
          </Pressable>
        );
      })()}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 0,
    backgroundColor: 'transparent',
  },
  mainPill: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radius.round,
  },
  mainTabButtonActive: {
    backgroundColor: colors.border, // Light grey for the expanding active tab pill
  },
  activeLabel: {
    marginLeft: spacing.xs,
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.xs,
    color: colors.primary,
  },
  cartCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCircleActive: {
    backgroundColor: colors.primary,
  }
});
