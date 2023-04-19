export default function Login() {
  return (
    <section className="lg:w-72">
      <h1 className="py-4 text-3xl font-semibold">Log in</h1>
      <form action="/">
        <label className="flex flex-col py-1" htmlFor="email">
          <span className="p-1">Email</span>
          <input className="input-bordered input" required type="email" name="email" id="email" />
        </label>
        <label className="flex flex-col py-1" htmlFor="password">
          <span className="p-1">Password</span>
          <input className="input-bordered input" required type="password" name="password" id="password" />
        </label>
        <div className="mt-4">
          <button className="btn-primary btn w-full" type="submit">
            Login
          </button>
        </div>
      </form>
    </section>
  );
}
