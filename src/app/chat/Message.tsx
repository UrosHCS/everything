type Props = {
  bot: boolean;
  children: string;
};

export default function Message({ children, bot }: Props) {
  if (bot) {
    return (
      <div className="answer flex justify-start text-purple-950">
        <div className="max-w-4/5 rounded-lg border border-purple-500 bg-gradient-to-r from-fuchsia-500 to-purple-500 p-2">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="question flex justify-end text-purple-950">
      <div className="max-w-4/5 rounded-lg border border-purple-500 bg-gradient-to-r from-purple-500 to-fuchsia-400 p-2">
        {children}
      </div>
    </div>
  );
}
