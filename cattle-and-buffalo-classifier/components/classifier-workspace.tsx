'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, CircleHelp, FileImage, ImagePlus, Info, LoaderCircle, LockKeyhole, RotateCcw, ScanLine, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PredictionResult } from '@/components/prediction-result'
import { ACCEPTED_TYPES, isPrediction, MODEL_STATUS, validateDimensions, validateFile, type Prediction } from '@/lib/classifier-contract'
import { cn } from '@/lib/utils'

type SelectedImage = { file: File; url: string; width: number; height: number }
type Phase = 'idle' | 'validating' | 'ready' | 'submitting' | 'complete'

export function ClassifierWorkspace() {
  const [image, setImage] = useState<SelectedImage | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)
  const [modelPending, setModelPending] = useState(false)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const generation = useRef(0)
  const request = useRef<AbortController | null>(null)
  const busy = phase === 'validating' || phase === 'submitting'

  useEffect(() => () => { if (image) URL.revokeObjectURL(image.url) }, [image])
  useEffect(() => () => { generation.current++; request.current?.abort() }, [])

  function reset() {
    generation.current++
    request.current?.abort()
    setImage(null)
    setPhase('idle')
    setError(null)
    setModelPending(false)
    setPrediction(null)
    if (input.current) input.current.value = ''
  }

  async function selectImage(files: File[]) {
    reset()
    if (files.length !== 1) {
      setError('Choose one image at a time so each animal gets a clear result.')
      return
    }
    const selected = files[0]
    const current = generation.current
    let url: string | undefined
    setPhase('validating')
    try {
      validateFile(selected)
      url = URL.createObjectURL(selected)
      const decoded = new window.Image()
      decoded.src = url
      await decoded.decode()
      validateDimensions(decoded.naturalWidth, decoded.naturalHeight)
      if (current !== generation.current) { URL.revokeObjectURL(url); return }
      setImage({ file: selected, url, width: decoded.naturalWidth, height: decoded.naturalHeight })
      setPhase('ready')
    } catch (cause) {
      if (url) URL.revokeObjectURL(url)
      if (current !== generation.current) return
      setError(cause instanceof Error && cause.name === 'ClassifierError' ? cause.message : 'We couldn’t read this image. It may be damaged. Try a different JPG, PNG, or WebP.')
      setPhase('idle')
    }
  }

  async function analyze() {
    if (!image) { setError('Choose an image before analyzing.'); return }
    const current = generation.current
    setPhase('submitting')
    setError(null)
    setModelPending(false)
    setPrediction(null)
    const controller = new AbortController()
    request.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 30_000)
    try {
      const body = new FormData()
      body.set('image', image.file)
      const response = await fetch('/api/predict', { method: 'POST', body, signal: controller.signal })
      let payload: unknown
      try { payload = await response.json() }
      catch { throw new Error('The image service returned an unreadable response. Please try again later.') }
      if (current !== generation.current) return
      if (!response.ok) {
        const detail = (payload as { error?: { code?: string; message?: string } })?.error
        setModelPending(detail?.code === 'MODEL_UNAVAILABLE')
        throw new Error(detail?.message || 'The service couldn’t process this image. Please try again.')
      }
      if (!isPrediction(payload)) throw new Error('The model returned an unreadable result. Please try again later.')
      setPrediction(payload)
      setPhase('complete')
    } catch (cause) {
      if (current !== generation.current) return
      setError(controller.signal.aborted ? 'The request took too long. Please try again.' : cause instanceof TypeError ? 'Unable to connect. Check your connection and try again.' : cause instanceof Error ? cause.message : 'The image service is unavailable. Please try again.')
      setPhase('ready')
    } finally {
      window.clearTimeout(timeout)
      if (request.current === controller) request.current = null
    }
  }

  return (
    <section id="classifier" aria-labelledby="upload-title" className="enter-view-late overflow-hidden rounded-2xl border bg-card shadow-[0_8px_40px_-20px_var(--foreground)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-6 py-5 sm:px-7">
        <div className="flex items-center gap-2.5"><ScanLine className="size-5 text-primary" aria-hidden="true" /><h2 id="upload-title" className="font-semibold">Image classifier</h2></div>
        <Badge variant="destructive">Model pending</Badge>
      </div>
      <div className="flex flex-col gap-5 p-6 sm:p-7">
        <div className="flex flex-col gap-1"><h3 className="text-xl font-medium tracking-tight">Let&apos;s take a closer look.</h3><p className="text-sm leading-relaxed text-muted-foreground">Start with a clear photo of a single animal.</p></div>
        <input ref={input} id="image-upload" data-testid="image-upload" type="file" accept={ACCEPTED_TYPES.join(',')} className="sr-only" tabIndex={-1} aria-label="Upload animal image" aria-describedby="upload-help" onChange={e => { if (e.target.files?.length) void selectImage(Array.from(e.target.files)) }} />
        {image ? (
          <div className="flex flex-col gap-3">
            <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl border bg-background sm:h-60">
              {/* Local object URLs remain in-browser until the user explicitly submits. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="Your uploaded animal image" className="size-full object-contain" />
              <Button size="icon" variant="outline" aria-label="Remove image" className="absolute top-3 right-3" onClick={reset}><X /></Button>
            </div>
            <div className="flex items-center gap-3 text-sm"><FileImage className="size-4 shrink-0 text-primary" aria-hidden="true" /><span className="min-w-0 flex-1 truncate">{image.file.name}</span><span className="shrink-0 font-mono text-muted-foreground">{(image.file.size / 1024 / 1024).toFixed(2)} MB</span></div>
          </div>
        ) : (
          <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false) }} onDrop={e => { e.preventDefault(); setDragging(false); void selectImage(Array.from(e.dataTransfer.files)) }} className={cn('flex min-h-64 flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-primary/30 bg-background/70 p-5 text-center transition-colors sm:min-h-72', dragging && 'border-primary bg-secondary')}>
            <span className="flex size-14 items-center justify-center rounded-2xl border bg-card text-primary shadow-sm">{phase === 'validating' ? <LoaderCircle className="size-6 animate-spin" aria-hidden="true" /> : <ImagePlus className="size-6" aria-hidden="true" />}</span>
            <div className="flex flex-col gap-1.5"><p className="font-medium">{dragging ? 'Drop your image here' : phase === 'validating' ? 'Checking your image…' : 'Drag & drop your image here'}</p><p className="text-sm text-muted-foreground">or choose one from your device</p></div>
            <Button variant="outline" size="lg" onClick={() => input.current?.click()} disabled={busy}><Upload data-icon="inline-start" /> Browse files</Button>
          </div>
        )}
        <p id="upload-help" className="text-center font-mono text-sm text-muted-foreground">JPG, PNG or WebP · Up to 3 MB</p>
        <div className="flex flex-col gap-3">
          <Button size="lg" className="h-12 w-full" disabled={!image || busy} onClick={() => void analyze()}>
            {phase === 'submitting' ? <><LoaderCircle className="animate-spin" data-icon="inline-start" /> Checking image & model…</> : <><ScanLine data-icon="inline-start" /> Analyze image <ArrowRight data-icon="inline-end" /></>}
          </Button>
          {image && <Button variant="ghost" onClick={reset}><RotateCcw data-icon="inline-start" /> Start over</Button>}
        </div>
        <div aria-live="polite" aria-atomic="true" className="flex flex-col gap-3">
          {error && <Alert variant="destructive"><Info /><AlertTitle>{modelPending ? 'Your image is ready. The model isn’t yet.' : 'Let’s try that again'}</AlertTitle><AlertDescription>{error}{modelPending && '. Your image was validated, but no prediction was generated.'}</AlertDescription></Alert>}
          {prediction && <PredictionResult prediction={prediction} />}
          {!error && !prediction && <div className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"><CircleHelp className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" /><p>Try the upload experience. Predictions will be available once model training is complete.</p></div>}
        </div>
        <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground"><LockKeyhole className="size-3.5" aria-hidden="true" /> Images are processed in memory, never saved.</p>
      </div>
      <div className="flex items-center gap-2 border-t bg-background px-6 py-3 text-sm text-muted-foreground"><span className="size-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />{MODEL_STATUS.message}</div>
    </section>
  )
}
