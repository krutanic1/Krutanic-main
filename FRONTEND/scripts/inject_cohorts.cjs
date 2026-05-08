const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/tarun/OneDrive/Desktop/Krutanic-main-1/FRONTEND/src/page/AdvanceCourse';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(f => {
  const file = path.join(dir, f);
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Skip if already injected (DataScience already has it)
  // Wait, DataScience has `<ProgramCohorts />` without props, so we should replace it to have props.
  
  // Extract courseValue
  let courseValueMatch = content.match(/<CareerSupport\s+courseValue="([^"]+)"/);
  if (!courseValueMatch) courseValueMatch = content.match(/courseValue="([^"]+)"/);
  const courseValue = courseValueMatch ? courseValueMatch[1] : "Advanced Course";

  // Extract Batch Starting Date
  let date = "Upcoming";
  const batchMatch = content.match(/{\s*label:\s*["']Batch Starting["'],\s*value:\s*["']([^"']+)["']\s*}/);
  if (batchMatch && batchMatch[1]) {
    date = batchMatch[1];
  }

  // Remove existing ProgramCohorts import if any
  content = content.replace(/import ProgramCohorts from ".\/Components\/ProgramCohorts";?\n?/g, '');
  
  // Remove existing <ProgramCohorts ... /> usage if any
  content = content.replace(/\s*<ProgramCohorts[^>]*\/>/g, '');

  // Add import
  const importStatement = 'import ProgramCohorts from "./Components/ProgramCohorts";\n';
  // Find a good place to insert import, e.g. before "import ApplyForm" or after "import CareerSupport"
  content = content.replace(/(import CareerSupport from "\.\.\/\.\.\/Components\/CareerSupport";)/, '$1\n' + importStatement);

  // Insert <ProgramCohorts /> after <Certification isDark={...} />
  const tagToInsert = `\n           <ProgramCohorts courseValue="${courseValue}" date="${date}" />`;
  const newContent = content.replace(/(<Certification[^>]*\/>)/, '$1' + tagToInsert);

  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    console.log(`Injected into ${f} - Course: ${courseValue}, Date: ${date}`);
  }
});
