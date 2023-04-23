'use client';

import { signInWithGoogle } from '@lib/firebase';
import { useSession } from '@lib/firebase/context';
import { redirect } from 'next/navigation';

// import { FormEvent, useState } from 'react';

// function onSubmit(e: FormEvent<HTMLFormElement>) {
//   e.preventDefault();
// }

export default function Login() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  const { user, status } = useSession();

  if (status === 'loading') return <p>spinner</p>;

  if (user) {
    redirect('/profile');
  }

  return (
    <>
      <h1 className="py-4 text-3xl font-semibold">Log in</h1>
      {/* <section className="lg:w-72">
        <form onSubmit={onSubmit} action="/">
          <label className="flex flex-col py-1" htmlFor="email">
            <span className="p-1">Email</span>
            <input
              className="input-bordered input"
              id="email"
              name="email"
              onChange={e => setEmail(e.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="flex flex-col py-1" htmlFor="password">
            <span className="p-1">Password</span>
            <input
              className="input-bordered input"
              id="password"
              name="password"
              onChange={e => setPassword(e.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          <div className="mt-4">
            <button className="btn-primary btn w-full" type="submit">
              Login
            </button>
          </div>
        </form>
      </section> */}
      <section>
        <button onClick={signInWithGoogle} className="btn-ghost btn text-xl normal-case">
          Login with google
        </button>
      </section>
    </>
  );
}
