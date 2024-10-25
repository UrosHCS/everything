export default async function AboutPage() {
  const randomNumber = Math.random();

  return (
    <div>
      This is just a test page for now to see how slow Next.js is.
      <div>Here is a random number: {randomNumber}</div>
    </div>
  );
}
