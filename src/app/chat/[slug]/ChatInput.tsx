import { Button } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { Send } from 'react-feather';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type Props = {
  ask: (question: string) => void;
  shouldDisable: boolean;
};

const FormSchema = z.object({
  question: z
    .string()
    .min(3, {
      message: 'Question must be at least 3 characters.',
    })
    .max(120, {
      message: 'Question must be at most 120 characters.',
    }),
});

type FormData = z.infer<typeof FormSchema>;

export function ChatInput({ ask, shouldDisable }: Props) {
  const { data: session, status } = useSession();

  const user = session?.user;

  const form = useForm<FormData>({
    defaultValues: {
      question: '',
    },
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: FormData) {
    if (status === 'loading') {
      return;
    }

    if (!user) {
      signIn('google');
      return;
    }

    form.reset();
    ask(data.question);
  }

  const disableSubmit =
    shouldDisable || !form.formState.isDirty || !form.formState.isValid || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-2 flex gap-2">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => {
            return (
              <FormItem className="flex-1">
                <FormControl>
                  <Input autoComplete="off" placeholder="Type your question here" {...field} />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Button disabled={disableSubmit} type="submit">
          <Send />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </Form>
  );
}
