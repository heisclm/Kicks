import React from 'react';
import { View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, typography, shadows } from '../theme';

// UIManager.setLayoutAnimationEnabledExperimental is a no-op in New Architecture (React Native 0.76+)
// LayoutAnimation works out of the box now.
export function BottomTabBar({ state, descriptors, navigation }: any) {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  
  // Separate routes
  const mainRoutes = state.routes.filter((route: any) => route.name !== 'cart');
  const cartRoute = state.routes.find((route: any) => route.name === 'cart');
  const cartIndex = state.routes.findIndex((route: any) => route.name === 'cart');

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, theme.spacing.md) }]}>
      
      {/* Main Pill */}
      <View style={[styles.mainPill, theme.shadows.soft]}>
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
                color: isFocused ? theme.colors.primary : theme.colors.textMuted,
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
          <Pressable onPress={onPress} style={[styles.cartCircle, theme.shadows.soft, isFocused && styles.cartCircleActive]}>
            {options.tabBarIcon ? options.tabBarIcon({
              focused: isFocused,
              color: isFocused ? theme.colors.textInverse : theme.colors.primary,
              size: 22,
            }) : null}
          </Pressable>
        );
      })()}
      
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 0,
    backgroundColor: 'transparent',
  },
  mainPill: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.round,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.round,
  },
  mainTabButtonActive: {
    backgroundColor: theme.colors.border, // Light grey for the expanding active tab pill
  },
  activeLabel: {
    marginLeft: theme.spacing.xs,
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
  },
  cartCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartCircleActive: {
    backgroundColor: theme.colors.primary,
  }
}));
