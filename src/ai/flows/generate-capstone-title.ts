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
import { GenerateCapstoneTitleOutputSchema } from '@/ai/schemas';

const GenerateCapstoneTitleInputSchema = z.object({
  fieldOfStudy: z.string().describe('The field of study (e.g., Computer Science, Electrical Engineering).'),
  topic: z.string().describe('The specific topic within the field of study (e.g., Data Mining, Embedded Systems).'),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).describe('The difficulty level of the project.'),
});

export type GenerateCapstoneTitleInput = z.infer<typeof GenerateCapstoneTitleInputSchema>;

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
  2. For 'suggestedTechStacks', provide a bulleted list (e.g., "- React\\n- Node.js").
  3. For 'objective', provide a concise paragraph.
  4. For 'description', provide a detailed paragraph.
  5. For 'implementationSteps', provide a numbered or bulleted list of steps.
  6. For 'expectedMethodology', provide a bulleted list.
  7. For 'dataCollection', describe how to collect data for the project. This can be a paragraph or a list.
  8. For 'estimatedTime', provide a time range (e.g., "3-4 months").
  9. For 'additionalInformation', include any other important details. Use a bulleted list if there are multiple points.

  Ensure the output is in JSON format, adhering to the output schema.
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
