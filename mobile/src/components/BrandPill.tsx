import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
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
  
  const hasCustomLogo = !!brand.logo_url;
  
  return (
    <Pressable 
      style={[
        styles.container, 
        isSelected && styles.containerSelected
      ]}
      onPress={onPress}
    >
      {hasCustomLogo ? (
        <Image 
          source={{ uri: brand.logo_url }} 
          style={{ width: 24, height: 24, opacity: isSelected ? 1 : 0.7 }}
          contentFit="contain"
          transition={200}
        />
      ) : (
        <>
          {brand.name === 'Nike' && <NikeLogo color={iconColor} size={20} />}
          {brand.name === 'Adidas' && <AdidasLogo color={iconColor} size={20} />}
          {brand.name === 'Puma' && <PumaLogo color={iconColor} size={20} />}
          {brand.name === 'Reebok' && <ReebokLogo color={iconColor} size={20} />}
          {brand.name === 'New Balance' && <NewBalanceLogo color={iconColor} size={20} />}
          {brand.name !== 'All' && 
           !['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'].includes(brand.name) && (
            <View style={{ 
              width: 24, height: 24, borderRadius: 12, 
              backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colors.border, 
              alignItems: 'center', justifyContent: 'center' 
            }}>
               <Text style={{ color: iconColor, fontSize: 12, fontWeight: 'bold' }}>
                 {brand.name.charAt(0).toUpperCase()}
               </Text>
            </View>
          )}
        </>
      )}
      
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
