# Open Issues — Friendlinq

## 1. Friends Tab Feed — 401 Unauthorized (BACKEND)

**Status:** Broken on BOTH web AND mobile
**Since:** App was taken out of mothballs ~March 2026 — has never worked since
**Severity:** High — entire Friends feed is non-functional on both platforms

**Symptom:**
- Friends tab shows empty feed on web (friendlinq.com) and iOS app
- Network tab shows: `POST /api/post/getAllFriendsPost` returns **401 Unauthorized**
- Community tab works fine (uses .NET API at unpokedfolks.com)
- Post creation works fine (uses Node API at natural.friendlinq.com)
- Other Node API endpoints work (createPost, postComment, notifications)
- The auth token IS valid — it works for other Node endpoints using the same token

**Backend details:**
- Endpoint: `https://natural.friendlinq.com/api/post/getAllFriendsPost`
- Method: POST with FormData (skip, limit) + authorization header
- Server: Node.js API on natural.friendlinq.com
- Auth: Token passed via `authorization` header (same interceptor as all other Node calls)

**Root cause (suspected):**
- Server-side auth middleware bug on this specific route
- Expired secret/key used for token validation on this route
- Route misconfiguration (different auth middleware than other routes)
- The endpoint may require a different auth format than other endpoints

**Cannot be fixed from frontend code.** Requires backend investigation on the Node.js server.

**To investigate:**
- Check the Node.js server logs for 401 errors on `/api/post/getAllFriendsPost`
- Compare the auth middleware on this route vs `/api/v1/post/createPost` (which works)
- Check if the route was changed or a dependency updated during the mothball period
- Backend code is in: `C:\Projects\Friendlinq_backend code\Friendlinq_backend code\NodeCode\BackendNodeCode.zip` (contains a .rar inside)
