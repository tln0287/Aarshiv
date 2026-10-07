export default function GlobeTooltip({ place }) {
  if (!place) return null
  const origin = place.id === 'india'
  return (
    <div className="pointer-events-none min-w-44 rounded-2xl border border-white/15 bg-night/85 px-4 py-3 text-left text-white shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-2 text-[0.7rem] font-medium text-saffron-2">
        <span className={`size-1.5 rounded-full ${origin ? 'bg-saffron' : 'bg-white'}`} />
        {origin ? 'Origin' : 'Export destination'}
      </div>
      <div className="mt-1 text-base font-semibold tracking-tight">{place.name}</div>
      <div className="mt-0.5 text-xs text-mist">{origin ? 'Sourced, packed and shipped from India' : 'A market we aim to serve'}</div>
    </div>
  )
}
