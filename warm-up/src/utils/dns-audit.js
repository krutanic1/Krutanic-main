import { promises as dns } from 'dns';
import dotenv from 'dotenv';
dotenv.config();

const DOMAIN = 'krutanic.info';

async function checkRecords() {
    console.log(`--- Auditing DNS Records for ${DOMAIN} ---`);

    // 1. Check SPF
    try {
        const txtRecords = await dns.resolveTxt(DOMAIN);
        const spf = txtRecords.flat().find(record => record.startsWith('v=spf1'));
        if (spf) {
            console.log(`✅ SPF Found: ${spf}`);
            if (!spf.includes('include:_spf.google.com')) {
                console.log('⚠️ WARNING: SPF does not include Google. If using Gmail SMTP, this will cause spam.');
            }
        } else {
            console.log('❌ SPF Missing! This is the #1 cause of spam.');
        }
    } catch (e) {
        console.log('❌ Error fetching SPF/TXT records.');
    }

    // 2. Check DMARC
    try {
        const dmarcRecords = await dns.resolveTxt(`_dmarc.${DOMAIN}`);
        const dmarc = dmarcRecords.flat().find(record => record.startsWith('v=DMARC1'));
        if (dmarc) {
            console.log(`✅ DMARC Found: ${dmarc}`);
        } else {
            console.log('❌ DMARC Missing! Gmail/Yahoo require this now.');
        }
    } catch (e) {
        console.log('❌ DMARC Missing or unresolvable.');
    }

    console.log('\n--- 🚨 ACTION REQUIRED ---');
    console.log(`Add these TXT records for ${DOMAIN}:`);
    console.log(`1. SPF: v=spf1 include:_spf.google.com ~all`);
    console.log(`2. DMARC: v=DMARC1; p=quarantine; adkim=r; aspf=r;`);
}

checkRecords();
