const axios = require('axios');

const companies = [
  "Siemens", "Philips", "GE", "Johnson & Johnson", "Pfizer", "Novartis", "Roche", "Merck", "GlaxoSmithKline", "Sanofi",
  "AstraZeneca", "Abbott", "Bayer", "Bristol Myers Squibb", "Eli Lilly", "Amgen", "Gilead Sciences", "Biogen", "Regeneron", "Vertex",
  "Boeing", "Airbus", "Lockheed Martin", "Raytheon Technologies", "Northrop Grumman", "General Dynamics", "L3Harris", "BAE Systems", "Thales", "Safran",
  "Ford", "General Motors", "Toyota", "Honda", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Porsche", "Nissan",
  "Hyundai", "Kia", "Volvo", "Mazda", "Subaru", "Ferrari", "Lamborghini", "Aston Martin", "McLaren", "Bugatti",
  "Walmart", "Target", "Costco", "Home Depot", "Lowe's", "Walgreens", "CVS Health", "Kroger", "Aldi", "IKEA",
  "Nike", "Adidas", "Puma", "Under Armour", "Reebok", "New Balance", "Asics", "Vans", "Converse", "Fila",
  "Coca-Cola", "PepsiCo", "Nestle", "Procter & Gamble", "Unilever", "Danone", "Kraft Heinz", "Mondelez", "General Mills", "Kellogg's",
  "ExxonMobil", "Chevron", "Shell", "BP", "TotalEnergies", "ConocoPhillips", "Eni", "Equinor", "Petrobras", "Saudi Aramco",
  "Sony", "Panasonic", "LG", "Dell", "HP", "Lenovo", "Asus", "Acer", "Toshiba", "Logitech"
];

const API_URL = 'http://localhost:5000/api/company-directory';

async function addCompanies() {
  for (let i = 0; i < companies.length; i++) {
    const companyName = companies[i];
    const data = {
      companyName: companyName,
      companyLogo: `https://www.google.com/s2/favicons?domain=${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=128`,
      industry: "Diversified",
      companyType: "Product",
      headquarters: "Global",
      careersUrl: `https://www.${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/careers`,
      fresherFriendly: Math.random() > 0.5,
      internshipFriendly: Math.random() > 0.5,
      remoteFriendly: Math.random() > 0.5,
      description: `${companyName} is a leading global company offering great career opportunities.`,
      tags: ["Global", "Enterprise"]
    };

    try {
      await axios.post(API_URL, data);
      console.log(`Added ${companyName}`);
    } catch (error) {
      console.error(`Failed to add ${companyName}:`, error.message);
    }
  }
  console.log('Finished adding 100 companies.');
}

addCompanies();
