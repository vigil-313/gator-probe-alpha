# Evaluation Chamber Personas

This directory contains configurations for the Evaluation Chamber gators - personas focused on evaluating startup ideas and providing multi-faceted feedback.

## Available Personas

| ID | Name | Nickname | Archetype | Focus |
|----|------|----------|-----------|-------|
| rex | Rex Revenue | The Roaster | Seasoned Angel Investor/Shark | Business model and revenue |
| vanessa | Vanessa Venture | The Validator | Data-Driven VC Investor | Market validation and metrics |
| finley | Finley Finance | The Figures | Pragmatic CFO/Financial Advisor | Financial modeling and unit economics |
| tessa | Tessa Tech | The Trendsetter | Visionary Innovation Expert/Early Adopter | Emerging tech trends and disruption |
| huxley | Huxley Hardware | The Hacker | Technical Co-founder/CTO Advisor | Technical feasibility and implementation |
| maya | Maya Marketing | The Mentor | Growth and Marketing Strategist | Go-to-market and customer acquisition |
| lucius | Lucius Thorn | The Skeptical Capitalist | Market-Focused Venture Capitalist | Market viability and defensibility |
| ada-bloom | Ada Bloom | The Human-Centered Idealist | Empathic Product Designer | User experience and emotional need |
| jax-morrow | Jax Morrow | The Vision-Driven Founder | Serial Entrepreneur | Growth strategy and market timing |
| dr-cass-nova | Dr. Cass Nova | The Rationalist Strategist | Systems Thinker | Data analysis and validation |
| nyx | Nyx | The Contrarian Trickster | Experimental Creative | Paradigm-breaking innovation |
| kip-snapjaw | Kip Snapjaw | The Grizzled Operator | Execution-Focused Realist | Operations and implementation |
| serena-vale | Serena Vale | The Market Oracle | Former CMO | Brand positioning and messaging |

## Usage

These personas are used by the prompt assembly system to generate appropriate instructions for the LLM API, allowing it to respond in character when evaluating user-submitted startup ideas.

Each JSON file contains comprehensive details about:
- Expertise areas
- Critique style
- Tone and language patterns
- Response structure
- Typical concerns and questions
- Vocabulary preferences

## Panel Dynamics

The Evaluation Chamber personas represent different perspectives on startup evaluation:

- **Business & Revenue**: Rex, Vanessa, Finley
- **Technical & Innovation**: Huxley, Tessa, Dr. Cass
- **Market & Brand**: Maya, Serena, Lucius
- **User & Experience**: Ada, Jax, Kip
- **Unconventional Thinking**: Nyx

Together, they provide a well-rounded evaluation covering multiple aspects of a startup idea.

## Default Persona

Rex Revenue is the default evaluation gator, as defined in `/config/settings.json`.