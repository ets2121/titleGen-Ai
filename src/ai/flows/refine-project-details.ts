'use server';

/**
 * @fileOverview A Genkit flow for refining generated project details based on user feedback.
 *
 * - refineProjectDetails - A function that refines the project details.
 * - RefineProjectDetailsInput - The input type for the refineProjectDetails function.
 * - RefineProjectDetailsOutput - The return type for the refineProjectDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateCapstoneTitleOutputSchema } from '@/ai/schemas';

const RefineProjectDetailsInputSchema = z.object({
  currentDetails: GenerateCapstoneTitleOutputSchema,
  refinementRequest: z.string().describe('The user\'s request for refining the project details (e.g., "make it simpler", "suggest different tech stacks").'),
});

export type RefineProjectDetailsInput = z.infer<typeof RefineProjectDetailsInputSchema>;

export type RefineProjectDetailsOutput = z.infer<typeof GenerateCapstoneTitleOutputSchema>;

export async function refineProjectDetails(input: RefineProjectDetailsInput): Promise<RefineProjectDetailsOutput> {
  return refineProjectDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineProjectDetailsPrompt',
  input: {schema: RefineProjectDetailsInputSchema},
  output: {schema: GenerateCapstoneTitleOutputSchema},
  prompt: `You are an expert project advisor. A user has generated project details and wants to refine them.

  Here are the current project details:
  Title: {{{currentDetails.title}}}
  Objective: {{{currentDetails.objective}}}
  Description: {{{currentDetails.description}}}
  Suggested Tech Stacks: {{{currentDetails.suggestedTechStacks}}}
  Implementation Steps: {{{currentDetails.implementationSteps}}}
  Expected Methodology: {{{currentDetails.expectedMethodology}}}
  Data Collection: {{{currentDetails.dataCollection}}}
  Estimated Time: {{{currentDetails.estimatedTime}}}
  Additional Information: {{{currentDetails.additionalInformation}}}

  The user's refinement request is: "{{{refinementRequest}}}"

  Based on the user's request, refine the project details. IMPORTANT: You must return a complete set of project details in the correct JSON format, not just the changed parts. Adhere to the output schema.
  Ensure that list-based fields like 'suggestedTechStacks' and 'implementationSteps' are formatted with bullets or numbers for readability.
`,
});

const refineProjectDetailsFlow = ai.defineFlow(
  {
    name: 'refineProjectDetailsFlow',
    inputSchema: RefineProjectDetailsInputSchema,
    outputSchema: GenerateCapstoneTitleOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
