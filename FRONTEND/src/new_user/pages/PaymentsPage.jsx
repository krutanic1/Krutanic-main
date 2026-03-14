import React from "react";
import { useDashboard } from "../DashboardContext";
import { SectionHeader } from "../new-dashboad";

/* Format "Dec 2025" or ISO "2025-02-13" → "Feb 2025" */
const formatMonthLabel = (raw) => {
    if (!raw) return null;
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    }
    return raw; // already human-readable
};

const fmt = (n) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

const PaymentsPage = () => {
    const { enrollment, userData, loading, isFullyPaid } = useDashboard();

    const programPrice = enrollment?.programPrice ?? 0;
    const paidAmount = enrollment?.paidAmount ?? 0;
    // Always compute remaining from actual fee fields (DB remainingAmount can be stale)
    const remainingAmount = Math.max(0, programPrice - paidAmount);

    const payPct = programPrice > 0
        ? Math.round((paidAmount / programPrice) * 100)
        : (isFullyPaid ? 100 : 0);

    // After /enrollments API, enrollment.domain is a course object
    const domainName =
        enrollment?.domain?.title ||
        (typeof enrollment?.domain === "string" ? enrollment.domain : "") ||
        "—";

    const monthOpted = enrollment?.monthOpted || null;
    const clearPaymentMonth = enrollment?.clearPaymentMonth || null;
    const modeofpayment = enrollment?.modeofpayment || null;

    const handlePaySupport = () => {
        const name = userData?.fullname || "Student";
        const email = userData?.email || "";
        const msg = `Hello, I need help with my payment.\nName: ${name}\nEmail: ${email}\nDomain: ${domainName}\nProgram: ${enrollment?.program || ""}\nPaid: ${fmt(paidAmount)} / ${fmt(programPrice)}\nRemaining: ${fmt(remainingAmount)}`;
        window.open(`https://wa.me/917829102936?text=${encodeURIComponent(msg)}`, "_blank");
    };

    if (loading) {
        return (
            <div className="nd-section-skeleton">
                <div className="nd-skeleton nd-sk-hero" />
                <div className="nd-skeleton nd-sk-card" />
                <div className="nd-skeleton nd-sk-card" />
            </div>
        );
    }

    return (
        <div className="nd-section-body">
            <SectionHeader icon="payments" title="Payment Details" subtitle="Your fee payment breakdown" />

            {!enrollment ? (
                <div className="nd-empty-state">
                    <span className="material-symbols-outlined nd-empty-icon">payments</span>
                    <p>No enrollment data found.</p>
                </div>
            ) : (
                <>
                    {/* Status Banner */}
                    <div className={`nd-payment-status-banner ${isFullyPaid ? "nd-pay-banner-green" : "nd-pay-banner-red"}`}>
                        <span className="material-symbols-outlined nd-pay-status-icon">
                            {isFullyPaid ? "check_circle" : "pending"}
                        </span>
                        <div>
                            <p className="nd-pay-status-title">{isFullyPaid ? "Payment Complete" : "Payment Pending"}</p>
                            <p className="nd-pay-status-sub">
                                {isFullyPaid
                                    ? "Your program fee is fully paid. Thank you!"
                                    : `${fmt(remainingAmount)} remaining to clear your dues.`}
                            </p>
                        </div>
                    </div>

                    {/* Payment Breakdown Card */}
                    <div className="nd-payment-card">

                        {/* Program & Domain */}
                        <div className="nd-payment-row">
                            <span className="nd-payment-row-label">Program</span>
                            <span className="nd-payment-row-value">{enrollment?.program || "—"}</span>
                        </div>
                        <div className="nd-payment-row nd-payment-divider">
                            <span className="nd-payment-row-label">Domain</span>
                            <span className="nd-payment-row-value">{domainName}</span>
                        </div>

                        {/* Fee Breakdown */}
                        <div className="nd-payment-row">
                            <span className="nd-payment-row-label">Program Fee</span>
                            <span className="nd-payment-row-value nd-pay-total">{fmt(programPrice)}</span>
                        </div>
                        <div className="nd-payment-row">
                            <span className="nd-payment-row-label">Amount Paid</span>
                            <span className="nd-payment-row-value nd-pay-green">{fmt(paidAmount)}</span>
                        </div>
                        <div className="nd-payment-row nd-payment-divider">
                            <span className="nd-payment-row-label">Remaining Balance</span>
                            <span className={`nd-payment-row-value ${remainingAmount > 0 ? "nd-pay-red" : "nd-pay-green"}`}>
                                {fmt(remainingAmount)}
                            </span>
                        </div>

                        {/* Payment Schedule */}
                        {monthOpted && (
                            <div className="nd-payment-row">
                                <span className="nd-payment-row-label">Opted Month</span>
                                <span className="nd-payment-row-value">{formatMonthLabel(monthOpted)}</span>
                            </div>
                        )}
                        {clearPaymentMonth && (
                            <div className="nd-payment-row">
                                <span className="nd-payment-row-label">Payment Due Month</span>
                                <span className={`nd-payment-row-value ${remainingAmount > 0 ? "nd-pay-red" : ""}`}>
                                    {formatMonthLabel(clearPaymentMonth)}
                                </span>
                            </div>
                        )}
                        {remainingAmount > 0 && (
                            <div className="nd-payment-row">
                                <span className="nd-payment-row-label">Next Due Amount</span>
                                <span className="nd-payment-row-value nd-pay-red">{fmt(remainingAmount)}</span>
                            </div>
                        )}
                        {modeofpayment && (
                            <div className="nd-payment-row">
                                <span className="nd-payment-row-label">Payment Mode</span>
                                <span className="nd-payment-row-value">{modeofpayment}</span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar */}
                    <div className="nd-payment-progress-wrap">
                        <div className="nd-payment-progress-labels">
                            <span className="nd-pp-label">Amount Paid</span>
                            <span className="nd-pp-pct">{payPct}%</span>
                        </div>
                        <div className="nd-payment-progress-track">
                            <div
                                className={`nd-payment-progress-fill ${isFullyPaid ? "nd-pp-fill-green" : "nd-pp-fill-orange"}`}
                                style={{ width: `${payPct}%` }}
                            />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#9ca3af" }}>
                            <span>{fmt(paidAmount)} paid</span>
                            <span>{fmt(programPrice)} total</span>
                        </div>
                    </div>

                    {/* Support Button */}
                    {!isFullyPaid && (
                        <button className="nd-payment-support-btn" onClick={handlePaySupport}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            Contact Support for Payment ({fmt(remainingAmount)} due)
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default PaymentsPage;
