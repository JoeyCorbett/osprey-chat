import CourseSearch from '@/components/CourseSearch'
import NavMenu from '@/components/NavMenu'

export default async function Search() {
  return (
    <>
      <NavMenu />
      <div className="mx-auto max-w-xl w-full px-4 mt-8">
        <div className="w-full">
          <CourseSearch />
        </div>
      </div>
    </>
  )
}
