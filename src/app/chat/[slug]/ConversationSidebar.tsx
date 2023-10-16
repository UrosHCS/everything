import { ConversationList } from './ConversationList';
import { ConversationPreview } from './server';
import { Button } from '@components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@components/ui/sheet';
import { ReactNode } from 'react';

type Props = {
  conversationPreviews: ConversationPreview[];
  children: ReactNode;
};

export function ConversationSidebar({ conversationPreviews, children }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        {children}
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Conversations</SheetTitle>
          <SheetDescription>Here you can see a list of previous conversations.</SheetDescription>
        </SheetHeader>
        <ConversationList conversationPreviews={conversationPreviews} />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
