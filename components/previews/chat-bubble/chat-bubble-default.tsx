import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "@/registry/chat-bubble/chat-bubble"

// Incoming and outgoing bubbles with tails, timestamps and delivery ticks.
export function ChatBubbleDefaultExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-1 rounded-lg bg-background p-4 shadow-sm">
      <ChatBubble variant="incoming">
        <ChatBubbleMessage>
          Hey! Did the new registry component land yet?
          <ChatBubbleTimestamp>9:41 AM</ChatBubbleTimestamp>
        </ChatBubbleMessage>
      </ChatBubble>

      <ChatBubble variant="outgoing">
        <ChatBubbleMessage>
          Just shipped it 🚀
          <ChatBubbleTimestamp status="read">9:42 AM</ChatBubbleTimestamp>
        </ChatBubbleMessage>
      </ChatBubble>

      <ChatBubble variant="outgoing">
        <ChatBubbleMessage tail={false}>
          Incoming and outgoing bubbles, with tails, timestamps and ticks —
          just like WhatsApp.
          <ChatBubbleTimestamp status="delivered">9:42 AM</ChatBubbleTimestamp>
        </ChatBubbleMessage>
      </ChatBubble>

      <ChatBubble variant="incoming">
        <ChatBubbleMessage>
          Nice, looks exactly right 👌
          <ChatBubbleTimestamp>9:43 AM</ChatBubbleTimestamp>
        </ChatBubbleMessage>
      </ChatBubble>
    </div>
  )
}
