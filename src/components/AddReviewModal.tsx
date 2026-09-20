import React, { useState } from 'react';
import { View, Text, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { X, Star } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '../theme';
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
    const { theme } = useStyles();
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
              <X color={theme.colors.textPrimary} size={24} />
            </Pressable>
          </View>
          
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                <Star 
                  color={star <= rating ? '#F5A623' : theme.colors.border} 
                  fill={star <= rating ? '#F5A623' : 'transparent'} 
                  size={32} 
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="What did you think about this product?"
            placeholderTextColor={theme.colors.textMuted}
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

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  closeBtn: {
    padding: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  starBtn: {
    padding: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    minHeight: 120,
    marginBottom: theme.spacing.xl,
  },
  submitBtn: {
    marginTop: theme.spacing.sm,
  },
}));
