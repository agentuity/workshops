// TODO: Import Zod library
// Hint: Import z from the 'zod' package for schema validation

/* SECTION 1: Judge Agent Schema (LLM Output Validation) */
// This schema validates the judge's response when picking a winner

/* TODO: Create JudgmentSchema using Zod
 * Hint: Use z.object() to define an object schema with these fields:
 * - winner: An enum of either 'openai' or 'google'
 * - winningStory: A string containing the full winning story text
 * - reasoning: A string explaining why this story won (2-3 sentences)
 * - improvements: A string with specific feedback to make the story even better
 */

// TODO: Export the schema so other files can use it
// Hint: Export as a named constant

// TODO: Export the TypeScript type for the schema
// Hint: Use Zod's type inference to extract TypeScript types from your schema

/* SECTION 2: Writer Agent Schema (Agent Boundary Validation) */
// This schema validates incoming requests to the writer agent

// TODO: Create WriterRequestSchema using Zod
// Hint: Use z.object() with this field:
// - prompt: A string with the user's story prompt

// TODO: Export the schema

// TODO: Export the TypeScript type for WriterRequest

/* SECTION 3: Judge Agent Schema (Agent Boundary Validation) */
// This schema validates incoming requests to the judge agent

// TODO: Create JudgeRequestSchema using Zod
// Hint: Use z.object() with these fields:
// - stories: A string containing markdown text with both stories
// - prompt: A string with the original user prompt

// TODO: Export the schema

// TODO: Export the TypeScript type for JudgeRequest
