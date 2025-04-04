'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Send, Paperclip } from 'lucide-react'
import { FileUploadModal } from '@/components/FileUploadModal'
import { FilePreview } from '@/components/FilePreview'

interface MessageInputProps {
  roomId: string
}

export default function MessageInput({ roomId }: MessageInputProps) {
  const [value, setValue] = useState('')
  const [localFile, setLocalFile] = useState<{
    file: File
    name: string
    size: number
  } | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() && !localFile) return
    if (isSubmitting) return

    try {
      setIsSubmitting(true)

      // First create the message
      const messageRes = await fetch(`/api/messages`, {
        method: 'POST',
        body: JSON.stringify({
          roomId,
          content: value,
          file_url: null,
          file_name: null,
          file_type: null,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (messageRes.status === 429) {
        toast.error(
          'You are sending messages too quickly. Please wait a few seconds.',
          { position: 'top-right' },
        )
        return
      }

      if (!messageRes.ok) {
        throw new Error('Failed to send message')
      }

      const { id: messageId } = await messageRes.json()

      // If there's a file, wait for upload to complete
      if (localFile) {
        const formData = new FormData()
        formData.append('file', localFile.file)
        formData.append('originalFileName', localFile.name)
        formData.append('messageId', messageId)
        formData.append('chatRoomId', roomId)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadRes.ok) {
          if (!value.trim()) {
            await fetch(`/api/messages/${messageId}`, {
              method: 'DELETE',
            })
          }
          toast.error('Upload failed. Please try again.', {
            position: 'top-right',
          })
          return
        }

        // Wait for the upload response
        await uploadRes.json()
      }

      setValue('')
      setLocalFile(null)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to send message. Please try again.', {
        position: 'top-right',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="max-w-[650px] mx-auto space-y-2">
        {localFile && (
          <FilePreview
            fileName={localFile.name}
            onRemoveAction={() => setLocalFile(null)}
            fileSize={localFile.size}
          />
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 p-2 border rounded-xl bg-white shadow-md"
        >
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <input
              className="flex-1 bg-transparent focus:outline-none"
              placeholder="Type your message..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              disabled={isSubmitting}
              autoFocus
            />
          </div>
          <button
            className={`p-2 flex items-center justify-center rounded-lg transition ${
              (value.trim() || localFile) && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white border'
                : 'bg-gray-100 cursor-not-allowed border'
            }`}
            type="submit"
            disabled={(!value.trim() && !localFile) || isSubmitting}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <FileUploadModal
        isOpen={isUploadModalOpen}
        onCloseAction={() => setIsUploadModalOpen(false)}
        onFileSelectAction={(file) => {
          setLocalFile({
            file,
            name: file.name,
            size: file.size,
          })
        }}
      />
    </>
  )
}
