/**
 * Utility to handle phone number formatting for calls and WhatsApp.
 * Ensures country code (91) is added correctly without duplication.
 */

export const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    
    // Remove all non-digits
    let cleaned = phone.toString().replace(/\D/g, '');
    
    // Handle cases where number might start with 0 (Indian local prefix)
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
        cleaned = cleaned.substring(1);
    }
    
    // If it's already 12 digits and starts with 91, it's likely already has the country code
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return cleaned;
    }
    
    // If it's 10 digits, it's a standard Indian number, so we add 91
    if (cleaned.length === 10) {
        return '91' + cleaned;
    }
    
    // If it's longer (e.g. 13 digits with 0091 or something), just return the last 12 digits if they start with 91
    if (cleaned.length > 12 && cleaned.endsWith(cleaned.substring(cleaned.length - 10)) && cleaned.substring(cleaned.length - 12, cleaned.length - 10) === '91') {
        return cleaned.substring(cleaned.length - 12);
    }

    return cleaned;
};

export const getCallUrl = (phone) => {
    const cleaned = cleanPhoneNumber(phone);
    return `tel:+${cleaned}`;
};

export const getWhatsAppUrl = (phone) => {
    const cleaned = cleanPhoneNumber(phone);
    return `https://wa.me/${cleaned}`;
};
