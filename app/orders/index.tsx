import { Image as ExpoImage } from "expo-image";
import { useRouter } from "expo-router";
import { CheckCircle, ChevronLeft, Clock, Package } from "lucide-react-native";
import { FlatList, Pressable, Text, View } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../../src/components/IconButton";
import { SneakerLoader } from "../../src/components/SneakerLoader";
import { useOrders } from "../../src/hooks/useOrders";
import { colors, radius, spacing, typography } from "../../src/theme";

function OrderCard({ order }: { order: any }) {
    const { theme } = useStyles();
  const firstItem = order.items?.[0];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "#2E7D32"; // Green
      case "processing":
        return "#F5A623"; // Orange
      case "shipped":
        return "#4A90E2"; // Blue
      default:
        return theme.colors.textMuted;
    }
  };

  const getStatusIcon = (status: string, color: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle color={color} size={14} strokeWidth={2.5} />;
      case "processing":
        return <Clock color={color} size={14} strokeWidth={2.5} />;
      case "shipped":
        return <Package color={color} size={14} strokeWidth={2.5} />;
      default:
        return <Package color={color} size={14} strokeWidth={2.5} />;
    }
  };

  const statusColor = getStatusColor(order.status);

  const formattedDate = new Date(order.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/details/${firstItem?.productId}` as any)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>
          ORD-{order.id.slice(0, 8).toUpperCase()}
        </Text>
        <Text style={styles.orderDate}>{formattedDate}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.imageContainer}>
          {firstItem?.image ? (
            <ExpoImage
              source={{ uri: firstItem.image }}
              style={styles.productImage}
              contentFit="contain"
              transition={300}
            />
          ) : (
            <Package color={theme.colors.textMuted} size={24} />
          )}
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {firstItem?.name || "Unknown Product"}
          </Text>
          <Text style={styles.itemCount}>
            {order.items?.length || 0}{" "}
            {order.items?.length === 1 ? "Item" : "Items"}{" "}
            {firstItem?.size ? `• Size ${firstItem.size}` : ""}
          </Text>
          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <View
          style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}
        >
          {getStatusIcon(order.status, statusColor)}
          <Text style={[styles.statusText, { color: statusColor }]}>
            {order.status}
          </Text>
        </View>
        <Text style={styles.detailsLink}>View Details</Text>
      </View>
    </Pressable>
  );
}

export default function OrdersScreen() {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { data: orders, isLoading, error } = useOrders();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon={
            <ChevronLeft
              color={theme.colors.textPrimary}
              size={24}
              strokeWidth={2.5}
            />
          }
          onPress={() => router.back()}
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 44 }} />
      </View>

      {isLoading ? (
        <View
          style={[styles.emptyContainer, { flex: 1, justifyContent: "center" }]}
        >
          <SneakerLoader label="Fetching orders..." transparent />
        </View>
      ) : error ? (
        <View
          style={[styles.emptyContainer, { flex: 1, justifyContent: "center" }]}
        >
          <Text style={styles.emptyTitle}>Error</Text>
          <Text style={styles.emptySubtitle}>
            Could not load orders. Please try again later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Package color={theme.colors.textMuted} size={48} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptySubtitle}>
                You haven't placed any orders. Start exploring to find your
                perfect pair.
              </Text>
              <Pressable
                style={styles.exploreButton}
                onPress={() => router.push("/(tabs)/discover" as any)}
              >
                <Text style={styles.exploreButtonText}>EXPLORE KICKS</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  orderId: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  orderDate: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.radius.xl,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.sm,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  orderInfo: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  productName: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  itemCount: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginBottom: 6,
  },
  orderTotal: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.backgroundLight,
    marginVertical: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.round,
    gap: 6,
  },
  statusText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  detailsLink: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
    textDecorationLine: "underline",
  },
  emptyContainer: {
    paddingTop: 100,
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: theme.spacing.xxl,
  },
  exploreButton: {
    backgroundColor: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.xxxl,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radius.round,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  exploreButtonText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: 12,
    color: theme.colors.textInverse,
    letterSpacing: 1.5,
  },
}));
