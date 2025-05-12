# Gator Personas Configuration

This directory contains the JSON configurations for all VALUGATOR gator personas, organized by their respective panels/councils.

## Directory Structure

- **evaluation-chamber/**: Gators focused on startup idea evaluation and critique (13 personas)
- **pathfinder-council/**: Gators focused on guidance, decision support, and direction (9 personas)
- **legal-panel/**: Gators focused on legal risk assessment and intellectual property (7 personas)

## Schema

All persona configurations follow the schema defined in `/Technical/PERSONA_SCHEMA.md`. Each JSON file contains comprehensive information about:

- Basic identity (name, nickname, archetype)
- Expertise areas
- Response style and tone
- Visual appearance
- Strengths and weaknesses
- Interaction patterns with other gators
- Vocabulary and sentence structure preferences
- Specific focus areas for evaluation

## Using Persona Configurations

The persona configurations are used by the prompt assembly system to generate appropriate instructions for the LLM API. The `src/prompt-builder.js` file (to be implemented) will extract relevant information from these files and combine it with templates from `/config/prompt-templates/` to create effective prompts.

## Adding New Personas

To add a new gator persona:

1. Choose the appropriate panel directory
2. Create a new JSON file named after the gator (e.g., `vanessa.json`)
3. Follow the schema defined in `/Technical/PERSONA_SCHEMA.md`
4. Ensure all required fields are populated with character-specific information

## Available Personas

### Evaluation Chamber (13)
- **rex.json**: Rex "The Roaster" Revenue - Business-focused angel investor
- **vanessa.json**: Vanessa "The Validator" Venture - Data-driven VC investor
- **finley.json**: Finley "The Figures" Finance - Financial modeling expert
- **tessa.json**: Tessa "The Trendsetter" Tech - Innovation and emerging trends expert
- **huxley.json**: Huxley "The Hacker" Hardware - Technical feasibility analyst
- **maya.json**: Maya "The Mentor" Marketing - Marketing and growth strategist
- **lucius.json**: Lucius "The Skeptical Capitalist" Thorn - Market viability assessor
- **ada-bloom.json**: Ada "The Human-Centered Idealist" Bloom - User experience designer
- **jax-morrow.json**: Jax "The Vision-Driven Founder" Morrow - Serial entrepreneur
- **dr-cass-nova.json**: Dr. Cass "The Rationalist Strategist" Nova - Data scientist
- **nyx.json**: Nyx "The Contrarian Trickster" - Experimental creative
- **kip-snapjaw.json**: Kip "The Grizzled Operator" Snapjaw - Execution-focused realist
- **serena-vale.json**: Serena "The Market Oracle" Vale - Positioning and brand specialist

### Pathfinder Council (9)
- **zane.json**: Zane "The Scopewright" Cutter - MVP strategist
- **luma.json**: Luma "The Alignment Seeker" Vale - Purpose alignment advisor
- **bram.json**: Bram "The Inner Firekeeper" Hollowtide - Emotional resilience coach
- **ori.json**: Ori "The Risk Calibrator" Verge - Strategic decision optimizer
- **echo.json**: Echo "The Future Whisper" of Then - Hindsight oracle
- **vex.json**: Vex "The Question Beyond" Tanglecoil - Creative instability agent
- **nell.json**: Nell "The Pattern Unwinder" Foldbarrow - Cognitive loop breaker
- **sol.json**: Sol "The Finisher" Grasp - Decision activator
- **dr-vire-glint.json**: Dr. Vire "The Still Skeptic" Glint - Assumption challenger

### Legal Panel (7)
- **lex.json**: Lex "The IP Enforcer" Talionis - Intellectual property guardian
- **clara.json**: Clara "The Contract Surgeon" Clause - Agreement forensics expert
- **rana-regulus.json**: Rana "The Compliance Strategist" Regulus - Ethics and risk advisor
- **gavin-graymark.json**: Gavin "The Corporate Architect" Graymark - Entity structuring analyst
- **delphi-docket.json**: Delphi "The Precedent Mapper" Docket - Legal historian
- **isla-proxy.json**: Isla "The Platform Guardian" Proxy - ToS and cyberlaw specialist
- **morven-sealight.json**: Morven "The Jurisdiction Weaver" Sealight - Cross-border strategist