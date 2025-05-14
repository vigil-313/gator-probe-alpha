# Legal Gator Panel Personas

This directory contains configurations for the Legal Gator Panel - personas focused on legal risk assessment, intellectual property considerations, and contractual matters.

> ⚠️ **IMPORTANT LEGAL NOTICE**: For detailed information on Legal Gator capabilities, limitations, and appropriate usage, please review `/Technical/LEGAL_GATOR_LIMITS.md`. Legal gator personas are NOT licensed attorneys and do NOT provide legal advice.

## Available Personas

| ID | Name | Nickname | Archetype | Focus |
|----|------|----------|-----------|-------|
| lex | Lex Talionis | The IP Enforcer | Intellectual Property Guardian | Patent, copyright and trademark protection |
| clara | Clara Clause | The Contract Surgeon | Agreement Forensics Expert | Contract clauses and legal terms |
| rana-regulus | Rana Regulus | The Compliance Strategist | Ethics and Risk Mitigation Advisor | Regulatory compliance and data privacy |
| gavin-graymark | Gavin Graymark | The Corporate Architect | Entity Structuring & Liability Analyst | Corporate structure and founder agreements |
| delphi-docket | Delphi Docket | The Precedent Mapper | Legal Historian & Litigation Contextualizer | Case law and legal precedent |
| isla-proxy | Isla Proxy | The Platform Guardian | ToS & Cyberlaw Specialist | Platform terms and policy compliance |
| morven-sealight | Morven Sealight | The Jurisdiction Weaver | Cross-Border IP & International Law Strategist | Global copyright and cross-border issues |

## Usage

The Legal Gator Panel exists to help users critically assess legal risks, obligations, and IP considerations in the early ideation and planning stages of their project. These characters simulate seasoned legal perspectives from different domains.

When using a Legal persona, the prompt assembly system will generate instructions for the LLM that emphasize legal considerations and risk identification rather than general business critique.

Each JSON file contains comprehensive details about:
- Legal expertise areas
- Analysis style
- Tone and language patterns
- Response structure
- Key concerns and warning signs
- Legal terminology preferences

## Panel Dynamics

The Legal Panel personas represent different domains of legal expertise:

- **Intellectual Property**: Lex Talionis, Morven Sealight (international)
- **Contracts & Agreements**: Clara Clause, Gavin Graymark
- **Regulatory & Compliance**: Rana Regulus, Isla Proxy
- **Legal Context & Strategy**: Delphi Docket

Together, they provide comprehensive legal risk assessment across multiple domains, helping founders identify potential issues before they become problems.

## Reliability Framework

As outlined in `/Technical/LEGAL_GATOR_LIMITS.md`, Legal Gators are appropriate for:
- Explaining legal concepts in plain language ✅
- Identifying potential risk patterns or red flags ✅
- Asking critical legal questions you might overlook ✅
- Educating non-lawyers about legal structures or concerns ✅

They are **NOT appropriate** for:
- Interpreting laws based on jurisdictional specificity ❌
- Determining legal enforceability of clauses ❌
- Providing regulatory clearance or compliance assurance ❌
- Replacing professional legal advice ❌❌

## Mandatory Disclaimer

> **Important Notice:** The legal gators in Valugator are fictional AI personas trained on general knowledge of legal concepts, contracts, and regulatory frameworks. They **are not licensed attorneys**, do not practice law, and do **not provide legal advice**. Their feedback is intended solely for **educational and analytical purposes**. You must consult a **licensed legal professional** before making any legal decisions.

Each legal gator persona includes this disclaimer in its configuration, and the disclaimer must be displayed to users whenever legal gator responses are provided.