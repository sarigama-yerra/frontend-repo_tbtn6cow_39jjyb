import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[360px] md:h-[440px]">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/30 to-slate-900"></div>
      </div>
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-6 md:px-10 pb-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white drop-shadow">Property Verification Tasks</h1>
            <p className="mt-3 md:mt-4 text-blue-200/90 text-sm md:text-base">Verify listing status, earn instant micropayments, and move to the next task automatically.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
