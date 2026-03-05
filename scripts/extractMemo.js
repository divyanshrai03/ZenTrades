const fs = require("fs");
const path = require("path");

// Paths
const transcriptPath = path.join(__dirname, "../dataset/demo_calls/demo1.txt");
const outputPath = path.join(__dirname, "../outputs/accounts/acc_001/v1/memo.json");

// Read transcript
const transcript = fs.readFileSync(transcriptPath, "utf8");

// Load existing memo template
const memo = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../outputs/accounts/acc_001/v1/memo.json"),
    "utf8"
  )
);

// --------- SIMPLE EXTRACTION LOGIC ----------

// account id
memo.account_id = "acc_001";

// company name detection
const companyMatch = transcript.match(/company\s*name\s*is\s*(.*)/i);
if (companyMatch) {
  memo.company_name = companyMatch[1].trim();
} else {
  memo.questions_or_unknowns.push("Company name not mentioned");
}

// business hours detection
const hoursMatch = transcript.match(/(\d{1,2}\s*(am|pm)).*(\d{1,2}\s*(am|pm))/i);
if (hoursMatch) {
  memo.business_hours.start = hoursMatch[1];
  memo.business_hours.end = hoursMatch[3];
} else {
  memo.questions_or_unknowns.push("Business hours not specified");
}

// address detection
const addressMatch = transcript.match(/address\s*is\s*(.*)/i);
if (addressMatch) {
  memo.office_address = addressMatch[1];
}

// emergency detection keywords
if (transcript.toLowerCase().includes("sprinkler leak")) {
  memo.emergency_definition.push("sprinkler leak");
}

if (transcript.toLowerCase().includes("fire alarm")) {
  memo.emergency_definition.push("fire alarm triggered");
}

// fallback notes
memo.notes = "Extracted automatically from demo transcript";

// Save memo
fs.writeFileSync(outputPath, JSON.stringify(memo, null, 2));

console.log("Memo extracted successfully!");