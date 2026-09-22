import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, MessageCircle, PhoneCall, Mail, FileText } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';

const faq = [
  "How do I track my order?",
  "What is the return policy?",
  "Can I cancel my order?",
  "How do I use a promo code?",
];

function ContactItem({ icon, title, subtitle, onPress }: any) {
    const { theme } = useStyles();
  return (
    <Pressable 
      style={styles.contactItem}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.contactTextContainer}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight color={theme.colors.textMuted} size={20} strokeWidth={2} />
    </Pressable>
  );
}

export default function SupportScreen() {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToastStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={theme.colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>
          <View style={styles.card}>
            <ContactItem 
              icon={<MessageCircle color={theme.colors.textPrimary} size={20} />} 
              title="Live Chat" 
              subtitle="Usually replies in 5 minutes" 
              onPress={() => showToast('Opening Live Chat...', 'Connecting to an agent', 'info')}
            />
            <View style={styles.divider} />
            <ContactItem 
              icon={<PhoneCall color={theme.colors.textPrimary} size={20} />} 
              title="Phone Support" 
              subtitle="+1 (800) 123-KICKS" 
              onPress={() => showToast('Calling Support...', '+1 (800) 123-KICKS', 'info')}
            />
            <View style={styles.divider} />
            <ContactItem 
              icon={<Mail color={theme.colors.textPrimary} size={20} />} 
              title="Email Us" 
              subtitle="support@kicks.com" 
              onPress={() => showToast('Composing Email...', 'support@kicks.com', 'info')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
          <View style={styles.card}>
            {faq.map((q, i) => (
              <React.Fragment key={i}>
                <Pressable 
                  style={styles.faqItem}
                  onPress={() => showToast('FAQ Selected', q, 'info')}
                >
                  <View style={styles.faqIconWrapper}>
                    <FileText color={theme.colors.textMuted} size={18} />
                  </View>
                  <Text style={styles.faqText}>{q}</Text>
                  <ChevronRight color={theme.colors.border} size={20} />
                </Pressable>
                {i < faq.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  section: {
    marginBottom: theme.spacing.xxxl,
  },
  sectionTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  contactTextContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  contactTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  faqIconWrapper: {
    marginRight: theme.spacing.md,
  },
  faqText: {
    flex: 1,
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.backgroundLight,
    marginLeft: theme.spacing.lg,
  }
}));
