import { DEMO_USER_ID } from "./config";

export function createDemoData() {
  const now = new Date();
  const date = (days: number, hour = 9) => {
    const value = new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour);
    return value.toISOString();
  };
  const createdAt = date(-7);
  const generation = { generationId: "gen-14", name: "14th Generation", year: String(now.getFullYear()), isCurrent: true, createdAt, updatedAt: createdAt };
  const users = [
    [DEMO_USER_ID, "Sok", "Dara", "ADMIN", "profile.png"],
    ["demo-organizer", "Chan", "Sreynit", "ORGANIZER", "sreynit.png"],
    ["demo-student", "Kim", "Veasna", "STUDENT", "veasna.jpg"],
    ["demo-alumni", "Lim", "Nika", "ALUMNI", "nika.png"],
  ].map(([appUserId, firstName, lastName, role, photo]) => ({
    appUserId, username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`, firstName, lastName,
    email: `${firstName.toLowerCase()}@eventhub.example`, gender: "OTHER", dateOfBirth: "2002-05-15",
    phoneNumber: "+85512345678", active: true, verified: true, telegramSubscribed: false,
    role, profilePicture: `/images/${photo}`, generation, createdAt, updatedAt: createdAt,
  }));
  const profiles = users.map((appUser) => ({
    profileId: `profile-${appUser.appUserId}`, bio: "Learning, building, and connecting with the HRD community.",
    profilePicture: appUser.profilePicture, major: "Software Engineering", cvResumeUrl: null,
    profileSharingMode: "PUBLIC", currentStatus: "Studying", roles: appUser.role,
    education: [{ institutionName: "Royal University of Phnom Penh", institutionAbbreviation: "RUPP", institutionLogo: "/images/rupp.png", degree: "Computer Science", startYear: 2022, endYear: null, isCurrent: true }],
    skills: ["React", "Java", "Teamwork"], socialAccount: [], generation, appUser,
    preferences: Object.fromEntries(["Email", "PhoneNumber", "Birthdate", "Gender", "Bio", "ProfilePicture", "Major", "CurrentStatus", "Cv", "Education", "Skills", "Social", "Generation"].map(key => [`show${key}`, true])),
  }));
  const workspaces = [
    { workspaceId: "hrd-community", name: "HRD Community", description: "Events, announcements, and stories from our community.", isPublic: true, isPinned: true },
    { workspaceId: "generation-14", name: "14th Generation", description: "Learn together, share ideas, and celebrate your journey.", isPublic: false, isPinned: true },
    { workspaceId: "alumni-network", name: "Alumni Network", description: "Stay connected with HRD graduates and discover new opportunities.", isPublic: true, isPinned: false },
  ].map(workspace => ({ ...workspace, id: workspace.workspaceId, generationId: generation.generationId, generationName: generation.name, createdBy: DEMO_USER_ID, createdAt, updatedAt: createdAt, telegramChannelUrl: "" }));
  const creator = { userId: DEMO_USER_ID, fullName: "Sok Dara", profilePicture: users[0].profilePicture, role: "ADMIN" };
  const posts = [
    ["event-workshop", "event", "Build Your First Full Stack App", "Join a hands-on workshop with HRD mentors. Bring your laptop and build something together.", "Workshop.webp", 3, "hrd-community"],
    ["event-sports", "event", "HRD Community Sports Day", "A day of friendly matches, teamwork, and fun for all generations.", "sport.png", 8, "generation-14"],
    ["event-alumni", "event", "Alumni Career Meetup", "Meet graduates, hear their stories, and explore your next career step.", "alumni.png", 14, "alumni-network"],
    ["announcement-welcome", "announcement", "Welcome to the HRD EventHub demo", "Explore groups, join an event, vote in a poll, or create your own post. All information here is sample data.", "closingDay.png", 1, "hrd-community"],
    ["article-learning", "article", "Five ways to make the most of your HRD journey", "Share what you learn, ask thoughtful questions, build with friends, attend community events, and keep in touch with alumni. Every connection is a chance to grow.", "codingchallenge.png", 2, "generation-14"],
  ].map(([postId, category, title, content, image, offset, workspaceId]) => ({
    postId: String(postId), workspaceId: String(workspaceId), category: String(category), title: String(title), content: String(content),
    purpose: "Connect and learn with the HRD community", status: "active", published: true, pinned: postId === "event-workshop",
    scheduledAt: null, expiresAt: date(30), eventStart: date(Number(offset)), eventEnd: date(Number(offset), 16),
    createdAt, updatedAt: createdAt, appUserId: DEMO_USER_ID, creator, comments: [], commentCount: 0,
    location: { locationId: "hrd-campus", locationName: "Korea Software HRD Center, Phnom Penh", googleMapUrl: "https://maps.google.com/?q=Korea+Software+HRD+Center", latitude: 11.5757, longitude: 104.889 },
    media: [{ mediaId: `media-${postId}`, filePath: `/images/${image}`, fileName: String(image), fileType: "image", isCover: true, createdAt }],
    payment: { postPaymentId: `payment-${postId}`, paymentType: "free", paymentAmount: 0, donationGoal: 0, amountRaised: 0, paymentAccId: "demo", createdAt, updatedAt: createdAt },
  }));
  const polls = [{ pollId: "poll-workshop", workspaceId: "hrd-community", appUserId: DEMO_USER_ID, title: "What should our next workshop cover?", description: "Help us plan the next community session.", type: "single", options: [{ id: "react", text: "React and Next.js", voteCount: 12 }, { id: "java", text: "Spring Boot", voteCount: 8 }, { id: "design", text: "UI/UX design", voteCount: 6 }], closingTime: date(20), multiSelect: false, anonymousVoting: false, allowAddOptions: false, hiddenPoll: false, showResult: "always", hasVoted: false, selectedOptionIds: [], votedOptionIds: [], totalVotes: 26, createdAt, updatedAt: createdAt }];
  const surveys = [{ surveyId: "survey-community", workspaceId: "hrd-community", appUserId: DEMO_USER_ID, title: "Community Event Feedback", description: "Tell us how we can make our events better.", isActive: true, closingTime: date(30), createdAt,
    content: { title: "Community Event Feedback", pages: [{ name: "page1", title: "Your experience", elements: [{ name: "experience", type: "radiogroup", title: "How was your experience?", choices: ["Excellent", "Good", "Could be better"] }, { name: "suggestions", type: "comment", title: "What would you like to see next?" }] }] } }];
  const participants = posts.filter(p => p.category === "event").flatMap(post => (post.postId === "event-workshop" ? users.slice(1) : users.slice(0, 3)).map((user, i) => ({
    participantId: `participant-${post.postId}-${i}`, postId: post.postId, post, appUserId: user.appUserId, user,
    registeredAt: createdAt, remark: "Demo registration", paymentStatus: "paid", registrationToken: `ticket-${post.postId}-${i}`,
  })));
  const transactions = [{ id: "transaction-demo", billNo: "DEMO-0001", transactionId: 1001, transactionDate: date(-2).slice(0, 10), transactionTime: "09:30:00", payerAccountNo: "DEMO-ACCOUNT", payerName: "Sok Dara", currencyCode: "USD", paymentMethod: "DEMO", amount: 5, senderBankName: "Demo Bank", senderAccountName: "Sok Dara", settlementDate: date(-2).slice(0, 10), settlementTime: "09:30:00", settlementStatus: "SUCCESS", remark: "Sample event contribution", createdAt, appUserId: DEMO_USER_ID, postId: "event-workshop", username: users[0].username }];
  const conversations = [{ id: "conversation-demo", otherUserId: users[1].appUserId, otherUserName: "Chan Sreynit", otherUserAvatar: users[1].profilePicture, lastMessage: "Welcome! See you at the next community event.", lastMessageAt: createdAt, unreadCount: 1, createdAt }];
  const messages = [{ id: "message-welcome", conversationId: "conversation-demo", senderId: users[1].appUserId, senderName: "Chan Sreynit", content: conversations[0].lastMessage, read: false, createdAt }];
  const notifications = [{ notificationId: "notification-demo", recipientId: DEMO_USER_ID, type: "NEW_POST", workspaceId: "hrd-community", postId: "event-workshop", postTitle: posts[0].title, postCategory: "event", actorId: users[1].appUserId, actorName: "Chan Sreynit", actorAvatar: users[1].profilePicture, message: "A new workshop is open for registration.", isRead: false, createdAt }];
  return { users, profiles, workspaces, posts, polls, surveys, participants, transactions, conversations, messages, notifications, generations: [generation], comments: [], submissions: [], endorsements: [], invitations: [], reactions: [], checkins: [] };
}
