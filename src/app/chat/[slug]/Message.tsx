type Props = {
  bot: boolean;
  children: string;
};

export default function Message({ children, bot }: Props) {
  if (bot) {
    return (
      <div className="bg-muted flex w-max max-w-[75%] flex-col gap-2 break-words rounded-lg px-3 py-2 text-sm">
        {children}
      </div>
    );
  }

  return (
    <div className="bg-primary text-primary-foreground ml-auto flex w-max max-w-[75%] flex-col gap-2 break-words rounded-lg px-3 py-2 text-sm">
      {children}
    </div>
  );
}
