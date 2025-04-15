import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface EditMessageDialogProps {
  editOpen: boolean
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>
  messageContent: string
  messageId: string
  editMessage: (id: string, content: string) => void
}

export const EditMessageDialog = ({
  editOpen,
  setEditOpen,
  messageContent,
  messageId,
  editMessage,
}: EditMessageDialogProps) => {
  const [editText, setEditText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const trimmed = editText.trim()
  const hasChanges = trimmed !== messageContent.trim()
  const isValid = trimmed.length > 0 && hasChanges

  const handleUpdate = useCallback(async () => {
    if (!isValid) return

    try {
      setIsLoading(true)
      setError(null)
      await editMessage(messageId, editText.trim())
      setEditOpen(false)
    } catch (error) {
      console.error('Error updating message:', error)
      setError('Failed to update message. Please try again.')
      toast.error('Failed to update message', {
        position: 'top-right',
      })
    } finally {
      setIsLoading(false)
    }
  }, [editMessage, editText, isValid, messageId, setEditOpen])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Submit on Cmd/Ctrl + Enter
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        void handleUpdate()
      }
    },
    [handleUpdate],
  )

  useEffect(() => {
    setEditText(messageContent)
    setError(null)

    // move cursor to end of string
    // '0' waits until dialog dom is ready
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        const len = inputRef.current.value.length
        inputRef.current.setSelectionRange(len, len)
        inputRef.current.focus()
      }
    }, 0)

    return () => clearTimeout(timeout)
  }, [messageContent, editOpen])

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>Edit your message below</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={editText}
            placeholder="Type your message here..."
            onChange={(e) => {
              setEditText(e.target.value)
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            disabled={isLoading}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setEditOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button disabled={!isValid || isLoading} onClick={handleUpdate}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
