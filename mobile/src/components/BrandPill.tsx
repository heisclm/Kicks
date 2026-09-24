import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Brand } from '../types';
import { colors, spacing, radius, typography } from '../theme';

interface BrandPillProps {
  brand: Brand;
  isSelected: boolean;
  onPress: () => void;
}

import { NikeLogo, AdidasLogo, PumaLogo, ReebokLogo, NewBalanceLogo } from './BrandLogos';

export function BrandPill({ brand, isSelected, onPress }: BrandPillProps) {
  const iconColor = isSelected ? colors.surface : colors.textPrimary;
  return (
    <Pressable 
      style={[
        styles.container, 
        isSelected && styles.containerSelected
      ]}
      onPress={onPress}
    >
      {brand.name === 'Nike' && <NikeLogo color={iconColor} size={20} />}
      {brand.name === 'Adidas' && <AdidasLogo color={iconColor} size={20} />}
      {brand.name === 'Puma' && <PumaLogo color={iconColor} size={20} />}
      {brand.name === 'Reebok' && <ReebokLogo color={iconColor} size={20} />}
      {brand.name === 'New Balance' && <NewBalanceLogo color={iconColor} size={20} />}
      
      <Text style={[styles.text, isSelected && styles.textSelected, { marginLeft: brand.name === 'All' ? 0 : spacing.sm }]}>
        {brand.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.xxxl,
    backgroundColor: colors.surface,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.semibold,
    color: colors.textSecondary,
  },
  textSelected: {
    color: colors.surface,
  },
  iconFallback: {
    fontWeight: typography.weights.black,
    marginRight: spacing.sm,
  }
});
