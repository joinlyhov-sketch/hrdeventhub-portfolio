# Real-Time Poll Feature Implementation Guide

## Overview

This implementation provides a complete real-time polling system with automatic WebSocket connection management and poll closing time handling.

## Files Created

### 1. **[types/poll.ts](types/poll.ts)** - Type Definitions

Defines the TypeScript interfaces for:

- `Poll` - Main poll data structure with options and metadata
- `PollOption` - Individual poll option with vote tracking
- `PollVotePayload` - Vote submission payload
- `PollUpdate` - WebSocket update messages
- `PollCreateRequest` & `PollVoteRequest` - API request types

### 2. **[service/poll.service.ts](service/poll.service.ts)** - Service Layer

Singleton service handling:

- **`getPoll(pollId)`** - Fetch poll data from `/polls/{pollId}`
- **`votePoll(pollId, voteRequest)`** - Submit vote to `/polls/{pollId}/vote`
- **`setupWebSocket(pollId, config)`** - Establish real-time WebSocket connection with:
  - Automatic poll closing time detection
  - Connection closure when poll expires
  - Automatic reconnection with exponential backoff
  - Vote update callbacks
- **`closePollConnection(pollId)`** - Clean up resources
- **`closeAllConnections()`** - Cleanup all active connections

### 3. **[hooks/use-poll.ts](hooks/use-poll.ts)** - React Hook

Custom hook for component integration:

```typescript
const {
  poll, // Current poll data
  isLoading, // Loading state
  error, // Error state
  vote, // Vote function
  refetch, // Manual refetch
  isPollOpen, // Check if poll is open
  getTimeRemaining, // Get remaining time object
  isWebSocketConnected, // WS connection status
} = usePoll(pollId, options);
```

### 4. **[components/poll/PollComponent.tsx](components/poll/PollComponent.tsx)** - Example Component

Full-featured React component demonstrating:

- Poll display with real-time vote updates
- Visual progress bars
- Countdown timer
- Vote submission
- Error handling
- Connection status indicator

## Usage Examples

### Basic Usage with Hook

```typescript
"use client";
import { usePoll } from "@/hooks/use-poll";

export function MyPoll({ pollId }: { pollId: string }) {
  const { poll, vote, isPollOpen, getTimeRemaining } = usePoll(pollId);

  return (
    <div>
      <h1>{poll?.title}</h1>
      {poll?.options.map(option => (
        <button key={option.optionId} onClick={() => vote(option.optionId)}>
          {option.text} ({option.voteCount} votes)
        </button>
      ))}
    </div>
  );
}
```

### Advanced Usage with Callbacks

```typescript
const { poll, vote, isWebSocketConnected } = usePoll(pollId, {
  enableWebSocket: true,
  onVoteUpdate: (updatedPoll) => {
    console.log("New votes received:", updatedPoll);
    // Update UI or trigger animations
  },
  onPollClosed: () => {
    console.log("Poll has closed");
    // Show poll results or redirect
  },
  onError: (error) => {
    console.error("Poll error:", error);
    // Show error notification
  },
});
```

### Using Service Directly

```typescript
import { pollService } from "@/service/poll.service";

// Fetch poll data
const poll = await pollService.getPoll("poll-123");

// Setup WebSocket for real-time updates
await pollService.setupWebSocket("poll-123", {
  onVoteUpdate: (poll) => console.log("Updated:", poll),
  onPollClosed: () => console.log("Poll closed"),
  onError: (error) => console.error(error),
});

// Submit a vote
const updatedPoll = await pollService.votePoll("poll-123", {
  optionId: "option-456",
});

// Clean up
pollService.closePollConnection("poll-123");
```

## Key Features

### 🔄 Automatic Closing Time Management

- Fetches poll closing time on WebSocket setup
- Automatically closes connection when closing time is reached
- Timer prevents further updates after expiration

### 🔗 Robust WebSocket Connection

- Automatic reconnection with exponential backoff (max 5 attempts)
- Real-time vote updates via WebSocket
- Graceful error handling and recovery
- Automatic cleanup on component unmount

### 📊 Vote Tracking

- Real-time vote count updates
- Percentage calculation
- Vote validation

### 🎯 State Management

- Uses SWR for client-side caching
- Automatic mutation updates
- Deduping and revalidation support

## Environment Variables Required

```env
NEXT_PUBLIC_API_BASE_URL=http://your-api-url
NEXT_PUBLIC_WS_BASE_URL=ws://your-ws-url  # Optional, defaults to http->ws conversion
```

## Error Handling

The implementation handles:

- Network errors and timeouts
- Invalid poll IDs
- Expired/closed polls
- WebSocket connection failures
- Vote submission errors
- Automatic reconnection logic

## Performance Considerations

1. **Deduping**: SWR dedupes requests within 5 seconds
2. **Exponential Backoff**: Reconnection attempts use increasing delays
3. **Memory Cleanup**: All timers and connections are cleared on unmount
4. **Efficient Updates**: Only necessary re-renders on vote updates

## Security Considerations

- Authentication token included in all requests
- Bearer token format: `Authorization: Bearer {token}`
- Session validation via `next-auth`
- Type-safe payload validation

## Integration in Your App

1. Create a poll page/route
2. Import the hook or component
3. Pass the poll ID
4. Configure callbacks as needed

Example page:

```typescript
export default function PollPage({ params }: { params: { pollId: string } }) {
  return <PollComponent pollId={params.pollId} enableRealTime={true} />;
}
```

## Troubleshooting

### WebSocket not connecting?

- Check `NEXT_PUBLIC_WS_BASE_URL` environment variable
- Verify poll ID is valid
- Check browser console for errors

### Votes not updating?

- Ensure WebSocket is connected (check status indicator)
- Verify poll is still open (before closing time)
- Check network tab for message payload

### Memory leaks?

- Ensure components unmount properly
- Check that connections are being closed
- Monitor for multiple WebSocket connections

## Testing

```typescript
// Test with mock data
const mockPoll: Poll = {
  pollId: "test-1",
  title: "Test Poll",
  options: [
    { optionId: "opt-1", text: "Option 1", voteCount: 10 },
    { optionId: "opt-2", text: "Option 2", voteCount: 20 },
  ],
  closingTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  totalVotes: 30,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  workspaceId: "ws-1",
  createdBy: "user-1",
};
```

## API Endpoints Referenced

- `GET /api/v4/polls/{pollId}` - Fetch poll data
- `POST /api/v4/polls/{pollId}/vote` - Submit vote
- `GET /api/v4/polls/{pollId}/options` - Fetch poll options
- `WS /api/v4/polls/{pollId}/subscribe` - WebSocket subscription
- `POST /api/v4/polls` - Create a new poll with payload:
  ```json
  {
    "workspaceId": "string (UUID)",
    "title": "string",
    "description": "string (optional)",
    "type": "string (default: 'text')",
    "options": ["string", "string", ...],
    "closingTime": "ISO 8601 datetime",
    "multiSelect": boolean (default: false),
    "anonymousVoting": boolean (default: false),
    "allowAddOptions": boolean (default: false),
    "hiddenPoll": boolean (default: false),
    "showResult": "string (default: 'afterVote')"
  }
  ```
- `PUT /api/v4/polls/{pollId}` - Update a poll

See the attached Postman/Swagger documentation for detailed endpoint specifications.
