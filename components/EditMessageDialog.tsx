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
import { useEffect, useState, useRef } from 'react'

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
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    if (editText === messageContent) return

    try {
      editMessage(messageId, editText)
      setIsLoading(true)
    } catch (error) {
      console.error('Error updating message', error)
    } finally {
      setEditOpen(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setEditText(messageContent)
  }, [messageContent])

  return (
    <Dialog open={editOpen} onOpenChange={setEditOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>Edit your message below</DialogDescription>
        </DialogHeader>
        <Textarea
          value={editText}
          placeholder="Type your message here..."
          onChange={(e) => setEditText(e.target.value)}
          ref={inputRef}
        />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant={'outline'} onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={messageContent === editText || isLoading}
            onClick={handleUpdate}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
