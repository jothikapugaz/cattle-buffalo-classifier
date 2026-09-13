import { ArrowRight, ArrowUpRight, Fingerprint, Focus, ImagePlus, ScanLine } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const steps = [
  { number: '01', icon: ImagePlus, title: 'Upload', description: 'Choose a well-lit photo with one animal clearly in the frame.' },
  { number: '02', icon: ScanLine, title: 'Analyze', description: 'The planned model will look for visual features that distinguish the two species.' },
  { number: '03', icon: Focus, title: 'Predict', description: 'Once trained, get a class and confidence score—not a guarantee.' },
]

export function ProjectDetails() {
  return (
    <>
      <section id="how-it-works" aria-labelledby="how-title" className="border-y bg-card">
        <div className="page-container py-12 sm:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4"><div className="flex flex-col gap-2"><p className="section-label text-primary">From photo to perspective</p><h2 id="how-title" className="text-3xl font-medium tracking-tight">Simple by nature.</h2></div><p className="text-sm text-muted-foreground">Three steps. One focused experience.</p></div>
          <div className="mt-9 grid gap-7 md:grid-cols-3 md:gap-10">
            {steps.map(({ number, icon: Icon, title, description }, index) => <div key={title} className="flex flex-col gap-3"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"><Icon className="size-5" aria-hidden="true" /></span><span className="font-mono text-sm text-muted-foreground">{number}</span>{index < 2 && <ArrowRight className="ml-auto hidden size-4 text-border md:block" aria-hidden="true" />}</div><h3 className="text-lg font-semibold">{title}</h3><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{description}</p></div>)}
          </div>
        </div>
      </section>
      <section id="about" aria-labelledby="about-title" className="page-container py-14 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div className="flex flex-col gap-5"><span className="section-label text-primary">Behind the distinction</span><h2 id="about-title" className="text-balance text-3xl font-medium leading-tight tracking-tight sm:text-4xl">Honest science.<br />Down to the last detail.</h2><p className="text-pretty leading-relaxed text-muted-foreground">A focused computer-vision project, built to distinguish cattle from water buffalo—and to be clear about what it can and cannot do.</p><Badge variant="destructive" className="h-auto whitespace-normal py-1">Model training pending dataset access</Badge><div className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"><Fingerprint className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" /><p>No fabricated predictions. No unverified accuracy claims. No substitute training data.</p></div></div>
          <div className="flex flex-col gap-0">
            <ModelDetail title="The model" description="MobileNetV3 Small is the planned lightweight transfer-learning architecture, with a future ONNX deployment path. No weights have been trained or loaded. The inference adapter currently returns an explicit unavailable status." />
            <ModelDetail title="The dataset" description="Intended source: Cattle&Buffalo breed classificat by Dheepika on Roboflow Universe. The source is reported as CC BY 4.0, with 5,654 images; those facts have not been independently verified here. Only cattle and buffalo will be included; unlabelled images will be excluded." />
            <ModelDetail title="Confidence is not certainty" description="Confidence measures the model’s preference between two classes. A binary classifier can still be confident about an unrelated image. Non-animal detection, confidence calibration, and reliable rejection need separate evaluation; they are not available in this preview." />
            <ModelDetail title="Current limitations" description="Dataset access is blocked by a security-verification page. Training, held-out evaluation, and error analysis have not run. Low light, unusual angles, multiple animals, and unfamiliar breeds will require careful testing." />
            <a className="mt-5 flex w-fit items-center gap-2 text-sm font-medium text-primary" href="https://universe.roboflow.com/dheepika/cattle-buffalo-breed-classificat" target="_blank" rel="noreferrer">Explore the intended dataset <ArrowUpRight className="size-4" aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </>
  )
}

function ModelDetail({ title, description }: { title: string; description: string }) {
  return <details className="group border-b py-5" open={title === 'The model'}><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">{title}<span aria-hidden="true" className="text-xl font-normal text-muted-foreground group-open:rotate-45">+</span></summary><p className="pt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></details>
}
