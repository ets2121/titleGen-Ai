
'use client';

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { fieldsOfStudy, difficultyLevels, type DifficultyLevel } from "@/lib/constants";
import { generateTitleAction } from "@/app/actions.ts";
import type { GenerateCapstoneTitleOutput } from "@/ai/flows/generate-capstone-title";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Cpu, Target, FileText, ListChecks, FunctionSquare, Clock, Info, Bot } from "lucide-react";

const formSchema = z.object({
  fieldOfStudy: z.string().min(1, 'Please select a field of study.'),
  topic: z.string().min(1, 'Please select a topic.'),
  customTopic: z.string().optional(),
  difficultyLevel: z.enum(['Beginner', 'Intermediate', 'Advanced'], {
    required_error: 'Please select a difficulty level.',
  }),
}).refine(data => {
  if (data.topic === 'Other') {
    return !!data.customTopic && data.customTopic.trim().length > 0;
  }
  return true;
}, {
  message: 'Please enter a custom topic.',
  path: ['customTopic'],
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
      topic: '',
      customTopic: '',
      difficultyLevel: 'Intermediate',
    },
  });

  const selectedField = form.watch('fieldOfStudy');
  const selectedTopic = form.watch('topic');

  const availableTopics = useMemo(() => {
    const field = fieldsOfStudy.find(f => f.name === selectedField);
    return field ? [...field.topics, 'Other'] : [];
  }, [selectedField]);

  useEffect(() => {
    form.resetField('topic');
  }, [selectedField, form]);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);

    const input = {
      fieldOfStudy: values.fieldOfStudy,
      topic: values.topic === 'Other' ? values.customTopic! : values.topic,
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedField}>
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

              {selectedTopic === 'Other' && (
                <FormField
                  control={form.control}
                  name="customTopic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Quantum Computing in Finance" {...field} />
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

      <div className="lg:sticky top-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultsSkeleton />
            </motion.div>
          ) : result ? (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ResultsDisplay result={result} />
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

function ResultsDisplay({ result }: { result: GenerateCapstoneTitleOutput }) {
  const details = [
    { icon: Cpu, title: 'Suggested Tech Stacks', content: result.suggestedTechStacks },
    { icon: Target, title: 'Objective', content: result.objective },
    { icon: FileText, title: 'Description', content: result.description },
    { icon: ListChecks, title: 'Implementation Steps', content: result.implementationSteps },
    { icon: FunctionSquare, title: 'Expected Methodology', content: result.expectedMethodology },
    { icon: Clock, title: 'Estimated Time', content: result.estimatedTime },
    { icon: Info, title: 'Additional Information', content: result.additionalInformation },
  ];

  return (
    <Card className="bg-card/50 border-border/50 max-h-[80vh] overflow-y-auto">
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
