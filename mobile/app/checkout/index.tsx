import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ChevronLeft, CreditCard, MapPin, Truck } from "lucide-react-native";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";
import { Button } from "../../src/components/Button";
import { FormInput } from "../../src/components/FormInput";
import { OrderSuccessModal } from "../../src/components/OrderSuccessModal";
import { useCartStore } from "../../src/store/useCartStore";
import { useCheckoutStore } from "../../src/store/useCheckoutStore";
import { useToastStore } from "../../src/store/useToastStore";
import { colors, spacing, radius, typography } from '../../src/theme';

const addressSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  street: z.string().min(5, "Street required"),
  city: z.string().min(2, "City required"),
  zipCode: z.string().length(5, "5 digits required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "16 digits required").max(16),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY format"),
  cvv: z.string().min(3, "3 digits required").max(4),
});

export default function CheckoutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { total, items, clearCart } = useCartStore();
  const { savedAddress, savedPayment, setAddress, setPayment } =
    useCheckoutStore();

  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(!savedAddress);
  const [isEditingPayment, setIsEditingPayment] = useState(!savedPayment);

  const addressForm = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: savedAddress || {
      fullName: "",
      email: "",
      street: "",
      city: "",
      zipCode: "",
    },
  });

  const paymentForm = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: savedPayment || { cardNumber: "", expiryDate: "", cvv: "" },
  });

  const onSaveAddress = addressForm.handleSubmit((data) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAddress(data);
    setIsEditingAddress(false);
  });

  const onSavePayment = paymentForm.handleSubmit((data) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPayment(data);
    setIsEditingPayment(false);
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      useToastStore
        .getState()
        .showToast("Empty Cart", "Your cart is empty.", "error");
      return;
    }
    if (
      isEditingAddress ||
      isEditingPayment ||
      !savedAddress ||
      !savedPayment
    ) {
      useToastStore
        .getState()
        .showToast(
          "Incomplete",
          "Please save your address and payment details.",
          "error",
        );
      return;
    }

    setIsPlacingOrder(true);

    // Auth Check
    const { useAuthStore } = require("../../src/store/useAuthStore");
    const user = useAuthStore.getState().user;

    if (!user) {
      useToastStore
        .getState()
        .showToast("Not Logged In", "Please log in to checkout.", "error");
      setIsPlacingOrder(false);
      return;
    }

    const { orderService } = require("../../src/services/OrderService");
    const deliveryMethodId =
      selectedShipping === "standard"
        ? "d9c6c8c1-1e9b-4e0d-8d5f-15a0c8b2a1a1"
        : "d9c6c8c1-1e9b-4e0d-8d5f-15a0c8b2a1a2";

    const orderId = await orderService.placeOrder({
      userId: user.id,
      shippingAddress: savedAddress,
      paymentMethod: savedPayment,
      deliveryMethodId,
    });

    setIsPlacingOrder(false);

    if (orderId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowSuccessModal(true);
    } else {
      useToastStore
        .getState()
        .showToast(
          "Checkout Failed",
          "Could not process your order. Please try again.",
          "error",
        );
    }
  };

  const handleCloseSuccess = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowSuccessModal(false);
    clearCart();
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />
        </Pressable>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Shipping Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin color={colors.textPrimary} size={20} strokeWidth={2} />
            <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
          </View>
          <View style={styles.card}>
            {!isEditingAddress && savedAddress ? (
              <View style={styles.savedBlock}>
                <View style={styles.savedInfo}>
                  <Text style={styles.savedTitle}>Home</Text>
                  <Text style={styles.savedDesc}>
                    {savedAddress.street}, {savedAddress.city},{" "}
                    {savedAddress.zipCode}
                  </Text>
                  <Text style={styles.savedDesc}>
                    {savedAddress.fullName} • {savedAddress.email}
                  </Text>
                </View>
                <Pressable onPress={() => setIsEditingAddress(true)}>
                  <Text style={styles.changeText}>Change</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <FormInput
                  control={addressForm.control}
                  name="fullName"
                  label="Full Name"
                  placeholder="John Doe"
                />
                <FormInput
                  control={addressForm.control}
                  name="email"
                  label="Email Address"
                  placeholder="john@example.com"
                  keyboardType="email-address"
                />
                <FormInput
                  control={addressForm.control}
                  name="street"
                  label="Street Address"
                  placeholder="123 Sneaker St"
                />
                <View style={styles.row}>
                  <View style={styles.flex1}>
                    <FormInput
                      control={addressForm.control}
                      name="city"
                      label="City"
                      placeholder="New York"
                    />
                  </View>
                  <View style={styles.spacer} />
                  <View style={styles.flex1}>
                    <FormInput
                      control={addressForm.control}
                      name="zipCode"
                      label="Zip Code"
                      placeholder="10001"
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Button
                  label="SAVE ADDRESS"
                  onPress={onSaveAddress}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            )}
          </View>
        </View>

        {/* Shipping Method Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Truck color={colors.textPrimary} size={20} strokeWidth={2} />
            <Text style={styles.sectionTitle}>SHIPPING METHOD</Text>
          </View>
          <View style={styles.card}>
            <Pressable
              style={[
                styles.shippingOption,
                selectedShipping !== "standard" && { opacity: 0.5 },
              ]}
              onPress={() => setSelectedShipping("standard")}
            >
              <View>
                <Text style={styles.shippingTitle}>Standard Delivery</Text>
                <Text style={styles.shippingDesc}>3-5 Business Days</Text>
              </View>
              <Text style={styles.shippingPrice}>Free</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              style={[
                styles.shippingOption,
                selectedShipping !== "express" && { opacity: 0.5 },
              ]}
              onPress={() => setSelectedShipping("express")}
            >
              <View>
                <Text style={styles.shippingTitle}>Express Delivery</Text>
                <Text style={styles.shippingDesc}>1-2 Business Days</Text>
              </View>
              <Text style={styles.shippingPrice}>$15.00</Text>
            </Pressable>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard color={colors.textPrimary} size={20} strokeWidth={2} />
            <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>
          </View>
          <View style={styles.card}>
            {!isEditingPayment && savedPayment ? (
              <View style={styles.savedBlock}>
                <View style={styles.savedInfo}>
                  <Text style={styles.savedTitle}>Card</Text>
                  <Text style={styles.savedDesc}>
                    •••• •••• •••• {savedPayment.cardNumber.slice(-4)}
                  </Text>
                  <Text style={styles.savedDesc}>
                    Expires {savedPayment.expiryDate}
                  </Text>
                </View>
                <Pressable onPress={() => setIsEditingPayment(true)}>
                  <Text style={styles.changeText}>Change</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <FormInput
                  control={paymentForm.control}
                  name="cardNumber"
                  label="Card Number"
                  placeholder="**** **** **** 1234"
                  keyboardType="numeric"
                />
                <View style={styles.row}>
                  <View style={styles.flex1}>
                    <FormInput
                      control={paymentForm.control}
                      name="expiryDate"
                      label="Expiry Date"
                      placeholder="MM/YY"
                    />
                  </View>
                  <View style={styles.spacer} />
                  <View style={styles.flex1}>
                    <FormInput
                      control={paymentForm.control}
                      name="cvv"
                      label="CVV"
                      placeholder="123"
                      keyboardType="numeric"
                      secureTextEntry
                    />
                  </View>
                </View>
                <Button
                  label="SAVE PAYMENT"
                  onPress={onSavePayment}
                  style={{ marginTop: spacing.md }}
                />
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View
        style={[
          styles.stickyFooter,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            ${(total + (selectedShipping === "express" ? 15 : 0)).toFixed(2)}
          </Text>
        </View>
        <Button
          size="lg"
          label="PLACE ORDER"
          onPress={handlePlaceOrder}
          isLoading={isPlacingOrder}
        />
      </View>

      <OrderSuccessModal
        visible={showSuccessModal}
        onClose={handleCloseSuccess}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundLight,
  },
  backButton: {
    padding: spacing.sm,
    marginLeft: -spacing.sm,
  },
  headerTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 150,
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: "row",
  },
  flex1: {
    flex: 1,
  },
  spacer: {
    width: spacing.lg,
  },
  shippingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  shippingTitle: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  shippingDesc: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  shippingPrice: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  savedBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savedInfo: {
    flex: 1,
  },
  savedTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  savedDesc: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  changeText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    textDecorationLine: "underline",
  },
  saveAction: {
    marginTop: spacing.md,
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  saveActionText: {
    color: colors.textInverse,
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.surface,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  totalLabel: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.lg,
    color: colors.textMuted,
  },
  totalValue: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.xxl,
    color: colors.textPrimary,
  },
  placeOrderButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: radius.round,
    alignItems: "center",
  },
  placeOrderText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textInverse,
    letterSpacing: 1,
  },
});
