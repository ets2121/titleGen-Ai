
import {z} from 'genkit';

export const GenerateCapstoneTitleOutputSchema = z.object({
  title: z.string().describe('The generated capstone project title.'),
  suggestedTechStacks: z.string().describe('Suggested tech stacks for the project, formatted as a bulleted list.'),
  objective: z.string().describe('The main objective of the project.'),
  description: z.string().describe('A clear and detailed description of the project.'),
  implementationSteps: z.string().describe('Steps on how to implement the project, formatted as a numbered or bulleted list.'),
  expectedMethodology: z.string().describe('Expected methodologies that can be used, formatted as a bulleted list.'),
  dataCollection: z.string().describe('How to collect data for the project.'),
  estimatedTime: z.string().describe('Estimated time to finish the project (days or months).'),
  additionalInformation: z.string().describe('Other important information about the project, can be a bulleted list if there are multiple points.'),
});
