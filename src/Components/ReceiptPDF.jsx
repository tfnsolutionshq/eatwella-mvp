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

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatNGN = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);

// Points per mm (1 pt = 1/72 inch; 1 inch = 25.4 mm)
const mmToPt = (mm) => (mm / 25.4) * 72;

/**
 * Returns page size and style scale for the given paperSize string.
 *
 * Supported values:
 *   "58mm"  – 58 mm wide thermal roll (common POS)
 *   "80mm"  – 80 mm wide thermal roll (wider POS)
 *   "A5"    – standard A5 desktop/office receipt (default)
 */
function getPaperConfig(paperSize = "A5") {
  switch (paperSize) {
    case "58mm":
      return {
        // 58 × 297 mm — height is auto/long enough for content
        size: [mmToPt(58), mmToPt(297)],
        padding: mmToPt(3),
        fontBase: 7,
        fontSm: 6,
        fontLg: 9,
        fontXl: 11,
        gap: 2,
        isThermal: true,
      };
    case "80mm":
      return {
        size: [mmToPt(80), mmToPt(297)],
        padding: mmToPt(4),
        fontBase: 8,
        fontSm: 7,
        fontLg: 10,
        fontXl: 12,
        gap: 3,
        isThermal: true,
      };
    case "A5":
    default:
      return {
        size: "A5",
        padding: 20,
        fontBase: 10,
        fontSm: 8,
        fontLg: 13,
        fontXl: 16,
        gap: 4,
        isThermal: false,
      };
  }
}

// Status badge colours
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

// ─────────────────────────────────────────────────────────────────────────────

const ReceiptPDFDocument = ({ order, paperSize = "A5" }) => {
  const items = order.items || order.order_items || [];

  const subtotal =
    order.order_items?.reduce((sum, item) => {
      const packagingPrice = item.packaging_price ?? 0;
      return sum + (item.subtotal ?? 0) + packagingPrice * (item.quantity ?? 1);
    }, 0) ?? 0;

  const vatAmount = order.tax_details?.VAT?.amount ?? 0;
  const vatType = order.tax_details?.VAT?.type ?? "VAT";
  const totalAmount = subtotal + vatAmount;

  const statusValue = (order?.status || "pending").toLowerCase();
  const statusLabel =
    statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
  const { bg: statusBg, color: statusColor } = getStatusStyle(statusValue);

  const cfg = getPaperConfig(paperSize);

  // ── Dynamic StyleSheet (re-created per render based on cfg) ──────────────
  const S = StyleSheet.create({
    page: {
      padding: cfg.padding,
      fontSize: cfg.fontBase,
      fontFamily: "Roboto",
      backgroundColor: "#ffffff",
      // display: "flex",
      // flexDirection: "column",
      // justifyContent: "space-between",
    },
    logoContainer: {
      // width: cfg.isThermal ? 60 : 100, // narrower on POS, wider on A5
      // height: cfg.isThermal ? 30 : 50,
      padding: 10,
    },
    // Logo (before text)
    logo: {
      // width: cfg.isThermal ? 60 : 100, // narrower on POS, wider on A5
      // height: cfg.isThermal ? 30 : 50,
      // marginBottom: cfg.gap * 2,
      objectFit: "contain",
    },
    // Header
    header: {
      alignItems: "center",
      marginBottom: cfg.gap * 2,
    },
    headerTitle: {
      fontSize: cfg.fontXl,
      // fontFamily: "Helvetica-Bold",
      fontWeight: "bold",
      marginBottom: cfg.gap,
    },
    headerSubtitle: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
      marginBottom: cfg.gap,
    },
    orderIdRow: {
      marginBottom: cfg.gap,
    },
    orderId: {
      fontSize: cfg.fontLg,
      fontWeight: "bold",
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      marginTop: cfg.gap,
    },
    statusText: {
      fontSize: cfg.fontSm,
      fontWeight: "bold",
      letterSpacing: 0.5,
    },
    // PIN block
    pin: {
      backgroundColor: "#fff7ed",
      borderRadius: 4,
      padding: cfg.gap * 1.5,
      marginBottom: cfg.gap * 2,
      alignItems: "center",
    },
    pinText: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
      marginBottom: cfg.gap,
    },
    pinNote: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
      textAlign: "center",
    },
    // Divider
    divider: {
      borderBottomWidth: 0.5,
      borderBottomColor: "#e5e7eb",
      marginVertical: cfg.gap * 1.5,
    },
    // Section
    section: {
      marginBottom: cfg.gap * 2,
    },
    sectionTitle: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
      marginBottom: cfg.gap,
      color: "#374151",
    },
    // Rows — thermal uses a stacked layout for very narrow widths
    row: cfg.isThermal
      ? { marginBottom: cfg.gap }
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: cfg.gap,
        },
    label: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
    },
    value: cfg.isThermal
      ? { fontSize: cfg.fontBase, fontWeight: "bold" }
      : {
          fontSize: cfg.fontBase,
          color: "#111827",
          textAlign: "right",
          maxWidth: "60%",
        },
    // Items
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    itemName: {
      fontSize: cfg.fontBase,
      flex: 1,
      marginRight: 4,
    },
    itemPrice: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
    },
    itemPackaging: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
      marginTop: 1,
    },
    // Totals
    totalRow: cfg.isThermal
      ? {
          borderTopWidth: 0.5,
          borderTopColor: "#e5e7eb",
          marginTop: cfg.gap,
          paddingTop: cfg.gap,
        }
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          borderTopWidth: 0.5,
          borderTopColor: "#e5e7eb",
          marginTop: cfg.gap,
          paddingTop: cfg.gap,
        },
    totalLabel: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
    },
    totalValue: {
      fontSize: cfg.fontLg,
      fontWeight: "bold",
      color: "#f97316",
    },
    // Footer
    footer: {
      marginTop: cfg.gap * 3,
      alignItems: "center",
      borderTopWidth: 0.5,
      borderTopColor: "#e5e7eb",
      paddingTop: cfg.gap * 2,
    },
    footerText: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
      textAlign: "center",
    },
  });

  // ── Receipt address ──────────────────────────────────────────────────────
  // NOTE: zone matching happens in ReceiptDetails; pass receiptAddress as a
  // prop if you prefer, but for now we fall back to delivery_address.
  const receiptAddress =
    order.receiptAddress || order.delivery_address || "N/A";

  // ── Detail rows ──────────────────────────────────────────────────────────
  const detailRows = [
    ["Customer", order.customer_name || "Guest"],
    ["Email", order.customer_email || "N/A"],
    ["Phone", order.customer_phone || "N/A"],
    ["Address", receiptAddress],
    [
      "Order Type",
      order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1) ||
        "N/A",
    ],
    order.table_number ? ["Table", `#${order.table_number}`] : null,
  ].filter(Boolean);

  return (
    <Document>
      <Page size={cfg.size} style={S.page}>
        <View style={S.main}>
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
            <Text style={S.sectionTitle}>CUSTOMER DETAILS</Text>
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
              <View key={index} style={{ marginBottom: cfg.gap }}>
                <View style={S.itemRow}>
                  <Text style={S.itemName}>
                    {item.quantity}x {item.menu?.name || item.name || "Item"}
                  </Text>
                  <Text style={S.itemPrice}>
                    {formatNGN(item.menu?.price || item.price || 0)}
                  </Text>
                </View>
                {item.packaging_price ? (
                  <Text style={S.itemPackaging}>
                    Packaging: {formatNGN(item.packaging_price)}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          <View style={S.divider} />

          {/* ── Tax + Total ── */}
          <View style={S.section}>
            <View style={S.row}>
              <Text style={S.label}>Tax ({vatType})</Text>
              <Text style={S.value}>{formatNGN(vatAmount)}</Text>
            </View>
            <View style={S.totalRow}>
              <Text style={S.totalLabel}>TOTAL PAYMENT</Text>
              <Text style={S.totalValue}>{formatNGN(totalAmount)}</Text>
            </View>
            <View style={[S.row, { marginTop: cfg.gap }]}>
              <Text style={S.label}>Payment Method</Text>
              <Text style={S.value}>
                {order.payment_type.charAt(0).toUpperCase() +
                  order.payment_type.slice(1) ||
                  order.invoice?.payment_method ||
                  "N/A"}
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
