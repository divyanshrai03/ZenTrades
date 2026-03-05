const fs = require("fs");
const path = require("path");

// Paths
const onboardingPath = path.join(
  __dirname,
  "../dataset/onboarding_calls/onboard1.txt"
);

const v1MemoPath = path.join(
  __dirname,
  "../outputs/accounts/acc_001/v1/memo.json"
);

const v2MemoPath = path.join(
  __dirname,
  "../outputs/accounts/acc_001/v2/memo.json"
);

const changelogPath = path.join(
  __dirname,
  "../outputs/accounts/acc_001/v2/changes.md"
);

// Read files
const transcript = fs.readFileSync(onboardingPath, "utf8");
const memo = JSON.parse(fs.readFileSync(v1MemoPath, "utf8"));

// Clone memo
const updatedMemo = JSON.parse(JSON.stringify(memo));

let changes = [];

// Update business hours
const hoursMatch = transcript.match(/(\d{1,2}\s*(am|pm)).*(\d{1,2}\s*(am|pm))/i);
if (hoursMatch) {
  updatedMemo.business_hours.start = hoursMatch[1];
  updatedMemo.business_hours.end = hoursMatch[3];

  changes.push(
    `Updated business hours to ${hoursMatch[1]} - ${hoursMatch[3]} based on onboarding call`
  );
}

// Update timezone
if (transcript.toLowerCase().includes("central time")) {
  updatedMemo.business_hours.timezone = "Central Time";
  changes.push("Timezone updated to Central Time");
}

// Emergency routing rule
if (transcript.toLowerCase().includes("emergency technician")) {
  updatedMemo.emergency_routing_rules.primary_contact =
    "Emergency Technician Line";
  changes.push("Emergency calls routed to emergency technician");
}

// Transfer rule
if (transcript.toLowerCase().includes("60 seconds")) {
  updatedMemo.call_transfer_rules.timeout_seconds = "60";
  changes.push("Transfer timeout set to 60 seconds");
}

// Save v2 memo
fs.writeFileSync(v2MemoPath, JSON.stringify(updatedMemo, null, 2));

// Save changelog
fs.writeFileSync(changelogPath, changes.join("\n"));

console.log("Onboarding updates applied successfully!");