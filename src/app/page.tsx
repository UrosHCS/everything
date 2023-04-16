import Image from 'next/image'

export default function Home() {
  return (
    <main className='flex flex-col justify-between items-center p-4'>
      <h1 className='text-3xl font-semibold p-4'>Are you ready?</h1>
      <Image
        src="/beginning.webp"
        alt="Next.js logo"
        width={384}
        height={768}
      />
    </main>
  )
}
