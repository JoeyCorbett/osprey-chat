'use client'

import { FileText, Image as ImageIcon, Download } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'

interface FileAttachmentProps {
  fileName: string
  fileUrl: string
  className?: string
}

export function FileAttachment({ fileName, fileUrl, className }: FileAttachmentProps) {
  const [hasError, setHasError] = useState(false)

  function getFileTypeIcon(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (!extension) return <FileText className="w-4 h-4" />
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    return imageExtensions.includes(extension) ? (
      <ImageIcon className="w-4 h-4" />
    ) : (
      <FileText className="w-4 h-4" />
    )
  }

  const isImageFile = (() => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    return extension ? imageExtensions.includes(extension) : false
  })()

  return (
    <>
      {isImageFile ? (
        <div className={`relative group ${className}`}>
          <div className="relative w-32 h-32 rounded-lg overflow-hidden">
            {/*<Image
              src={fileUrl}
              alt={fileName}
              fill
              className="object-cover"
              sizes="128px"
              onError={() => setHasError(true)}
            />*/}
            {hasError && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
            onClick={() => window.open(fileUrl, '_blank')}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Card
          className={`flex items-center gap-2 p-2 bg-muted/50 border-muted-foreground/20 ${className}`}
        >
          <div className="flex-shrink-0 text-muted-foreground">
            {getFileTypeIcon(fileName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {fileName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={() => window.open(fileUrl, '_blank')}
          >
            <Download className="h-3 w-3" />
          </Button>
        </Card>
      )}
    </>
  )
}
