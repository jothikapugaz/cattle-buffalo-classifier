import Image from 'next/image'
import { ArrowUpRight, ScanLine } from 'lucide-react'

export function ClassifierIntro() {
  return (
    <div className="enter-view flex min-w-0 flex-col gap-7 lg:pt-4">
      <div className="flex items-center gap-2 text-primary"><ScanLine className="size-4" aria-hidden="true" /><p className="section-label">A fresh perspective on the field</p></div>
      <div className="flex flex-col gap-5">
        <h1 className="text-balance text-4xl leading-[1.08] font-medium tracking-[-0.055em] sm:text-6xl lg:text-[64px]">Cattle or buffalo?<br /><span className="text-primary">See the difference.</span></h1>
        <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground">A little curiosity. A clearer picture. Upload an animal photo to explore a simpler way to tell cattle and buffalo apart.</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <AnimalPortrait name="Cattle" latin="Bos taurus / indicus" src="/images/cattle.png" />
          <AnimalPortrait name="Buffalo" latin="Bubalus bubalis" src="/images/buffalo.png" />
        </div>
        <p className="text-sm text-muted-foreground">AI-generated illustrations · Not training or test images</p>
      </div>
      <a href="#about" className="flex w-fit items-center gap-2 text-sm font-medium text-primary">Built with transparency, not guesswork <ArrowUpRight className="size-4" aria-hidden="true" /></a>
    </div>
  )
}

function AnimalPortrait({ name, latin, src }: { name: string; latin: string; src: string }) {
  return (
    <figure className="group overflow-hidden rounded-xl border bg-card">
      <div className="relative aspect-[1.18] overflow-hidden">
        <Image src={src} alt={`Illustrative portrait of ${name === 'Cattle' ? 'a tan zebu cow' : 'a dark water buffalo'} in a green meadow`} fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 40vw, 240px" priority className="object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <figcaption className="flex items-center justify-between px-3.5 py-3">
        <div className="flex flex-col gap-0.5"><span className="font-medium">{name}</span><span className="text-sm text-muted-foreground">{latin}</span></div>
      </figcaption>
    </figure>
  )
}
