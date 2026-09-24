const fs = require('fs');
let file = 'mobile/app/profile/add-address.tsx';

let content = `import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, Keyboard, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { ChevronLeft, Navigation, MapPin } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { Button } from '../../src/components/Button';
import { useCheckoutStore } from '../../src/store/useCheckoutStore';
import { useToastStore } from '../../src/store/useToastStore';
import { FormInput } from '../../src/components/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const { width, height } = Dimensions.get('window');

const addressSchema = z.object({
  street: z.string().min(3, "Street required"),
  city: z.string().min(2, "City required"),
  zipCode: z.string().min(3, "Zip required"),
});

export default function AddAddressScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setAddress } = useCheckoutStore();
  const { showToast } = useToastStore();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 37.78825, // Default to SF or could use a generic default
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      city: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    (async () => {
      setIsLocating(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast('Permission Denied', 'Allow location to use map easily', 'error');
        setIsLocating(false);
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } catch (error) {
        console.warn(error);
      }
      setIsLocating(false);
    })();
  }, []);

  const handleSave = async (data: any) => {
    setIsSaving(true);
    await setAddress({
      fullName: '', // The service auto-fills this from user profile
      email: '',
      street: data.street,
      city: data.city,
      zipCode: data.zipCode,
    });
    setIsSaving(false);
    showToast('Success', 'Address saved successfully', 'success');
    router.back();
  };

  const centerOnUser = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    let location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      {/* Map Section */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          initialRegion={region}
          showsUserLocation={true}
          onRegionChangeComplete={setRegion}
          provider={Platform.OS === 'android' ? undefined : undefined}
        />
        
        {/* Center Marker Pin */}
        <View style={styles.centerMarker} pointerEvents="none">
          <MapPin color={colors.primary} size={42} fill={colors.backgroundLight} strokeWidth={2} />
        </View>

        {/* Top Header & Search */}
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <IconButton 
            icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
            onPress={() => router.back()} 
            style={styles.backButton}
          />
          <View style={styles.searchContainer}>
            <GooglePlacesAutocomplete
              placeholder='Search Google Maps...'
              onPress={(data, details = null) => {
                if (details?.geometry?.location) {
                  mapRef.current?.animateToRegion({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }, 1000);
                }
                if (details?.address_components) {
                  let streetNum = '';
                  let route = '';
                  let city = '';
                  let zip = '';
                  details.address_components.forEach(comp => {
                    if (comp.types.includes('street_number')) streetNum = comp.short_name;
                    if (comp.types.includes('route')) route = comp.short_name;
                    if (comp.types.includes('locality')) city = comp.long_name;
                    if (comp.types.includes('postal_code')) zip = comp.short_name;
                  });
                  form.setValue('street', \`\${streetNum} \${route}\`.trim() || data.structured_formatting?.main_text || '');
                  if (city) form.setValue('city', city);
                  if (zip) form.setValue('zipCode', zip);
                }
                Keyboard.dismiss();
              }}
              fetchDetails={true}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
                language: 'en',
              }}
              styles={{
                container: { flex: 1 },
                textInput: styles.searchInput,
                listView: styles.searchList,
                row: styles.searchRow,
              }}
              enablePoweredByContainer={false}
              textInputProps={{
                placeholderTextColor: colors.textMuted
              }}
            />
          </View>
        </View>

        {/* My Location Button */}
        {!keyboardVisible && (
          <IconButton 
            icon={<Navigation color={colors.primary} size={24} strokeWidth={2.5} />} 
            style={styles.myLocationBtn}
            onPress={centerOnUser}
          />
        )}
      </View>

      {/* Bottom Sheet Form */}
      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>Confirm Details</Text>
        <FormInput control={form.control} name="street" label="Street Address" placeholder="123 Sneaker Ave" />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <FormInput control={form.control} name="city" label="City" placeholder="Los Angeles" />
          </View>
          <View style={{ flex: 1 }}>
            <FormInput control={form.control} name="zipCode" label="Zip Code" placeholder="90001" />
          </View>
        </View>
        <Button 
          label="SAVE ADDRESS" 
          onPress={form.handleSubmit(handleSave)}
          isLoading={isSaving}
          style={{ marginTop: spacing.md }}
        />
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  centerMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -42, // Shift up by pin height so tip points to center
    marginLeft: -21, // Shift left by half width
    zIndex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    alignItems: 'flex-start',
    zIndex: 10,
  },
  backButton: {
    backgroundColor: colors.surface,
    ...shadows.medium,
    marginRight: spacing.sm,
    marginTop: 4,
  },
  searchContainer: {
    flex: 1,
    ...shadows.medium,
  },
  searchInput: {
    height: 52,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    fontFamily: typography.families.medium,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  searchList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginTop: spacing.xs,
    elevation: 4,
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
  },
  searchRow: {
    padding: spacing.md,
    height: 50,
  },
  myLocationBtn: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
    backgroundColor: colors.surface,
    ...shadows.medium,
    zIndex: 10,
  },
  bottomSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    padding: spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? spacing.xxxl : spacing.xl,
    ...shadows.strong,
  },
  sheetTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
`;

fs.writeFileSync('mobile/app/profile/add-address.tsx', content, 'utf8');
