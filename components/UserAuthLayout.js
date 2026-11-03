import Image from 'next/image';

export default function UserAuthLayout({ eyebrow, title, description, children }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f4ef] px-4 py-8 sm:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] bg-white shadow-[0_30px_100px_rgba(47,24,20,0.16)] md:min-h-[560px] md:grid-cols-[0.82fr_1.18fr]">
        <section className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#4c111b] via-[#731d2b] to-[#9c4a31] px-6 py-8 text-center text-white md:min-h-full">
          <div aria-hidden="true" className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[30px] border-white/[0.08]" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white p-2 shadow-xl ring-1 ring-white/50">
            <Image
              src="/images/logos/gvp-college-seal.jpg"
              alt="Gayatri Vidya Parishad College seal"
              width={225}
              height={225}
              className="h-full w-full rounded-full object-contain"
            />
          </div>
          <h2 className="relative mt-5 text-2xl font-bold">Gayatri Vidya Parishad</h2>
          <p className="relative mt-2 text-sm text-rose-100">One community. A lifetime of connection.</p>
        </section>
        <section className="flex items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9a4a31]">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-[#281b1a]">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
