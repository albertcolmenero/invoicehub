"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Trash } from "lucide-react"
import { Project } from "@prisma/client"
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
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"

const formSchema = z.object({
  name: z.string().min(1),
});

type ProjectFormValues = z.infer<typeof formSchema>

interface ProjectFormProps {
  initialData: Project | null;
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit Project' : 'Add Project ';
  const description = initialData ? 'Edit a project.' : 'Add a new project';
  const toastMessage = initialData ? 'Project updated.' : 'Project created.';
  const action = initialData ? 'Save changes' : 'Add';

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: '',
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      setLoading(true);

      console.log(initialData);
      console.log(data);

      if (initialData) {
        await axios.patch(`/api/projects/${params.projectId}`, data);
      } else {
        console.log('Creating new project');
        const response = await axios.post('/api/projects', {
          name: data.name
        });
      }
      router.refresh();
      router.push(`/projects`);
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
      await axios.delete(`/api/projects/${params.projectId}`);
      router.refresh();
      router.push(`/projects`);
      toast.success('Project deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this project first.');
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
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Project name" {...field} />
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
