import { ConversationPreview } from './server';
import { ScrollArea } from '@components/ui/scroll-area';
import { Separator } from '@components/ui/separator';
import Link from 'next/link';
import { Fragment } from 'react';
import { MessageSquare } from 'react-feather';

type Props = {
  conversationPreviews: ConversationPreview[];
};

export function ConversationList({ conversationPreviews }: Props) {
  if (conversationPreviews.length === 0) {
    return (
      <div className="p-4">
        <p className="text-center opacity-50">No conversations yet.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="my-4 rounded-md border">
      <div className="px-4">
        {conversationPreviews.map((conversation, index) => (
          <Fragment key={conversation.id}>
            <div className="w-80 overflow-x-hidden overflow-ellipsis whitespace-nowrap py-2 text-sm lg:w-72">
              <Link className="w-full py-2" href={conversation.url}>
                <MessageSquare width={18} height={18} className="mr-2 inline-block" />
                {conversation.name}
              </Link>
            </div>
            {index !== conversationPreviews.length - 1 && <Separator />}
          </Fragment>
        ))}
      </div>
    </ScrollArea>
  );
}
