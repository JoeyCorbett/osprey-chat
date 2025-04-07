'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/dropzone'
import { Paperclip } from 'lucide-react'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { useState, useEffect } from 'react'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = [
  'image/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

export default function DropZoneModal({
  isConnected,
}: {
  isConnected: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  const uploadProps = useSupabaseUpload({
    bucketName: 'uploads',
    maxFileSize: MAX_FILE_SIZE,
    maxFiles: 1,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
    path: 'messages',
    upsert: false,
  })

  const { isSuccess, setFiles, setErrors, setSuccesses } = uploadProps

  useEffect(() => {
    const resetUploadState = () => {
      setFiles([])
      setErrors([])
      setSuccesses([])
    }

    if (!isOpen) {
      resetUploadState()
    }
  }, [isOpen, setErrors, setFiles, setSuccesses])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-2 hover:bg-muted border rounded-full transition-colors"
          disabled={!isConnected}
        >
          <Paperclip className="w-5 h-5 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a file</DialogTitle>
          <DialogDescription>
            Drag and drop a file here, or click to browse.
          </DialogDescription>
        </DialogHeader>
        <Dropzone {...uploadProps}>
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        {isSuccess && (
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Done</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
