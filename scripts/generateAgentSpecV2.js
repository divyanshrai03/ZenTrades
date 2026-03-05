const fs = require("fs");
const path = require("path");

// Paths
const memoPath = path.join(__dirname, "../outputs/accounts/acc_001/v2/memo.json");

const agentSpecTemplatePath = path.join(
  __dirname,
  "../outputs/accounts/acc_001/v1/agent_spec.json"
);

const agentSpecV2Path = path.join(
  __dirname,
  "../outputs/accounts/acc_001/v2/agent_spec.json"
);

// Load files
const memo = JSON.parse(fs.readFileSync(memoPath, "utf8"));
const agentSpec = JSON.parse(fs.readFileSync(agentSpecTemplatePath, "utf8"));

// Update version
agentSpec.version = "v2";

// Update variables
agentSpec.agent_name = memo.company_name + " AI Receptionist";

agentSpec.key_variables.company_name = memo.company_name;
agentSpec.key_variables.business_hours = memo.business_hours;
agentSpec.key_variables.office_address = memo.office_address;
agentSpec.key_variables.timezone = memo.business_hours.timezone;

// Updated system prompt
agentSpec.system_prompt = `
You are an AI receptionist for ${memo.company_name}.

Business hours are ${memo.business_hours.start} to ${memo.business_hours.end} (${memo.business_hours.timezone}).

During business hours:
- greet the caller
- ask the purpose of the call
- collect name and phone number
- route or transfer the call appropriately
- confirm next steps

After hours:
- greet the caller
- confirm whether the issue is an emergency
- if emergency collect name, phone, and address immediately
- attempt transfer to emergency technician
- if transfer fails assure the caller dispatch will follow up shortly
`;

// Transfer rules
agentSpec.call_transfer_protocol.timeout_seconds =
memo.call_transfer_rules.timeout_seconds || "60";

agentSpec.call_transfer_protocol.retry_attempts =
memo.call_transfer_rules.retry_attempts || "2";

agentSpec.call_transfer_protocol.transfer_target =
memo.emergency_routing_rules.primary_contact;

// Save v2 agent spec
fs.writeFileSync(agentSpecV2Path, JSON.stringify(agentSpec, null, 2));

console.log("V2 agent spec generated successfully!");