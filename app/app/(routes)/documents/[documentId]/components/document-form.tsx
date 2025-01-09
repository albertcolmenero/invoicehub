"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Trash } from "lucide-react"
import { Document, Project } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
  name: z.string().min(1),
  projectId: z.string().nullable(),
  content: z.string().min(1),
});

type DocumentFormValues = z.infer<typeof formSchema>

interface DocumentFormProps {
  initialData: Document | null;
  projects: Project[];
};

export const DocumentForm: React.FC<DocumentFormProps> = ({
  initialData,
  projects
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Document' : 'Add Document ';
  const description = initialData ? 'Edit a document.' : 'Add a new document';
  const toastMessage = initialData ? 'Document updated.' : 'Document created.';
  const action = initialData ? 'Save changes' : 'Add';

  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: '',
        projectId: '',
        content: ''
    }
  });

  const onSubmit = async (data: DocumentFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(`/api/documents/${params.documentId}`, data);
      } else {
        console.log('Creating new document');
        const response = await axios.post('/api/documents', {
          name: data.name,
          projectId: data.projectId,
          content: data.content
        });
      }
      router.refresh();
      router.push(`/documents`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/documents/${params.documentId}`);
      router.refresh();
      router.push(`/documents`);
      toast.success('Document deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this document first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="md:grid md:grid-cols-3 gap-8">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Document name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value ?? undefined} defaultValue={field.value ?? undefined}>
                    <FormControl>
                    <SelectTrigger>
                      <SelectValue defaultValue={field.value ?? undefined} placeholder="Select a project" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Document content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            </div>
          
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
