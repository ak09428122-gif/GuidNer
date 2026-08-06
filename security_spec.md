# Firebase Security Specification

## Data Invariants
1. A user can only read, write, update, and delete their own profile (`/users/{userId}`) and their subcollections (`tasks`, `chatSessions`, `messages`, `vaultItems`).
2. An unauthenticated user cannot access any documents in Firestore.
3. Users cannot modify another user's `uid` or `userId` in any document.
4. Timestamps must be validated or set accurately.
5. All IDs must pass format checks (`isValidId`).
6. All string fields have strict maximum length limits to prevent DoS/wallet exhaustion attacks.

## The Dirty Dozen Payloads (Negative Tests)
1. **Unauthenticated Read**: Request `/users/user123` with no auth context -> REJECT
2. **Cross-User Profile Write**: Auth UID `userA` attempting setDoc on `/users/userB` -> REJECT
3. **Invalid ID Format**: Write document with ID containing special script chars (`/users/userA/tasks/<script>alert(1)</script>`) -> REJECT
4. **Oversized Field**: Task title exceeding 200 characters -> REJECT
5. **Spoofed User ID**: Task payload where `userId` is set to `userB` inside `/users/userA/tasks/task1` -> REJECT
6. **Unknown Field Injection (Shadow Field)**: Task document with unapproved field `isAdmin: true` -> REJECT
7. **Type Mismatch**: Task `completed` set to string `"true"` instead of boolean `true` -> REJECT
8. **Unauthenticated List**: Querying `/users` collection group with no auth -> REJECT
9. **Cross-User Subcollection Read**: Auth UID `userA` reading `/users/userB/chatSessions/session1` -> REJECT
10. **Chat Message Session Mismatch**: Writing message with `sessionId: "sess2"` inside `/users/userA/chatSessions/sess1/messages/msg1` -> REJECT
11. **Vault Item Oversized Data**: Encrypted payload exceeding 10000 characters -> REJECT
12. **Immutable Field Modification**: Attempting to change `userId` or `createdAt` on update -> REJECT
