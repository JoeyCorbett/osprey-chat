import { Metadata } from 'next'
import { ThemeMenu } from '@/components/ThemeMenu'

export const metadata: Metadata = {
  title: 'Settings - Appearance',
}

export default async function SettingsPage() {
  return (
    <>
      <div className="mx-auto max-w-xl w-full px-4 mt-8">
        <div className="w-full">
          <ThemeMenu />
        </div>
      </div>
    </>
  )
}
