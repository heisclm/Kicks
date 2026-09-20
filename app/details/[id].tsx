import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Dimensions } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Heart, Lock, RotateCcw, ShoppingBag, Star } from 'lucide-react-native';
import Animated from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useProduct } from '../../src/hooks/useProducts';
import { IconButton } from '../../src/components/IconButton';
import { SizeSelector } from '../../src/components/SizeSelector';

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);
import { CartAddIcon } from '../../src/components/CartAddIcon';
import { SizeGuideModal } from '../../src/components/SizeGuideModal';
import { Button } from '../../src/components/Button';
import { useToastStore } from '../../src/store/useToastStore';
import { useWishlistStore } from '../../src/store/useWishlistStore';
import { useCartStore } from '../../src/store/useCartStore';
import { colors, spacing, radius, typography, shadows } from '../../src/theme';
import { useReviews, useReviewEligibility, useAddReview } from '../../src/hooks/useReviews';
import { AddReviewModal } from '../../src/components/AddReviewModal';
import { useAuthStore } from '../../src/store/useAuthStore';
import { SneakerLoader } from '../../src/components/SneakerLoader';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
    const { theme } = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: product, isLoading } = useProduct(id as string);
  const insets = useSafeAreaInsets();

  const { savedProductIds, toggleWishlist } = useWishlistStore();
  const isSaved = product ? savedProductIds.includes(product.id) : false;
  const { addToCart } = useCartStore();

  const [selectedSize, setSelectedSize] = useState<number>(38);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('Multi');
  const [isSizeGuideVisible, setIsSizeGuideVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const { user } = useAuthStore();
  const { data: reviews, isLoading: isReviewsLoading } = useReviews(id as string);
  const { data: eligibleOrderItemId } = useReviewEligibility(id as string);
  const { mutateAsync: addReview, isPending: isSubmittingReview } = useAddReview();

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || 38);
      setSelectedColor(product.availableColors?.[0] || product.color);
    }
  }, [product]);

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!user || !eligibleOrderItemId) return;
    try {
      await addReview({
        userId: user.id,
        productId: id as string,
        orderItemId: eligibleOrderItemId,
        rating,
        comment,
      });
      useToastStore.getState().showToast('Success', 'Thank you for your review!', 'success');
      setIsReviewModalVisible(false);
    } catch (e: any) {
      useToastStore.getState().showToast('Error', e.message || 'Failed to submit review', 'error');
    }
  };

  if (isLoading || !product) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <SneakerLoader label="Loading product..." transparent />
      </View>
    );
  }

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addToCart({
      productId: product.id,
      size: selectedSize,
      quantity: 1,
      price: product.price
    });
    useToastStore.getState().showToast('Added to Cart', `${product.name} - Size ${selectedSize}`, 'success');
  };

  const handleToggleWishlist = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleWishlist(product.id);
  };

  const handleSelectSize = (size: number) => {
    Haptics.selectionAsync();
    setSelectedSize(size);
  };

  const handleSelectColor = (color: string) => {
    Haptics.selectionAsync();
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon={<ChevronLeft color={theme.colors.iconDark} size={24} />} onPress={() => router.back()} />
          <IconButton 
            icon={<Heart color={isSaved ? theme.colors.primary : theme.colors.iconDark} size={24} fill={isSaved ? theme.colors.primary : 'transparent'} />} 
            onPress={handleToggleWishlist}
          />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.gender}>{product.gender?.toUpperCase() || product.subtitle.toUpperCase()}</Text>
          <Text style={styles.title}>{product.name}</Text>
        </View>

        {/* Main Image */}
        <View style={styles.imageContainer}>
          {product.rating >= 4.5 && (
            <View style={styles.highlyRatedPill}>
              <Star color="#000" size={14} fill="#000" />
              <Text style={styles.highlyRatedText}>Highly Rated</Text>
            </View>
          )}
          <AnimatedExpoImage 
            sharedTransitionTag={`image-${product.id}`}
            source={product.thumbnails ? product.thumbnails[selectedThumbnail] : product.image} 
            style={styles.mainImage} 
            contentFit="contain" 
            cachePolicy="disk"
          />
          {/* 360 degree indicator */}
          <View style={styles.rotationIndicator}>
            <View style={styles.rotationLine} />
            <View style={styles.rotationIconContainer}>
               <RotateCcw color="#fff" size={12} style={{marginRight: 4}} />
               <RotateCcw color="#fff" size={12} style={{transform: [{scaleX: -1}]}} />
            </View>
          </View>
        </View>

        {/* Thumbnails */}
        {product.thumbnails && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailsContainer}>
            {product.thumbnails.map((thumb, index) => (
              <Pressable 
                key={index} 
                onPress={() => setSelectedThumbnail(index)}
                style={[styles.thumbnailWrapper, selectedThumbnail === index && styles.thumbnailWrapperSelected]}
              >
                <ExpoImage source={thumb} style={styles.thumbnailImage} contentFit="contain" cachePolicy="disk" />
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.sizeHeaderRow}>
            <Text style={styles.sizeLabel}>SELECT SIZE</Text>
            <Pressable onPress={() => setIsSizeGuideVisible(true)}>
              <Text style={styles.sizeGuideLink}>SIZE GUIDE</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sizesContainer}>
            {product.sizes?.map(size => (
              <SizeSelector
                key={size}
                size={size}
                isSelected={selectedSize === size}
                onPress={() => handleSelectSize(size)}
              />
            ))}
          </ScrollView>

          {product.availableColors && product.availableColors.length > 0 && (
            <>
              <Text style={styles.colorLabel}>SELECT COLOR</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorsContainer}>
                {product.availableColors.map(color => (
                  <Pressable 
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorCircleSelected
                    ]}
                    onPress={() => handleSelectColor(color)}
                  />
                ))}
              </ScrollView>
            </>
          )}

          <Text style={styles.descriptionLabel}>DESCRIPTION</Text>
          <Text style={styles.description}>
            {product.description}
          </Text>

          {/* Reviews Section */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.descriptionLabel}>REVIEWS ({reviews?.length || 0})</Text>
            {eligibleOrderItemId && (
              <Pressable onPress={() => setIsReviewModalVisible(true)}>
                <Text style={styles.writeReviewLink}>Write a Review</Text>
              </Pressable>
            )}
          </View>
          
          {isReviewsLoading ? (
            <Text style={styles.loadingText}>Loading reviews...</Text>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAuthorInfo}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>
                        {review.user.fullName.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.reviewAuthorName}>{review.user.fullName}</Text>
                      <Text style={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reviewRating}>
                    <Star color="#F5A623" fill="#F5A623" size={14} />
                    <Text style={styles.reviewRatingText}>{review.rating.toFixed(1)}</Text>
                  </View>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyReviews}>No reviews yet. Be the first to review this product!</Text>
          )}
        </View>

      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, theme.spacing.xxl) }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>$ {product.price}</Text>
        </View>
        <Button 
          style={{ flex: 1.5, marginLeft: theme.spacing.xxl }}
          size="lg"
          label="ADD TO CART" 
          onPress={handleAddToCart} 
          rightIcon={<CartAddIcon color={theme.colors.textInverse} size={20} strokeWidth={2.5} />} 
        />
      </View>

      <SizeGuideModal 
        visible={isSizeGuideVisible} 
        onClose={() => setIsSizeGuideVisible(false)} 
      />

      <AddReviewModal
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmittingReview}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  safeArea: {
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.md,
  },
  scrollContent: {
    paddingBottom: 120,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.md,
  },
  gender: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 12,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontSize: theme.typography.sizes.huge,
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    height: 350,
    position: 'relative',
  },
  highlyRatedPill: {
    position: 'absolute',
    top: theme.spacing.md,
    left: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.xxxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    zIndex: 10,
    ...theme.shadows.soft,
  },
  highlyRatedText: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  mainImage: {
    width: width * 0.9,
    height: 300,
    transform: [{ rotate: '-15deg' }]
  },
  rotationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    width: '60%',
  },
  rotationLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
    position: 'absolute',
    width: '100%',
    zIndex: 0,
    borderRadius: theme.radius.round,
  },
  rotationIconContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.xl,
    zIndex: 1,
    ...theme.shadows.soft,
  },
  thumbnailsContainer: {
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  thumbnailWrapper: {
    width: 70,
    height: 70,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.soft,
  },
  thumbnailWrapperSelected: {
    borderColor: theme.colors.textPrimary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    transform: [{ rotate: '-15deg' }]
  },
  detailsContainer: {
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.xxxl,
  },
  sizeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sizeLabel: {
    fontSize: 10,
    fontFamily: theme.typography.families.semibold,
    color: theme.colors.textMuted,
    letterSpacing: 2,
  },
  sizeGuideLink: {
    fontSize: 10,
    fontFamily: theme.typography.families.semibold,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  sizesContainer: {
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  colorLabel: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 12,
    color: theme.colors.textPrimary,
    letterSpacing: 1.5,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
  },
  colorsContainer: {
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.soft,
  },
  colorCircleSelected: {
    borderColor: theme.colors.textPrimary,
    borderWidth: 3,
  },
  descriptionLabel: {
    fontSize: 10,
    fontFamily: theme.typography.families.semibold,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginTop: theme.spacing.xxxl,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.sizes.sm,
    lineHeight: 22,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.families.regular,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: theme.colors.backgroundLight,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
  },
  buyButton: {
    flex: 1.5,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.xxxl,
    marginLeft: theme.spacing.xxl,
    gap: theme.spacing.sm,
  },
  buyButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.families.semibold,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  writeReviewLink: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    textDecorationLine: 'underline',
  },
  loadingText: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
  },
  emptyReviews: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.md,
    fontStyle: 'italic',
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    marginTop: theme.spacing.md,
    ...theme.shadows.soft,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  reviewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewAvatarText: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.sm,
  },
  reviewAuthorName: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  reviewDate: {
    fontFamily: theme.typography.families.regular,
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.sm,
    color: '#F5A623',
  },
  reviewComment: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  }
}));
