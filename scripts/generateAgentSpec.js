const fs = require("fs");
const path = require("path");

// Paths
const memoPath = path.join(__dirname, "../outputs/accounts/acc_001/v1/memo.json");
const agentSpecPath = path.join(__dirname, "../outputs/accounts/acc_001/v1/agent_spec.json");

// Load memo
const memo = JSON.parse(fs.readFileSync(memoPath, "utf8"));

// Load agent spec template
const agentSpec = JSON.parse(fs.readFileSync(agentSpecPath, "utf8"));

// Fill agent details
agentSpec.agent_name = memo.company_name + " AI Receptionist";

agentSpec.key_variables.company_name = memo.company_name;
agentSpec.key_variables.business_hours = memo.business_hours;
agentSpec.key_variables.office_address = memo.office_address;

// Generate system prompt
agentSpec.system_prompt = `
You are an AI receptionist for ${memo.company_name}.

During business hours:
- greet the caller politely
- ask the purpose of the call
- collect caller name and phone number
- route the call appropriately
- confirm next steps

After hours:
- greet the caller
- confirm if the issue is an emergency
- if emergency collect name, phone, and address immediately
- attempt transfer to emergency contact
- if transfer fails assure the caller someone will follow up soon
`;

// Business hours flow summary
agentSpec.call_flows.business_hours_flow =
"Greet caller, collect purpose, name, phone number, route call or transfer.";

// After hours flow summary
agentSpec.call_flows.after_hours_flow =
"Greet caller, confirm emergency, collect details, attempt transfer, fallback if transfer fails.";

// Transfer rules
agentSpec.call_transfer_protocol.timeout_seconds =
memo.call_transfer_rules.timeout_seconds || "60";

agentSpec.call_transfer_protocol.retry_attempts =
memo.call_transfer_rules.retry_attempts || "2";

// Fallback message
agentSpec.fallback_protocol.transfer_failure_message =
"We are unable to transfer your call right now. Someone will contact you shortly.";

// Save agent spec
fs.writeFileSync(agentSpecPath, JSON.stringify(agentSpec, null, 2));

console.log("Agent spec generated successfully!");