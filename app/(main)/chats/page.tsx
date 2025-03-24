import MyCourses from '@/components/MyCourses'
import { FeedbackDialog } from '@/components/FeedbackDialog'

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
