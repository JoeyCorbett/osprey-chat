import { Metadata } from 'next'
import GraduationYearMenu from '@/components/GraduationYearMenu'

export const metadata: Metadata = {
  title: 'Settings - Profile',
}

export default async function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 mt-8">
      <div className="shadow-lg p-8 w-full max-w-lg bg-card text-card-foreground border border-border rounded-[var(--radius)]">
        <h1 className="text-xl font-bold mb-2 text-foreground">Profile</h1>
        <span className="text-sm text-muted-foreground">
          Customize your profile settings.
        </span>
        <div className="flex flex-col mt-6">
          <span className="font-medium text-foreground space-between">Class</span>
          <span className="text-sm text-muted-foreground">
            Select your graduation year.
          </span>
          <GraduationYearMenu />
        </div>
      </div>
    </div>
  )
}
