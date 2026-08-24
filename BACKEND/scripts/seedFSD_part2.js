require('dotenv').config({path:require('path').resolve(__dirname,'../.env')});
const mongoose=require('mongoose');
const PracticePath=require('../models/PracticePath');
const PracticeTopic=require('../models/PracticeTopic');
const PracticeSubtopic=require('../models/PracticeSubtopic');
const PracticeQuestion=require('../models/PracticeQuestion');
const SLUG='full-stack-development';
const sl=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
async function makeQs(base,sub,qs){
  for(let i=0;i<qs.length;i++){
    const q=qs[i];
    try{
      await PracticeQuestion.create({...base,subtopic:sub._id,title:q.t,
        slug:sl(q.t)+'-'+sub._id.toString().slice(-4)+i,
        difficulty:q.d||'Easy',statement:q.q,
        options:q.o.map((x,j)=>({text:x,isCorrect:j===q.a})),
        explanation:q.e||'',order:i+1,isPublished:true,tags:['full-stack','seed']});
    }catch(e){if(!e.code||e.code!==11000)throw e;}
  }
}const TOPICS7=[
{title:"Deployment and Hosting",slug:"deployment-hosting",desc:"Deploy apps to cloud platforms.",subs:[
{title:"Web Hosting Concepts",desc:"Hosting types and domains.",qs:[
{t:"Static Hosting",q:"Static site hosting serves?",o:["Server-side code","Pre-built HTML CSS JS files","Database queries","Node processes"],a:1,e:"Static hosting serves pre-built files directly."},
{t:"VPS vs Shared",q:"VPS hosting vs shared hosting?",o:["Same","VPS dedicated resources; shared shares resources","Shared is faster","VPS is free"],a:1,e:"VPS gives dedicated resources; shared splits server."},
{t:"CDN Purpose",q:"CDN (Content Delivery Network) does?",o:["Runs backend code","Stores DB","Serves assets from geographically close servers","Handles auth"],a:2,e:"CDN caches assets at edge servers near users."},
{t:"Domain DNS",q:"DNS (Domain Name System) translates?",o:["IP to domain","Domain name to IP address","HTTP to HTTPS","Port to protocol"],a:1,e:"DNS maps domain names to IP addresses."},
{t:"SSL TLS",q:"HTTPS uses which protocol?",o:["HTTP","FTP","SSL/TLS","SMTP"],a:2,e:"HTTPS encrypts traffic using SSL/TLS."},
{t:"Serverless Meaning",q:"Serverless means?",o:["No internet","No servers at all","Code runs in managed cloud functions","Free hosting"],a:2,e:"Serverless runs code in cloud-managed functions."},
{t:"Reverse Proxy",q:"Nginx as reverse proxy does?",o:["Stores files","Run Node directly","Routes client requests to backend servers","Manages DNS"],a:2,e:"Reverse proxy routes requests to appropriate backends."},
{t:"Load Balancer",q:"Load balancer purpose?",o:["Speed up DNS","Distribute traffic across multiple servers","Store cache","Manage domains"],a:1,e:"Load balancers distribute requests across servers."},
{t:"Environment Variables",q:"Environment variables in deployment store?",o:["HTML templates","Sensitive config like API keys and DB URLs","Static assets","User sessions"],a:1,e:"Env vars store sensitive config outside codebase."},
{t:"Port 443",q:"Port 443 is used by?",o:["HTTP","FTP","HTTPS","SSH"],a:2,e:"HTTPS runs on port 443."}
]},
{title:"Deploying to Vercel and Netlify",desc:"Frontend deployment platforms.",qs:[
{t:"Vercel Use Case",q:"Vercel is best for?",o:["Mobile apps","SQL databases","Frontend and Next.js deployments","Email servers"],a:2,e:"Vercel specializes in frontend and Next.js deployments."},
{t:"Netlify Deploy",q:"Netlify deploys from?",o:["FTP upload only","Git repo with auto-build on push","Database snapshots","Docker images"],a:1,e:"Netlify connects to Git and auto-deploys on push."},
{t:"Vercel Preview",q:"Vercel preview deployments are?",o:["Permanent URLs","Auto-created for each PR/branch","Manual builds","Paid feature"],a:1,e:"Vercel auto-creates preview URL for every PR."},
{t:"Build Command",q:"Build command for React app?",o:["npm start","npm run dev","npm run build","npm install"],a:2,e:"npm run build creates optimized production bundle."},
{t:"Netlify _redirects",q:"_redirects file in Netlify is for?",o:["CSS styling","Rewriting URLs and handling SPA routing","Database config","Auth tokens"],a:1,e:"_redirects configures URL rewrites for SPA routing."},
{t:"Vercel.json",q:"vercel.json configures?",o:["Package dependencies","CSS variables","Deployment routes rewrites and headers","Git settings"],a:2,e:"vercel.json defines deployment configuration."},
{t:"Continuous Deploy",q:"Continuous deployment means?",o:["Manual server restart","Auto-deploy to production on code push","Weekly releases","Testing only"],a:1,e:"CD auto-deploys code to production on push."},
{t:"Build Output",q:"React build output goes to?",o:["src folder","node_modules","build or dist folder","public folder"],a:2,e:"React build outputs optimized files to build or dist."},
{t:"Env in Netlify",q:"Environment variables in Netlify set in?",o:["package.json","index.html","Site settings > Environment variables","Netlify.toml only"],a:2,e:"Set env vars in Netlify site settings dashboard."},
{t:"Custom Domain",q:"Custom domain for deployed app?",o:["Not possible on Vercel","Add DNS records pointing to platform","Edit package.json","Change index.html"],a:1,e:"Add DNS A or CNAME records pointing to the platform."}
]},
{title:"Docker Basics",desc:"Containerize applications.",qs:[
{t:"Docker Purpose",q:"Docker is used to?",o:["Design UIs","Write backend only","Package apps into portable containers","Manage DNS"],a:2,e:"Docker packages apps and dependencies into containers."},
{t:"Dockerfile",q:"Dockerfile is?",o:["Config file for DNS","Text file defining how to build a Docker image","CSS config","Git config"],a:1,e:"Dockerfile has instructions to build a Docker image."},
{t:"Docker Image",q:"Docker image vs container?",o:["Same thing","Image is blueprint; container is running instance","Container is blueprint; image runs","Image is a file"],a:1,e:"Image = blueprint; container = running instance."},
{t:"docker run",q:"docker run does?",o:["Build image","Push to registry","Start a container from image","Delete image"],a:2,e:"docker run starts a container from a Docker image."},
{t:"docker build",q:"docker build does?",o:["Start container","Creates image from Dockerfile","Push to registry","Pull image"],a:1,e:"docker build creates an image from a Dockerfile."},
{t:"Port Mapping",q:"-p 3000:3000 in docker run means?",o:["CPU limit","Map host port 3000 to container port 3000","Memory limit","Volume mount"],a:1,e:"Port mapping: host:container port numbers."},
{t:"docker-compose",q:"docker-compose is used to?",o:["Build single container","Orchestrate multiple containers","Push to DockerHub","Monitor containers"],a:1,e:"docker-compose manages multi-container applications."},
{t:"Docker Volume",q:"Docker volume is for?",o:["CPU sharing","Persist data outside containers","Network config","Security"],a:1,e:"Volumes persist data independent of container lifecycle."},
{t:"DockerHub",q:"DockerHub is?",o:["DNS service","Cloud registry for Docker images","Container orchestrator","CI tool"],a:1,e:"DockerHub is a public Docker image registry."},
{t:"FROM Instruction",q:"FROM in Dockerfile specifies?",o:["Output directory","Base image to build from","Port to expose","Run command"],a:1,e:"FROM sets the base image for the Docker build."}
]},
{title:"CI/CD Pipeline Concepts",desc:"Automate build test deploy.",qs:[
{t:"CI Meaning",q:"CI (Continuous Integration) means?",o:["Manual testing","Frequently merging and auto-testing code","Weekly releases","Continuous monitoring"],a:1,e:"CI frequently merges code and auto-runs tests."},
{t:"CD Meaning",q:"CD (Continuous Delivery/Deployment) means?",o:["Code debugging","Auto-releasing to staging or production","Complete development","Cloud deployment only"],a:1,e:"CD automates releasing code to environments."},
{t:"Pipeline Stage",q:"Typical CI/CD pipeline stages?",o:["Build only","Design only","Build Test Deploy","Plan only"],a:2,e:"Typical pipeline: Build > Test > Deploy."},
{t:"Artifact in CI",q:"A build artifact is?",o:["Source code","Config file","Output of build step like compiled binary","Test report only"],a:2,e:"Artifacts are build outputs like compiled binaries or bundles."},
{t:"Rollback Strategy",q:"Rollback in deployment means?",o:["Delete repo","Revert to previous stable version","Redeploy current","Delete DB"],a:1,e:"Rollback reverts to last known good version."},
{t:"Blue Green Deploy",q:"Blue-green deployment?",o:["Two identical envs; switch traffic to new version","Two repos","Blue=dev Green=prod always","Random color tags"],a:0,e:"Blue-green runs two identical envs, switching traffic."},
{t:"Canary Release",q:"Canary release means?",o:["Full deploy at once","Roll out to small subset first","Delete old version","Emergency patch"],a:1,e:"Canary releases new version to small user subset first."},
{t:"Health Check",q:"Health check endpoint in deployment?",o:["Returns user data","Returns 200 OK if app is running","Runs DB migrations","Sends emails"],a:1,e:"Health checks confirm app is alive and responsive."},
{t:"Zero Downtime",q:"Zero-downtime deployment means?",o:["Never deploy","Deploy without any service interruption","Deploy at midnight","Automated testing"],a:1,e:"Zero-downtime deploys without interrupting users."},
{t:"Infrastructure as Code",q:"IaC (Infrastructure as Code) means?",o:["Writing HTML","Manage infrastructure using code files","Using GUI only","Manual server config"],a:1,e:"IaC manages infrastructure via version-controlled config files."}
]},
{title:"Cloud Platforms (AWS, GCP, Azure)",desc:"Cloud deployment basics.",qs:[
{t:"AWS EC2",q:"AWS EC2 provides?",o:["Managed DB","Static file storage","Virtual servers in the cloud","DNS management"],a:2,e:"EC2 = Elastic Compute Cloud = virtual machines."},
{t:"AWS S3",q:"AWS S3 is used for?",o:["Running code","Object/file storage","DNS","Load balancing"],a:1,e:"S3 = Simple Storage Service for file storage."},
{t:"Serverless AWS",q:"AWS serverless compute service?",o:["EC2","RDS","Lambda","S3"],a:2,e:"AWS Lambda runs code without managing servers."},
{t:"PaaS Definition",q:"PaaS (Platform as a Service) provides?",o:["Hardware only","Network only","Platform to deploy apps without managing infrastructure","Full app built for you"],a:2,e:"PaaS provides runtime environment, hiding infrastructure."},
{t:"Heroku Type",q:"Heroku is a?",o:["IaaS","SaaS","PaaS","DNS provider"],a:2,e:"Heroku is a PaaS for easy app deployment."},
{t:"Region in Cloud",q:"Cloud regions are?",o:["Color codes","Data centers in specific geographic areas","Pricing tiers","Security levels"],a:1,e:"Regions are geographic locations with data centers."},
{t:"Availability Zone",q:"Availability Zones (AZ) provide?",o:["Faster code","High availability via separate isolated DCs in a region","Lower cost","Better DNS"],a:1,e:"AZs are isolated data centers for high availability."},
{t:"Cloud Storage Benefit",q:"Cloud object storage benefit?",o:["Runs backend code","Infinite scalable file storage with high availability","Free domain","DB management"],a:1,e:"Object storage scales infinitely with high availability."},
{t:"Managed DB Service",q:"AWS RDS is?",o:["NoSQL DB","Managed relational DB service","File storage","Lambda function"],a:1,e:"RDS = Relational Database Service, managed SQL."},
{t:"Auto Scaling",q:"Auto-scaling in cloud?",o:["Manual server add","Automatically add/remove servers based on load","Fixed server count","Cost optimization only"],a:1,e:"Auto-scaling adjusts compute resources based on demand."}
]}
]}];
const TOPICS8=[
{title:"Authentication and Authorization",slug:"auth-and-authorization",desc:"Secure apps with auth.",subs:[
{title:"Authentication vs Authorization",desc:"Concepts of auth.",qs:[
{t:"Auth vs Authz",q:"Difference between authentication and authorization?",o:["Same thing","Auth=who you are; Authz=what you can do","Auth=permissions; Authz=identity","Neither matters"],a:1,e:"Authentication verifies identity; Authorization grants permissions."},
{t:"Password Hashing",q:"Why hash passwords before storing?",o:["Faster lookup","Store shorter data","So plain text is never stored in DB","Encryption required by law"],a:2,e:"Hashing ensures plain passwords are never stored."},
{t:"bcrypt Salt",q:"A salt in password hashing?",o:["Decrypts password","Random data added before hashing to prevent rainbow attacks","Speeds up hash","Stores user ID"],a:1,e:"Salt prevents rainbow table attacks."},
{t:"JWT Structure",q:"JWT is composed of?",o:["Header only","Header and payload","Header, payload, and signature","Username and password"],a:2,e:"JWT = Header.Payload.Signature (3 base64 parts)."},
{t:"JWT Stateless",q:"JWTs are stateless because?",o:["Stored in DB","Server memory holds state","All info is in the token; no server-side session","Client never stores them"],a:2,e:"JWT embeds all needed info; server needs no session store."},
{t:"Session vs JWT",q:"Key difference: session vs JWT auth?",o:["Same","Session stores state server-side; JWT is stateless token","JWT always less secure","Sessions work with mobile"],a:1,e:"Sessions store state server-side; JWT is self-contained."},
{t:"OAuth 2.0",q:"OAuth 2.0 is used for?",o:["Password storage","Hashing","Delegated authorization (Sign in with Google)","Database auth"],a:2,e:"OAuth 2.0 allows apps to access resources on behalf of user."},
{t:"HTTPS Necessity",q:"Why is HTTPS required for auth?",o:["Looks professional","Faster requests","Encrypts credentials in transit","Required by browsers only"],a:2,e:"HTTPS encrypts credentials so they cannot be intercepted."},
{t:"2FA",q:"2FA (Two-Factor Authentication) adds?",o:["Two passwords","Second verification factor beyond password","Two accounts","Double login form"],a:1,e:"2FA requires a second verification step beyond password."},
{t:"Principle of Least Privilege",q:"Least privilege means?",o:["All users are admins","Users get only the minimum permissions they need","Passwords are short","No auth needed"],a:1,e:"Least privilege: grant only the minimum necessary access."}
]},
{title:"JWT Implementation",desc:"Implement JWT in Node.js.",qs:[
{t:"Sign JWT",q:"Sign a JWT in Node.js?",o:["jwt.create()","jwt.sign(payload, secret, options)","jwt.generate()","jwt.encode()"],a:1,e:"jwt.sign creates and signs a JWT."},
{t:"Verify JWT",q:"Verify JWT?",o:["jwt.decode()","jwt.validate()","jwt.verify(token, secret)","jwt.check()"],a:2,e:"jwt.verify validates token signature and expiry."},
{t:"JWT Expiry",q:"JWT expiry set using?",o:["expires field in payload","expiresAt option","expiresIn option in sign options","ttl field"],a:2,e:"Set expiresIn in jwt.sign options."},
{t:"JWT Storage",q:"Where to store JWT on client?",o:["LocalStorage (risk XSS)","HttpOnly cookie (safer)","Both options have tradeoffs","URL query string"],a:2,e:"HttpOnly cookies protect from XSS; localStorage is simpler but risky."},
{t:"Refresh Token",q:"Refresh token purpose?",o:["Log user out","Replace access token when expired without re-login","Store user data","Encrypt payload"],a:1,e:"Refresh tokens issue new access tokens when expired."},
{t:"Token in Header",q:"JWT sent in request header as?",o:["Content-Type: JWT","Authorization: Bearer token","X-Token: jwt","Cookie: jwt"],a:1,e:"JWT sent as: Authorization: Bearer <token>."},
{t:"JWT Decode No Verify",q:"jwt.decode() without verify is?",o:["Always safe","Decodes without verifying signature (unsafe for auth)","Throws error","Same as verify"],a:1,e:"decode just reads payload; always use verify for auth."},
{t:"HS256 Algorithm",q:"HS256 JWT algorithm uses?",o:["Asymmetric RSA","Symmetric HMAC-SHA256 secret","No algorithm","AES encryption"],a:1,e:"HS256 uses a shared secret with HMAC-SHA256."},
{t:"RS256 Algorithm",q:"RS256 vs HS256?",o:["Same","RS256 uses RSA key pair; HS256 shared secret","RS256 is faster","HS256 more secure"],a:1,e:"RS256 uses asymmetric RSA key pair."},
{t:"Token Blacklist",q:"Invalidate a JWT before expiry?",o:["Delete from localStorage","Add to server-side blacklist or use short expiry","JWT cannot be invalidated","Re-sign token"],a:1,e:"Blacklist or short expiry are strategies for JWT invalidation."}
]},
{title:"Passport.js and OAuth",desc:"Passport strategies and OAuth.",qs:[
{t:"Passport.js",q:"Passport.js is?",o:["CSS library","Authentication middleware for Node.js","Database ORM","Test framework"],a:1,e:"Passport.js is Node.js authentication middleware."},
{t:"Strategy Pattern",q:"Passport uses strategies for?",o:["Routing","CSS","Different auth methods (local, Google, JWT)","Database queries"],a:2,e:"Strategies implement different authentication mechanisms."},
{t:"Local Strategy",q:"Local strategy authenticates via?",o:["OAuth","Google login","Username and password","SMS"],a:2,e:"Local strategy verifies username/password credentials."},
{t:"Google OAuth Flow",q:"OAuth flow steps?",o:["User enters password only","User redirected to provider, grants access, app gets token","Direct DB query","SSL certificate exchange"],a:1,e:"OAuth: redirect > user grants > provider returns token."},
{t:"passport.authenticate",q:"passport.authenticate() is used as?",o:["Route handler only","Middleware to authenticate a route","DB query","Config function"],a:1,e:"passport.authenticate() is route middleware."},
{t:"serializeUser",q:"serializeUser() does?",o:["Encrypts user","Saves user info to session (what to store)","Fetches user from DB","Logs user out"],a:1,e:"serializeUser decides what user data to store in session."},
{t:"deserializeUser",q:"deserializeUser() does?",o:["Deletes session","Retrieves user from session data on each request","Creates new user","Encrypts session"],a:1,e:"deserializeUser reconstructs user object from session."},
{t:"OAuth Access Token",q:"OAuth access token is?",o:["User password","Long-lived credential","Short-lived token granting resource access","Permanent API key"],a:2,e:"Access tokens are short-lived resource access credentials."},
{t:"OAuth Scope",q:"OAuth scope defines?",o:["Token expiry","What resources the app can access","Redirect URL","User role"],a:1,e:"Scope defines what permissions the app requests."},
{t:"Callback URL",q:"OAuth callback URL is?",o:["Homepage URL","Where provider redirects after auth with code","Error page","DB connection string"],a:1,e:"Callback URL receives the auth code from the provider."}
]},
{title:"Role-Based Access Control",desc:"RBAC and permissions.",qs:[
{t:"RBAC Definition",q:"RBAC (Role-Based Access Control)?",o:["Random access control","Permissions assigned to roles, users get roles","All users same access","Password policy"],a:1,e:"RBAC assigns permissions to roles, not directly to users."},
{t:"Admin Role",q:"Admin role typically has?",o:["Read-only","No access","Full CRUD and management permissions","Only delete"],a:2,e:"Admin has full permissions across the application."},
{t:"Middleware Auth Check",q:"Protect a route in Express?",o:["No middleware needed","Auth middleware checks token before route handler","Route handler checks","DB query first"],a:1,e:"Auth middleware validates token before the route handler runs."},
{t:"403 Status",q:"HTTP 403 means?",o:["Not found","Unauthorized (missing auth)","Forbidden (authenticated but not authorized)","Server error"],a:2,e:"403 Forbidden = authenticated but lacks permission."},
{t:"401 Status",q:"HTTP 401 means?",o:["Not found","Unauthorized (unauthenticated)","Forbidden","Bad request"],a:1,e:"401 Unauthorized = authentication required or failed."},
{t:"Role Check Middleware",q:"Check user role in middleware?",o:["In the DB only","After route handler","req.user.role against allowed roles before handler","In frontend only"],a:2,e:"Check req.user.role against allowed roles in middleware."},
{t:"Resource-Based Auth",q:"Resource-based auth checks?",o:["User role only","If user owns or has permission for specific resource","All users allowed","IP address only"],a:1,e:"Resource-based auth checks ownership or resource-level permission."},
{t:"JWT Claims",q:"JWT claims are?",o:["Server variables","Key-value pairs in payload encoding user info and permissions","HTTP headers","Database fields"],a:1,e:"Claims are payload key-value pairs like role, userId, exp."},
{t:"Token Expiry Strategy",q:"Short access token expiry with refresh token is?",o:["Worse security","Better security balancing usability and protection","Inconvenient only","No difference"],a:1,e:"Short-lived access + refresh tokens balance security and UX."},
{t:"CORS Auth Header",q:"Allow Authorization header in CORS?",o:["Automatic","Set Access-Control-Allow-Headers to include Authorization","Not possible","Set in frontend only"],a:1,e:"CORS must allow Authorization header for JWT auth to work."}
]},
{title:"Security Best Practices",desc:"Secure Node.js apps.",qs:[
{t:"SQL Injection",q:"Prevent SQL injection?",o:["Validate only","Use parameterized queries or prepared statements","Use GET requests","Disable logging"],a:1,e:"Parameterized queries prevent SQL injection."},
{t:"XSS Prevention",q:"Prevent XSS?",o:["Long passwords","Sanitize and escape user output; use CSP headers","Disable cookies","Use HTTP not HTTPS"],a:1,e:"Sanitize output and use Content Security Policy headers."},
{t:"CSRF Attack",q:"CSRF (Cross-Site Request Forgery) attack?",o:["SQL injection","Tricks user browser into making unwanted requests","DDoS","Man-in-middle"],a:1,e:"CSRF forges requests using victim's authenticated session."},
{t:"CSRF Token",q:"CSRF token prevents?",o:["XSS","SQL injection","Unauthorized cross-origin form submissions","Password theft"],a:2,e:"CSRF tokens validate requests come from trusted origin."},
{t:"Rate Limiting Purpose",q:"Rate limiting prevents?",o:["Cache invalidation","Brute-force and DDoS attacks","DB timeouts","Memory leaks"],a:1,e:"Rate limiting blocks brute-force and DDoS attempts."},
{t:"HTTPS Enforce",q:"Enforce HTTPS in Express?",o:["SSL option in app.listen","Redirect HTTP to HTTPS in middleware","Change port only","In package.json"],a:1,e:"Redirect all HTTP traffic to HTTPS in middleware."},
{t:"Sensitive Data Log",q:"Should you log sensitive data like passwords?",o:["Yes for debugging","Yes in production","No, never log sensitive data","Only in development"],a:2,e:"Never log passwords, tokens, or sensitive personal data."},
{t:"Dependency Audit",q:"npm audit does?",o:["Installs packages","Checks dependencies for known vulnerabilities","Formats code","Tests app"],a:1,e:"npm audit reports known security vulnerabilities in deps."},
{t:"Input Validation",q:"Validate user input to prevent?",o:["Slow rendering","Injection attacks and invalid data processing","Memory overflow","DNS errors"],a:1,e:"Input validation prevents injection and invalid data attacks."},
{t:"Security Headers",q:"helmet middleware sets security headers like?",o:["Content-Type","CORS","Content-Security-Policy and X-Frame-Options","Authorization"],a:2,e:"helmet sets headers like CSP, HSTS, X-Frame-Options."}
]}
]}];
const TOPICS9=[
{title:"RESTful API Practices",slug:"restful-api-practices",desc:"Design and consume REST APIs.",subs:[
{title:"REST Principles",desc:"Core REST constraints.",qs:[
{t:"REST Stateless",q:"REST stateless constraint means?",o:["Server stores session","Each request independent no server state","REST uses WebSockets","Only GET allowed"],a:1,e:"Each REST request is independent; server stores no state."},
{t:"Uniform Interface",q:"Uniform interface in REST means?",o:["All use JSON","One URL only","Consistent interface using standard HTTP methods and resources","All use POST"],a:2,e:"Uniform interface standardizes API design."},
{t:"Resource Identification",q:"REST resources identified by?",o:["Method name","Function call","URI (Uniform Resource Identifier)","Port number"],a:2,e:"Resources are identified by URIs."},
{t:"HATEOAS",q:"HATEOAS in REST means?",o:["HTML encoding","Responses include links to related actions","Hash-based auth","HTML API standard"],a:1,e:"HATEOAS embeds links for client navigation."},
{t:"Layered System",q:"Layered REST architecture allows?",o:["One server only","Adding proxies load balancers without client knowledge","Client sees all layers","No intermediaries"],a:1,e:"Layered system allows transparent intermediary servers."},
{t:"Cache Constraint",q:"REST caching means?",o:["Server always fetches fresh","Responses can be marked cacheable for performance","Client never caches","Databases cache only"],a:1,e:"REST allows responses to be cached for performance."},
{t:"Client-Server Separation",q:"Client-server separation means?",o:["Same app","Client handles UI; server handles data and logic","Client controls DB","No separation needed"],a:1,e:"Client handles UI; server handles business logic and data."},
{t:"Code on Demand",q:"Code on demand in REST?",o:["Mandatory constraint","Optional: server can send executable code to client","Always required","Never allowed"],a:1,e:"Code on demand (e.g., JS) is optional REST constraint."},
{t:"REST vs SOAP",q:"REST vs SOAP?",o:["Same","REST uses HTTP and JSON; SOAP is XML protocol with strict standards","SOAP is newer","REST is always faster"],a:1,e:"REST is lightweight HTTP; SOAP is strict XML protocol."},
{t:"Idempotent Safe",q:"Safe HTTP method means?",o:["Fast method","No side effects (read-only)","No authentication needed","Only GET and POST"],a:1,e:"Safe methods (GET, HEAD) have no side effects."}
]},
{title:"API Design Best Practices",desc:"Design clean RESTful APIs.",qs:[
{t:"Noun Endpoints",q:"REST endpoints should use?",o:["Verbs like /getUser","/users (nouns)","camelCase only","UPPERCASE"],a:1,e:"RESTful endpoints use nouns; methods are verbs."},
{t:"Plural Resources",q:"Prefer /users or /user for collection?",o:["/user","/users","Doesn't matter","/Users"],a:1,e:"Use plural nouns for resource collections."},
{t:"Nested Resource",q:"URL for user's orders?",o:["/orders?userId=1","/users/1/orders","/userOrders","/orders/user/1"],a:1,e:"/users/:id/orders represents nested resource."},
{t:"API Versioning",q:"URL versioning example?",o:["/api/users?v=1","/api/v1/users","v1.api.com/users","/users/v1"],a:1,e:"/api/v1/ is the standard URL versioning pattern."},
{t:"Filter Query Params",q:"Filter users by role in REST?",o:["/users/role/admin","/users?role=admin","/filterUsers","/admin/users"],a:1,e:"Use query params for filtering: ?role=admin."},
{t:"HATEOAS Links",q:"HATEOAS response includes?",o:["Only data","Links to related actions and resources","Auth token","Error codes only"],a:1,e:"HATEOAS provides navigation links in responses."},
{t:"Consistent Error Format",q:"Consistent API error format should include?",o:["Only message","HTTP status only","Status code message and error details","Random format"],a:2,e:"Consistent errors include status, message, and details."},
{t:"API Documentation",q:"Best tool for REST API documentation?",o:["README only","Word document","Swagger/OpenAPI specification","JSON file"],a:2,e:"Swagger/OpenAPI provides interactive API documentation."},
{t:"Batch Operations",q:"Batch operations in REST done via?",o:["Multiple sequential GET","POST with array of items or custom batch endpoint","WebSockets","GraphQL only"],a:1,e:"Batch via POST with array or dedicated batch endpoint."},
{t:"Deprecation Header",q:"Mark API version as deprecated via?",o:["Remove endpoint","Sunset header in response","Change URL","Email users"],a:1,e:"Sunset HTTP header signals API deprecation with date."}
]},
{title:"API Testing with Postman",desc:"Test APIs with Postman.",qs:[
{t:"Postman Purpose",q:"Postman is used for?",o:["CSS styling","Database management","Testing and exploring APIs","Server deployment"],a:2,e:"Postman is an API testing and exploration tool."},
{t:"Environment Variables",q:"Postman environment variables store?",o:["HTML templates","Reusable values like base URLs and tokens","CSS variables","DB schemas"],a:1,e:"Env vars store reusable values across requests."},
{t:"Collection",q:"Postman collection is?",o:["Single request","Database backup","Organized group of related API requests","Test script"],a:2,e:"Collections group related API requests together."},
{t:"Pre-request Script",q:"Postman pre-request script runs?",o:["After response","Before the request is sent","Only on errors","On collection run"],a:1,e:"Pre-request scripts execute before the request is sent."},
{t:"Test Script",q:"Postman test script purpose?",o:["Send requests","Write assertions to verify API responses","Style requests","Encrypt data"],a:1,e:"Test scripts assert expected values in responses."},
{t:"pm.expect",q:"In Postman, pm.expect(res.code).to.equal(200) does?",o:["Sends 200 request","Asserts response status is 200","Sets status code","Logs status"],a:1,e:"pm.expect asserts response status code equals 200."},
{t:"Auth in Postman",q:"Set Bearer token auth in Postman?",o:["In URL query","Authorization tab > Bearer Token","Request body","Header manually only"],a:1,e:"Use Authorization tab to set Bearer token."},
{t:"Mock Server",q:"Postman mock server allows?",o:["Real API only","Test against simulated API responses without backend","Deploy app","Monitor traffic"],a:1,e:"Mock servers simulate API responses for frontend testing."},
{t:"Runner",q:"Postman collection runner?",o:["Runs one request","Runs all collection requests sequentially with assertions","Deploys API","Generates docs"],a:1,e:"Collection runner executes all requests with tests."},
{t:"Response Validation",q:"Validate JSON schema in Postman?",o:["Not possible","pm.expect(res.json()).to.have.jsonSchema(schema)","Use third-party only","Manual check"],a:1,e:"Postman can validate response against JSON schema."}
]},
{title:"GraphQL Basics",desc:"Introduction to GraphQL.",qs:[
{t:"GraphQL vs REST",q:"Key GraphQL advantage over REST?",o:["Faster servers","Client requests exactly the data it needs (no over/under-fetching)","No backend needed","Better security"],a:1,e:"GraphQL lets clients specify exactly what data they need."},
{t:"Single Endpoint",q:"GraphQL uses?",o:["Multiple endpoints per resource","A single endpoint for all operations","No HTTP","REST endpoints internally"],a:1,e:"GraphQL exposes one endpoint for all queries and mutations."},
{t:"Query vs Mutation",q:"GraphQL query vs mutation?",o:["Same","Query=read; Mutation=write","Query=write; Mutation=read","Both write"],a:1,e:"Queries read data; mutations write/modify data."},
{t:"Schema Definition",q:"GraphQL schema defines?",o:["Database tables","CSS","Types and the shape of available queries and mutations","Routes"],a:2,e:"Schema defines types, queries, mutations and their shapes."},
{t:"Resolver",q:"GraphQL resolver is?",o:["Query UI","DB table","Function that returns data for a schema field","Auth middleware"],a:2,e:"Resolvers implement the logic to fetch field data."},
{t:"Over-fetching",q:"Over-fetching means?",o:["Server too busy","API returns more data than client needs","Not enough data","Too many requests"],a:1,e:"Over-fetching = API returns unneeded extra fields."},
{t:"Subscription",q:"GraphQL subscription is for?",o:["Auth","Batch queries","Real-time updates via WebSocket","Caching"],a:2,e:"Subscriptions enable real-time data over WebSocket."},
{t:"Introspection",q:"GraphQL introspection allows?",o:["Server monitoring","Client to query the schema itself","DB inspection","Auth bypass"],a:1,e:"Introspection lets clients discover available types and queries."},
{t:"N+1 Problem GraphQL",q:"N+1 problem in GraphQL solved by?",o:["Caching","DataLoader for batching and caching","More RAM","Pagination only"],a:1,e:"DataLoader batches and caches field-level DB calls."},
{t:"Apollo Client",q:"Apollo Client is?",o:["GraphQL server","REST client","GraphQL client for React","Database driver"],a:2,e:"Apollo Client manages GraphQL queries in React apps."}
]},
{title:"API Rate Limiting and Caching",desc:"Optimize API performance.",qs:[
{t:"Rate Limit Purpose",q:"API rate limiting?",o:["Speed up DB","Prevent abuse by limiting requests per client","Add authentication","Compress responses"],a:1,e:"Rate limiting protects APIs from abuse and DDoS."},
{t:"Redis Cache",q:"Redis is used for caching because?",o:["Stores to disk","Slow but reliable","In-memory store with very fast reads","SQL alternative"],a:2,e:"Redis is an in-memory store with sub-millisecond reads."},
{t:"Cache Hit",q:"Cache hit means?",o:["Cache miss","Data found in cache, no DB needed","Cache was wrong","New cache entry"],a:1,e:"Cache hit = data found in cache, avoiding DB query."},
{t:"Cache Invalidation",q:"Cache invalidation is?",o:["Adding cache","Removing stale cache entries when data changes","Encrypting cache","Compressing cache"],a:1,e:"Invalidation removes or updates stale cached data."},
{t:"TTL in Cache",q:"TTL in caching stands for?",o:["Total Transfer Load","Time To Live - how long data stays cached","Type Transfer Layer","Token Transport Layer"],a:1,e:"TTL defines how long cached data remains valid."},
{t:"ETag Header",q:"ETag HTTP header is for?",o:["Auth","Content encoding","Cache validation - server sends hash client checks for changes","Compression"],a:2,e:"ETags enable conditional requests for cache validation."},
{t:"Conditional Request",q:"If-None-Match header does?",o:["Force refresh","Auth token","Send request only if ETag changed; 304 if not","Compress"],a:2,e:"If-None-Match returns 304 Not Modified if unchanged."},
{t:"Throttling vs Rate Limit",q:"Throttling vs rate limiting?",o:["Same","Rate limit=hard cap; Throttling=slow down excess requests","Throttling=block","Rate limit=slow"],a:1,e:"Rate limit hard-blocks; throttling slows excess requests."},
{t:"Cache-Control Header",q:"Cache-Control: no-cache means?",o:["Never cache","Disable all caching","Must revalidate before using cached response","Cache forever"],a:2,e:"no-cache means revalidate with server before using cache."},
{t:"Memoization",q:"Memoization in API context?",o:["DB indexing","Cache function results in memory to avoid recomputation","HTTP caching","Session storage"],a:1,e:"Memoization caches function results for repeated calls."}
]}
]}];
const TOPICS10=[
{title:"Advanced React and State Management",slug:"advanced-react-state",desc:"Redux, Context, and advanced patterns.",subs:[
{title:"Context API",desc:"React built-in state sharing.",qs:[
{t:"Context API Purpose",q:"React Context API solves?",o:["Styling","Routing","Prop drilling (sharing state across many levels)","Database access"],a:2,e:"Context avoids prop drilling by sharing state at any depth."},
{t:"createContext",q:"createContext() creates?",o:["A component","A context object with Provider and Consumer","A hook","A reducer"],a:1,e:"createContext returns a context object."},
{t:"Provider Component",q:"Context Provider does?",o:["Consumes context","Provides context value to all descendant components","Fetches data","Manages routing"],a:1,e:"Provider makes context value available to descendants."},
{t:"Context Re-render",q:"When does context cause re-render?",o:["Always","Never","When the context value changes","On route change only"],a:2,e:"Components re-render when the context value changes."},
{t:"Context Default Value",q:"Default value in createContext(defaultVal)?",o:["Ignored","Used when no Provider above in tree","Always used","Only in tests"],a:1,e:"Default value is used when there is no Provider ancestor."},
{t:"Context vs Redux",q:"Context API vs Redux?",o:["Same","Context=built-in simple; Redux=third-party powerful for complex state","Redux always better","Context is deprecated"],a:1,e:"Context for simple sharing; Redux for complex global state."},
{t:"Multiple Contexts",q:"Can a component consume multiple contexts?",o:["No","Yes, by calling useContext multiple times","Only two max","Only with Redux"],a:1,e:"Multiple useContext calls consume multiple contexts."},
{t:"Context Performance",q:"Context performance issue?",o:["None","All consumers re-render on any context change","Only Provider re-renders","Only root re-renders"],a:1,e:"All Context consumers re-render on value change."},
{t:"Context Split Strategy",q:"Split contexts for performance means?",o:["One big context","Separate contexts by update frequency to minimize re-renders","Split by file","Context per component"],a:1,e:"Separate frequently updated values into different contexts."},
{t:"Context and Memo",q:"Prevent child re-render from context change?",o:["Not possible","Wrap child in React.memo with useMemo for value","Always re-renders","Use Redux instead"],a:1,e:"Memoize children and context value to prevent unnecessary re-renders."}
]},
{title:"Redux Toolkit",desc:"Manage global state with Redux.",qs:[
{t:"Redux Purpose",q:"Redux is used for?",o:["CSS management","Server-side rendering","Predictable global state management","Routing"],a:2,e:"Redux manages application-wide state predictably."},
{t:"Redux Toolkit",q:"Redux Toolkit (RTK) vs vanilla Redux?",o:["Same","RTK reduces boilerplate with opinionated setup","Vanilla is better","RTK removes reducers"],a:1,e:"RTK simplifies Redux with less boilerplate."},
{t:"createSlice",q:"createSlice() in RTK generates?",o:["API calls","Action creators and reducer together","React component","Database schema"],a:1,e:"createSlice auto-generates actions and reducer."},
{t:"configureStore",q:"configureStore() does?",o:["Fetch data","Create React context","Create Redux store combining slices","Configure axios"],a:2,e:"configureStore creates the Redux store."},
{t:"useSelector",q:"useSelector hook?",o:["Dispatches actions","Selects state from Redux store","Fetches API data","Creates slices"],a:1,e:"useSelector reads state from Redux store."},
{t:"useDispatch",q:"useDispatch hook?",o:["Read state","Dispatch actions to store","Create selectors","Fetch data"],a:1,e:"useDispatch returns the dispatch function."},
{t:"Immer in RTK",q:"RTK uses Immer for?",o:["Async actions","HTTP requests","Writing mutable-looking state updates that are actually immutable","CSS-in-JS"],a:2,e:"Immer lets you write mutable code that stays immutable."},
{t:"createAsyncThunk",q:"createAsyncThunk handles?",o:["Sync state","Routing","Async operations with pending/fulfilled/rejected actions","CSS"],a:2,e:"createAsyncThunk manages async operations in Redux."},
{t:"RTK Query",q:"RTK Query is?",o:["REST framework","ORM","Data fetching and caching solution built into RTK","Testing tool"],a:2,e:"RTK Query handles data fetching, caching, and state."},
{t:"Redux DevTools",q:"Redux DevTools allows?",o:["Edit CSS","Deploy app","Inspect state changes and time-travel debug","Manage auth"],a:2,e:"DevTools lets you inspect state history and time-travel."}
]},
{title:"Performance Optimization",desc:"Optimize React app performance.",qs:[
{t:"Code Splitting",q:"Code splitting means?",o:["Split CSS","Breaking app into smaller chunks loaded on demand","Split DB queries","Split team tasks"],a:1,e:"Code splitting loads JS chunks only when needed."},
{t:"Virtualization",q:"List virtualization does?",o:["Encrypt list","Render only visible list items (not all)","Sort list","Filter list"],a:1,e:"Virtualization renders only visible items for huge lists."},
{t:"react-window",q:"react-window library is for?",o:["Routing","Auth","Efficiently rendering large lists","CSS animations"],a:2,e:"react-window virtualizes large lists for performance."},
{t:"Bundle Analysis",q:"Analyze bundle size?",o:["console.log","npm test","webpack-bundle-analyzer or source-map-explorer","npm audit"],a:2,e:"Bundle analyzers visualize what makes your bundle large."},
{t:"Tree Shaking",q:"Tree shaking removes?",o:["CSS","Unused exports from final bundle","Node modules","Tests"],a:1,e:"Tree shaking eliminates dead code from production bundle."},
{t:"Lazy Image Load",q:"Lazy loading images does?",o:["Blur images","Load images only when they enter viewport","Compress images","Delete images"],a:1,e:"Lazy loading defers image loading until visible."},
{t:"Web Vitals",q:"Core Web Vitals measure?",o:["Server uptime","Bundle size","User experience metrics: LCP FID CLS","Code quality"],a:2,e:"Core Web Vitals: LCP, FID/INP, CLS for UX metrics."},
{t:"LCP",q:"LCP (Largest Contentful Paint) measures?",o:["Layout shifts","Input delay","Time to render largest visible content element","Total bundle"],a:2,e:"LCP measures when the largest content element is rendered."},
{t:"CLS",q:"CLS (Cumulative Layout Shift) measures?",o:["Loading speed","Input delay","Visual stability (unexpected layout shifts)","Script errors"],a:2,e:"CLS measures unexpected movement of page content."},
{t:"Debounce",q:"Debouncing in React is used to?",o:["Speed up renders","Delay execution until user stops triggering event (e.g. search)","Batch state updates","Cache API results"],a:1,e:"Debounce delays function call until events stop firing."}
]},
{title:"Testing React Apps",desc:"Unit and integration testing.",qs:[
{t:"Jest Purpose",q:"Jest is?",o:["CSS framework","REST client","JavaScript testing framework","DB tool"],a:2,e:"Jest is a JavaScript testing framework."},
{t:"RTL Purpose",q:"React Testing Library philosophy?",o:["Test implementation details","Test what user sees and interacts with","Test Redux only","Mock everything"],a:1,e:"RTL tests behavior from the user's perspective."},
{t:"render Function",q:"RTL render() does?",o:["Deploy component","Render component into virtual DOM for testing","Style component","Fetch data"],a:1,e:"render() mounts component into virtual DOM for queries."},
{t:"getByText",q:"getByText() queries element by?",o:["CSS class","ID","Visible text content","Data attribute"],a:2,e:"getByText finds element by its text content."},
{t:"fireEvent",q:"fireEvent.click(btn) does?",o:["Remove element","Simulate user click event on element","Focus element","Animate element"],a:1,e:"fireEvent simulates DOM events for testing."},
{t:"userEvent",q:"userEvent vs fireEvent?",o:["Same","userEvent simulates more realistic user interactions","fireEvent is newer","userEvent is deprecated"],a:1,e:"userEvent simulates real user interactions more accurately."},
{t:"Mocking",q:"Why mock modules in tests?",o:["Speed CSS","Isolate unit under test from external dependencies","Break app","Skip tests"],a:1,e:"Mocking isolates the unit from external dependencies."},
{t:"Test Coverage",q:"Test coverage measures?",o:["Test speed","What percentage of code is executed by tests","Code quality","Bundle size"],a:1,e:"Coverage reports what percentage of code tests execute."},
{t:"Snapshot Testing",q:"Snapshot testing does?",o:["Test performance","Capture and compare UI output to detect changes","Test auth","Test routing"],a:1,e:"Snapshots catch unintended UI rendering changes."},
{t:"E2E Testing",q:"End-to-end testing tools for React?",o:["Jest only","Cypress or Playwright","eslint","webpack"],a:1,e:"Cypress and Playwright test full user flows in browser."}
]},
{title:"Advanced Patterns",desc:"Compound components, HOC, render props.",qs:[
{t:"HOC Pattern",q:"Higher-Order Component (HOC)?",o:["HTML tag","Function taking component returning enhanced component","Redux store","CSS mixin"],a:1,e:"HOC wraps a component to add reusable behavior."},
{t:"Render Props",q:"Render props pattern?",o:["Return JSX from state","Prop that is a function providing render logic","CSS rendering","Server rendering"],a:1,e:"Render props share code via a function prop."},
{t:"Compound Components",q:"Compound components pattern?",o:["Multiple separate apps","Components sharing implicit state through context","SQL joins","CSS components"],a:1,e:"Compound components share state via Context internally."},
{t:"Controlled vs Uncontrolled",q:"Uncontrolled component uses?",o:["State for form value","Ref to access DOM value directly","Redux","Context"],a:1,e:"Uncontrolled components use ref to read DOM value."},
{t:"Portal",q:"ReactDOM.createPortal renders?",o:["New React app","Component outside its parent DOM hierarchy","Hidden element","Modal only"],a:1,e:"Portal renders children outside the parent DOM container."},
{t:"Error Boundary",q:"Error boundary catches?",o:["Network errors","async errors","JavaScript errors in child render lifecycle","Redux errors"],a:2,e:"Error boundaries catch render lifecycle JS errors in children."},
{t:"Forwarding Refs",q:"React.forwardRef allows?",o:["Copy refs","Pass ref through component to child DOM node","Delete refs","Create new refs"],a:1,e:"forwardRef passes refs down through component hierarchy."},
{t:"useImperativeHandle",q:"useImperativeHandle customizes?",o:["State behavior","The ref value exposed to parent","CSS","Context"],a:1,e:"useImperativeHandle controls what ref exposes to parent."},
{t:"Concurrent Mode",q:"React Concurrent Mode allows?",o:["Multiple apps","Parallel route rendering","Interrupt rendering for higher-priority updates","Multiple states"],a:2,e:"Concurrent Mode lets React interrupt rendering for priority."},
{t:"Suspense Data Fetching",q:"Suspense for data fetching?",o:["Manual loading state","Declaratively show fallback while async data loads","CSS loading","DB query"],a:1,e:"Suspense shows fallback while async data is loading."}
]}
]}];
const TOPICS11=[
{title:"DevOps Basics for Developers",slug:"devops-basics",desc:"DevOps tools and practices.",subs:[
{title:"Linux and Command Line",desc:"Essential Linux commands.",qs:[
{t:"pwd Command",q:"pwd command does?",o:["Print working directory","Change directory","Create file","List files"],a:0,e:"pwd prints the current working directory path."},
{t:"ls Command",q:"ls -la does?",o:["Delete files","List all files with details including hidden","Create directory","Print path"],a:1,e:"ls -la lists all files including hidden with details."},
{t:"cd Command",q:"cd ~ does?",o:["Create directory","Change to root","Change to home directory","List files"],a:2,e:"~ represents the home directory."},
{t:"grep Command",q:"grep pattern file does?",o:["Delete lines","Move file","Search for pattern in file","Count lines"],a:2,e:"grep searches for pattern matches in files."},
{t:"chmod Command",q:"chmod 755 file does?",o:["Change owner","Delete file","Set file permissions","Rename file"],a:2,e:"chmod changes file permissions."},
{t:"ps aux",q:"ps aux shows?",o:["Disk usage","Network connections","All running processes","CPU temp"],a:2,e:"ps aux lists all running processes."},
{t:"kill Command",q:"kill -9 PID does?",o:["Restart process","Pause process","Forcefully terminate process by PID","Send signal 1"],a:2,e:"kill -9 forcefully terminates a process."},
{t:"tail f",q:"tail -f logfile does?",o:["Delete file","Read from beginning","Follow log file output in real time","Count lines"],a:2,e:"tail -f streams new log file additions in real time."},
{t:"curl Command",q:"curl URL does?",o:["Edit file","Transfer data from URL (test HTTP endpoints)","Create directory","Manage processes"],a:1,e:"curl transfers data and can test HTTP endpoints."},
{t:"Environment Variable",q:"Set env var in Linux shell?",o:["env KEY=VALUE","set KEY=VALUE","KEY=VALUE (export for child processes)","config KEY=VALUE"],a:2,e:"KEY=VALUE sets env var; export makes it available to children."}
]},
{title:"Nginx and Web Servers",desc:"Configure Nginx for apps.",qs:[
{t:"Nginx Use Case",q:"Nginx is used as?",o:["DB server","Email server","Web server and reverse proxy","Auth server"],a:2,e:"Nginx is a web server and reverse proxy."},
{t:"Reverse Proxy Config",q:"Nginx reverse proxy passes requests to?",o:["Static files","Internet","Upstream backend app like Node.js","DNS"],a:2,e:"Reverse proxy forwards requests to backend app."},
{t:"Server Block",q:"Nginx server block configures?",o:["Linux user","Virtual host for a domain","Database","Email"],a:1,e:"Server blocks configure virtual hosts in Nginx."},
{t:"SSL in Nginx",q:"Enable HTTPS in Nginx with?",o:["nginx.conf port 80","ssl_certificate and ssl_certificate_key directives","Environment variable","Dockerfile"],a:1,e:"SSL cert and key directives enable HTTPS in Nginx."},
{t:"Certbot",q:"Certbot is used for?",o:["Code formatting","Free SSL certificates from Let's Encrypt","Database backup","Log management"],a:1,e:"Certbot automates free SSL certificate from Let's Encrypt."},
{t:"Nginx Load Balancing",q:"Nginx upstream block configures?",o:["Static file path","Virtual host","Load balancing across multiple backend servers","SSL cert"],a:2,e:"Upstream block defines backend servers for load balancing."},
{t:"Nginx Default Port",q:"Nginx listens on which port by default?",o:["3000","8080","80","443"],a:2,e:"Nginx defaults to port 80 for HTTP."},
{t:"try_files Directive",q:"try_files in Nginx?",o:["Test SSL","Try file paths in order for SPA routing","Cache config","Set headers"],a:1,e:"try_files serves matching files or falls back for SPA."},
{t:"gzip Compression",q:"Nginx gzip compression?",o:["Encrypts responses","Compresses responses to reduce transfer size","Caches responses","Logs requests"],a:1,e:"gzip reduces response size for faster transfer."},
{t:"Nginx vs Apache",q:"Nginx vs Apache main difference?",o:["Same","Nginx event-driven async; Apache thread-per-request","Apache is faster","Nginx is newer only"],a:1,e:"Nginx is async event-driven; Apache uses threads."}
]},
{title:"Monitoring and Logging",desc:"Monitor production apps.",qs:[
{t:"Application Logging",q:"Why log in production?",o:["Only for debugging","Track errors user behavior and system health","Required by law","Slow the app"],a:1,e:"Logs track errors, events, and system health."},
{t:"Log Levels",q:"Common log levels in order (most to least severe)?",o:["info debug warn error","error warn info debug","debug info warn error","warn error debug info"],a:1,e:"Severity: error > warn > info > debug."},
{t:"PM2",q:"PM2 is used for?",o:["Package management","CSS processing","Process management for Node.js (auto-restart, clustering)","DNS management"],a:2,e:"PM2 manages Node.js processes with auto-restart."},
{t:"PM2 Cluster",q:"PM2 cluster mode does?",o:["Single thread","Runs multiple Node instances across CPU cores","Limits memory","Blocks requests"],a:1,e:"Cluster mode runs one instance per CPU core."},
{t:"Health Endpoint",q:"Health check endpoint returns?",o:["User data","200 OK when app is healthy","Error always","Static HTML"],a:1,e:"Health endpoint returns 200 OK confirming app is running."},
{t:"Prometheus",q:"Prometheus is?",o:["Log viewer","Monitoring system scraping metrics","DB","Deployment tool"],a:1,e:"Prometheus collects and stores time-series metrics."},
{t:"Grafana",q:"Grafana is used for?",o:["Code reviews","Visualizing metrics from Prometheus and other sources","DB management","Auth"],a:1,e:"Grafana visualizes metrics in dashboards."},
{t:"Error Tracking",q:"Sentry is used for?",o:["Performance testing","Real-time error tracking and reporting","Log storage","Deployment"],a:1,e:"Sentry captures and reports application errors in real time."},
{t:"Alerting",q:"Monitoring alerts notify when?",o:["All requests","New code deployed","Metrics exceed thresholds (errors, latency, CPU)","User logins"],a:2,e:"Alerts fire when metrics exceed defined thresholds."},
{t:"Uptime Monitoring",q:"Uptime monitoring checks?",o:["CPU usage","Memory","Whether the app/URL is accessible and returns OK","DB size"],a:2,e:"Uptime monitors confirm the app is accessible."}
]},
{title:"Version Control and Collaboration",desc:"Team Git workflows.",qs:[
{t:"Code Review Practice",q:"Why require code review for PRs?",o:["Slow teams down","Catch bugs share knowledge maintain quality","Mandatory law","Add LOC"],a:1,e:"Code reviews catch bugs and improve knowledge sharing."},
{t:"Branch Strategy",q:"Trunk-based development means?",o:["Long-lived feature branches","Commit directly to main frequently","Use only GitHub","No branching"],a:1,e:"Trunk-based development uses short-lived branches committing to main often."},
{t:"CODEOWNERS",q:"CODEOWNERS file in GitHub does?",o:["Set permissions","Auto-assign reviewers for specific files","List contributors","Set branch protection"],a:1,e:"CODEOWNERS auto-assigns required reviewers for file areas."},
{t:"Issue Tracking",q:"GitHub Issues are used for?",o:["Code storage","Tracking bugs features and tasks","DNS","Authentication"],a:1,e:"Issues track bugs, features, and project tasks."},
{t:"README Purpose",q:"README.md purpose?",o:["Store CSS","Document project setup usage and contribution guide","Git config","DB schema"],a:1,e:"README documents what the project does and how to use it."},
{t:"Semantic Versioning",q:"SemVer 1.2.3 means?",o:["Random numbers","Major.Minor.Patch version numbers","Date based","Hash based"],a:1,e:"SemVer: Major.Minor.Patch release versioning."},
{t:"CHANGELOG",q:"CHANGELOG.md purpose?",o:["List all files","Document all notable changes per version","CSS changes","DB migrations"],a:1,e:"CHANGELOG tracks all notable changes per version."},
{t:"Pair Programming",q:"Pair programming?",o:["Two computers one task","Two developers working together on same code","Remote only","Testing practice"],a:1,e:"Pair programming has two devs working on same code."},
{t:"Feature Flag",q:"Feature flags allow?",o:["Bug deletion","Enable/disable features without deploying","Branch creation","DB migration"],a:1,e:"Feature flags toggle features without new deployment."},
{t:"Post-mortem",q:"Incident post-mortem purpose?",o:["Blame team","Analyze what went wrong and prevent recurrence","Delete logs","Rollback code"],a:1,e:"Post-mortems analyze incidents to prevent recurrence."}
]},
{title:"Basic Networking for Developers",desc:"HTTP, DNS, and networking.",qs:[
{t:"HTTP vs HTTPS",q:"HTTPS vs HTTP?",o:["Same","HTTPS encrypts with TLS; HTTP is plain text","HTTPS is slower","HTTP is newer"],a:1,e:"HTTPS encrypts with TLS; HTTP sends plain text."},
{t:"TCP vs UDP",q:"TCP vs UDP?",o:["Same","TCP is reliable ordered; UDP is faster no guarantees","UDP is reliable","TCP is newer"],a:1,e:"TCP = reliable ordered; UDP = fast unreliable."},
{t:"WebSocket",q:"WebSockets provide?",o:["One-way HTTP","File uploads","Persistent full-duplex connection for real-time","Caching"],a:2,e:"WebSockets enable persistent bi-directional real-time connection."},
{t:"HTTP/2 Benefit",q:"HTTP/2 over HTTP/1.1?",o:["Older protocol","Multiplexing multiple requests on one connection","Slower","Text only"],a:1,e:"HTTP/2 multiplexes requests improving performance."},
{t:"DNS Lookup",q:"DNS lookup process?",o:["Check DB","Browser cache > OS > resolver > root > TLD > authoritative","Read HTML","Check local file"],a:1,e:"DNS: browser cache > OS > resolver > root > authoritative."},
{t:"IP Address Types",q:"Private IP range example?",o:["8.8.8.8","192.168.x.x","54.123.x.x","45.x.x.x"],a:1,e:"192.168.x.x is a private (local network) IP range."},
{t:"CORS Origin",q:"CORS error occurs when?",o:["Server is down","Request made to different origin without proper headers","Wrong JSON","DB error"],a:1,e:"CORS blocks cross-origin requests missing Access-Control headers."},
{t:"HTTP Cache Headers",q:"Cache-Control: max-age=3600 means?",o:["No caching","Cache for 1 hour","Force revalidate","Private only"],a:1,e:"max-age=3600 caches response for 3600 seconds (1 hour)."},
{t:"Localhost",q:"localhost resolves to?",o:["Google server","127.0.0.1 (loopback address)","Public IP","Random IP"],a:1,e:"localhost = 127.0.0.1 loopback to your own machine."},
{t:"Port 3000",q:"Port 3000 is commonly used for?",o:["HTTPS","FTP","Node.js/React development server","Email"],a:2,e:"Port 3000 is the conventional Node.js/React dev port."}
]}
]}];
const TOPICS12=[
{title:"Capstone Project and Interview Preparation",slug:"capstone-interview-prep",desc:"Build projects and ace interviews.",subs:[
{title:"System Design Basics",desc:"Design scalable systems.",qs:[
{t:"Scalability",q:"Horizontal scaling means?",o:["Bigger server","Add more servers","Faster CPU","More RAM"],a:1,e:"Horizontal scaling adds more servers (scale out)."},
{t:"Database Sharding",q:"Database sharding is?",o:["DB backup","Partitioning DB across multiple servers","Adding indexes","DB normalization"],a:1,e:"Sharding splits data across multiple DB instances."},
{t:"Microservices",q:"Microservices architecture?",o:["One big app","Small independent services each doing one thing","Only for mobile","DB first approach"],a:1,e:"Microservices are small independent deployable services."},
{t:"Message Queue",q:"Message queue like RabbitMQ/Kafka used for?",o:["CSS","DB queries","Async decoupled communication between services","Auth"],a:2,e:"Message queues decouple services via async messaging."},
{t:"CAP Theorem",q:"CAP theorem states distributed system can have?",o:["All three: Consistency Availability Partition tolerance","Only two of: C A P","Consistency only","Availability only"],a:1,e:"CAP: can only guarantee 2 of Consistency, Availability, Partition tolerance."},
{t:"API Gateway",q:"API Gateway does?",o:["Stores data","Single entry point routing auth rate-limiting for microservices","Frontend build","DB connection"],a:1,e:"API Gateway is single entry point managing cross-cutting concerns."},
{t:"CDN in Design",q:"CDN in system design reduces?",o:["Server count","DB queries","Latency by serving assets close to users","Code complexity"],a:2,e:"CDN reduces latency by caching assets near users."},
{t:"Event-Driven Architecture",q:"Event-driven systems communicate via?",o:["Direct HTTP calls","Shared DB","Events and messages on queues/topics","REST only"],a:2,e:"Event-driven systems communicate through async events."},
{t:"Load Balancing Algorithm",q:"Round-robin load balancing?",o:["Random server","Fastest server","Routes each request to next server in sequence","Most loaded server"],a:2,e:"Round-robin distributes requests sequentially."},
{t:"Single Point of Failure",q:"SPOF (Single Point of Failure) prevention?",o:["More code","Redundancy and failover mechanisms","Faster DB","Better CSS"],a:1,e:"Redundancy and failover eliminate single points of failure."}
]},
{title:"Coding Interview Patterns",desc:"Common DS/A patterns.",qs:[
{t:"Big O Notation",q:"Big O O(n) means?",o:["Constant time","Linear time proportional to input size","Quadratic time","Log time"],a:1,e:"O(n) = linear time, grows proportionally with input."},
{t:"O(1) Example",q:"Example of O(1) operation?",o:["Loop through array","Sort array","Access array by index","Recursive fib"],a:2,e:"Array index access is constant time O(1)."},
{t:"Two Pointer Technique",q:"Two pointer technique used for?",o:["Tree traversal","Graph BFS","Sorted array problems like pair sum","Stack problems"],a:2,e:"Two pointers solve sorted array problems efficiently."},
{t:"Sliding Window",q:"Sliding window pattern used for?",o:["Sorting","Tree problems","Subarray or substring problems","Graph traversal"],a:2,e:"Sliding window solves contiguous subarray/substring problems."},
{t:"Hash Map Use Case",q:"Hash map lookup time complexity?",o:["O(n)","O(log n)","O(1) average","O(n log n)"],a:2,e:"Hash map lookup is O(1) average case."},
{t:"Binary Search",q:"Binary search requires?",o:["Unsorted array","Linked list","Sorted array","Graph"],a:2,e:"Binary search requires a sorted array, O(log n)."},
{t:"BFS vs DFS",q:"BFS is best for?",o:["Deepest path","Backtracking","Shortest path in unweighted graph","Sorting"],a:2,e:"BFS finds shortest path in unweighted graphs."},
{t:"Dynamic Programming",q:"Dynamic programming uses?",o:["Brute force only","Recursion only","Memoization or tabulation to avoid recomputation","Random algorithms"],a:2,e:"DP avoids recomputation via memoization or tabulation."},
{t:"Stack Use Case",q:"Stack (LIFO) used for?",o:["BFS","Queue operations","Function call stack, undo, balanced parentheses","Sorting"],a:2,e:"Stack: function calls, undo, balanced parentheses."},
{t:"Recursion Base Case",q:"Every recursive function needs?",o:["Global variable","Loop inside","A base case to stop recursion","Return void"],a:2,e:"Base case prevents infinite recursion."}
]},
{title:"HR and Behavioral Interviews",desc:"Ace behavioral questions.",qs:[
{t:"STAR Method",q:"STAR method stands for?",o:["Skills Tasks Actions Results","Situation Task Action Result","Strategy Theory Analysis Result","Story Timing Approach Response"],a:1,e:"STAR: Situation, Task, Action, Result."},
{t:"Tell Me About Yourself",q:"Best approach for tell me about yourself?",o:["Personal life story","Unrelated hobbies","Professional summary: background skills relevant experience","Recite resume verbatim"],a:2,e:"Give a concise professional summary relevant to the role."},
{t:"Greatest Weakness",q:"Best response to what is your greatest weakness?",o:["I have none","Random negative trait","Real weakness with steps to improve it","Blame others"],a:2,e:"Share a real weakness and how you are actively improving."},
{t:"Why This Company",q:"Why do you want to work here answer?",o:["I need money","I applied everywhere","Research-based answer: company culture mission and role fit","Random answer"],a:2,e:"Research company and align your goals with their mission."},
{t:"Conflict Resolution",q:"Describe conflict with coworker question tests?",o:["Technical skills","Communication and conflict resolution skills","CSS knowledge","DB skills"],a:1,e:"Tests how you communicate and resolve disagreements."},
{t:"Salary Negotiation",q:"When to discuss salary?",o:["First thing","Never","After receiving offer or when asked","In every interview round"],a:2,e:"Discuss salary after an offer or when the interviewer asks."},
{t:"Questions to Ask",q:"At interview end you should?",o:["Say you have no questions","Ask about salary only","Ask thoughtful questions about role team and growth","Leave immediately"],a:2,e:"Asking questions shows interest and preparation."},
{t:"Culture Fit",q:"Culture fit questions assess?",o:["Technical skills","If your values and work style align with company","Math skills","Language preference"],a:1,e:"Culture fit assesses value and work style alignment."},
{t:"Remote Work Answer",q:"When asked about remote work experience?",o:["Lie if none","Honest answer with tools used and self-management skills","Skip question","Only mention tools"],a:1,e:"Be honest and highlight tools and self-discipline."},
{t:"Follow Up After Interview",q:"After interview you should?",o:["Do nothing","Send thank you email within 24 hours","Call every day","Post on social media"],a:1,e:"Send a thank-you email within 24 hours."}
]},
{title:"Portfolio and Resume",desc:"Build portfolio and resume.",qs:[
{t:"Portfolio Project Count",q:"How many projects in dev portfolio?",o:["20 plus","Zero","3-5 quality projects showcasing different skills","One only"],a:2,e:"3-5 high-quality projects are better than many mediocre ones."},
{t:"README in Projects",q:"Every portfolio project should have?",o:["No README","README with description setup instructions and tech stack","Only screenshots","Only deploy link"],a:1,e:"README explains what, how to run, and tech used."},
{t:"Live Demo",q:"Portfolio projects should have?",o:["Only code","Only documentation","Live demo link and source code","Video only"],a:2,e:"Both live demo and source code showcase the project best."},
{t:"Resume Length",q:"Developer resume should be?",o:["5 pages","Includes photo always","1 page for less than 10 years experience","Skills list only"],a:2,e:"1 page resume for under 10 years experience."},
{t:"GitHub Activity",q:"Active GitHub profile shows?",o:["Nothing to employers","Consistent coding habits and open source contribution","Only personal projects","Only forks"],a:1,e:"Active GitHub shows consistent coding and engagement."},
{t:"ATS Friendly Resume",q:"ATS-friendly resume uses?",o:["Tables and graphics","Simple formatting with keywords matching job description","Colors and images","Unusual fonts"],a:1,e:"ATS systems parse simple text; include relevant keywords."},
{t:"Personal Branding",q:"LinkedIn for developers should include?",o:["Personal photos only","Skills projects experience and custom URL","Nothing","Only jobs"],a:1,e:"LinkedIn should have full profile with skills and projects."},
{t:"Quantified Achievements",q:"Resume bullet points should?",o:["Be vague","List duties only","Quantify impact: improved performance by 40%","Use passive voice"],a:2,e:"Quantified achievements show concrete impact."},
{t:"Open Source Contribution",q:"Contributing to open source shows?",o:["Waste of time","Collaboration skills real-world code quality and initiative","Only for experts","Nothing to employers"],a:1,e:"Open source shows collaboration and real-world coding skills."},
{t:"Technical Blog",q:"Writing technical blog posts shows?",o:["Waste of time","Communication skills and deep understanding of topics","Only CSS skills","Nothing"],a:1,e:"Technical writing demonstrates deep understanding and communication."}
]},
{title:"Full Stack Project Practices",desc:"Build and deploy a full-stack project.",qs:[
{t:"Monorepo",q:"Monorepo stores?",o:["One file","Multiple related projects in one repository","Only frontend","Only backend"],a:1,e:"Monorepo houses multiple related projects in one repo."},
{t:"API First Design",q:"API-first design means?",o:["Build UI first","Design and agree on API contract before building frontend or backend","DB first","Test first"],a:1,e:"API-first defines the contract first, enabling parallel development."},
{t:"Environment Separation",q:"Dev staging production envs purpose?",o:["Same env","Test safely without affecting production","Save costs","Redundancy only"],a:1,e:"Separate envs allow safe testing before production."},
{t:"Database Migration",q:"DB migration files do?",o:["Back up DB","Version-control schema changes","Delete old data","Auto-index"],a:1,e:"Migrations version-control and apply schema changes."},
{t:"Seed Data",q:"Seed data in development is?",o:["Real production data","Sample data for testing and development","Random data","Backup data"],a:1,e:"Seed data populates DB with test data for development."},
{t:"Feature Branch Deploy",q:"Deploy feature branch to staging for?",o:["Production use","Testing feature before merging to main","Permanent hosting","Cost savings"],a:1,e:"Feature branch staging lets you test before merging."},
{t:"Error Monitoring Deploy",q:"Production app should have?",o:["console.log only","No monitoring","Error monitoring like Sentry and uptime checks","Manual daily checks"],a:2,e:"Production needs error monitoring and uptime checks."},
{t:"Twelve Factor App",q:"12-factor app methodology promotes?",o:["12 programming languages","12 DB tables","Best practices for building scalable cloud-native apps","12 team members"],a:2,e:"12-factor defines best practices for cloud-native apps."},
{t:"API Documentation",q:"Document API with?",o:["README only","No docs needed","Swagger/OpenAPI for interactive docs","Word doc"],a:2,e:"Swagger/OpenAPI provides interactive API documentation."},
{t:"Code Quality Tools",q:"Code quality tools include?",o:["MS Paint","notepad","ESLint Prettier and SonarQube","GitHub only"],a:2,e:"ESLint, Prettier, and SonarQube enforce code quality."}
]}
]}];
const ALL=[...TOPICS7,...TOPICS8,...TOPICS9,...TOPICS10,...TOPICS11,...TOPICS12];
const DB=process.env.DB_NAME;
const TOPIC_START_ORDER=7;
async function run(){
  await mongoose.connect(DB);
  console.log("Connected");
  const path=await PracticePath.findOne({slug:SLUG});
  if(!path){console.error("Path not found. Run seedFSD_part1.js first.");process.exit(1);}
  let tc=0,sc=0,qc=0;
  for(let ti=0;ti<ALL.length;ti++){
    const td=ALL[ti];
    let topic=await PracticeTopic.findOne({practicePath:path._id,slug:td.slug});
    if(!topic){
      topic=await PracticeTopic.create({practicePath:path._id,title:td.title,slug:td.slug,description:td.desc,order:TOPIC_START_ORDER+ti,isPublished:true});
      tc++;
    }
    console.log("Topic "+(TOPIC_START_ORDER+ti)+":",topic.title);
    for(let si=0;si<td.subs.length;si++){
      const sd=td.subs[si];
      const stSlug=sl(sd.title)+"-st"+si;
      let sub=await PracticeSubtopic.findOne({topic:topic._id,slug:stSlug});
      if(!sub){
        sub=await PracticeSubtopic.create({topic:topic._id,practicePath:path._id,title:sd.title,slug:stSlug,description:sd.desc||"",order:si+1,isPublished:true});
        sc++;
      }
      const base={practicePath:path._id,topic:topic._id,type:"mcq",isPublished:true,tags:["full-stack","seed"]};
      await makeQs(base,sub,sd.qs);
      qc+=sd.qs.length;
      console.log("  Subtopic:",sub.title,"-",sd.qs.length,"Qs");
    }
  }
  console.log("\nDone! Topics:"+tc+" Subtopics:"+sc+" Questions:"+qc);
  await mongoose.disconnect();
}
run().catch(e=>{console.error("Seed failed:",e.message);process.exit(1);});
