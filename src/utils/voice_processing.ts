import OpenAI from 'openai';

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should use a server-side API endpoint
});

// Friend name with ID for matching
export interface FriendReference {
  id: string;
  name: string;
}

// Types for processed items
export interface ProcessedItem {
  type: 'note' | 'task' | 'topic' | 'date';
  content: string;
  title?: string;
  date?: string;
  priority?: 'Normal' | 'High';
  recurring?: boolean;
}

// Structure for OpenAI response
export interface ProcessedVoiceResult {
  friends: Array<{
    id: string;
    name: string;
    items: Array<ProcessedItem>;
  }>;
  unassignedItems: Array<ProcessedItem>;
  createNewFriend: boolean;
  newFriendName?: string;
}

/**
 * Process voice input using OpenAI to extract structured data
 * @param transcript The voice transcript text
 * @param availableFriends List of friends to match against
 * @returns Structured data extracted from the transcript
 */
export async function processVoiceInput(
  transcript: string,
  availableFriends: FriendReference[] = []
): Promise<ProcessedVoiceResult> {
  try {
    // Construct the system prompt with available friend names
    const friendsList = availableFriends.length > 0
      ? `Available friends: ${availableFriends.map(f => f.name).join(', ')}`
      : 'No existing friends in database';

    const systemPrompt = `You analyze voice memos about friends to extract structured data. Extract friends, tasks, dates, notes, and topics.

For each piece of information:
1. Identify which friend it relates to (match to available friends when possible)
2. Categorize as: task, note, topic, or date
3. Extract relevant details (priority for tasks, dates for events)

${friendsList}

Return a JSON object with:
1. "friends": array of objects with:
   - "id": matching id from available friends, or empty string if no match
   - "name": friend name
   - "items": array of processed items
2. "unassignedItems": array of items without a clear friend association
3. "createNewFriend": boolean, true if there's an unmatched friend that should be created
4. "newFriendName": suggested name for new friend (if applicable)

Item structure:
- "type": "note" | "task" | "topic" | "date"
- "content": main text content
- "priority": "Normal" | "High" (for tasks)
- "date": YYYY-MM-DD format (for dates)
- "recurring": boolean (for dates)
- "title": short title (for dates)`;

    // Make the API call
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: transcript
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const responseContent = response.choices[0].message.content;
    if (!responseContent) {
      throw new Error('Empty response from OpenAI');
    }

    let parsedResult: ProcessedVoiceResult;
    try {
      parsedResult = JSON.parse(responseContent);
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error('Invalid response format');
    }

    // Match friend IDs with available friends by name (case insensitive)
    parsedResult.friends = parsedResult.friends.map(friend => {
      if (!friend.id) {
        const matchedFriend = availableFriends.find(
          f => f.name.toLowerCase() === friend.name.toLowerCase()
        );
        if (matchedFriend) {
          return { ...friend, id: matchedFriend.id };
        }
      }
      return friend;
    });

    return parsedResult;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to process voice input');
  }
}