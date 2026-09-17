export default function Home() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_#dbeafe,_transparent_45%),radial-gradient(circle_at_bottom_right,_#fef3c7,_transparent_40%)]" />
      <section className="group w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/10 sm:p-12">
        <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_0_5px_rgba(59,130,246,0.12)] transition-transform duration-300 group-hover:scale-125" />
          Assignment 1
        </div>
        <div className="mt-12">
          <p className="text-sm font-medium text-blue-600 transition-colors duration-300 group-hover:text-indigo-600">
            Humor Project
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            This is a sample Next.js app for Assignment 1.
          </h1>
        </div>
        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <span className="transition-colors duration-300 hover:text-blue-600">
            Next.js App Router
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span className="transition-colors duration-300 hover:text-blue-600">
            TypeScript
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
          <span className="transition-colors duration-300 hover:text-blue-600">
            Tailwind CSS
          </span>
        </div>
        <a
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          href="https://anncli.github.io"
          target="_blank"
          rel="noreferrer"
        >
          More about Ann Li
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </a>
      </section>
    </main>
  );
}
