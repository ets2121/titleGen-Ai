
"use server";

import { generateCapstoneTitle, type GenerateCapstoneTitleOutput, type GenerateCapstoneTitleInput } from '@/ai/flows/generate-capstone-title';

export async function generateTitleAction(input: GenerateCapstoneTitleInput): Promise<GenerateCapstoneTitleOutput> {
    try {
        const result = await generateCapstoneTitle(input);
        if (!result || !result.title) {
          throw new Error("The AI failed to generate a response. Please try adjusting your topic.");
        }
        return result;
    } catch (e) {
        console.error("Genkit Action Error:", e);
        throw new Error('An unexpected error occurred while generating the title. Please try again later.');
    }
}
