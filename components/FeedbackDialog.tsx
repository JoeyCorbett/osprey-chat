'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { ChangeEvent } from 'react'
import { PencilLine, Bug, Megaphone } from 'lucide-react'

export function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<'feedback' | 'bug'>('feedback')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit() {
    if (!content.trim()) {
      toast.error('Please enter some feedback')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({ type, content }),
      })

      if (response.status === 429) {
        toast.error(
          'You have already submitted feedback recently. Place wait a minute before trying again.',
        )
        return
      }

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      if (type === 'feedback') {
        toast.success('Thank you for your feedback!')
      } else {
        toast.success('Thank you for your bug report!')
      }

      setIsOpen(false)
      setContent('')
      setType('feedback')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Megaphone className="w-6 h-6" />
          <span className="sr-only">Open feedback form</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve Osprey Chat by sharing your thoughts or reporting
            issues.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select
              value={type}
              onValueChange={(value: 'feedback' | 'bug') => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feedback">
                  <div className="flex items-center">
                    <PencilLine className="w-4 h-4 mr-2" /> Feedback
                  </div>
                </SelectItem>
                <SelectItem value="bug">
                  <div className="flex items-center">
                    <Bug className="w-4 h-4 mr-2" /> Bug Report
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Textarea
              placeholder={
                type === 'feedback'
                  ? 'Share your thoughts, suggestions, or ideas...'
                  : 'Describe the bug and steps to reproduce it...'
              }
              value={content}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
