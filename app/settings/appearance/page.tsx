import { Metadata } from 'next'
import { ThemeMenu } from '@/components/ThemeMenu'

export const metadata: Metadata = {
  title: 'Settings - Appearance',
}

export default async function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 mt-8">
      <div className="shadow-lg p-8 w-full max-w-lg background-card text-card-foreground border border-border rounded-[var(--radius)]">
        <h1 className="text-xl font-bold mb-2 text-foreground">Appearance</h1>
        <span className="text-sm text-muted-foreground">
          Customize the look and feel of your application.
        </span>
        <div className="mt-6 flex items-center justify-between">
          <span className="font-medium text-foreground space-between">
            Theme
          </span>
          <ThemeMenu />
        </div>
      </div>
    </div>
  )
}
