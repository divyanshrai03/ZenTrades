# Clara Answers Intern Assignment
## Zero-Cost Automation Pipeline  
**Demo Call → Retell Agent Draft → Onboarding Update → Agent Revision**

---

# Project Overview

This project implements a **zero-cost automation pipeline** that processes demo call transcripts and onboarding updates to generate and maintain **Retell AI receptionist configurations**.

The system performs the following tasks:

1. Processes demo call transcripts and extracts structured business information.
2. Generates a **Preliminary Retell AI receptionist configuration (v1)**.
3. Stores structured artifacts for each account.
4. Processes onboarding updates to modify the agent configuration.
5. Generates **updated agent configurations (v2)** with version tracking and changelog generation.

The pipeline is designed to be:

- Fully reproducible
- Zero cost
- Automated end-to-end
- Structured and versioned

---

# System Architecture

The automation system is divided into two major pipelines.

## Pipeline A — Demo Call → Preliminary Agent

**Input**
- Demo call transcript

**Output**
- Structured **Account Memo JSON**
- **Retell Agent Draft Specification (v1)**
- Stored artifacts for the account

Processing steps:

1. Transcript ingestion
2. Information extraction
3. Account memo generation
4. Agent configuration generation
5. Artifact storage

---

## Pipeline B — Onboarding → Agent Update

**Input**
- Onboarding call transcript or onboarding form

**Output**
- Updated **Account Memo JSON (v2)**
- Updated **Retell Agent Draft Spec (v2)**
- Changelog describing updates

Processing steps:

1. Onboarding input ingestion
2. Update extraction
3. Account memo patch
4. Agent configuration regeneration
5. Versioned storage
6. Changelog generation

---

# Workflow Diagram
                ┌───────────────────────────┐
                │   Demo Call Transcript     │
                └──────────────┬─────────────┘
                               │
                               ▼
                 ┌────────────────────────┐
                 │ Transcript Processing  │
                 │ / Data Normalization   │
                 └──────────────┬─────────┘
                                │
                                ▼
                    ┌────────────────────┐
                    │ Data Extraction    │
                    │ (Structured JSON)  │
                    └───────────┬────────┘
                                │
                                ▼
                   ┌──────────────────────────┐
                   │ Account Memo JSON (v1)   │
                   └───────────┬──────────────┘
                               │
                               ▼
                 ┌─────────────────────────────┐
                 │ Retell Agent Draft Spec v1  │
                 └───────────┬─────────────────┘
                             │
                             ▼
                  ┌────────────────────────┐
                  │ Stored Account Output  │
                  │ (Repo / Storage)       │
                  └───────────┬────────────┘
                              │
                              ▼
              ┌────────────────────────────────┐
              │ Onboarding Transcript / Form   │
              └─────────────┬──────────────────┘
                            │
                            ▼
                 ┌─────────────────────────┐
                 │ Update Extraction       │
                 │ (Change Detection)      │
                 └─────────────┬───────────┘
                               │
                               ▼
                ┌────────────────────────────┐
                │ Updated Account Memo (v2)  │
                └─────────────┬──────────────┘
                              │
                              ▼
             ┌─────────────────────────────────┐
             │ Updated Retell Agent Spec (v2)  │
             └──────────────┬──────────────────┘
                            │
                            ▼
                  ┌──────────────────────┐
                  │ Changelog Generation │
                  └──────────────────────┘

                  
---

# Technology Stack

This implementation follows the **zero-cost constraint**.

**Automation Orchestrator**

- n8n (self-hosted locally via Docker)

**Storage**

- Local structured JSON files stored in the repository

**Processing**

- Prompt templating
- Structured JSON generation

**Version Control**

- GitHub repository

**Optional Transcription**

- Local Whisper (if audio recordings are provided)

---

# Repository Structure
.
├── workflows
│ └── n8n_workflow.json
│
├── outputs
│ └── accounts
│ └── <account_id>
│ ├── v1
│ │ ├── account_memo.json
│ │ └── agent_spec.json
│ │
│ └── v2
│ ├── account_memo.json
│ └── agent_spec.json
│
├── changelog
│ └── <account_id>_changes.json
│
├── dataset
│ ├── demo_calls
│ └── onboarding_calls
│
├── scripts
│ └── helper_scripts.js
│
└── README.md


---

# Account Memo JSON Format

Each account generates a structured memo.

Example structure:


{
"account_id": "",
"company_name": "",
"business_hours": {
"days": "",
"start": "",
"end": "",
"timezone": ""
},
"office_address": "",
"services_supported": [],
"emergency_definition": [],
"emergency_routing_rules": {},
"non_emergency_routing_rules": {},
"call_transfer_rules": {},
"integration_constraints": [],
"after_hours_flow_summary": "",
"office_hours_flow_summary": "",
"questions_or_unknowns": [],
"notes": ""
}


Missing information is placed under **questions_or_unknowns** to avoid hallucinated values.

---

# Retell Agent Draft Specification

Each account generates a Retell agent configuration.

Example structure:


{
"agent_name": "",
"voice_style": "",
"system_prompt": "",
"key_variables": {},
"tool_invocation_placeholders": {},
"call_transfer_protocol": "",
"fallback_protocol": "",
"version": "v1"
}


Version rules:

- **v1 → generated from demo call**
- **v2 → generated after onboarding updates**

---

# Versioning and Change Tracking

When onboarding updates are processed:

1. A new **Account Memo v2** is generated
2. A new **Agent Spec v2** is generated
3. A **changelog file** is created

Example changelog:


{
"account_id": "ACME001",
"changes": [
"Updated business hours",
"Added emergency routing contact",
"Updated services supported"
]
}


---

# Running the Project Locally

## 1. Clone Repository


git clone <repository-url>
cd clara-answers-assignment


---

## 2. Start n8n

Run using Docker:


docker run -it --rm
-p 5678:5678
-v ~/.n8n:/home/node/.n8n
n8nio/n8n


Open in browser:


http://localhost:5678


---

## 3. Import Workflow

1. Open the **n8n UI**
2. Import workflow from:


/workflows/n8n_workflow.json


---

## 4. Add Dataset

Place transcripts inside:


dataset/demo_calls/
dataset/onboarding_calls/


Each file corresponds to one account interaction.

---

## 5. Run the Pipeline

Trigger the workflow manually or batch process the dataset.

The workflow automatically:

1. Processes demo transcripts
2. Generates **v1 account memo and agent spec**
3. Processes onboarding transcripts
4. Generates **v2 updates**
5. Produces **changelog files**

Outputs are stored in:


outputs/accounts/


---

# Retell Setup

If Retell API access is unavailable on the free tier:

1. Create a Retell account
2. Copy the generated **Agent Draft Spec JSON**
3. Paste the configuration manually in the Retell dashboard

The generated configuration follows the expected Retell agent structure.

---

# Prompt Design Principles

The generated agent prompt follows required conversation rules.

### Business Hours Flow

- Greeting
- Identify caller intent
- Collect name and phone number
- Route or transfer call
- Handle transfer failure
- Confirm next steps
- Offer additional help
- Close conversation

### After Hours Flow

- Greeting
- Determine emergency
- Collect name, phone number, and address
- Attempt transfer
- Handle transfer failure
- Provide reassurance and follow-up
- Close conversation

Constraints:

- Minimal questioning
- No mention of tool calls
- Clear transfer protocols
- Defined fallback behavior

---

# Known Limitations

- Extraction quality depends on transcript clarity.
- Retell agent creation may require manual UI configuration.
- Emergency routing depends on available transcript information.

---

# Future Improvements

With production access the system could be improved by:

- Direct Retell API integration
- Database storage (Supabase/PostgreSQL)
- Automated diff viewer for memo updates
- Monitoring and logging dashboard
- Retry and failure handling
- Real-time workflow triggers
- Simple UI for reviewing generated agents

---

# Demonstration

The repository includes:

- Example dataset
- Generated outputs
- Workflow configuration

A short demo video shows:

1. Running the pipeline
2. Processing demo transcripts
3. Generating **agent v1**
4. Applying onboarding updates
5. Producing **agent v2 with changelog**

---

# Summary

This project demonstrates:

- End-to-end automation
- Structured data extraction
- Versioned AI agent configuration
- Zero-cost infrastructure
- Reproducible workflow execution

The system is designed to behave like a **small automation product**, emphasizing reliability, clarity, and maintainability.
