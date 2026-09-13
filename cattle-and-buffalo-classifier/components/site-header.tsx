import { ArrowUpRight, Focus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function Brand() {
  return (
    <a href="#" className="flex items-center gap-2.5" aria-label="CattleBuffalo AI home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Focus className="size-5" aria-hidden="true" /></span>
      <span className="text-lg font-semibold tracking-tight">CattleBuffalo <span className="font-normal text-primary">AI</span></span>
    </a>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b bg-card/80">
      <div className="page-container flex min-h-20 items-center justify-between gap-6">
        <Brand />
        <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm md:flex">
          <a href="#classifier" className="font-medium text-primary">Classifier</a>
          <a href="#how-it-works" className="text-muted-foreground transition-colors hover:text-primary">How it works</a>
          <a href="#about" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary">About the model <ArrowUpRight className="size-4" aria-hidden="true" /></a>
        </nav>
        <Badge variant="outline" className="hidden sm:inline-flex"><span className="size-1.5 rounded-full bg-warning" aria-hidden="true" /> Research preview</Badge>
      </div>
      <nav aria-label="Mobile navigation" className="flex justify-center gap-8 border-t py-3 text-sm md:hidden">
        <a href="#classifier">Classifier</a><a href="#how-it-works">How it works</a><a href="#about">The model</a>
      </nav>
    </header>
  )
}
