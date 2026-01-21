'use server';

/**
 * @fileOverview Generates a capstone project title based on the field of study, topic, and difficulty level.
 *
 * - generateCapstoneTitle - A function that generates a capstone title.
 * - GenerateCapstoneTitleInput - The input type for the generateCapstoneTitle function.
 * - GenerateCapstoneTitleOutput - The return type for the generateCapstoneTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCapstoneTitleInputSchema = z.object({
  fieldOfStudy: z.string().describe('The field of study (e.g., Computer Science, Electrical Engineering).'),
  topic: z.string().describe('The specific topic within the field of study (e.g., Data Mining, Embedded Systems).'),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the project.'),
});

export type GenerateCapstoneTitleInput = z.infer<typeof GenerateCapstoneTitleInputSchema>;

const GenerateCapstoneTitleOutputSchema = z.object({
  title: z.string().describe('The generated capstone project title.'),
  suggestedTechStacks: z.string().describe('Suggested tech stacks that can be used for the project.'),
  objective: z.string().describe('The main objective of the project.'),
  description: z.string().describe('A clear and detailed description of the project.'),
  implementationSteps: z.string().describe('Steps on how to implement the project.'),
  expectedMethodology: z.string().describe('Expected methodologies that can be used.'),
  dataCollection: z.string().describe('How to collect data for the project.'),
  estimatedTime: z.string().describe('Estimated time to finish the project (days or months).'),
  additionalInformation: z.string().describe('Other important information about the project.'),
});

export type GenerateCapstoneTitleOutput = z.infer<typeof GenerateCapstoneTitleOutputSchema>;

export async function generateCapstoneTitle(input: GenerateCapstoneTitleInput): Promise<GenerateCapstoneTitleOutput> {
  return generateCapstoneTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCapstoneTitlePrompt',
  input: {schema: GenerateCapstoneTitleInputSchema},
  output: {schema: GenerateCapstoneTitleOutputSchema},
  prompt: `You are an expert in generating capstone project titles and providing detailed information about the project.

  Based on the following information, generate a relevant and engaging capstone project title and provide detailed information:

  Field of Study: {{{fieldOfStudy}}}
  Topic: {{{topic}}}
  Difficulty Level: {{{difficultyLevel}}}

  Instructions:
  1. Generate a title that is specific, clear, and relevant to the field, topic, and difficulty.
  2. Suggest appropriate tech stacks that can be used for the project.
  3. Describe the main objective of the project.
  4. Provide a clear and detailed description of the project.
  5. Outline the steps on how to implement the project.
  6. Suggest expected methodologies that can be used.
  7. Describe how to collect data for the project.
  8. Estimate the time to finish the project (days or months).
  9. Include any additional important information about the project.

  Output the result in JSON format.
  {
    "title": "Generated Capstone Project Title",
    "suggestedTechStacks": "Suggested tech stacks",
    "objective": "The main objective of the project",
    "description": "Detailed description of the project",
    "implementationSteps": "Steps on how to implement the project",
    "expectedMethodology": "Expected methodologies that can be used",
    "dataCollection": "How to collect data for the project",
    "estimatedTime": "Estimated time to finish the project",
    "additionalInformation": "Any additional important information"
  }
`,
});

const generateCapstoneTitleFlow = ai.defineFlow(
  {
    name: 'generateCapstoneTitleFlow',
    inputSchema: GenerateCapstoneTitleInputSchema,
    outputSchema: GenerateCapstoneTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
