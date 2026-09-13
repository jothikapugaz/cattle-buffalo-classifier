import { SiteHeader, Brand } from '@/components/site-header'
import { ClassifierIntro } from '@/components/classifier-intro'
import { ClassifierWorkspace } from '@/components/classifier-workspace'
import { ProjectDetails } from '@/components/project-details'

export default function Page() {
  return (
    <>
      <a href="#main" className="sr-only fixed top-3 left-3 focus:not-sr-only focus:z-50 focus:rounded-lg focus:bg-card focus:p-3 focus:text-primary">Skip to main content</a>
      <SiteHeader />
      <main id="main">
        <div className="page-container grid items-start gap-10 py-10 md:py-14 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:py-16">
          <ClassifierIntro />
          <ClassifierWorkspace />
        </div>
        <ProjectDetails />
      </main>
      <footer className="border-t bg-card">
        <div className="page-container flex flex-col items-start justify-between gap-5 py-7 sm:flex-row sm:items-center"><Brand /><p className="text-sm text-muted-foreground">A closer look at the animals around us.</p><a href="#about" className="text-sm text-primary">Research & transparency</a></div>
      </footer>
    </>
  )
}
