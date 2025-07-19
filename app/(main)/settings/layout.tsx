import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import SettingsNav from "@/components/SettingsNav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SettingsNav />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}