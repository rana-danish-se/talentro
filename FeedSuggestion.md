# Talentro Feed System Analysis

This document provides a detailed technical breakdown of how the Feed System is architected in Talentro, covering the data models, backend generation logic, and frontend rendering.

---

## 1. Data Model (`Post.model.js`)

The foundation of the feed is the `Post` model. It is designed to handle rich content and multi-dimensional engagement.

- **Author Tracking**: Links to the `User` model via `authorId`.
- **Content Structure**:
  - `text`: Supports up to 3000 characters.
  - `media`: An array of objects supporting both `image` and `video` formats with URLs and durations.
- **Visibility Control**: Supports `public`, `connections`, and `group` visibility levels, which the feed controller uses to filter access.
- **Engagement Metrics**:
  - Tracks specific reaction types (`like`, `love`, `celebrate`, `support`, `insightful`, `funny`).
  - Tracks `commentsCount` and `likesCount`.
  - Includes a virtual `totalEngagement` (likes + comments) and `totalReactions`.
- **Advanced Features**: Includes fields for `isPinned`, `isScheduled` (Premium), and analytics like `viewsCount` and `engagementRate`.

---

## 2. Backend Feed Generation (`feed.controller.js`)

The `getFeed` controller implements a sophisticated **Priority-Based Suggestion Algorithm**. Instead of a simple chronological list, it builds a personalized experience based on the user's professional profile.

### The Categorization Process

The system first identifies various clusters of users related to the currently logged-in user:

- **Direct Connections**: People the user has accepted connections with.
- **Industry Cluster**: Users in the same `industry`.
- **Location Cluster**: Users in the same `city` or `country`.
- **Skill Cluster**: Users who share at least one skill.
- **Field Cluster**: Users with similar job titles/fields.

### The Priority Hierarchy

Posts are fetched in "Groups" with decreasing priority and different visibility rules:

| Priority | Group                  | Visibility Logic                                                                |
| :------- | :--------------------- | :------------------------------------------------------------------------------ |
| **1**    | **Direct Connections** | Posts from connections (Public + Connections visibility). Shuffled for variety. |
| **2**    | **Same Industry**      | Public posts from users in the same industry.                                   |
| **3**    | **Same Location**      | Public posts from users in the same City (higher) or Country.                   |
| **4**    | **Shared Skills**      | Public posts from users with overlapping skills.                                |
| **5**    | **Same Field**         | Public posts from users in the same professional field.                         |
| **6**    | **Mutual Connections** | Public posts from 2nd-degree connections (friends of friends).                  |
| **7**    | **Global Public**      | Remaining public posts from across the platform.                                |
| **8**    | **Own Posts**          | The user's own posts are placed at the very end of the feed.                    |

### Post Processing Pipeline

1. **Deduplication**: Since a user might fall into multiple categories (e.g., a connection who is also in the same city), the controller uses a `Set` to ensure each post ID appears only once.
2. **Profile Enrichment**: The `formatPosts` helper fetches `Profile` data for every author to inject names, headlines, and avatars.
3. **Reaction Context**: The system checks if the _current user_ has reacted to each post and with which emoji, allowing the UI to show the "active" state.
4. **Comment Population**: The feed pre-loads the top 2 comments for each post to encourage immediate interaction.

---

## 3. Frontend Orchestration (`Feed.jsx`)

The frontend manages how these fetched posts are displayed and sorted.

- **State Management**: Uses `PostContext` to manage the global state of the feed.
- **Sorting Mechanisms**:
  - **Recent**: Sorts by `createdAt` timestamp (Client-side).
  - **Top**: Sorts by engagement score (`likesCount + commentsCount`).
- **Conditional Rendering**: Displays a "No posts found" state if the user has no connections and no suggested content matches, nudging them to "Find People".

---

## 4. UI Rendering (`PostCard.jsx`)

The `PostCard` is a complex interactive component that powers the social experience.

- **Dynamic Header**: Displays the author's slug-based link (fixed typo from `/dasboard` to `/dashboard`), headline, and visibility icon (Globe, Users, or Lock).
- **Media Support**: Automatically switches layout based on the number of images (grid) or if content is a video.
- **Micro-Interactions**:
  - **Reactions Popup**: Uses `framer-motion` for a smooth, LinkedIn-style reaction picker on hover.
  - **Optimistic Updates**: When a user reacts, the UI updates locally immediately, then syncs with the API, reverting only if the request fails.
- **Stats Bar**: Summarizes engagement with small icons of the top 3 reaction types used on that post.
- **Time Formatting**: Uses a custom `getTimeSince` helper (e.g., "5m", "2h", "3d") to keep the UI clean.

---

## Summary of Recent Fixes

- **User Link Fix**: Corrected the URL typo in `PostCard.jsx` that was causing 404s on user profile links.
- **Avatar Path Fix**: Corrected the default avatar path from `/asset/...` to `/assets/...` to prevent 500 image loader errors.
- **Ghost Connections**: Updated `getUserConnections` to show placeholder cards for deleted accounts, ensuring the connection count matches the displayed cards.
