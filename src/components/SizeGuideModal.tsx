import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadows } from '../theme';

interface SizeGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const sizeData = [
  { us: '7', uk: '6.5', eu: '40', cm: '25' },
  { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
  { us: '8', uk: '7.5', eu: '41', cm: '26' },
  { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
  { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
  { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
  { us: '10', uk: '9.5', eu: '44', cm: '28' },
  { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
  { us: '11', uk: '10.5', eu: '45', cm: '29' },
  { us: '12', uk: '11.5', eu: '46', cm: '30' },
];

export function SizeGuideModal({ visible, onClose }: SizeGuideModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Size Guide</Text>
              <Text style={styles.headerSubtitle}>Men's Footwear</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X color={colors.textPrimary} size={24} />
            </Pressable>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.col]}>US</Text>
            <Text style={[styles.columnHeader, styles.col]}>UK</Text>
            <Text style={[styles.columnHeader, styles.col]}>EU</Text>
            <Text style={[styles.columnHeader, styles.col]}>CM</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {sizeData.map((row, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}>
                <Text style={[styles.cell, styles.col, styles.usCell]}>{row.us}</Text>
                <Text style={[styles.cell, styles.col]}>{row.uk}</Text>
                <Text style={[styles.cell, styles.col]}>{row.eu}</Text>
                <Text style={[styles.cell, styles.col]}>{row.cm}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Measure from heel to toe for the most accurate fit.
            </Text>
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    height: '70%',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    ...shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
  },
  headerTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    padding: spacing.sm,
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.round,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  columnHeader: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  col: {
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
  },
  tableRowAlt: {
    backgroundColor: colors.backgroundLight,
  },
  cell: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  usCell: {
    fontFamily: typography.families.semibold,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  }
});
