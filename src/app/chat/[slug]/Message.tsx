type Props = {
  bot: boolean;
  children: string;
};

export default function Message({ children, bot }: Props) {
  if (bot) {
    return (
      <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg bg-muted px-3 py-2 text-sm">{children}</div>
    );
  }

  return (
    <div className="ml-auto flex w-max max-w-[75%] flex-col gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
      {children}
    </div>
  );
}
