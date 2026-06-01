# Poll Create & Edit Feature - Setup Guide

## ✅ Completed Fixes

### 1. **Poll Service Enhancement** (`service/poll.service.ts`)

- ✅ Added `createPoll(request)` method with full validation
- ✅ Added `updatePoll(pollId, request)` method for editing polls
- ✅ Validates title, options (min 2), and closing time (must be future)
- ✅ Fixed WebSocket URL handling to auto-convert http→ws

### 2. **Poll Form Component** (`components/feedback/poll/creation/PollForm.tsx`)

- ✅ Fixed imports to use updated PollSidebar with settings
- ✅ Added workspaceId prop support
- ✅ Comprehensive form validation before submission
- ✅ Uses `pollService.createPoll()` for API integration
- ✅ Error and success messaging with visual feedback
- ✅ Auto-redirect to poll after creation
- ✅ Proper ISO date/time formatting for API

### 3. **Poll Settings Sidebar** (`components/feedback/poll/creation/PollSidebar.tsx`)

- ✅ Converted to accept settings as props
- ✅ Added date and time input fields for closing time
- ✅ Shows formatted datetime preview
- ✅ All settings passed to parent via `onSettingsChange` callback
- ✅ Includes toggle options: multiple select, anonymous vote, add option, hidden poll
- ✅ Show results dropdown: Select, Always Visible, After Voting, After Poll Expire

## 🚀 How to Use

### Basic Usage in a Route/Page:

```typescript
import PollForm from "@/components/feedback/poll/creation/PollForm";

export default function CreatePollPage({ params }: { params: { workspaceId: string } }) {
  return <PollForm workspaceId={params.workspaceId} />;
}
```

### Form State Management:

- **Title**: Required, minimum 1 character
- **Description**: Optional
- **Options**: Minimum 2, maximum unlimited (can add/remove)
- **Closing Date/Time**: Required, must be in the future
- **Settings**: All toggles and dropdown managed by sidebar

### API Integration:

The component automatically calls:

```typescript
await pollService.createPoll({
  title: string,
  description?: string,
  options: Array<{ text: string }>,
  closingTime: ISO8601 string,
  workspaceId: string
});
```

### Response:

On success, the API returns a `Poll` object with:

- `pollId`: Unique identifier for the poll
- `title`, `description`: Poll metadata
- `options`: Array of PollOption objects
- `closingTime`: ISO string when poll closes
- `totalVotes`: Current vote count
- `isActive`: Whether poll is accepting votes

## 📋 Validation Rules

The form validates:

1. ✅ Title is not empty
2. ✅ At least 2 poll options
3. ✅ All options have text content
4. ✅ Closing date/time is selected
5. ✅ Closing time is in the future (not past)
6. ✅ Workspace ID is provided

## 🎨 UI Features

### Error Display:

- Red alert box with AlertCircle icon
- Displays validation errors clearly
- Auto-clears when user makes changes

### Success Display:

- Green success box with CheckCircle icon
- "Poll Created!" button state
- Auto-redirects after 1.5 seconds

### Loading States:

- Spinner animation during submission
- Button disabled while submitting
- Button disabled after successful creation (until redirect)

## 📦 Component Props

### PollForm

```typescript
interface PollFormProps {
  workspaceId: string; // Required: workspace to create poll in
}
```

### PollSidebar (Internal)

```typescript
interface PollSidebarProps {
  settings: PollSettings;
  onSettingsChange: (settings: PollSettings) => void;
}

interface PollSettings {
  multipleSelect: boolean;
  anonymousVote: boolean;
  addOption: boolean;
  hiddenPoll: boolean;
  showResult: string;
  closingDate: string; // YYYY-MM-DD format
  closingTime: string; // HH:mm format (24-hour)
}
```

## 🔄 Poll Editing

For editing existing polls, use:

```typescript
await pollService.updatePoll(pollId, {
  title?: string,
  description?: string,
  options?: Array<{ text: string }>,
  closingTime?: string,
});
```

To create an edit form, reuse PollForm with:

- Pre-fill existing poll data
- Load poll using `pollService.getPoll(pollId)`
- Call `updatePoll` instead of `createPoll` on submit

## 🐛 Troubleshooting

**Poll not created?**

- Check browser console for error message
- Verify closing time is in future
- Ensure workspaceId is valid
- Check API_BASE_URL is configured

**Date/time not saving?**

- Ensure date format is YYYY-MM-DD
- Ensure time format is HH:mm (24-hour)
- Check browser timezone settings

**Form validation failing?**

- All fields must pass validation before submit
- Title required, 1+ characters
- Options must have text
- Closing time must be future date

## 📚 Related Files

- **Types**: `types/poll.ts`
- **Service**: `service/poll.service.ts`
- **Hooks**: `hooks/use-poll.ts`
- **Display Component**: `components/poll/PollComponent.tsx`
- **Main Guide**: `POLL_FEATURE_GUIDE.md`

## ✨ Next Steps

1. Create a route that uses PollForm component
2. Pass workspaceId from route params
3. Test poll creation with valid data
4. Verify API receives correct payload
5. Implement poll editing using updatePoll method
6. Add poll management dashboard for listing/editing polls
