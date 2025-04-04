'use client'

import { FileText, Image as ImageIcon, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilePreviewProps {
  fileName: string
  onRemoveAction: () => void
  fileSize?: number
  className?: string
}

export function FilePreview({ fileName, onRemoveAction, fileSize, className }: FilePreviewProps) {
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

  function formatFileSize(bytes?: number) {
    if (!bytes) return null
    
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Card className={cn(
      "flex items-center gap-2 p-2 bg-muted/50 border-muted-foreground/20",
      "max-w-full overflow-hidden",
      className
    )}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex-shrink-0 text-muted-foreground">
          {getFileTypeIcon(fileName)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {fileName}
          </p>
          {fileSize && (
            <p className="text-xs text-muted-foreground">
              {formatFileSize(fileSize)}
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 flex-shrink-0"
        onClick={onRemoveAction}
      >
        <X className="h-3 w-3" />
      </Button>
    </Card>
  )
} 