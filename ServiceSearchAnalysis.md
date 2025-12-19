# Talentro Service Search System Analysis

This document provides a comprehensive analysis of the Service Search and Management system in Talentro, covering both user-specific management and platform-wide discovery.

---

## 1. Management vs. Discovery

The system uses two distinct controllers to handle service data depending on the context:

- **`service.controller.js` (Management)**: Used for the "My Services" dashboard. It handles CRUD (Create, Read, Update, Delete) operations specifically for the logged-in user's own services.
- **`search.controller.js` (Discovery)**: Used for the platform-wide marketplace search. This is where users find services from _other_ people using filters, queries, and relevance sorting.

---

## 2. Platform-Wide Search Architecture (`search.controller.js`)

The `search` endpoint is a multi-purpose tool that processes services alongside people and jobs.

### Search Criteria

When searching for services, the system evaluates the following:

- **`q` (Query)**: Scans for keywords in the service `name`, `description`, `category`, `requirements`, and `location` (city/country).
- **`category`**: Filters results by specific industries like "Programming & Tech", "Design & Creative", etc.
- **`location`**: Filters by city and country using regex for partial matches.
- **`mode`**: Filters based on the `modesAvailable` field (`paid`, `barter`, or `hybrid`).
- **`isActive`**: Only services where `isActive: true` are returned to the public marketplace.

### Relevance Scoring Logic

A unique feature of the search system is its manual relevance scoring. When sorting by **`relevance`**, the system calculates a score for each match:

- Matches in the **Service Name** are weighted highest (x3 multiplier).
- Matches in the **Location** (City) are weighted medium (x2 multiplier).
- Matches in the **Description** are weighted lower (x1 multiplier).
- The **position** of the match also matters: matches appearing earlier in the text (closer to index 0) receive higher scores.

---

## 3. Autocomplete and Suggestions

To improve user experience, the system provides real-time suggestions via the `searchSuggestions` endpoint:

- It returns up to 5 service matches as the user types (minimum 2 characters).
- It also returns distinct **Categories**, **Skills**, and **Locations** found in the database that match the prefix, allowing the user to select valid filter values instantly.

---

## 4. Data Model Optimization (`Service.model.js`)

### Database Indexing

The search is supported by several strategic indexes to ensure performance:

- **`userId: 1`**: Fast lookup for a specific user's services.
- **`category: 1, isActive: 1`**: Optimizes the primary marketplace browse path.
- **`exchangeMode: 1`**: Bridges the gap between traditional payment and the barter system.
- **`location.coordinates: "2dsphere"`**: Supports potential future features like "Services near me."

### User-Specific Limits

The backend enforces business rules during the `pre('save')` hook:

- **Free User Limit**: Users on the free tier are restricted to **4 active services**.
- The system checks the `isActive` count before allowing a new service to be saved, preventing limit bypasses.

---

## 5. UI Enrichment

When services are returned in search results, they are automatically enriched:

- **Provider Profiles**: The search controller fetches and attaches the `providerProfile` for each service author, including their full name, headline, and profile image.
- **Virtual Pricing**: The `pricingDisplay` virtual is used to generate a human-readable string (e.g., "$50/hour | 5 credits/hour") based on the complex breakdown of `paidPrice`, `creditsPerUnit`, and `modesAvailable`.
