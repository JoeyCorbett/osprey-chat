'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface FileUploadModalProps {
  isOpen: boolean
  onCloseAction: () => void
  onFileSelectAction: (file: File) => void
}

export function FileUploadModal({
  isOpen,
  onCloseAction,
  onFileSelectAction,
}: FileUploadModalProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      if (
        file.type === 'image/svg+xml' ||
        file.name.toLowerCase().endsWith('.svg')
      ) {
        toast.error('SVG files are not supported')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too big! Max size is 10MB.')
        return
      }

      onFileSelectAction(file)
      onCloseAction()
    },
    [onFileSelectAction, onCloseAction],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: (fileRejections) => {
      for (const fileRejection of fileRejections) {
        const error = fileRejection.errors[0]
        if (error.code === 'file-too-large') {
          toast.error('File is too big! Max size is 10MB.', {
            position: 'top-right',
          })
        } else {
          toast.error('File is not supported', { position: 'top-right' })
        }
      }
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
  })

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`mt-4 p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-gray-400" />
          <DialogDescription className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select'}
          </DialogDescription>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: Images, PDF, DOC, DOCX
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
