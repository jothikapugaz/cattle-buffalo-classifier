import { CheckCircle2 } from 'lucide-react'
import type { Prediction } from '@/lib/classifier-contract'

export function PredictionResult({ prediction }: { prediction: Prediction }) {
  const label = prediction.class === 'cattle' ? 'Cattle' : 'Buffalo'
  const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 }).format(prediction.confidence)
  return (
    <section aria-label="Prediction result" className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-secondary p-5 text-secondary-foreground">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><CheckCircle2 className="size-5" aria-hidden="true" /><h3 className="text-xl font-semibold">{label}</h3></div>
        <span className="font-mono text-2xl font-medium">{percent}</span>
      </div>
      <div role="meter" aria-label={`${label} model confidence`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={prediction.confidence * 100} className="h-1.5 overflow-hidden rounded-full bg-primary/10"><div className="h-full rounded-full bg-primary" style={{ width: `${prediction.confidence * 100}%` }} /></div>
      <p className="text-sm leading-relaxed">Model confidence, not certainty. This binary classifier cannot reliably rule out other animals or objects.</p>
    </section>
  )
}
