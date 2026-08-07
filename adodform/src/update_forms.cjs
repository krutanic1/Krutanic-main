const fs = require('fs');
const path = require('path');

const updateForm = (filePath, prefix) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace formData state
  const stateRegex = /const \[formData, setFormData\] = useState\(\{[\s\S]*?\}\);/;
  const newState = `const [formData, setFormData] = useState({
    fullName: '',
    personalEmail: '',
    contactNumber: '',
    whatsappNumber: '',
    collegeName: '',
    branchName: '',
    collegeEmail: '',
    yearOfStudying: '',
    placementCellEmail: '',
    crNameAndNumber: '',
    interestedDomain: '',
    primaryObjective: '',
    preferredLanguage: ''
  });`;
  content = content.replace(stateRegex, newState);

  // Replace selectDomain
  const selectDomainRegex = /const selectDomain = \(domainName\) => \{[\s\S]*?\};/;
  const newSelectDomain = `const selectDomain = (domainName) => {
    setFormData(prev => ({ ...prev, interestedDomain: domainName }));
    if (errors.interestedDomain) {
      setErrors(prev => ({ ...prev, interestedDomain: '' }));
    }
  };`;
  content = content.replace(selectDomainRegex, newSelectDomain);

  // Replace validations and steps
  const validationsRegex = /\/\* Step Validations \*\/[\s\S]*?const prevStep = \(\) => \{[\s\S]*?\};/;
  const newValidations = `/* Step Validations */
  const validateStep1 = () => {
    let errs = {};
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.personalEmail.trim() || !emailRegex.test(formData.personalEmail)) errs.personalEmail = 'Valid email is required';
    if (!formData.contactNumber.trim() || formData.contactNumber.replace(/\\D/g, '').length < 7) errs.contactNumber = 'Valid contact number is required';
    if (!formData.whatsappNumber.trim() || formData.whatsappNumber.replace(/\\D/g, '').length < 7) errs.whatsappNumber = 'Valid WhatsApp number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    let errs = {};
    if (!formData.collegeName.trim()) errs.collegeName = 'College Name is required';
    if (!formData.branchName.trim()) errs.branchName = 'Branch Name is required';
    if (!formData.collegeEmail.trim() || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.collegeEmail)) errs.collegeEmail = 'Valid college email is required';
    if (!formData.yearOfStudying.trim()) errs.yearOfStudying = 'Year of Studying is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    let errs = {};
    if (!formData.interestedDomain) errs.interestedDomain = 'Please select a domain';
    if (!formData.primaryObjective.trim()) errs.primaryObjective = 'Primary Objective is required';
    if (!formData.preferredLanguage.trim()) errs.preferredLanguage = 'Preferred Language is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };`;
  content = content.replace(validationsRegex, newValidations);

  // Replace params in fetch
  const paramsRegex = /const params = new URLSearchParams\(\);[\s\S]*?params\.append\('formSource', '[^']+'\);/;
  const newParams = `const params = new URLSearchParams();
      params.append('fullName', formData.fullName);
      params.append('personalEmail', formData.personalEmail);
      params.append('contactNumber', formData.contactNumber);
      params.append('whatsappNumber', formData.whatsappNumber);
      params.append('collegeName', formData.collegeName);
      params.append('branchName', formData.branchName);
      params.append('collegeEmail', formData.collegeEmail);
      params.append('yearOfStudying', formData.yearOfStudying);
      params.append('placementCellEmail', formData.placementCellEmail);
      params.append('crNameAndNumber', formData.crNameAndNumber);
      params.append('interestedDomain', formData.interestedDomain);
      params.append('primaryObjective', formData.primaryObjective);
      params.append('preferredLanguage', formData.preferredLanguage);
      params.append('formSource', '${prefix}');`;
  content = content.replace(paramsRegex, newParams);

  // Replace Form Steps JSX
  const formStepsRegex = /\{\/\* Step 1: Basic Info \*\/\}[\s\S]*?\{\/\* Step 4: Summary & Submit \*\/\}/;
  const newFormSteps = `{/* Step 1: Personal Details */}
                  {currentStep === 1 && (
                    <div className="${prefix}-step-content">
                      <div className="${prefix}-form-group">
                        <label>Full Name *</label>
                        <input type="text" name="fullName" placeholder="Enter your full name" className="${prefix}-form-input" value={formData.fullName} onChange={handleInputChange} />
                        {errors.fullName && <div className="${prefix}-error-text">{errors.fullName}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>Personal Email *</label>
                        <input type="email" name="personalEmail" placeholder="john@example.com" className="${prefix}-form-input" value={formData.personalEmail} onChange={handleInputChange} />
                        {errors.personalEmail && <div className="${prefix}-error-text">{errors.personalEmail}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>Contact Number *</label>
                        <input type="tel" name="contactNumber" placeholder="+91" className="${prefix}-form-input" value={formData.contactNumber} onChange={handleInputChange} />
                        {errors.contactNumber && <div className="${prefix}-error-text">{errors.contactNumber}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>WhatsApp Number *</label>
                        <input type="tel" name="whatsappNumber" placeholder="+91" className="${prefix}-form-input" value={formData.whatsappNumber} onChange={handleInputChange} />
                        {errors.whatsappNumber && <div className="${prefix}-error-text">{errors.whatsappNumber}</div>}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Academic Details */}
                  {currentStep === 2 && (
                    <div className="${prefix}-step-content">
                      <div className="${prefix}-form-group">
                        <label>College Name *</label>
                        <input type="text" name="collegeName" placeholder="Your University/College" className="${prefix}-form-input" value={formData.collegeName} onChange={handleInputChange} />
                        {errors.collegeName && <div className="${prefix}-error-text">{errors.collegeName}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>Branch Name *</label>
                        <input type="text" name="branchName" placeholder="e.g. Computer Science" className="${prefix}-form-input" value={formData.branchName} onChange={handleInputChange} />
                        {errors.branchName && <div className="${prefix}-error-text">{errors.branchName}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>College Email ID *</label>
                        <input type="email" name="collegeEmail" placeholder="student@college.edu" className="${prefix}-form-input" value={formData.collegeEmail} onChange={handleInputChange} />
                        {errors.collegeEmail && <div className="${prefix}-error-text">{errors.collegeEmail}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>Year Of Studying *</label>
                        <input type="text" name="yearOfStudying" placeholder="e.g. 2nd Year, 2025" className="${prefix}-form-input" value={formData.yearOfStudying} onChange={handleInputChange} />
                        {errors.yearOfStudying && <div className="${prefix}-error-text">{errors.yearOfStudying}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>Placement Cell Email (Optional)</label>
                        <input type="email" name="placementCellEmail" placeholder="tpo@college.edu" className="${prefix}-form-input" value={formData.placementCellEmail} onChange={handleInputChange} />
                      </div>
                      <div className="${prefix}-form-group">
                        <label>CR's Name & Number (Optional)</label>
                        <input type="text" name="crNameAndNumber" placeholder="Name - Phone" className="${prefix}-form-input" value={formData.crNameAndNumber} onChange={handleInputChange} />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Program Goals */}
                  {currentStep === 3 && (
                    <div className="${prefix}-step-content">
                      <div className="${prefix}-form-group">
                        <label>Interested Domain *</label>
                        <div className="${prefix}-domain-select-grid">
                          {DOMAINS_LIST.map((d) => (
                            <div
                              key={d.id}
                              className={\`${prefix}-domain-radio-card \${formData.interestedDomain === d.name ? 'selected' : ''}\`}
                              onClick={() => selectDomain(d.name)}
                            >
                              <span className="${prefix}-domain-radio-name">{d.name}</span>
                            </div>
                          ))}
                        </div>
                        {errors.interestedDomain && <div className="${prefix}-error-text">{errors.interestedDomain}</div>}
                      </div>
                      <div className="${prefix}-form-group" style={{ marginTop: '16px' }}>
                        <label>Primary Objective *</label>
                        <input type="text" name="primaryObjective" placeholder="Enter your primary objective" className="${prefix}-form-input" value={formData.primaryObjective} onChange={handleInputChange} />
                        {errors.primaryObjective && <div className="${prefix}-error-text">{errors.primaryObjective}</div>}
                      </div>
                      <div className="${prefix}-form-group">
                        <label>Preferred Language *</label>
                        <input type="text" name="preferredLanguage" placeholder="e.g. English, Hindi" className="${prefix}-form-input" value={formData.preferredLanguage} onChange={handleInputChange} />
                        {errors.preferredLanguage && <div className="${prefix}-error-text">{errors.preferredLanguage}</div>}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Summary & Submit */}`;
  content = content.replace(formStepsRegex, newFormSteps);

  // Replace step 4 summary variables
  const step4Regex = /<strong>Name:<\/strong> \{formData\.name\}<br \/>\s*<strong>Email:<\/strong> \{formData\.personalEmailId\}<br \/>\s*<strong>Phone:<\/strong> \{formData\.contactNumber\}<br \/>\s*<strong>Domain:<\/strong> <span className="highlight-text">\{formData\.selectedDomain\}<\/span>/;
  const newStep4 = `<strong>Name:</strong> {formData.fullName}<br />
                          <strong>Email:</strong> {formData.personalEmail}<br />
                          <strong>Phone:</strong> {formData.contactNumber}<br />
                          <strong>Domain:</strong> <span className="highlight-text">{formData.interestedDomain}</span>`;
  content = content.replace(step4Regex, newStep4);

  // Replace success state variables
  const successRegex = /Thank you <strong>\{formData\.name\}<\/strong>\. Your request for <span className="highlight-text">\{formData\.selectedDomain\}<\/span> has been registered\./;
  const newSuccess = `Thank you <strong>{formData.fullName}</strong>. Your request for <span className="highlight-text">{formData.interestedDomain}</span> has been registered.`;
  content = content.replace(successRegex, newSuccess);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
};

updateForm(path.join(__dirname, 'AvgFormPage.jsx'), 'avg');
updateForm(path.join(__dirname, 'WarrFormPage.jsx'), 'warr');
