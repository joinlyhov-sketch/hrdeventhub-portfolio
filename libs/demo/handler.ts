/* eslint-disable @typescript-eslint/no-explicit-any */
// Flexible records mirror the backend's different response shapes at this boundary.
import { createDemoData } from "./seed";
import { DEMO_TOKEN, DEMO_USER_ID } from "./config";

export type DemoChanges = Record<string, Record<string, any> | null>;
const keys: Record<string, string> = { users: "appUserId", profiles: "profileId", workspaces: "workspaceId", posts: "postId", polls: "pollId", surveys: "surveyId", participants: "participantId", transactions: "id", conversations: "id", messages: "id", notifications: "notificationId", generations: "generationId", comments: "commentId", submissions: "responseId", endorsements: "endorsementId", invitations: "invitationId", reactions: "id", checkins: "id" };

export function handleDemoRequest(path: string, method = "GET", body: any = {}, changes: DemoChanges = {}) {
  const url = new URL(path, "https://demo.local");
  const parts = url.pathname.split("/").filter(Boolean);
  const [root, id, action] = parts;
  const seed = createDemoData();
  const db: Record<string, any[]> = structuredClone(seed);
  for (const [key, value] of Object.entries(changes)) {
    const [table, entityId] = key.split(":");
    if (!db[table]) continue;
    db[table] = db[table].filter(item => String(item[keys[table]]) !== entityId);
    if (value) db[table].push(value);
  }
  db.posts = db.posts.filter(p => db.workspaces.some(w => w.workspaceId === p.workspaceId));
  db.participants = db.participants.filter(p => db.posts.some(post => post.postId === p.postId));
  const now = new Date().toISOString();
  const writing = method !== "GET";
  const wrap = (payload: any) => ({ success: true, message: "Demo action completed", status: "OK", payload, timestamp: now });
  const list = (items: any[]) => {
    const page = Math.max(1, Number(url.searchParams.get("page") || 1));
    const size = Math.max(1, Number(url.searchParams.get("size") || 100));
    return items.slice((page - 1) * size, page * size);
  };
  const find = (table: string, entityId: string) => {
    const item = db[table].find(item => String(item[keys[table]]) === entityId);
    if (!item) throw new Error("This demo item was not found.");
    return item;
  };
  const save = (table: string, item: any) => {
    changes[`${table}:${item[keys[table]]}`] = item;
    return wrap(item);
  };
  const remove = (table: string, entityId: string) => { changes[`${table}:${entityId}`] = null; return wrap(null); };
  const newId = () => crypto.randomUUID();
  const me = find("users", DEMO_USER_ID);
  const creator = { userId: DEMO_USER_ID, fullName: `${me.firstName} ${me.lastName}`, profilePicture: me.profilePicture, role: "ADMIN" };

  if (root === "auths") {
    if (["login", "refresh"].includes(id)) return wrap({ token: DEMO_TOKEN, refreshToken: "demo-refresh" });
    if (id === "me") return writing ? save("users", { ...me, ...body }) : wrap(me);
    return wrap(id === "verify-forgot-password" ? "demo-reset-token" : me);
  }
  if (root === "profile") {
    const profile = db.profiles.find(p => p.appUser.appUserId === (id === "me" ? DEMO_USER_ID : id));
    if (!profile) throw new Error("Demo profile not found.");
    profile.appUser = find("users", profile.appUser.appUserId);
    if (!writing) return wrap(profile);
    if (action === "preferences") profile.preferences = { ...profile.preferences, ...body };
    else if (action === "sharing-mode") profile.profileSharingMode = body.mode;
    else if (action === "cv") profile.cvResumeUrl = null;
    else Object.assign(profile, body);
    return save("profiles", profile);
  }
  if (root === "admin" && id === "users") {
    if (!action) return wrap(list(db.users));
    const user = find("users", action);
    if (writing) {
      const operation = parts[3];
      if (operation === "suspend") user.active = false;
      if (operation === "reactivate") user.active = true;
      if (operation === "role") user.role = body.role;
      return save("users", user);
    }
    return wrap(user);
  }
  if (root === "generations") return wrap(list(db.generations));
  if (root === "universities") return wrap([{ universityId: "rupp", name: "Royal University of Phnom Penh", abbreviation: "RUPP", logoUrl: "/images/rupp.png" }]);
  if (root === "workspaces") {
    if (!id || id === "me" || id === "generation") {
      if (method === "POST") { const workspaceId = newId(); return save("workspaces", { ...db.workspaces[0], ...body, workspaceId, id: workspaceId, isPinned: false, createdAt: now }); }
      let items = db.workspaces;
      const name = url.searchParams.get("name")?.toLowerCase();
      if (name) items = items.filter(w => w.name.toLowerCase().includes(name));
      if (url.searchParams.has("isPublic")) items = items.filter(w => w.isPublic === (url.searchParams.get("isPublic") === "true"));
      const generationId = id === "generation" ? action : url.searchParams.get("generationId");
      if (generationId) items = items.filter(w => w.generationId === generationId);
      return wrap(list(items));
    }
    const workspace = find("workspaces", id);
    if (action === "members") return wrap(db.users);
    if (action === "leave") return remove("workspaces", id);
    if (action === "pin") return save("workspaces", { ...workspace, isPinned: url.searchParams.get("isPinned") === "true" });
    if (action === "feed") {
      const items = [...db.posts, ...db.polls, ...db.surveys].filter(p => p.workspaceId === id && p.published !== false).map(data => ({
        id: data.postId || data.pollId || data.surveyId, type: data.pollId ? "POLL" : data.surveyId ? "SURVEY" : "POST", subType: data.category || (data.pollId ? "poll" : "survey"), title: data.title, description: data.description || data.content, createdAt: data.createdAt, postedAt: data.createdAt, new: false, data,
      }));
      return wrap(list(items));
    }
    if (action === "post") {
      const postId = parts[3];
      if (!postId) return wrap(list(db.posts.filter(p => p.workspaceId === id)));
      if (method === "POST") return save("posts", { ...db.posts[0], ...body, postId: newId(), workspaceId: id, category: postId, published: body.isPublished ?? true, pinned: body.isPinned ?? false, creator, createdAt: now, media: body.media || [], comments: [], commentCount: 0 });
      const post = find("posts", postId);
      if (method === "DELETE") return remove("posts", postId);
      if (writing) return save("posts", { ...post, ...body, published: parts[4] === "publish" ? true : body.isPublished ?? post.published, pinned: parts[4] === "pin" ? url.searchParams.get("pinned") === "true" : body.isPinned ?? post.pinned, updatedAt: now });
      return wrap(post);
    }
    if (method === "DELETE") return remove("workspaces", id);
    return writing ? save("workspaces", { ...workspace, ...body }) : wrap(workspace);
  }
  if (root === "posts" && id === "events") return wrap(action ? find("posts", action) : list(db.posts.filter(p => p.category === "event")));
  if (root === "posts" && id === "participants") {
    let items = db.participants.map(p => ({ ...p, post: find("posts", p.postId) }));
    if (action === "me") items = items.filter(p => p.appUserId === DEMO_USER_ID);
    if (action === "user") items = items.filter(p => p.appUserId === parts[3]);
    return wrap(list(items));
  }
  if (root === "posts" && action === "participants") {
    if (writing) {
      const existing = db.participants.find(p => p.postId === id && p.appUserId === DEMO_USER_ID);
      return save("participants", existing || { participantId: newId(), postId: id, post: find("posts", id), appUserId: DEMO_USER_ID, user: me, registeredAt: now, paymentStatus: "paid", remark: body.remark || "", registrationToken: `ticket-${id}` });
    }
    return wrap(list(db.participants.filter(p => p.postId === id)));
  }
  if (root === "posts" && (action === "comments" || id === "comments")) {
    if (id === "comments") {
      const comment = find("comments", action);
      if (method === "DELETE") return remove("comments", action);
      if (parts[3] === "replies") return save("comments", { ...comment, replies: [...comment.replies, { ...comment, ...body, commentId: newId(), replies: [], createdAt: now }] });
      return save("comments", { ...comment, ...body, updatedAt: now });
    }
    if (!writing) return wrap(db.comments.filter(c => c.postId === id));
    return save("comments", { commentId: newId(), postId: id, ...body, appUser: me, mentionedUserId: body.mentionedUserId || { userIds: [] }, replies: [], createdAt: now, updatedAt: now });
  }
  if ((root === "posts" || root === "comment") && action === "reactions") {
    const reactionId = `${root}-${id}`;
    if (method === "DELETE") return remove("reactions", reactionId);
    if (writing) return save("reactions", { id: reactionId, reactionId, ...body, createdAt: now, postId: id, commentId: id, reactor: { ...me, profileImage: me.profilePicture } });
    return wrap(db.reactions.filter(r => r.id === reactionId));
  }
  if (root === "polls" || root === "survey") {
    const table = root === "polls" ? "polls" : "surveys";
    const key = keys[table];
    if (id === "workspace") return wrap(list(db[table].filter(p => p.workspaceId === action)));
    if (!id) {
      if (writing) return save(table, { ...body, [key]: newId(), appUserId: DEMO_USER_ID, createdAt: now, options: body.options?.map((o: any) => ({ id: newId(), text: typeof o === "string" ? o : o.text, voteCount: 0 })) });
      return wrap(list(db[table]));
    }
    const item = find(table, id);
    if (action === "vote") {
      const selected = body.optionIds || [];
      return save(table, { ...item, hasVoted: true, selectedOptionIds: selected, votedOptionIds: selected, totalVotes: item.totalVotes + (item.hasVoted ? 0 : 1), options: item.options.map((o: any) => ({ ...o, voteCount: (o.voteCount || 0) - (item.selectedOptionIds?.includes(o.id) ? 1 : 0) + (selected.includes(o.id) ? 1 : 0) })) });
    }
    if (action === "voters") return wrap([]);
    if (action === "results") return wrap(item);
    if (action === "options") return wrap(item.options);
    if (action === "submit") {
      const existing = db.submissions.find(s => s.surveyId === id && s.appUserId === DEMO_USER_ID);
      return save("submissions", { responseId: existing?.responseId || newId(), surveyId: id, appUserId: DEMO_USER_ID, username: me.username, content: body.content, submittedAt: now });
    }
    const submissions = db.submissions.filter(s => s.surveyId === id);
    if (action === "submitted") return wrap(submissions.some(s => s.appUserId === DEMO_USER_ID));
    if (action === "responses") {
      if (parts[3] === "count") return wrap(submissions.length);
      if (parts[3] === "me") return wrap(submissions.find(s => s.appUserId === DEMO_USER_ID) || null);
      return wrap(parts[3] ? find("submissions", parts[3]) : list(submissions));
    }
    if (method === "DELETE") return remove(table, id);
    const options = table === "polls" && body.options ? body.options.map((option: any, index: number) => ({ id: item.options[index]?.id || newId(), text: typeof option === "string" ? option : option.text, voteCount: item.options[index]?.voteCount || 0 })) : item.options;
    return writing ? save(table, { ...item, ...body, ...(table === "polls" ? { options } : {}), updatedAt: now }) : wrap(item);
  }
  if (root === "notifications") {
    if (!writing) return wrap(db.notifications);
    db.notifications.filter(n => id === "read-all" || n.notificationId === id).forEach(n => save("notifications", { ...n, isRead: true }));
    return wrap(null);
  }
  if (root === "presence") return wrap(Object.fromEntries((Array.isArray(body) ? body : []).map(appUserId => [appUserId, { appUserId, status: "ONLINE", label: "Online" }])));
  if (root === "chat") {
    if (id === "users") return wrap(db.users.filter(u => `${u.firstName} ${u.lastName} ${u.username}`.toLowerCase().includes((url.searchParams.get("name") || "").toLowerCase())));
    if (id === "conversations") {
      if (action && parts[3] === "messages") {
        if (!writing) return wrap(db.messages.filter(m => m.conversationId === action));
        const message = { id: newId(), conversationId: action, senderId: DEMO_USER_ID, senderName: creator.fullName, content: body.content, read: false, createdAt: now };
        save("conversations", { ...find("conversations", action), lastMessage: body.content, lastMessageAt: now });
        return save("messages", message);
      }
      if (method === "DELETE") return remove("conversations", action);
      if (method === "POST") {
        const target = url.searchParams.get("targetName");
        const user = db.users.find(u => u.username === target || `${u.firstName} ${u.lastName}` === target || u.appUserId === target) || db.users[1];
        const existing = db.conversations.find(c => c.otherUserId === user.appUserId);
        return existing ? wrap(existing) : save("conversations", { id: newId(), otherUserId: user.appUserId, otherUserName: `${user.firstName} ${user.lastName}`, otherUserAvatar: user.profilePicture, unreadCount: 0, createdAt: now });
      }
      return wrap(db.conversations);
    }
    if (id === "messages") {
      if (method === "DELETE") return remove("messages", action);
      return save("messages", { ...find("messages", action), ...body, isEdited: true });
    }
  }
  if (root === "payments") {
    if (id === "transactions") return wrap(action === "detail" ? find("transactions", parts[3]) : list(db.transactions));
    if (["credential", "notify"].includes(id)) return wrap(null);
    throw new Error("Demo payments are simulated. No real payment or bank connection is required.");
  }
  if (root === "tickets") {
    if (action === "attendees") return wrap(db.participants.map(p => ({ ...p.user, ticketId: p.registrationToken, postId: p.postId, postTitle: p.post.title, eventStart: p.post.eventStart, eventEnd: p.post.eventEnd, workspaceId: p.post.workspaceId, workspaceName: find("workspaces", p.post.workspaceId).name, role: p.user.role, ticketStatus: db.checkins.some(c => c.id === p.registrationToken) ? "CHECKED_IN" : "PENDING", checkedInAt: null, createdAt: p.registeredAt })));
    if (action === "verify") {
      const ticket = db.participants.find(p => p.registrationToken === url.searchParams.get("token"));
      if (!ticket) throw new Error("Use a sample ticket from the demo attendee list.");
      save("checkins", { id: ticket.registrationToken });
      return wrap({ attendeeName: `${ticket.user.firstName} ${ticket.user.lastName}`, postTitle: ticket.post.title, checkedInAt: now });
    }
  }
  if (root === "endorsements") return writing ? save("endorsements", { ...body, endorsementId: newId(), createdAt: now }) : wrap(db.endorsements);
  if (root === "invitations") {
    if (writing) return save("invitations", { ...body, invitationId: newId(), token: "demo", inviteLink: "/join/demo", createdAt: now, expiredAt: seed.surveys[0].closingTime });
    return wrap({ workspaceName: db.workspaces[0].name, workspaceDescription: db.workspaces[0].description, generationName: "14th Generation", memberCount: db.users.length, members: db.users, expiredAt: seed.surveys[0].closingTime, public: true });
  }
  if (root === "files") throw new Error("File uploads are unavailable in this demo. Please use the included sample images.");
  if (root === "telegram-bot") throw new Error("Telegram connections are unavailable in this demo.");
  throw new Error(`Demo operation is not available: ${method} ${url.pathname}`);
}
