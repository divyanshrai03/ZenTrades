const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const demoFolder = path.join(__dirname, "../dataset/demo_calls");
const accountsFolder = path.join(__dirname, "../outputs/accounts");

// Read all demo transcripts
const demoFiles = fs.readdirSync(demoFolder);

demoFiles.forEach((file, index) => {
  const accountId = `acc_${String(index + 1).padStart(3, "0")}`;

  console.log(`Processing ${file} for ${accountId}`);

  const accountPath = path.join(accountsFolder, accountId);

  const v1Path = path.join(accountPath, "v1");
  const v2Path = path.join(accountPath, "v2");

  // Create folders
  fs.mkdirSync(v1Path, { recursive: true });
  fs.mkdirSync(v2Path, { recursive: true });

  // Copy template memo
  const memoTemplate = path.join(
    __dirname,
    "../outputs/accounts/acc_001/v1/memo.json"
  );

  const agentTemplate = path.join(
    __dirname,
    "../outputs/accounts/acc_001/v1/agent_spec.json"
  );

  fs.copyFileSync(memoTemplate, path.join(v1Path, "memo.json"));
  fs.copyFileSync(agentTemplate, path.join(v1Path, "agent_spec.json"));

  console.log(`Initialized templates for ${accountId}`);
});

console.log("Batch initialization complete.");