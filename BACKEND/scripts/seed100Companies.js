const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CompanyDirectory = require('../models/CompanyDirectory');

dotenv.config();

const companies = [
  { name: "Google", type: "Product", industry: "Technology", careers: "https://careers.google.com/" },
  { name: "Microsoft", type: "Product", industry: "Technology", careers: "https://careers.microsoft.com/" },
  { name: "Amazon", type: "Product", industry: "E-commerce", careers: "https://amazon.jobs/" },
  { name: "Apple", type: "Product", industry: "Consumer Electronics", careers: "https://www.apple.com/jobs/" },
  { name: "Meta", type: "Product", industry: "Social Media", careers: "https://www.metacareers.com/" },
  { name: "Netflix", type: "Product", industry: "Entertainment", careers: "https://jobs.netflix.com/" },
  { name: "TCS", type: "Service", industry: "IT Services", careers: "https://www.tcs.com/careers" },
  { name: "Infosys", type: "Service", industry: "IT Services", careers: "https://www.infosys.com/careers.html" },
  { name: "Wipro", type: "Service", industry: "IT Services", careers: "https://careers.wipro.com/" },
  { name: "HCLTech", type: "Service", industry: "IT Services", careers: "https://www.hcltech.com/careers" },
  { name: "Tech Mahindra", type: "Service", industry: "IT Services", careers: "https://careers.techmahindra.com/" },
  { name: "Accenture", type: "Service", industry: "Consulting", careers: "https://www.accenture.com/in-en/careers" },
  { name: "Cognizant", type: "Service", industry: "IT Services", careers: "https://careers.cognizant.com/global/en" },
  { name: "Capgemini", type: "Service", industry: "Consulting", careers: "https://www.capgemini.com/careers/" },
  { name: "IBM", type: "Product", industry: "Technology", careers: "https://www.ibm.com/careers/" },
  { name: "Oracle", type: "Product", industry: "Software", careers: "https://www.oracle.com/corporate/careers/" },
  { name: "SAP", type: "Product", industry: "Software", careers: "https://jobs.sap.com/" },
  { name: "Salesforce", type: "Product", industry: "Software", careers: "https://www.salesforce.com/company/careers/" },
  { name: "Adobe", type: "Product", industry: "Software", careers: "https://adobe.com/careers.html" },
  { name: "Cisco", type: "Product", industry: "Networking", careers: "https://jobs.cisco.com/" },
  { name: "Intel", type: "Product", industry: "Semiconductors", careers: "https://jobs.intel.com/" },
  { name: "AMD", type: "Product", industry: "Semiconductors", careers: "https://careers.amd.com/" },
  { name: "Nvidia", type: "Product", industry: "Semiconductors", careers: "https://www.nvidia.com/en-us/about-nvidia/careers/" },
  { name: "Qualcomm", type: "Product", industry: "Semiconductors", careers: "https://qualcomm.com/company/careers" },
  { name: "Broadcom", type: "Product", industry: "Semiconductors", careers: "https://careers.broadcom.com/" },
  { name: "Tesla", type: "Product", industry: "Automotive", careers: "https://www.tesla.com/careers" },
  { name: "Uber", type: "Product", industry: "Transportation", careers: "https://www.uber.com/us/en/careers/" },
  { name: "Airbnb", type: "Product", industry: "Hospitality", careers: "https://careers.airbnb.com/" },
  { name: "LinkedIn", type: "Product", industry: "Social Media", careers: "https://careers.linkedin.com/" },
  { name: "Twitter (X)", type: "Product", industry: "Social Media", careers: "https://careers.x.com/" },
  { name: "Snap", type: "Product", industry: "Social Media", careers: "https://careers.snap.com/" },
  { name: "Pinterest", type: "Product", industry: "Social Media", careers: "https://www.pinterestcareers.com/" },
  { name: "Spotify", type: "Product", industry: "Entertainment", careers: "https://www.lifeatspotify.com/" },
  { name: "Stripe", type: "Product", industry: "Fintech", careers: "https://stripe.com/jobs" },
  { name: "Square (Block)", type: "Product", industry: "Fintech", careers: "https://block.xyz/careers" },
  { name: "PayPal", type: "Product", industry: "Fintech", careers: "https://careers.pypl.com/" },
  { name: "Visa", type: "Product", industry: "Finance", careers: "https://vi.sa/careers" },
  { name: "Mastercard", type: "Product", industry: "Finance", careers: "https://careers.mastercard.com/" },
  { name: "American Express", type: "Product", industry: "Finance", careers: "https://careers.americanexpress.com/" },
  { name: "Goldman Sachs", type: "Service", industry: "Finance", careers: "https://www.goldmansachs.com/careers/" },
  { name: "JPMorgan Chase", type: "Service", industry: "Finance", careers: "https://careers.jpmorgan.com/" },
  { name: "Morgan Stanley", type: "Service", industry: "Finance", careers: "https://www.morganstanley.com/careers" },
  { name: "Citigroup", type: "Service", industry: "Finance", careers: "https://jobs.citi.com/" },
  { name: "Bank of America", type: "Service", industry: "Finance", careers: "https://careers.bankofamerica.com/" },
  { name: "Wells Fargo", type: "Service", industry: "Finance", careers: "https://www.wellsfargojobs.com/" },
  { name: "Deloitte", type: "Service", industry: "Consulting", careers: "https://www2.deloitte.com/global/en/careers/careers.html" },
  { name: "PwC", type: "Service", industry: "Consulting", careers: "https://www.pwc.com/gx/en/careers.html" },
  { name: "EY", type: "Service", industry: "Consulting", careers: "https://www.ey.com/en_gl/careers" },
  { name: "KPMG", type: "Service", industry: "Consulting", careers: "https://home.kpmg/xx/en/home/careers.html" },
  { name: "McKinsey", type: "Service", industry: "Consulting", careers: "https://www.mckinsey.com/careers/home" },
  { name: "BCG", type: "Service", industry: "Consulting", careers: "https://careers.bcg.com/" },
  { name: "Bain", type: "Service", industry: "Consulting", careers: "https://www.bain.com/careers/" },
  { name: "Flipkart", type: "Product", industry: "E-commerce", careers: "https://www.flipkartcareers.com/" },
  { name: "Myntra", type: "Product", industry: "E-commerce", careers: "https://careers.myntra.com/" },
  { name: "Zomato", type: "Startup", industry: "Food Tech", careers: "https://www.zomato.com/careers" },
  { name: "Swiggy", type: "Startup", industry: "Food Tech", careers: "https://careers.swiggy.com/" },
  { name: "Ola", type: "Startup", industry: "Transportation", careers: "https://ola.recruiterbox.com/" },
  { name: "Paytm", type: "Startup", industry: "Fintech", careers: "https://paytm.com/careers/" },
  { name: "PhonePe", type: "Startup", industry: "Fintech", careers: "https://www.phonepe.com/careers/" },
  { name: "Cred", type: "Startup", industry: "Fintech", careers: "https://careers.cred.club/" },
  { name: "Razorpay", type: "Startup", industry: "Fintech", careers: "https://razorpay.com/jobs/" },
  { name: "Zerodha", type: "Startup", industry: "Fintech", careers: "https://zerodha.com/careers" },
  { name: "Groww", type: "Startup", industry: "Fintech", careers: "https://groww.in/careers" },
  { name: "Upstox", type: "Startup", industry: "Fintech", careers: "https://upstox.com/careers/" },
  { name: "Dream11", type: "Startup", industry: "Gaming", careers: "https://about.dream11.com/careers" },
  { name: "Meesho", type: "Startup", industry: "E-commerce", careers: "https://meesho.io/jobs" },
  { name: "ShareChat", type: "Startup", industry: "Social Media", careers: "https://sharechat.com/careers" },
  { name: "Byju's", type: "Startup", industry: "EdTech", careers: "https://byjus.com/careers/" },
  { name: "Unacademy", type: "Startup", industry: "EdTech", careers: "https://unacademy.com/careers" },
  { name: "UpGrad", type: "Startup", industry: "EdTech", careers: "https://www.upgrad.com/careers/" },
  { name: "L&T Infotech", type: "Service", industry: "IT Services", careers: "https://www.lntinfotech.com/careers/" },
  { name: "Mindtree", type: "Service", industry: "IT Services", careers: "https://www.mindtree.com/careers" },
  { name: "Mphasis", type: "Service", industry: "IT Services", careers: "https://www.mphasis.com/home/careers.html" },
  { name: "Genpact", type: "Service", industry: "IT Services", careers: "https://www.genpact.com/careers" },
  { name: "WNS", type: "Service", industry: "IT Services", careers: "https://www.wns.com/careers" },
  { name: "EXL", type: "Service", industry: "IT Services", careers: "https://www.exlservice.com/careers" },
  { name: "EPAM", type: "Service", industry: "IT Services", careers: "https://www.epam.com/careers" },
  { name: "Thoughtworks", type: "Service", industry: "IT Services", careers: "https://www.thoughtworks.com/careers" },
  { name: "Atlassian", type: "Product", industry: "Software", careers: "https://www.atlassian.com/company/careers" },
  { name: "Intuit", type: "Product", industry: "Software", careers: "https://jobs.intuit.com/" },
  { name: "Workday", type: "Product", industry: "Software", careers: "https://www.workday.com/en-us/company/careers.html" },
  { name: "ServiceNow", type: "Product", industry: "Software", careers: "https://careers.servicenow.com/" },
  { name: "Snowflake", type: "Product", industry: "Software", careers: "https://careers.snowflake.com/" },
  { name: "Palantir", type: "Product", industry: "Software", careers: "https://www.palantir.com/careers/" },
  { name: "Databricks", type: "Product", industry: "Software", careers: "https://databricks.com/company/careers" },
  { name: "Twilio", type: "Product", industry: "Software", careers: "https://www.twilio.com/company/jobs" },
  { name: "Zoom", type: "Product", industry: "Software", careers: "https://zoom.us/careers" },
  { name: "Splunk", type: "Product", industry: "Software", careers: "https://www.splunk.com/en_us/careers.html" },
  { name: "DocuSign", type: "Product", industry: "Software", careers: "https://www.docusign.com/company/careers" },
  { name: "Dropbox", type: "Product", industry: "Software", careers: "https://jobs.dropbox.com/" },
  { name: "Box", type: "Product", industry: "Software", careers: "https://careers.box.com/" },
  { name: "Zendesk", type: "Product", industry: "Software", careers: "https://jobs.zendesk.com/" },
  { name: "HubSpot", type: "Product", industry: "Software", careers: "https://www.hubspot.com/careers" },
  { name: "Shopify", type: "Product", industry: "E-commerce", careers: "https://www.shopify.com/careers" },
  { name: "Epic Games", type: "Product", industry: "Gaming", careers: "https://www.epicgames.com/site/en-US/careers" },
  { name: "Electronic Arts", type: "Product", industry: "Gaming", careers: "https://www.ea.com/careers" },
  { name: "Activision", type: "Product", industry: "Gaming", careers: "https://careers.activision.com/" },
  { name: "Riot Games", type: "Product", industry: "Gaming", careers: "https://www.riotgames.com/en/work-with-us" },
  { name: "Sony Interactive", type: "Product", industry: "Gaming", careers: "https://www.playstation.com/en-us/corporate/playstation-careers/" },
  { name: "Samsung", type: "Product", industry: "Consumer Electronics", careers: "https://www.samsung.com/us/about-us/careers/" }
];

const dummyData = companies.map(c => {
  let rawDomain = c.careers.split('/')[2];
  let domain = rawDomain.replace('careers.', '').replace('jobs.', '').replace('www.', '');
  // Special overrides for better logos
  if (domain === 'vi.sa') domain = 'visa.com';
  if (domain === 'amazon.jobs') domain = 'amazon.com';
  if (domain === 'block.xyz') domain = 'squareup.com';
  
  return {
    companyName: c.name,
    companyLogo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    industry: c.industry,
    companyType: c.type,
    headquarters: "Global",
    careersUrl: c.careers,
    fresherFriendly: Math.random() > 0.3, // 70% chance
    internshipFriendly: Math.random() > 0.4, // 60% chance
    remoteFriendly: Math.random() > 0.5, // 50% chance
    description: `${c.name} is a leading ${c.industry.toLowerCase()} company offering great career opportunities. Explore roles and connect with professionals.`,
    tags: [c.industry, c.type]
  };
});

mongoose.connect(process.env.DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB');
  await CompanyDirectory.deleteMany({});
  console.log('Inserting 100 companies...');
  await CompanyDirectory.insertMany(dummyData);
  console.log('Seeded data successfully');
  process.exit(0);
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
