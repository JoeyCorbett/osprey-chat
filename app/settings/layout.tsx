import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import SettingsNav from '@/components/SettingsNav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SettingsNav />
      <main>
        <SidebarTrigger className="mt-3 ml-3" />
        {children}
      </main>
    </SidebarProvider>
  )
}
