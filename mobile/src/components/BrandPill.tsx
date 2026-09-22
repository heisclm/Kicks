import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { Brand } from '../types';
import { colors, spacing, radius, typography } from '../theme';

interface BrandPillProps {
  brand: Brand;
  isSelected: boolean;
  onPress: () => void;
}

import { NikeLogo, AdidasLogo, PumaLogo, ReebokLogo, NewBalanceLogo } from './BrandLogos';

export function BrandPill({ brand, isSelected, onPress }: BrandPillProps) {
    const { theme } = useStyles();
  const iconColor = isSelected ? theme.colors.surface : theme.colors.textPrimary;
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
      
      <Text style={[styles.text, isSelected && styles.textSelected, { marginLeft: brand.name === 'All' ? 0 : theme.spacing.sm }]}>
        {brand.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.xxxl,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  containerSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  text: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.families.semibold,
    color: theme.colors.textSecondary,
  },
  textSelected: {
    color: theme.colors.surface,
  },
  iconFallback: {
    fontWeight: theme.typography.weights.black,
    marginRight: theme.spacing.sm,
  }
}));
