# IMPLEMENTATION TASK 4: Prompt Assembly Module

## Context
The VALUGATOR Probe Alpha project uses structured prompt templates combined with persona configurations to generate effective prompts for the LLM API. The prompt assembly module is responsible for combining these elements with user input to create the final prompts.

## Objective
Implement a prompt assembly module that:
1. Uses the configuration loader to access persona configurations and templates
2. Processes templates by replacing variables with persona attributes
3. Incorporates user input into the prompt
4. Provides a clean API for generating prompts

## Starting Point
- The configuration loader has been implemented and tested
- Persona configurations and prompt templates are defined in JSON
- Templates include placeholders like `{{name}}`, `{{critiqueStyle}}`, etc.

## Requirements
- Create a class-based prompt assembler
- Implement template processing functionality
- Support nested object access in templates
- Handle arrays and complex data structures
- Properly escape user input
- Follow the extensibility design pattern
- Provide proper error handling

## Steps
1. Create the prompt assembler class in `/src/prompt/assembler.js`:
   - Implement constructor that accepts a config loader instance
   - Create main method for assembling complete prompts

2. Implement template variable replacement:
   - Method to process template strings
   - Support for accessing nested object properties
   - Support for iterating over arrays
   - Method for flattening nested objects for template processing

3. Implement panel type inference:
   - Method to determine panel type from persona ID if not explicitly specified
   - Support fallback to default panel type

4. Implement the prompt assembly process:
   - Load persona configuration
   - Determine panel type
   - Load appropriate template
   - Process template with persona attributes
   - Incorporate user input
   - Return complete prompt

5. Implement proper error handling:
   - Create custom error classes if needed
   - Provide meaningful error messages
   - Handle common error cases gracefully

6. Create a clean API that is easy to use and extend

## References
- [DOC-DEV-IMPL-EXT-1]: Implementation Extensibility Guidelines
- [DOC-TECH-PROM-1]: Prompt Templates Documentation
- [DOC-TECH-EXT-1]: Extensibility Design Patterns

## Constraints
- Do not modify the template format
- Keep the implementation flexible for future extensions
- Ensure proper escaping and sanitization of user input
- Do not include any hardcoded prompt content

## Expected Output
A fully functioning prompt assembly module with:
- Clean API for generating prompts
- Proper template processing
- Support for accessing all persona attributes
- Proper error handling
- Extensibility for future enhancements

## Validation
- Unit tests should verify:
  - Correct replacement of template variables
  - Correct handling of nested objects
  - Correct handling of arrays
  - Appropriate error handling for missing variables
  - Appropriate error handling for invalid templates
  - Proper escaping and sanitization of user input

## Next Steps
After implementing the prompt assembly module, we will create the unit tests for this module (TASK5) and then move on to implementing the LLM API client (TASK6).