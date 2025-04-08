import MyCourses from '@/components/MyCourses'
import { FeedbackDialog } from '@/components/FeedbackDialog'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chats',
}

export default async function Chats() {
  return (
    <>
      <div className="mx-auto max-w-xl w-full px-4 mt-8">
        <div className="w-full">
          <MyCourses />
        </div>
        <FeedbackDialog />
      </div>
    </>
  )
}
