
'use client';

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { fieldsOfStudy, difficultyLevels, type DifficultyLevel } from "@/lib/constants";
import { generateTitleAction, refineDetailsAction } from "@/app/actions";
import type { GenerateCapstoneTitleOutput } from "@/ai/flows/generate-capstone-title";
import type { RefineProjectDetailsInput } from "@/ai/flows/refine-project-details";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, Cpu, Target, FileText, ListChecks, FunctionSquare, Clock, Info, Bot, Database, ArrowRight, Sparkles, Download, RefreshCw } from "lucide-react";

const formSchema = z.object({
  fieldOfStudy: z.string().min(1, 'Please select a field of study.'),
  customFieldOfStudy: z.string().optional(),
  topic: z.string().optional(), // Can be empty if custom field of study
  customTopic: z.string().optional(),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Please select a difficulty level.',
  }),
}).superRefine((data, ctx) => {
  if (data.fieldOfStudy === 'Other') {
    if (!data.customFieldOfStudy?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a custom field of study.',
        path: ['customFieldOfStudy'],
      });
    }
    if (!data.customTopic?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a topic for your custom field.',
        path: ['customTopic'],
      });
    }
  } else {
    if (!data.topic) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select a topic.',
            path: ['topic'],
        });
    }
    if (data.topic === 'Other' && !data.customTopic?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter a custom topic.',
        path: ['customTopic'],
      });
    }
  }
});

type FormValues = z.infer<typeof formSchema>;

export default function TitleForgeClient() {
  const [result, setResult] = useState<GenerateCapstoneTitleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldOfStudy: '',
      customFieldOfStudy: '',
      topic: '',
      customTopic: '',
      difficultyLevel: 'Intermediate',
    },
  });

  const selectedField = form.watch('fieldOfStudy');
  const selectedTopic = form.watch('topic');

  const availableTopics = useMemo(() => {
    if (selectedField === 'Other') return [];
    const field = fieldsOfStudy.find(f => f.name === selectedField);
    return field ? [...field.topics, 'Other'] : [];
  }, [selectedField]);

  useEffect(() => {
    form.resetField('topic');
    form.resetField('customTopic');
  }, [selectedField, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    const isCustomField = values.fieldOfStudy === 'Other';
    const isCustomTopic = values.topic === 'Other';

    const input = {
      fieldOfStudy: isCustomField ? values.customFieldOfStudy! : values.fieldOfStudy,
      topic: isCustomField || isCustomTopic ? values.customTopic! : values.topic!,
      difficultyLevel: values.difficultyLevel as DifficultyLevel,
    };

    try {
      const response = await generateTitleAction(input);
      setResult(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGenerateNext() {
    setIsLoading(true);
    const values = form.getValues();
    
    const isCustomField = values.fieldOfStudy === 'Other';
    const isCustomTopic = values.topic === 'Other';

    const input = {
      fieldOfStudy: isCustomField ? values.customFieldOfStudy! : values.fieldOfStudy,
      topic: isCustomField || isCustomTopic ? values.customTopic! : values.topic!,
      difficultyLevel: values.difficultyLevel as DifficultyLevel,
    };

    try {
      const response = await generateTitleAction(input);
      setResult(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`grid grid-cols-1 gap-8 lg:gap-12 items-start ${result ? 'lg:justify-items-center' : 'lg:grid-cols-2'}`}>
      <AnimatePresence>
        {!result && (
          <motion.div
            key="form-card"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fieldOfStudy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Field of Study</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a field..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {fieldsOfStudy.map(field => (
                                <SelectItem key={field.name} value={field.name}>{field.name}</SelectItem>
                              ))}
                              <SelectItem value="Other">Other...</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedField === 'Other' && (
                      <FormField
                        control={form.control}
                        name="customFieldOfStudy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Field of Study</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Quantum Biology" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedField && selectedField !== 'Other' && (
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ''} disabled={!selectedField}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a topic..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableTopics.map(topic => (
                                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {(selectedTopic === 'Other' || selectedField === 'Other') && (
                      <FormField
                        control={form.control}
                        name="customTopic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{selectedField === 'Other' ? 'Topic' : 'Custom Topic'}</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., AI in Drug Discovery" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="difficultyLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {difficultyLevels.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? 'Generating...' : 'Forge Title'}
                      {!isLoading && <Lightbulb className="ml-2 h-4 w-4" />}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={result || isLoading ? 'w-full max-w-4xl' : 'lg:sticky top-8'}>
        <AnimatePresence mode="wait">
          {isLoading && !result ? ( // Only show main skeleton on initial load
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultsSkeleton />
            </motion.div>
          ) : result ? (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ResultsDisplay
                result={result}
                onGenerateNext={handleGenerateNext}
                isGeneratingNext={isLoading}
                onNewSearch={() => setResult(null)}
                onRefine={setResult}
              />
            </motion.div>
          ) : (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Placeholder />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2 border-b border-border/50 pb-4 last:border-b-0">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ResultsDisplay({
  result,
  onGenerateNext,
  isGeneratingNext,
  onNewSearch,
  onRefine
}: {
  result: GenerateCapstoneTitleOutput;
  onGenerateNext: () => void;
  isGeneratingNext: boolean;
  onNewSearch: () => void;
  onRefine: (refinedResult: GenerateCapstoneTitleOutput) => void;
}) {
  const details = [
    { icon: Cpu, title: 'Suggested Tech Stacks', content: result.suggestedTechStacks },
    { icon: Target, title: 'Objective', content: result.objective },
    { icon: FileText, title: 'Description', content: result.description },
    { icon: ListChecks, title: 'Implementation Steps', content: result.implementationSteps },
    { icon: FunctionSquare, title: 'Expected Methodology', content: result.expectedMethodology },
    { icon: Database, title: 'Data Collection', content: result.dataCollection },
    { icon: Clock, title: 'Estimated Time', content: result.estimatedTime },
    { icon: Info, title: 'Additional Information', content: result.additionalInformation },
  ];
  
  const [refinementRequest, setRefinementRequest] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const { toast } = useToast();

  async function handleRefineClick() {
    if (!refinementRequest.trim()) {
      toast({
        variant: 'destructive',
        title: 'Refinement request is empty',
        description: 'Please tell the AI how you want to refine the details.',
      });
      return;
    }
    setIsRefining(true);
    try {
      const input: RefineProjectDetailsInput = {
        currentDetails: result,
        refinementRequest,
      };
      const refinedResult = await refineDetailsAction(input);
      onRefine(refinedResult);
      setRefinementRequest('');
      toast({
        title: 'Refinement Complete',
        description: 'The project details have been updated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsRefining(false);
    }
  }

  function handleExportClick() {
    const { title, suggestedTechStacks, objective, description, implementationSteps, expectedMethodology, dataCollection, estimatedTime, additionalInformation } = result;

    const formatContent = (content: string) => {
        if (!content) return '';
        return content.replace(/\n/g, '<br />');
    };

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  body { font-family: sans-serif; line-height: 1.4; }
  h1 { color: #333; }
  h2 { color: #555; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 24px; }
</style>
</head>
<body>
  <h1>${title}</h1>

  <h2>Objective</h2>
  <p>${objective}</p>

  <h2>Description</h2>
  <p>${description}</p>

  <h2>Suggested Tech Stacks</h2>
  <p>${formatContent(suggestedTechStacks)}</p>

  <h2>Implementation Steps</h2>
  <p>${formatContent(implementationSteps)}</p>

  <h2>Expected Methodology</h2>
  <p>${formatContent(expectedMethodology)}</p>

  <h2>Data Collection</h2>
  <p>${dataCollection}</p>

  <h2>Estimated Time</h2>
  <p>${estimatedTime}</p>

  <h2>Additional Information</h2>
  <p>${formatContent(additionalInformation)}</p>
</body>
</html>
    `.trim();

    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeTitle}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const showSkeleton = isGeneratingNext || isRefining;

  return (
    <Card className="bg-card/50 border-border/50 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="sticky top-0 z-10 p-4 sm:p-6 bg-card/95 backdrop-blur-sm border-b border-border/50 flex flex-col sm:flex-row gap-3">
        <Button onClick={onNewSearch} variant="outline" className="w-full sm:w-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            New Search
        </Button>
        <Button onClick={onGenerateNext} className="w-full" disabled={isGeneratingNext || isRefining}>
          {isGeneratingNext ? "Generating..." : "Generate Another"}
          {!isGeneratingNext && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        <Button onClick={handleExportClick} variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export as Doc
        </Button>
      </div>
      
      <AnimatePresence mode="wait">
        {showSkeleton ? (
           <motion.div key="skeleton-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
             <ResultsSkeleton />
           </motion.div>
        ) : (
          <motion.div key="content-inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{result.title}</CardTitle>
              <p className="text-sm text-muted-foreground">Here are the generated details for your project idea.</p>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue={details[0].title}>
                {details.map(({ icon: Icon, title, content }) => (
                  <AccordionItem key={title} value={title}>
                    <AccordionTrigger className="text-base hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary/80" />
                        <span>{title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground prose prose-sm dark:prose-invert prose-p:leading-relaxed whitespace-pre-wrap">
                      {content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      <CardFooter className="flex-col items-start gap-4 p-6 bg-background/30 border-t border-border/50">
        <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary"/>
          Refine with AI
        </h3>
        <p className="text-sm text-muted-foreground -mt-2">
          Not quite right? Tell the AI what you want to change. (e.g., "Suggest Python libraries", "Make the description shorter")
        </p>
        <div className="w-full grid gap-2">
          <Textarea 
            placeholder="Your refinement request..."
            value={refinementRequest}
            onChange={(e) => setRefinementRequest(e.target.value)}
            disabled={isRefining || isGeneratingNext}
          />
          <Button onClick={handleRefineClick} className="w-full sm:w-auto justify-self-start" disabled={isRefining || isGeneratingNext || !refinementRequest.trim()}>
            {isRefining ? "Refining..." : "Refine"}
            {!isRefining && <RefreshCw className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function Placeholder() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 lg:p-12 border-2 border-dashed border-border/50 rounded-lg h-full min-h-[400px]">
        <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="font-headline text-xl font-semibold text-foreground">Awaiting Your Brilliance</h3>
        <p className="mt-2 text-muted-foreground max-w-sm">
            Fill out the form to generate your project title and detailed plan. Your next great idea starts here.
        </p>
    </div>
  );
}

    