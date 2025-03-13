import NavMenu from '@/components/NavMenu'
import MyCourses from '@/components/MyCourses'

export default async function Chats() {
  return (
    <>
      <NavMenu />
      <div className="mx-auto max-w-xl w-full px-4 mt-8">
        <div className="w-full">
          <MyCourses />
        </div>
      </div>
    </>
  )
}
