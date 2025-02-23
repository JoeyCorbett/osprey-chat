import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'

export default function MyCourses() {
  

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className='flex items-center justify-center gap-2 mb-10'>
        <MessageCircle className="w-6 h-6 text-gray-900" />
        <h1 className="text-2xl font-bold text-gray-900">Course Chats</h1>
      </div>


      {/* Button to Find Courses */}
      <div className="mt-6 flex justify-center">
        <Link href="/search">
          <Button className="bg-black text-white hover:bg-gray-800">
            ➕ Find New Courses
          </Button>
        </Link>
      </div>
    </div>
  )
}
