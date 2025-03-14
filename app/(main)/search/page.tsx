import CourseSearch from '@/components/CourseSearch'

export default async function Search() {
  return (
    <>
      <div className="mx-auto max-w-xl w-full px-4 mt-8">
        <div className="w-full">
          <CourseSearch />
        </div>
      </div>
    </>
  )
}
