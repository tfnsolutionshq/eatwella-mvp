import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/EW BLACK.png";

const formatNGN = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

const mmToPt = (mm) => (mm / 25.4) * 72;

function getPaperConfig(paperSize = "A5") {
  switch (paperSize) {
    case "58mm":
      return {
        size: [mmToPt(58), mmToPt(297)],
        padding: mmToPt(3.5),
        fontBase: 8,
        fontSm: 7,
        fontLg: 10,
        fontXl: 12,
        gap: 3,
        isThermal: true,
      };
    case "80mm":
      return {
        size: [mmToPt(80), mmToPt(297)],
        padding: mmToPt(4.5),
        fontBase: 9,
        fontSm: 8,
        fontLg: 11,
        fontXl: 13,
        gap: 4,
        isThermal: true,
      };
    case "A5":
    default:
      return {
        size: "A5",
        padding: 22,
        fontBase: 10,
        fontSm: 8.5,
        fontLg: 13,
        fontXl: 16,
        gap: 4,
        isThermal: false,
      };
  }
}

function getStatusStyle(status) {
  const s = (status || "pending").toLowerCase();
  if (s === "completed") return { bg: "#dcfce7", color: "#15803d" };
  if (s === "cancelled") return { bg: "#fee2e2", color: "#b91c1c" };
  return { bg: "#fef9c3", color: "#b45309" };
}

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlvAw.ttf",
      fontWeight: "bold",
    },
  ],
});

const ReceiptPDFDocument = ({ order, paperSize = "A5" }) => {
  const items = order.items || order.order_items || [];

  const subtotal =
    order.order_items?.reduce((sum, item) => {
      const packagingPrice = item.packaging_price ?? 0;
      return sum + (item.subtotal ?? 0) + packagingPrice * (item.quantity ?? 1);
    }, 0) ?? 0;

  const vatAmount = order.tax_details?.VAT?.amount ?? 0;
  const vatType = order.tax_details?.VAT?.type ?? "VAT";
  const deliveryFee = Number(order.delivery_fee ?? 0);
  const discountAmount = Number(order.discount_amount ?? 0);
  const totalAmount = subtotal + deliveryFee + vatAmount - discountAmount;

  const statusValue = (order?.status || "pending").toLowerCase();
  const statusLabel =
    statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
  const { color: statusColor } = getStatusStyle(statusValue);

  const cfg = getPaperConfig(paperSize);

  const S = StyleSheet.create({
    page: {
      padding: cfg.padding,
      fontSize: cfg.fontBase,
      fontFamily: "Roboto",
      backgroundColor: "#ffffff",
    },
    logoContainer: {
      padding: 8,
      alignItems: "center",
      marginBottom: cfg.gap,
    },
    logo: {
      objectFit: "contain",
    },
    header: {
      alignItems: "center",
      marginBottom: cfg.gap * 2,
    },
    headerTitle: {
      fontSize: cfg.fontXl,
      fontWeight: "bold",
      marginBottom: cfg.gap,
      letterSpacing: 0.8,
    },
    orderIdRow: {
      marginBottom: cfg.gap,
    },
    orderId: {
      fontSize: cfg.fontLg,
      fontWeight: "bold",
    },
    statusText: {
      fontSize: cfg.fontSm,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    divider: {
      borderBottomWidth: 0.75,
      borderBottomColor: "#d1d5db",
      marginVertical: cfg.gap * 1.5,
    },
    section: {
      marginBottom: cfg.gap * 2,
    },
    sectionTitle: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
      marginBottom: cfg.gap * 1.5,
      color: "#111827",
      letterSpacing: 0.5,
    },

    // ── Detail rows: side-by-side on both thermal and A5 ──
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: cfg.isThermal ? cfg.gap * 1.5 : cfg.gap * 1.2,
    },
    label: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
    },
    value: {
      fontSize: cfg.fontBase,
      fontWeight: cfg.isThermal ? "bold" : "normal",
      color: "#111827",
      textAlign: "right",
      maxWidth: "58%",
      flexWrap: "wrap",
    },

    // ── Item rows ──
    itemWrapper: {
      marginBottom: cfg.gap * 1.5,
      paddingBottom: cfg.gap,
      borderBottomWidth: 0.5,
      borderBottomColor: "#f3f4f6",
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    itemName: {
      fontSize: cfg.fontBase,
      flex: 1,
      marginRight: 4,
      lineHeight: 1.4,
      color: "#111827",
    },
    itemQtyBadge: {
      fontSize: cfg.fontSm,
      fontWeight: "bold",
      color: "#f97316",
    },
    itemPrice: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
      color: "#111827",
    },
    itemPackaging: {
      fontSize: cfg.fontSm,
      color: "#9ca3af",
      marginTop: 2,
      textAlign: "right", // ← aligns packaging cost to the right
    },

    // ── Totals: side-by-side on both thermal and A5 ──
    totalsSection: {
      marginTop: cfg.gap,
    },
    vatRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: cfg.gap,
      borderBottomWidth: 0.75,
      borderBottomColor: "#d1d5db",
      paddingBottom: cfg.gap * 1.5,
    },
    vatLabel: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
    },
    vatValue: {
      fontSize: cfg.fontBase,
      color: "#374151",
      textAlign: "right",
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      // borderTopWidth: 0.75,
      // borderTopColor: "#d1d5db",
      marginTop: cfg.gap,
      paddingTop: cfg.gap * 1.5,
      marginBottom: cfg.gap,
    },
    totalLabel: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
      color: "#111827",
      letterSpacing: 0.5,
    },
    totalValue: {
      fontSize: cfg.fontLg,
      fontWeight: "bold",
      color: "#f97316",
    },
    paymentRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: cfg.gap,
    },
    paymentLabel: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
    },
    paymentValue: {
      fontSize: cfg.fontBase,
      fontWeight: cfg.isThermal ? "bold" : "normal",
      color: "#111827",
      textAlign: "right",
    },

    // ── Footer ──
    footer: {
      marginTop: cfg.gap * 4,
      alignItems: "center",
      borderTopWidth: 0.75,
      borderTopColor: "#d1d5db",
      paddingTop: cfg.gap * 2,
    },
    footerText: {
      fontSize: cfg.fontSm,
      color: "#9ca3af",
      textAlign: "center",
      lineHeight: 1.5,
    },
  });

  const receiptAddress =
    order.receiptAddress || order.delivery_address || "N/A";

  // Format phone number: replace +234 with 0 for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return "N/A";
    return phone.replace(/^\+234/, '0');
  };

  const detailRows = [
    ["Customer", order.customer_name || "Guest"],
    ["Email", order.customer_email || "N/A"],
    ["Phone", formatPhoneNumber(order.customer_phone)],
    ["Address", receiptAddress],
    ...(order.attendant
      ? [
          ["Attendant", order.attendant.name],
          ["Attendant Email", order.attendant.email],
        ]
      : []),
    [
      "Order Type",
      order.order_type === "dine" 
        ? "Dine-In" 
        : order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1) ||
          "N/A",
    ],
    order.table_number ? ["Table", `#${order.table_number}`] : null,
  ].filter(Boolean);

  return (
    <Document>
      <Page size={cfg.size} style={S.page}>
        <View>
          {/* ── Logo ── */}
          <View style={S.logoContainer}>
            <Image src={logo} style={S.logo} />
          </View>

          {/* ── Header ── */}
          <View style={S.header}>
            <Text style={S.headerTitle}>ORDER RECEIPT</Text>
            <View style={S.orderIdRow}>
              <Text style={S.orderId}>
                #{order.order_number || order.id || "PENDING"}
              </Text>
            </View>
            <Text style={[S.statusText, { color: statusColor }]}>
              {statusLabel.toUpperCase()}
            </Text>
          </View>

          <View style={S.divider} />

          {/* ── Customer Details ── */}
          <View style={S.section}>
            {detailRows.map(([label, value], i) => (
              <View style={S.row} key={i}>
                <Text style={S.label}>{label}</Text>
                <Text style={S.value}>{value}</Text>
              </View>
            ))}
          </View>

          <View style={S.divider} />

          {/* ── Order Items ── */}
          <View style={S.section}>
            <Text style={S.sectionTitle}>ORDER ITEMS</Text>
            {items.map((item, index) => (
              <View key={index} style={S.itemWrapper}>
                <View style={S.itemRow}>
                  <Text style={S.itemName}>
                    <Text style={S.itemQtyBadge}>{item.quantity}x </Text>
                    {item.menu?.name || item.name || "Item"}
                  </Text>
                  <Text style={S.itemPrice}>
                    {formatNGN(
                      (item.menu?.price || item.price || 0) * item.quantity,
                    )}
                  </Text>
                </View>
                {item.packaging_price ? (
                  <Text style={S.itemPackaging}>
                    + Packaging: {formatNGN(item.packaging_price)}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          <View style={S.divider} />

          {/* ── Tax + Total ── */}
          <View style={S.totalsSection}>
            {deliveryFee > 0 && (
              <View style={S.vatRow}>
                <Text style={S.vatLabel}>Delivery Fee</Text>
                <Text style={S.vatValue}>{formatNGN(deliveryFee)}</Text>
              </View>
            )}
            {discountAmount > 0 && (
              <View style={S.vatRow}>
                <Text style={[S.vatLabel, { color: "#16a34a" }]}>Discount</Text>
                <Text style={[S.vatValue, { color: "#16a34a" }]}>
                  -{formatNGN(discountAmount)}
                </Text>
              </View>
            )}
            {order.tax_details.VAT.mode === "exclusive" ? <View style={S.vatRow}>
              <Text style={S.vatLabel}>Tax ({vatType})</Text>
              <Text style={S.vatValue}>{formatNGN(vatAmount)}</Text>
            </View> : ""}
            <View style={S.totalRow}>
              <Text style={S.totalLabel}>TOTAL PAYMENT</Text>
              <Text style={S.totalValue}>{formatNGN(totalAmount)}</Text>
            </View>
            <View style={S.paymentRow}>
              <Text style={S.paymentLabel}>Payment method</Text>
              <Text style={S.paymentValue}>
                {order.payment_type
                  ? order.payment_type.charAt(0).toUpperCase() +
                    order.payment_type.slice(1)
                  : order.invoice?.payment_method || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={S.footer}>
          <Text style={S.footerText}>Thanks for coming!</Text>
          <Text style={[S.footerText, { marginTop: cfg.gap }]}>
            See you again soon.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDFDocument;
