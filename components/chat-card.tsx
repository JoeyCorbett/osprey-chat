import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatCard() {
  return (
    <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback>J</AvatarFallback>
        </Avatar>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Jane Smith (TA)</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {/* Incoming Message */}
        <div className="flex flex-col max-w-[80%]">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-100">
              Hey everyone, just a reminder that the group project proposal is
              due tomorrow at 5 PM. Does anyone have questions about the format?
            </p>
          </div>
          {/* Timestamp */}
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            9:32 AM
          </span>
        </div>

        {/* Outgoing Message */}
        <div className="flex flex-col items-end max-w-[80%] ml-auto">
          <div className="bg-blue-500 text-white p-3 rounded-lg">
            <p className="text-sm">
              Hi Jane, thanks for the reminder! I just wanted to confirm if we
              should include a reference list at this stage or only in the final
              report?
            </p>
          </div>
          {/* Timestamp */}
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            9:34 AM
          </span>
        </div>

        {/* Incoming Message */}
        <div className="flex flex-col max-w-[80%]">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-100">
              Great question. Just a brief list of sources is enough for now—no
              formal citations required yet.
            </p>
          </div>
          {/* Timestamp */}
          <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            9:35 AM
          </span>
        </div>
      </div>
    </div>
  )
}
