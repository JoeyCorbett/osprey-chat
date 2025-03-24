import NavMenu from '@/components/NavMenu'
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavMenu />
      <main>{children}</main>
    </>
  )
}