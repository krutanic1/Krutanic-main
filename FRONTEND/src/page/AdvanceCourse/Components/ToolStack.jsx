import React from 'react';

const ToolStack = ({ title, subtitle, categories, accentColor = "#4F46E5" }) => {
  // Mapping for logos to SimpleIcons slugs
  const iconMap = {
    // Data & AI
    "Excel": "microsoftexcel",
    "Advanced Excel": "microsoftexcel",
    "SQL": "mysql",
    "Python": "python",
    "Numpy": "numpy",
    "NumPy": "numpy",
    "Pandas": "pandas",
    "Matplotlib": "matplotlib",
    "Seaborn": "seaborn",
    "Power BI": "powerbi",
    "Tableau": "tableau",
    "Looker Studio": "looker",
    "Snowflake": "snowflake",
    "Databricks": "databricks",
    "Scikit-Learn": "scikitlearn",
    "TensorFlow": "tensorflow",
    "Keras": "keras",
    "Spark": "apachespark",
    "Hadoop": "apachehadoop",
    "MLOps": "cloudfoundry",
    "DAX": "powerbi",
    "Google Sheets": "googlesheets",
    "Statistics": "googlescholar",
    
    // AI & LLM Core
    "GPT-4o": "openai",
    "ChatGPT": "openai",
    "Claude 3.5 Sonnet": "anthropic",
    "Gemini Pro": "googlegemini",
    "Llama 3": "meta",
    "Mistral Large": "mistral",
    "PromptLayer": "openai",
    "LangSmith": "langchain",
    "Humanloop": "openai",
    "Pryon": "brain",
    "LangChain": "langchain",
    "LlamaIndex": "meta",
    "AutoGPT": "openai",
    "AutoGen": "microsoft",
    "Pinecone": "pinecone",
    "ChromaDB": "databricks",
    "Weaviate": "weaviate",
    "Redis Stack": "redis",
    "DeepEval": "testcafe",
    "Giskard": "giskard",
    "Ragas": "python",
    "TruLens": "tensorflow",
    
    // Web & Engineering
    "React": "react",
    "React.js": "react",
    "Node.js": "nodedotjs",
    "MongoDB": "mongodb",
    "Atlas": "mongodb",
    "Docker": "docker",
    "GitHub": "github",
    "Git": "git",
    "Tailwind CSS": "tailwindcss",
    "Vercel": "vercel",
    "Postman": "postman",
    "Redux": "redux",
    "Redux Toolkit": "redux",
    "Express": "express",
    "Express.js": "express",
    "Vite": "vite",
    "Typescript": "typescript",
    "Next.js": "nextdotjs",
    "Firebase": "firebase",
    "Heroku": "heroku",
    "NPM": "npm",
    "Insomnia": "insomnia",
    "Swagger": "swagger",
    "Storybook": "storybook",
    "API": "none",
    "APIs": "none",

    // MERN & Dev Concepts
    "Aggregation": "mongodb",
    "Indexing": "mongodb",
    "CI/CD": "githubactions",
    "Performance Profiling": "speedtest",
    "Mongoose": "mongodb",
    "React Router": "reactrouter",
    "Axios": "axios",
    "JavaScript ES6+": "javascript",
    "JWT": "jsonwebtokens",
    "REST APIs": "postman",
    "Git/GitHub": "github",
    
    // Automation & Testing
    "Selenium": "selenium",
    "Selenium WebDriver": "selenium",
    "Playwright": "playwright",
    "Cypress": "cypress",
    "Jenkins": "jenkins",
    "Appium": "appium",
    "JMeter": "apachejmeter",
    "TestNG": "testng",
    "JUnit 5": "junit5",
    "Cucumber (BDD)": "cucumber",
    "Pytest": "pytest",
    "Mocha/Chai": "mocha",
    "GitLab CI": "gitlab",
    "AWS Device Farm": "amazonaws",

    // Marketing & Growth
    "Google Analytics": "googleanalytics",
    "Google Analytics 4": "googleanalytics",
    "GA4": "googleanalytics",
    "Google Ads": "googleads",
    "Meta Ads": "meta",
    "Meta Ads Manager": "meta",
    "Meta Business Suite": "meta",
    "LinkedIn Ads": "linkedin",
    "LinkedIn Ads Manager": "linkedin",
    "LinkedIn": "linkedin",
    "TikTok Ads": "tiktok",
    "Shopify": "shopify",
    "Canva": "canva",
    "Canva Pro": "canva",
    "HubSpot": "hubspot",
    "Mailchimp": "mailchimp",
    "Zapier": "zapier",
    "Notion": "notion",
    "Slack": "slack",
    "Jira": "jira",
    "SEMrush": "semrush",
    "Ahrefs": "none",
    "Hotjar": "hotjar",
    "Mixpanel": "mixpanel",
    "GTM": "googletagmanager",
    "Google Tag Manager": "googletagmanager",
    "FB Pixel/CAPI": "meta",
    "Unbounce": "unbounce",
    "Optimizely": "optimizely",
    "SpyFu": "spyfu",
    "Youtube Ads": "youtube",
    "Twitter Ads": "twitter",
    "Snapchat Ads": "snapchat",
    "Bing Ads": "microsoftbing",
    "QuillBot": "none",
    "copy.ai": "none",
    "Grammarly": "grammarly",
    "Screaming Frog": "none",
    "Ubersuggest": "none",
    "Microsoft Clarity": "microsoft",
    "ActiveCampaign": "activecampaign",
    "AppsFlyer": "none",
    "MoEngage": "none",
    "Google Forms": "google",
    "Google Drive": "googledrive",
    "Hootsuite": "hootsuite",
    "Buffer": "buffer",
    "Yoast": "yoast",
    "Brevo": "brevo",
    "Webflow": "webflow",
    
    // Design
    "Figma": "figma",
    "Adobe XD": "adobexd",
    "Sketch": "sketch",
    "Framer": "framer",
    "Photoshop": "adobephotoshop",
    "Illustrator": "adobeillustrator",
    "After Effects": "adobeaftereffects",
    "Lottie": "lottiefiles",
    
    // Finance
    "PowerPoint": "microsoftpowerpoint",
    "Bloomberg": "bloomberg",
  };

  return (
    <section className="py-24 bg-[#F9FAFB]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-[34px] md:text-[42px] font-[900] text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {title || "Tool-stack you will master"}
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            {subtitle || "Gain execution depth across a suite of industry-standard tools used at high-growth tech hubs and global brands."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category, idx) => (
            <div 
              key={idx} 
              className="bg-white p-8 rounded-[20px] border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-gray-200 transition-all duration-500 group"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-[2px] group-hover:text-gray-600 transition-colors">
                  {category.group}
                </h3>
                <div className="h-[2px] w-8 bg-gray-100 group-hover:w-12 transition-all duration-500" style={{ backgroundColor: accentColor }}></div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {category.tools.map((tool, tIdx) => {
                  const mappedSlug = iconMap[tool];
                  const fallbackSlug = tool.toLowerCase().replace(/\./g, 'dot').replace(/\+/g, 'plus').replace(/\//g, '').replace(/\s+/g, '');
                  const slug = mappedSlug !== undefined ? mappedSlug : fallbackSlug;
                  
                  return (
                    <div 
                      key={tIdx} 
                      className="flex items-center gap-3 px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-300 hover:-translate-y-1 hover:shadow-sm transition-all duration-300 cursor-default group/pill"
                    >
                      <div className="w-5 h-5 flex items-center justify-center overflow-hidden">
                        {slug !== "none" ? (
                          <>
                            <img 
                              src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${slug}.svg`} 
                              alt={tool} 
                              className="w-full h-full object-contain filter grayscale group-hover/pill:grayscale-0 transition-all duration-300"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                const fallback = e.target.parentElement.querySelector('.fallback-icon');
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="fallback-icon hidden w-full h-full items-center justify-center bg-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase">
                              {tool.substring(0, 2)}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase">
                            {tool.substring(0, 2)}
                          </div>
                        )}
                      </div>
                      <span className="text-[14px] font-[700] text-gray-700 whitespace-nowrap leading-none group-hover/pill:text-gray-900 transition-colors">
                        {tool}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToolStack;
