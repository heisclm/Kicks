import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StyleSheet } from 'react-native';
import { X, Star } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme';
import { Button } from './Button';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';

interface AddReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isSubmitting: boolean;
}

export function AddReviewModal({ visible, onClose, onSubmit, isSubmitting }: AddReviewModalProps) {
    const theme = { colors, spacing, radius, typography };
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim()) {
      useToastStore.getState().showToast('Error', 'Please write a review comment.', 'error');
      return;
    }
    await onSubmit(rating, comment);
    setRating(5);
    setComment('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Write a Review</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <X color={colors.textPrimary} size={24} />
            </Pressable>
          </View>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                <Star 
                  color={star <= rating ? '#F5A623' : colors.border} 
                  fill={star <= rating ? '#F5A623' : 'transparent'} 
                  size={32} 
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="What did you think about this product?"
            placeholderTextColor={colors.textMuted}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Button 
            label="SUBMIT REVIEW" 
            onPress={handleSubmit} 
            isLoading={isSubmitting} 
            style={styles.submitBtn} 
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xxl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  starBtn: {
    padding: spacing.xs,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderRadius: radius.md,
    padding: spacing.md,
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    minHeight: 120,
    marginBottom: spacing.xl,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
});
