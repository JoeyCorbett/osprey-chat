import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Trash2, Pencil } from 'lucide-react'
import ChatBubble from '@/components/ChatBubble'
import { useState } from 'react'
import type { ChatMessage } from '@/hooks/use-realtime-chat'
import { EditMessageDialog } from '@/components/EditMessageDialog'

interface MessageActionProps {
  message: ChatMessage
  isOwnMessage: boolean
  onEdit: (id: string, content: string) => void
  onDelete: () => void
  edited: boolean
}

export const MessageActions = ({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
  edited,
}: MessageActionProps) => {
  const [alertOpen, setAlertOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <ChatBubble
            content={message.content}
            isOwnMessage={isOwnMessage}
            edited={edited}
          />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem className="gap-2" onClick={() => setEditOpen(true)}>
            <Pencil className="w-4 h-4" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            className="gap-2"
            onSelect={() => setAlertOpen(true)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span className="text-red-500">Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this message? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => onDelete?.()}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditMessageDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        messageContent={message.content}
        messageId={message.id}
        editMessage={onEdit}
      />
    </>
  )
}
