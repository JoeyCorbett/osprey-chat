import NavMenu from '@/components/NavMenu'
import { ReactNode } from 'react';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavMenu />
      <main>{children}</main>
    </>
  )
}