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

const mmToPt = (mm) => (mm / 25.4) * 72;

function getPaperConfig(paperSize = "A5") {
  switch (paperSize) {
    case "58mm":
      return {
        size: [mmToPt(58), mmToPt(297)],
        padding: mmToPt(3.5),
        fontBase: 8, // +1 from 7
        fontSm: 7, // +1 from 6
        fontLg: 10, // +1 from 9
        fontXl: 12, // +1 from 11
        gap: 3, // +1 from 2 — more breathing room
        isThermal: true,
      };
    case "80mm":
      return {
        size: [mmToPt(80), mmToPt(297)],
        padding: mmToPt(4.5),
        fontBase: 9, // +1 from 8
        fontSm: 8, // +1 from 7
        fontLg: 11, // +1 from 10
        fontXl: 13, // +1 from 12
        gap: 4, // +1 from 3
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

  const S = StyleSheet.create({
    page: {
      padding: cfg.padding,
      fontSize: cfg.fontBase,
      fontFamily: "Roboto",
      backgroundColor: "#ffffff",
    },
    logoContainer: {
      padding: 8,
      alignItems: "center", // center logo on all sizes
      marginBottom: cfg.gap,
    },
    logo: {
      // Let the image fill its container naturally
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
      letterSpacing: 0.8, // slightly spaced caps read better at small sizes
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
      borderBottomWidth: 0.75, // slightly thicker — more visible on small prints
      borderBottomColor: "#d1d5db",
      marginVertical: cfg.gap * 1.5,
    },
    section: {
      marginBottom: cfg.gap * 2,
    },
    sectionTitle: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
      marginBottom: cfg.gap * 1.5, // more space under section headings
      color: "#111827", // darker than before (#374151) — better contrast
      letterSpacing: 0.5,
    },

    // ── Detail rows: always stacked on thermal, side-by-side on A5 ──
    row: cfg.isThermal
      ? {
          marginBottom: cfg.gap * 1.5, // more vertical gap between rows
        }
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: cfg.gap * 1.2,
        },
    label: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
      marginBottom: cfg.isThermal ? 1 : 0, // small gap between label and value on thermal
    },
    value: cfg.isThermal
      ? {
          fontSize: cfg.fontBase,
          fontWeight: "bold",
          color: "#111827",
          flexWrap: "wrap", // allow long values to wrap
        }
      : {
          fontSize: cfg.fontBase,
          color: "#111827",
          textAlign: "right",
          maxWidth: "58%", // slightly narrower so long text wraps rather than overflows
          flexWrap: "wrap",
        },

    // ── Item rows ──
    itemWrapper: {
      marginBottom: cfg.gap * 1.5,
      paddingBottom: cfg.gap,
      borderBottomWidth: 0.5,
      borderBottomColor: "#f3f4f6", // very subtle separator between items
    },
    itemRow: cfg.isThermal
      ? {
          // On thermal: name on top, price below (avoids squishing on 58mm)
          flexDirection: "column",
        }
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        },
    itemName: {
      fontSize: cfg.fontBase,
      flex: cfg.isThermal ? undefined : 1,
      marginRight: cfg.isThermal ? 0 : 4,
      lineHeight: 1.4, // looser line-height helps on small sizes
      color: "#111827",
    },
    itemQtyBadge: {
      // Quantity shown as a small inline tag before the name on thermal
      fontSize: cfg.fontSm,
      fontWeight: "bold",
      color: "#f97316",
      marginRight: 2,
    },
    itemPrice: {
      fontSize: cfg.fontBase,
      fontWeight: "bold",
      color: cfg.isThermal ? "#374151" : "#111827",
      marginTop: cfg.isThermal ? 1 : 0, // tiny top gap when stacked
    },
    itemPackaging: {
      fontSize: cfg.fontSm,
      color: "#9ca3af", // slightly lighter — clearly secondary
      marginTop: 2,
    },

    // ── Totals ──
    totalsSection: {
      marginTop: cfg.gap,
    },
    vatRow: cfg.isThermal
      ? { marginBottom: cfg.gap }
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: cfg.gap,
        },
    vatLabel: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
      marginBottom: cfg.isThermal ? 1 : 0,
    },
    vatValue: cfg.isThermal
      ? { fontSize: cfg.fontBase, color: "#374151" }
      : { fontSize: cfg.fontBase, color: "#374151", textAlign: "right" },
    totalRow: cfg.isThermal
      ? {
          borderTopWidth: 0.75,
          borderTopColor: "#d1d5db",
          marginTop: cfg.gap,
          paddingTop: cfg.gap * 1.5,
          marginBottom: cfg.gap,
        }
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopWidth: 0.75,
          borderTopColor: "#d1d5db",
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
      marginTop: cfg.isThermal ? 2 : 0,
    },
    paymentRow: cfg.isThermal
      ? { marginTop: cfg.gap }
      : {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: cfg.gap,
        },
    paymentLabel: {
      fontSize: cfg.fontSm,
      color: "#6b7280",
      marginBottom: cfg.isThermal ? 1 : 0,
    },
    paymentValue: cfg.isThermal
      ? { fontSize: cfg.fontBase, fontWeight: "bold", color: "#111827" }
      : { fontSize: cfg.fontBase, color: "#111827", textAlign: "right" },

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

  const detailRows = [
    ["Customer", order.customer_name || "Guest"],
    ["Email", order.customer_email || "N/A"],
    ["Phone", order.customer_phone || "N/A"],
    ["Address", receiptAddress],

    // 👇 Attendant (conditionally included)
    ...(order.attendant
      ? [
          ["Attendant", order.attendant.name],
          ["Attendant Email", order.attendant.email],
        ]
      : []),

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
                  {cfg.isThermal ? (
                    // Thermal: qty + name on one line, price below
                    <>
                      <Text style={S.itemName}>
                        <Text style={S.itemQtyBadge}>{item.quantity}x </Text>
                        {item.menu?.name || item.name || "Item"}
                      </Text>
                      <Text style={S.itemPrice}>
                        {formatNGN(
                          (item.menu?.price || item.price || 0) * item.quantity,
                        )}
                      </Text>
                    </>
                  ) : (
                    // A5: traditional side-by-side
                    <>
                      <Text style={S.itemName}>
                        {item.quantity}x{" "}
                        {item.menu?.name || item.name || "Item"}
                      </Text>
                      <Text style={S.itemPrice}>
                        {formatNGN(item.menu?.price || item.price || 0)}
                      </Text>
                    </>
                  )}
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
            <View style={S.vatRow}>
              <Text style={S.vatLabel}>Tax ({vatType})</Text>
              <Text style={S.vatValue}>{formatNGN(vatAmount)}</Text>
            </View>
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
