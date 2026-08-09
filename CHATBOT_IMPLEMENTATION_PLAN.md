# Chatbot Implementation Plan

This document outlines the plan for adding an interactive chatbot to the portfolio website, allowing employers to ask questions about Dan Baker.

## Architecture Overview

**Two Google Cloud Run Services:**
1. **Existing**: Frontend (React/nginx/Vite) - Current portfolio site
2. **New**: Backend Chat API (Node.js/Express) - Handles LLM integration

Both services communicate via HTTPS, with the backend handling LLM API calls.

## Major Architectural Decisions

### 1. LLM Provider Choice

**Option A: OpenAI API (GPT-4/3.5)**
- Pros: Mature API, good documentation, widely used
- Cons: Cost per request, rate limits, data sent to OpenAI

**Option B: Anthropic API (Claude)**
- Pros: Strong reasoning, longer context windows, better at following instructions
- Cons: Similar cost structure to OpenAI

**Option C: Open Source (Llama, Mistral via Google Vertex AI)**
- Pros: More control, can run on GCP infrastructure
- Cons: More complex setup, may need GPU instances

**Recommendation**: Start with Anthropic Claude API or OpenAI GPT-4 for faster implementation.

### 2. Backend Architecture

**Google Cloud Run with Node.js/Express**
- Fits existing containerized deployment pattern
- Auto-scales to zero (cost-effective)
- Simple deployment process
- Built-in HTTPS and load balancing

## Implementation Steps

### Phase 1: Backend Chat Service (Cloud Run)

**1. Create Backend Service Structure**
```
chat-backend/
├── package.json
├── index.js              # Express server
├── chatHandler.js        # LLM integration logic
├── promptBuilder.js      # System prompt with Dan's info
├── Dockerfile            # Multi-stage Node build
├── .env.example          # Environment variable template
├── .dockerignore
└── README.md
```

**2. Set up Express API**
- `POST /api/chat` - Main chat endpoint
  - Accept: `{ message: string, conversationHistory?: array }`
  - Return: `{ reply: string, conversationId?: string }`
- `GET /api/health` - Health check for Cloud Run
- `GET /api/suggested-questions` - Optional: return common questions

**3. Integrate LLM API**
- Install SDK: `npm install openai` or `npm install @anthropic-ai/sdk`
- Store API key in Google Secret Manager
- Implement chat completion logic
- Handle streaming responses (optional)
- Add error handling and retries

**4. Build Knowledge Base & System Prompt**
- Extract data from frontend `src/constants/index.js`:
  - Experiences array (work history)
  - Technologies array (skills)
- Create comprehensive system prompt:
  ```
  You are a helpful assistant representing Dan Baker, a Senior Full Stack Developer.

  BACKGROUND:
  [Include work experience, skills, accomplishments from constants]

  INSTRUCTIONS:
  - Answer questions about Dan's professional background, skills, and experience
  - Be friendly but professional
  - If asked about topics unrelated to Dan's career, politely redirect
  - Keep responses concise (2-3 paragraphs max)
  ```

**5. Implement Security & Rate Limiting**
- Add rate limiting (e.g., `express-rate-limit`)
  - Limit: 10 requests per minute per IP
  - Prevents abuse and controls costs
- Input validation and sanitization
- CORS configuration (allow frontend domain)
- Request/response logging

**6. Configure for Cloud Run**
- Listen on `process.env.PORT || 8080`
- Add graceful shutdown handling
- Health check endpoint returns 200 OK
- Dockerfile optimizations:
  ```dockerfile
  FROM node:18-alpine as build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .

  FROM node:18-alpine
  WORKDIR /app
  COPY --from=build /app .
  EXPOSE 8080
  CMD ["node", "index.js"]
  ```

### Phase 2: Deploy Backend to Cloud Run

**1. Build and Push Docker Image**
```bash
cd chat-backend

# Build image
docker build -t gcr.io/<project-id>/chat-backend:latest .

# Push to Google Container Registry
docker push gcr.io/<project-id>/chat-backend:latest
```

**2. Set Up Secrets in Google Secret Manager**
```bash
# Create secret for API key
echo -n "your-api-key-here" | gcloud secrets create openai-api-key --data-file=-

# Or for Anthropic
echo -n "your-api-key-here" | gcloud secrets create anthropic-api-key --data-file=-
```

**3. Deploy to Cloud Run**
```bash
gcloud run deploy chat-backend \
  --image gcr.io/<project-id>/chat-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets=OPENAI_API_KEY=openai-api-key:latest \
  --max-instances=10 \
  --min-instances=0 \
  --cpu=1 \
  --memory=512Mi \
  --timeout=60s
```

**4. Note the Service URL**
- Cloud Run will output a URL like: `https://chat-backend-xxx-uc.a.run.app`
- Save this for frontend configuration

### Phase 3: Frontend Chat Component

**1. Create Chat UI Components**

`src/components/ChatBot.jsx` - Main chat interface
- Chat message history display
- Input field with send button
- Loading/typing indicators
- Error states
- Minimize/maximize functionality

`src/components/ChatWidget.jsx` - Floating chat button (optional)
- Fixed position bottom-right
- Unread message badge
- Open/close animation

**2. Chat Component Features**
- Message history stored in React state or localStorage
- Auto-scroll to latest message
- Timestamp display
- "Suggested questions" on first load
- Mobile-responsive design
- Tailwind CSS styling (match existing design)

**3. API Integration**
```javascript
// Example chat API call
const sendMessage = async (message) => {
  const response = await fetch(`${import.meta.env.VITE_CHAT_API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      conversationHistory: messages
    })
  });

  const data = await response.json();
  return data.reply;
};
```

**4. State Management**
- Use React useState for message history
- Optional: localStorage for persistence across page refreshes
- Handle loading states (show typing indicator)
- Error handling with user-friendly messages

**5. Update App Structure**
- Modify `src/App.jsx`:
  ```javascript
  import { ChatBot } from "./components";

  // Add to render
  <ChatBot />
  ```
- Update `src/components/index.js`:
  ```javascript
  export { default as ChatBot } from './ChatBot';
  ```

### Phase 4: Deploy Updated Frontend

**1. Add Environment Variable**
Create/update `.env.production`:
```
VITE_CHAT_API_URL=https://chat-backend-xxx-uc.a.run.app
```

**2. Build and Deploy**
```bash
# Build with production env vars
npm run build

# Build Docker image
docker build -t gcr.io/<project-id>/dan-baker-info:latest .

# Push to GCR
docker push gcr.io/<project-id>/dan-baker-info:latest

# Deploy to Cloud Run
gcloud run deploy dan-baker-info \
  --image gcr.io/<project-id>/dan-baker-info:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars=VITE_CHAT_API_URL=https://chat-backend-xxx-uc.a.run.app
```

**3. Update CORS in Backend**
- Update backend to allow your frontend Cloud Run URL
- Or configure both services to use custom domain

### Phase 5: Polish & Optimization

**1. Analytics & Monitoring**
- Add Google Analytics events for chat interactions
- Monitor Cloud Run metrics (request count, latency, errors)
- Track common questions employers ask
- Set up Cloud Monitoring alerts for errors/high usage

**2. Conversation Memory**
- Implement session-based conversation context
- Store recent messages for context (last 5-10 exchanges)
- Clear context after inactivity or on user request

**3. Enhanced Features**
- "Suggested questions" feature:
  - "What is Dan's experience with React?"
  - "Tell me about Dan's backend experience"
  - "What technologies does Dan specialize in?"
- Quick reply buttons
- Copy message to clipboard
- Download conversation transcript

**4. Cost Monitoring & Optimization**
```bash
# Set up budget alerts in GCP
gcloud billing budgets create \
  --billing-account=<billing-account-id> \
  --display-name="Chat API Budget" \
  --budget-amount=50USD
```

**Optimization strategies:**
- Cache common questions/answers in backend (Redis or in-memory)
- Implement token limits per conversation (prevent very long contexts)
- Set max conversation length
- Monitor LLM API costs in provider dashboard

**5. Testing Checklist**
- [ ] Test various professional questions employers might ask
- [ ] Test off-topic questions (should redirect politely)
- [ ] Test very long messages (handle gracefully)
- [ ] Test rate limiting (verify it works)
- [ ] Test on mobile devices (responsive design)
- [ ] Test with slow network (loading states)
- [ ] Test CORS from production domain
- [ ] Load test backend (simulate multiple concurrent users)

## Cloud Run Specific Benefits

- **Auto-scaling**: Scales to zero when not used (no idle costs)
- **Pay-per-use**: Only pay when chat is actively being used
- **Simple deployment**: Single command deployment
- **Built-in HTTPS**: Automatic SSL certificates
- **Easy secrets**: Native Google Secret Manager integration
- **No infrastructure management**: No servers to maintain
- **Global load balancing**: Built-in (if using custom domain)

## Estimated Costs

### Monthly Cost Breakdown (Moderate Traffic)

**LLM API (Anthropic Claude or OpenAI GPT-4):**
- Average conversation: 5-10 exchanges
- Cost per conversation: $0.01-0.05
- 100 conversations/month: $1-5
- 500 conversations/month: $5-25

**Cloud Run - Chat Backend:**
- Request pricing: $0.40 per million requests
- CPU time: $0.00002400 per vCPU-second
- Memory: $0.00000250 per GiB-second
- Estimated: $2-10/month for moderate traffic
- **Free tier**: 2 million requests, 360,000 vCPU-seconds

**Cloud Run - Frontend:**
- Similar pricing, likely within free tier for portfolio site
- Current cost (if any)

**Total Estimated**: $5-35/month depending on usage
- Low traffic (< 100 chats/month): ~$5/month
- Moderate traffic (500 chats/month): ~$20-35/month

## Files to Create/Modify

### New Files
- `chat-backend/` (entire directory)
  - `package.json`
  - `index.js`
  - `chatHandler.js`
  - `promptBuilder.js`
  - `Dockerfile`
  - `.dockerignore`
  - `README.md`
  - `.env.example`
- `src/components/ChatBot.jsx`
- `src/components/ChatWidget.jsx` (optional)
- `.env.production` (frontend env vars)
- `CHATBOT_IMPLEMENTATION_PLAN.md` (this file)

### Files to Modify
- `src/App.jsx` - Add ChatBot component
- `src/components/index.js` - Export ChatBot
- `CLAUDE.md` - Document chat backend architecture

### Files to Deprecate/Ignore
- `deploy/*.yaml` files (Kubernetes configs from old deployment method)

## Next Steps When Ready to Implement

1. Choose LLM provider (recommend: Anthropic Claude)
2. Set up Google Secret Manager and add API key
3. Create `chat-backend/` directory and implement Phase 1
4. Deploy backend to Cloud Run (Phase 2)
5. Build frontend chat UI (Phase 3)
6. Deploy updated frontend (Phase 4)
7. Test thoroughly and optimize (Phase 5)

## Useful Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Secret Manager](https://cloud.google.com/secret-manager/docs)
- [React Chatbot UI Examples](https://github.com/topics/react-chatbot)
