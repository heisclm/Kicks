import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
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
    const { theme } = useStyles();
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
              <X color={theme.colors.textPrimary} size={24} />
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

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xxxl,
    borderTopRightRadius: theme.radius.xxxl,
    height: '70%',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    ...theme.shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  closeButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.radius.round,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  columnHeader: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
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
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.lg,
  },
  tableRowAlt: {
    backgroundColor: theme.colors.backgroundLight,
  },
  cell: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  usCell: {
    fontFamily: theme.typography.families.semibold,
  },
  footer: {
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
  }
}));
