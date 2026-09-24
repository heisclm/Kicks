const fs = require('fs');
let file = 'mobile/app/profile/payments.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ useToastStore \} from '\.\.\/\.\.\/src\/store\/useToastStore';\r?\n/, "import { useToastStore } from '../../src/store/useToastStore';\nimport { useCheckoutStore } from '../../src/store/useCheckoutStore';\n");

content = content.replace(/export default function PaymentMethodsScreen\(\) \{[\s\S]*?return \(/, `export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToastStore();
  const savedPayment = useCheckoutStore(state => state.savedPayment);

  const getCardType = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'visa';
    if (cardNumber.startsWith('5')) return 'mastercard';
    return 'card';
  };

  const getCardName = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    return 'Credit Card';
  };

  return (`);

content = content.replace(/<ScrollView showsVerticalScrollIndicator=\{false\} contentContainerStyle=\{styles\.scrollContent\}>[\s\S]*?<\/ScrollView>/, `<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {savedPayment ? (
          <Pressable 
            style={[styles.card, styles.cardActive]}
            onPress={() => showToast('Payment Method Selected', 'Default Payment', 'success')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <View style={styles.iconWrapper}>
                  {renderLogo(getCardType(savedPayment.cardNumber))}
                </View>
                <View>
                  <Text style={styles.name}>{getCardName(savedPayment.cardNumber)}</Text>
                  <Text style={styles.subtitle}>**** **** **** {savedPayment.cardNumber.slice(-4)}</Text>
                </View>
              </View>
              <CheckCircle color={colors.primary} size={20} strokeWidth={2.5} />
            </View>
          </Pressable>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontFamily: typography.families.medium, color: colors.textMuted }}>No saved payment methods</Text>
            <Text style={{ fontFamily: typography.families.regular, color: colors.textMuted, fontSize: 12, marginTop: 8 }}>Add one during your next checkout</Text>
          </View>
        )}
      </ScrollView>`);

content = content.replace(/onPress=\{[^}]+\}\s*style=\{styles\.backButton\}\s*\/>/g, `onPress={() => router.push('/checkout')} style={styles.backButton} />`);

fs.writeFileSync(file, content, 'utf8');
