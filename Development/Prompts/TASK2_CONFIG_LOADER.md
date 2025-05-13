# IMPLEMENTATION TASK 2: Configuration Loader Module

## Context
The VALUGATOR Probe Alpha project uses JSON configuration files to define gator personas and prompt templates. The configuration loader module is responsible for loading, validating, and providing access to these configurations.

## Objective
Implement a configuration loader module that can:
1. Load persona configurations from JSON files
2. Load prompt templates from JSON files
3. Load global settings
4. Provide a clean API for accessing these configurations

## Starting Point
- The project setup has been completed in TASK1
- Configuration files are located in the `/config` directory
- Persona configurations are organized in subdirectories by panel type
- Prompt templates are stored as JSON files in `/config/prompt-templates/`
- Global settings are in `/config/settings.json`

## Requirements
- Create a class-based configuration loader
- Implement methods to load persona configurations
- Implement methods to load prompt templates
- Implement methods to load global settings
- Provide proper error handling with meaningful messages
- Include basic validation of loaded configurations
- Follow the extensibility design pattern defined in the technical documentation

## Steps
1. Create the config loader class in `/src/config/loader.js`:
   - Implement constructor that accepts base path
   - Create helper methods for loading JSON files

2. Implement persona configuration loading:
   - Method to load a specific persona by ID
   - Search across all panel subdirectories
   - Return validated persona configuration

3. Implement template loading:
   - Method to load a specific template by panel type
   - Return validated template configuration

4. Implement settings loading:
   - Method to load global settings
   - Provide default values for missing settings

5. Implement basic validation:
   - Ensure required fields are present
   - Validate configuration structure

6. Create a main export that provides a clean interface to the loader

7. Implement proper error handling:
   - Create custom error classes if needed
   - Provide meaningful error messages
   - Handle common error cases gracefully

## References
- [DOC-DEV-IMPL-EXT-1]: Implementation Extensibility Guidelines
- [DOC-TECH-PERS-1]: Persona Schema Documentation
- [DOC-TECH-EXT-1]: Extensibility Design Patterns

## Constraints
- Do not modify the configuration files themselves
- Follow the provider pattern described in the extensibility documentation
- Keep file operations asynchronous when possible
- Do not include Claude or OpenAI API key handling in this module

## Expected Output
A fully functioning configuration loader module with:
- Clean API for accessing configurations
- Proper error handling
- Basic validation
- Ability to find and load all configuration types

## Validation
- Unit tests should verify:
  - Correct loading of persona configurations
  - Correct loading of prompt templates
  - Correct loading of settings
  - Appropriate error handling for missing files
  - Appropriate error handling for invalid JSON
  - Appropriate error handling for invalid configurations

## Next Steps
After implementing the configuration loader, we will create the prompt assembly module (TASK3) which will use this module to access persona configurations and templates.