'use server';

/**
 * @fileOverview A Genkit flow for generating detailed project information including tech stacks, objectives, descriptions, steps, methodology, and timelines.
 *
 * - generateProjectDetails - A function that generates the project details.
 * - GenerateProjectDetailsInput - The input type for the generateProjectDetails function.
 * - GenerateProjectDetailsOutput - The return type for the generateProjectDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectDetailsInputSchema = z.object({
  category: z.string().describe('The category of the project (e.g., BSIT, Computer Science).'),
  topic: z.string().describe('The specific topic of the project (e.g., Data Mining).'),
  difficulty: z.string().describe('The difficulty level of the project (Beginner, Intermediate, Advanced).'),
  title: z.string().describe('The generated title of the project.'),
});

export type GenerateProjectDetailsInput = z.infer<typeof GenerateProjectDetailsInputSchema>;

const GenerateProjectDetailsOutputSchema = z.object({
  techStacks: z.string().describe('Suggested tech stacks for the project.'),
  objective: z.string().describe('The main objective of the project.'),
  description: z.string().describe('A detailed description of the project.'),
  implementationSteps: z.string().describe('Steps on how to implement the project.'),
  methodology: z.string().describe('Expected methodology to be used for the project.'),
  estimatedTime: z.string().describe('Estimated time (days or months) to finish the project.'),
  additionalInformation: z.string().describe('Other important information about the project.'),
});

export type GenerateProjectDetailsOutput = z.infer<typeof GenerateProjectDetailsOutputSchema>;

export async function generateProjectDetails(input: GenerateProjectDetailsInput): Promise<GenerateProjectDetailsOutput> {
  return generateProjectDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectDetailsPrompt',
  input: {schema: GenerateProjectDetailsInputSchema},
  output: {schema: GenerateProjectDetailsOutputSchema},
  prompt: `You are an expert project advisor specializing in providing detailed information for capstone and thesis projects.

  Based on the category, topic, difficulty, and title of the project, you will generate the following information:
  - Suggested tech stacks that can be used
  - The main objective of the project
  - A clear detailed description about the project
  - Steps on how to implement the project
  - Expected methodology that can be used
  - Estimated time (days or months) to finish the project
  - Other important information about the project

  Category: {{{category}}}
  Topic: {{{topic}}}
  Difficulty: {{{difficulty}}}
  Title: {{{title}}}

  Ensure the output is well-formatted and easy to understand.  Do not include any introductory or concluding sentences.
  `,
});

const generateProjectDetailsFlow = ai.defineFlow(
  {
    name: 'generateProjectDetailsFlow',
    inputSchema: GenerateProjectDetailsInputSchema,
    outputSchema: GenerateProjectDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
