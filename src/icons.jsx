// Professional SVG icon library — no emojis, no AI-looking icon packs.
// All icons are hand-tuned 24x24 viewBox, stroke-based for crispness.

const Icon = ({ d, size = 18, color = "currentColor", fill = "none", strokeWidth = 1.8, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

// Navigation & UI
export const IcHome    = (p) => <Icon {...p} d="M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3z" />;
export const IcGrid    = (p) => <Icon {...p} d={["M3 3h7v7H3z","M14 3h7v7h-7z","M3 14h7v7H3z","M14 14h7v7h-7z"]} />;
export const IcMenu    = (p) => <Icon {...p} d={["M3 12h18","M3 6h18","M3 18h18"]} />;
export const IcClose   = (p) => <Icon {...p} d={["M18 6L6 18","M6 6l12 12"]} />;
export const IcChevronRight = (p) => <Icon {...p} d="M9 18l6-6-6-6" />;
export const IcChevronLeft  = (p) => <Icon {...p} d="M15 18l-6-6 6-6" />;
export const IcChevronDown  = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;
export const IcArrowRight   = (p) => <Icon {...p} d={["M5 12h14","M12 5l7 7-7 7"]} />;
export const IcArrowLeft    = (p) => <Icon {...p} d={["M19 12H5","M12 19l-7-7 7-7"]} />;
export const IcSearch  = (p) => <Icon {...p} d={["M11 19a8 8 0 100-16 8 8 0 000 16z","M21 21l-4.35-4.35"]} />;
export const IcFilter  = (p) => <Icon {...p} d={["M22 3H2l8 9.46V19l4 2v-8.54L22 3z"]} />;
export const IcSort    = (p) => <Icon {...p} d={["M3 6h18","M7 12h10","M11 18h2"]} />;
export const IcCheck   = (p) => <Icon {...p} d="M20 6L9 17l-5-5" />;
export const IcPlus    = (p) => <Icon {...p} d={["M12 5v14","M5 12h14"]} />;
export const IcMinus   = (p) => <Icon {...p} d="M5 12h14" />;
export const IcTrash   = (p) => <Icon {...p} d={["M3 6h18","M19 6l-1 14H6L5 6","M9 6V4h6v2","M10 11v6","M14 11v6"]} />;
export const IcEdit    = (p) => <Icon {...p} d={["M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7","M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"]} />;
export const IcEye     = (p) => <Icon {...p} d={["M1 12s4-8 11-8 11 8 11 8","M1 12s4 8 11 8 11-8 11-8","M12 9a3 3 0 100 6 3 3 0 000-6z"]} />;
export const IcEyeOff  = (p) => <Icon {...p} d={["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94","M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19","M1 1l22 22","M14.12 14.12a3 3 0 01-4.24-4.24"]} />;
export const IcCopy    = (p) => <Icon {...p} d={["M8 17H5a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v3","M12 21h7a2 2 0 002-2v-7a2 2 0 00-2-2h-7a2 2 0 00-2 2v7a2 2 0 002 2z"]} />;
export const IcLogout  = (p) => <Icon {...p} d={["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"]} />;
export const IcSettings= (p) => <Icon {...p} d={["M12 15a3 3 0 100-6 3 3 0 000 6z","M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"]} />;
export const IcRefresh = (p) => <Icon {...p} d={["M23 4v6h-6","M1 20v-6h6","M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"]} />;
export const IcBell    = (p) => <Icon {...p} d={["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"]} />;
export const IcUser    = (p) => <Icon {...p} d={["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8z"]} />;
export const IcUsers   = (p) => <Icon {...p} d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 11a4 4 0 100-8 4 4 0 000 8z","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"]} />;
export const IcShield  = (p) => <Icon {...p} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;

// Commerce & Finance
export const IcShoppingCart = (p) => <Icon {...p} d={["M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z","M3 6h18","M16 10a4 4 0 01-8 0"]} />;
export const IcPackage    = (p) => <Icon {...p} d={["M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"]} />;
export const IcTruck      = (p) => <Icon {...p} d={["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z","M18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"]} />;
export const IcCreditCard = (p) => <Icon {...p} d={["M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z","M1 10h22"]} />;
export const IcDollar     = (p) => <Icon {...p} d={["M12 1v22","M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"]} />;
export const IcTrendUp    = (p) => <Icon {...p} d={["M23 6l-9.5 9.5-5-5L1 18","M17 6h6v6"]} />;
export const IcBarChart   = (p) => <Icon {...p} d={["M18 20V10","M12 20V4","M6 20v-6"]} />;
export const IcPieChart   = (p) => <Icon {...p} d={["M21.21 15.89A10 10 0 118.08 2.67","M22 12A10 10 0 0012 2v10z"]} />;
export const IcTag        = (p) => <Icon {...p} d={["M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z","M7 7h.01"]} />;
export const IcPercent   = (p) => <Icon {...p} d={["M19 5L5 19","M6.5 6.5a.5.5 0 100-1 .5.5 0 000 1z","M17.5 17.5a.5.5 0 100-1 .5.5 0 000 1z"]} />;
export const IcSave       = (p) => <Icon {...p} d={["M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z","M17 21v-8H7v8","M7 3v5h8"]} />;

// Communication
export const IcMail    = (p) => <Icon {...p} d={["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"]} />;
export const IcPhone   = (p) => <Icon {...p} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.67 9.79 19.79 19.79 0 01.61 1.13 2 2 0 012.6 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l.95-.95a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />;
export const IcChat    = (p) => <Icon {...p} d={["M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"]} />;
export const IcSend    = (p) => <Icon {...p} d={["M22 2L11 13","M22 2L15 22 11 13 2 9l20-7z"]} />;
export const IcAt      = (p) => <Icon {...p} d={["M12 8a4 4 0 100 8 4 4 0 000-8z","M20 12a8 8 0 10-3.22 6.39"]} />;

// Business & People
export const IcStore   = (p) => <Icon {...p} d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"]} />;
export const IcBuilding= (p) => <Icon {...p} d={["M3 21h18","M5 21V7l7-4 7 4v14","M9 21V11h6v10","M9 8h.01","M15 8h.01","M9 14h.01","M15 14h.01"]} />;
export const IcHandshake=(p) => <Icon {...p} d={["M18 15l-6-6","M9.5 7.5l1.5 1.5L15 5l-3-3H8L2 8l3.5 3.5 2-2","M14.5 16.5l-2 2 3 3 6-6-3-3","M5 15l4 4"]} />;
export const IcAward   = (p) => <Icon {...p} d={["M12 15a7 7 0 100-14 7 7 0 000 14z","M8.21 13.89L7 23l5-3 5 3-1.21-9.12"]} />;
export const IcStar    = (p) => <Icon {...p} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
export const IcZap     = (p) => <Icon {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
export const IcTarget  = (p) => <Icon {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 18a6 6 0 100-12 6 6 0 000 12z","M12 14a2 2 0 100-4 2 2 0 000 4z"]} />;
export const IcLayers  = (p) => <Icon {...p} d={["M12 2L2 7l10 5 10-5-10-5z","M2 17l10 5 10-5","M2 12l10 5 10-5"]} />;
export const IcKey     = (p) => <Icon {...p} d={["M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"]} />;
export const IcLock    = (p) => <Icon {...p} d={["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"]} />;
export const IcUnlock  = (p) => <Icon {...p} d={["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 019.9-1"]} />;

// Location & Time
export const IcMapPin  = (p) => <Icon {...p} d={["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z","M12 7a3 3 0 100 6 3 3 0 000-6z"]} />;
export const IcClock   = (p) => <Icon {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 6v6l4 2"]} />;
export const IcCalendar= (p) => <Icon {...p} d={["M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z","M16 2v4","M8 2v4","M3 10h18"]} />;

// Status
export const IcCheckCircle  = (p) => <Icon {...p} d={["M22 11.08V12a10 10 0 11-5.93-9.14","M22 4L12 14.01l-3-3"]} />;
export const IcXCircle       = (p) => <Icon {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M15 9l-6 6","M9 9l6 6"]} />;
export const IcAlertTriangle = (p) => <Icon {...p} d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"]} />;
export const IcInfo          = (p) => <Icon {...p} d={["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 8h.01","M11 12h1v4h1"]} />;
export const IcLoader        = (p) => <Icon {...p} d={["M12 2v4","M12 18v4","M4.93 4.93l2.83 2.83","M16.24 16.24l2.83 2.83","M2 12h4","M18 12h4","M4.93 19.07l2.83-2.83","M16.24 7.76l2.83-2.83"]} />;

// File & Document
export const IcFileText = (p) => <Icon {...p} d={["M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z","M14 2v6h6","M16 13H8","M16 17H8","M10 9H8"]} />;
export const IcUpload   = (p) => <Icon {...p} d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]} />;
export const IcDownload = (p) => <Icon {...p} d={["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"]} />;

// The BulkBuy logo mark — abstract interlocking B shapes
export function BulkBuyMark({ size = 32, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="9" fill="url(#bb-grad)" />
      <defs>
        <linearGradient id="bb-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f7cff" />
          <stop offset="1" stopColor="#7c5cfc" />
        </linearGradient>
      </defs>
      {/* Two interlocking arcs forming a "B" + bulk stack mark */}
      <path d="M8 7h7a4 4 0 010 8H8V7z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M8 15h8a4 4 0 010 8H8v-8z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M20 11l3 5-3 5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function BulkBuyWordmark({ size = 28, light = true }) {
  const c = light ? "#ffffff" : "#0a0f1e";
  return (
    <svg width={size * 4.2} height={size} viewBox="0 0 200 48" fill="none">
      {/* Bold geometric wordmark — not a font, actual SVG paths for "BULKBUY" */}
      <text x="0" y="37"
        fontFamily="'Manrope','Inter',sans-serif"
        fontWeight="800"
        fontSize="38"
        letterSpacing="-1.5"
        fill={c}>BulkBuy</text>
      <rect x="0" y="43" width="85" height="2.5" rx="1.25" fill="url(#wm-grad)" />
      <defs>
        <linearGradient id="wm-grad" x1="0" y1="0" x2="85" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f7cff" />
          <stop offset="1" stopColor="#7c5cfc" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

