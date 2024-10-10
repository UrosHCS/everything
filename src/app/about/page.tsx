export default async function AboutPage() {
  const response = await fetch('https://api.github.com/repos/vercel/next.js', {
    next: {
      revalidate: 1,
    },
  });

  const data = await response.json();
  const id = data.id;
  return (
    <div>
      This is just a test page for now to see how slow Next.js is.
      <div>Here is a vercel id from github: {id}</div>
    </div>
  );
}
