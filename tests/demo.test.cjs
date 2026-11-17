const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const Module = require("node:module");

// Compile only the pure demo modules in memory; no server or database is needed.
function load(file) {
  const filename = path.resolve(__dirname, "../libs/demo", `${file}.ts`);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = module.paths;
  mod.require = (name) => name.startsWith("./") ? load(name.slice(2)) : require(name);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
  return mod.exports;
}
const { handleDemoRequest: request } = load("handler");

test("fixtures link workspaces, events, profiles, and attendees", () => {
  const groups = request("/workspaces").payload;
  assert.equal(groups.length, 3);
  const events = request("/posts/events").payload;
  assert.equal(events.length, 3);
  for (const event of events) {
    assert.ok(groups.some(g => g.workspaceId === event.workspaceId));
    assert.ok(request(`/workspaces/${event.workspaceId}/post/${event.postId}`).payload.title);
    assert.equal(request(`/posts/${event.postId}/participants`).payload.length, 3);
    for (const media of event.media) assert.ok(fs.existsSync(path.resolve(__dirname, "../public", media.filePath.slice(1))));
  }
  assert.equal(request("/profile/demo-admin").payload.roles, "ADMIN");
  assert.equal(request("/workspaces/hrd-community/feed").payload.length, 4);
  assert.equal(request("/workspaces?page=2&size=100").payload.length, 0);
  assert.equal(request("/workspaces?name=alumni").payload.length, 1);
});

test("workspace and post edits persist only in the visitor's changes", () => {
  const changes = {};
  const group = request("/workspaces", "POST", { name: "Demo club" }, changes).payload;
  assert.ok(request("/workspaces", "GET", {}, changes).payload.some(g => g.workspaceId === group.workspaceId));
  const post = request(`/workspaces/${group.workspaceId}/post/article`, "POST", { title: "My story", content: "Hello", isPublished: true }, changes).payload;
  request(`/workspaces/${group.workspaceId}/post/${post.postId}/article`, "PATCH", { title: "Updated story" }, changes);
  assert.equal(request(`/workspaces/${group.workspaceId}/feed`, "GET", {}, changes).payload[0].title, "Updated story");
  assert.equal(request("/workspaces").payload.length, 3);
  request(`/workspaces/${group.workspaceId}/post/${post.postId}`, "DELETE", {}, changes);
  assert.equal(request(`/workspaces/${group.workspaceId}/feed`, "GET", {}, changes).payload.length, 0);
});

test("votes survive reload and changing a vote does not increase the total", () => {
  const changes = {};
  request("/polls/poll-workshop/vote", "POST", { optionIds: ["react"] }, changes);
  const voted = request("/polls/poll-workshop", "GET", {}, changes).payload;
  assert.equal(voted.totalVotes, 27);
  assert.equal(voted.options[0].voteCount, 13);
  request("/polls/poll-workshop/vote", "POST", { optionIds: ["java"] }, changes);
  const updated = request("/polls/poll-workshop", "GET", {}, changes).payload;
  assert.equal(updated.totalVotes, 27);
  assert.equal(updated.options[0].voteCount, 12);
  assert.equal(updated.options[1].voteCount, 9);
});

test("comments, reactions, survey submissions, and notification reads persist", () => {
  const changes = {};
  const comment = request("/posts/event-workshop/comments", "POST", { comment: "Looking forward to it" }, changes).payload;
  request(`/posts/comments/${comment.commentId}/replies`, "POST", { comment: "See you there" }, changes);
  assert.equal(request("/posts/event-workshop/comments", "GET", {}, changes).payload[0].replies.length, 1);
  request("/posts/event-workshop/reactions", "POST", { type: "like" }, changes);
  assert.equal(request("/posts/event-workshop/reactions", "GET", {}, changes).payload[0].reactor.appUserId, "demo-admin");
  request("/survey/survey-community/submit", "POST", { content: { experience: "Excellent" } }, changes);
  assert.equal(request("/survey/survey-community/responses/count", "GET", {}, changes).payload, 1);
  assert.equal(request("/survey/survey-community/submitted", "GET", {}, changes).payload, true);
  request("/notifications/read-all", "PATCH", {}, changes);
  assert.equal(request("/notifications", "GET", {}, changes).payload[0].isRead, true);
});

test("chat sends, edits and deletes without a websocket", () => {
  const changes = {};
  const message = request("/chat/conversations/conversation-demo/messages", "POST", { content: "Hello!" }, changes).payload;
  request(`/chat/messages/${message.id}`, "PATCH", { content: "Hello again!" }, changes);
  assert.equal(request("/chat/conversations/conversation-demo/messages", "GET", {}, changes).payload.at(-1).content, "Hello again!");
  request(`/chat/messages/${message.id}`, "DELETE", {}, changes);
  assert.equal(request("/chat/conversations/conversation-demo/messages", "GET", {}, changes).payload.length, 1);
});

test("registration is idempotent and ticket check-in persists", () => {
  const changes = {};
  const registration = request("/posts/event-workshop/participants", "POST", { remark: "Joining the demo" }, changes).payload;
  request("/posts/event-workshop/participants", "POST", {}, changes);
  assert.equal(request("/posts/event-workshop/participants", "GET", {}, changes).payload.length, 4);
  request(`/tickets/admin/verify?token=${registration.registrationToken}`, "POST", {}, changes);
  const ticket = request("/tickets/admin/attendees", "GET", {}, changes).payload.find(t => t.ticketId === registration.registrationToken);
  assert.equal(ticket.ticketStatus, "CHECKED_IN");
});

test("unsupported integrations fail explicitly instead of contacting real services", () => {
  assert.throws(() => request("/payments/qr/generate", "POST"), /Demo payments/);
  assert.throws(() => request("/files/upload", "POST"), /uploads are unavailable/);
  assert.throws(() => request("/unknown"), /not available/);
});
