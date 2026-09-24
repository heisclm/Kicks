const fs = require('fs');
let file = 'mobile/app/profile/notifications.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ useSafeAreaInsets \} from 'react-native-safe-area-context';\r?\n/, "import { useSafeAreaInsets } from 'react-native-safe-area-context';\nimport { usePreferencesStore } from '../../src/store/usePreferencesStore';\n");

content = content.replace(/export default function NotificationsScreen\(\) \{[\s\S]*?const router = useRouter\(\);/, `export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const prefs = usePreferencesStore();`);

content = content.replace(/<Switch\s+value=\{[^}]+\}\s+onValueChange=\{[^}]+\}/g, (match) => {
  // It's manually doing state. We just replace all of them manually
  return match;
});

// Since the component uses local useState for switches, I'll rewrite the component's body.
content = content.replace(/export default function NotificationsScreen\(\) \{[\s\S]*?\}\);/m, `export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orderUpdates, promotions, priceDrops, newArrivals, setNotificationPreference } = usePreferencesStore();

  const toggle = (key: 'orderUpdates' | 'promotions' | 'priceDrops' | 'newArrivals', value: boolean) => {
    setNotificationPreference(key, !value);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Orders & Deliveries</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Order Updates</Text>
              <Text style={styles.settingDesc}>Get notified about your order status</Text>
            </View>
            <Switch 
              value={orderUpdates} 
              onValueChange={() => toggle('orderUpdates', orderUpdates)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.backgroundLight}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers & Updates</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Promotions & Sales</Text>
              <Text style={styles.settingDesc}>Hear about exclusive offers and sales</Text>
            </View>
            <Switch 
              value={promotions} 
              onValueChange={() => toggle('promotions', promotions)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.backgroundLight}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Price Drops</Text>
              <Text style={styles.settingDesc}>Get notified when wishlisted items drop in price</Text>
            </View>
            <Switch 
              value={priceDrops} 
              onValueChange={() => toggle('priceDrops', priceDrops)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.backgroundLight}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>New Arrivals</Text>
              <Text style={styles.settingDesc}>Be the first to know about new sneaker drops</Text>
            </View>
            <Switch 
              value={newArrivals} 
              onValueChange={() => toggle('newArrivals', newArrivals)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.backgroundLight}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}`);

fs.writeFileSync(file, content, 'utf8');
