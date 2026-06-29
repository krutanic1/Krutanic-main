const fs = require('fs');
let content = fs.readFileSync('src/AdvTeam/AdvLeadsBook.jsx', 'utf8');

// 1. Add imports at the top
content = content.replace('import { useLocation } from "react-router-dom";', 'import { useLocation } from "react-router-dom";\nimport AdvLeadActionPanel from "./AdvLeadActionPanel";\nimport { STAGES_AND_DISPOSITIONS } from "./AdvLeadConstants";');

// 2. Remove lines 7-99 (STAGES_AND_DISPOSITIONS, ACTION_TYPES, designTokens, AudioButton)
// Since we only imported STAGES_AND_DISPOSITIONS above, let's remove the declarations.
content = content.replace(/const STAGES_AND_DISPOSITIONS = \{[\s\S]*?\};\r?\n\r?\nconst ACTION_TYPES = \[[\s\S]*?\];\r?\n\r?\nconst designTokens = \{[\s\S]*?\};\r?\n\r?\nconst AudioButton = \(\{\s*url\s*\}\) => \{[\s\S]*?return \([\s\S]*?<\/?button>\r?\n\s*\);\r?\n\};\r?\n/, '');

// 3. Remove subtractFiveThirtyAndFormat
content = content.replace(/\/\/ Subtract 5 hours 30 minutes from a stored datetime and format for display\r?\n\s*const subtractFiveThirtyAndFormat = \([\s\S]*?\};\r?\n/, '');

// 4. Replace Action Panel UI (lines 1232-1569 roughly) with AdvLeadActionPanel
// The UI starts with {/* Action Panel */} and ends with </div> right before )} for isOpen
content = content.replace(/\{\/\* Action Panel \*\/\}\r?\n\s*\{isOpen && \([\s\S]*?<\/div>\r?\n\s*\)\}/, `{/* Action Panel */}
                                                {isOpen && (
                                                    <AdvLeadActionPanel
                                                        lead={lead}
                                                        isManager={isManagerOrLeader}
                                                        form={formState[lead._id] || {}}
                                                        updateForm={updateForm}
                                                        handleLogCall={handleLogCall}
                                                        submitting={submitting}
                                                        history={callHistory[lead._id] || []}
                                                        expandedLogId={expandedLogId}
                                                        setExpandedLogId={setExpandedLogId}
                                                    />
                                                )}`);

fs.writeFileSync('src/AdvTeam/AdvLeadsBook.jsx', content);
console.log('Patched AdvLeadsBook.jsx successfully.');
