# Designer Marketplace API

A RESTful API for a freelance designer portfolio and marketplace platform, built with Node.js, Express.js, and a JSON file database.

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file and edit if needed
cp .env.example .env

# (Optional) regenerate seed data with fresh dates
npm run seed

# Run in development mode (with auto-reload)
npm run dev

# Run in production mode
npm start
```

The server starts at `http://localhost:5000` by default.

---

## Environment Variables

| Variable | Default | Description       |
|----------|---------|-------------------|
| `PORT`   | `5000`  | Port to listen on |

---

## Entities

### Designer
| Field          | Type     | Description                                      |
|----------------|----------|--------------------------------------------------|
| `id`           | string   | Unique identifier (UUID)                         |
| `name`         | string   | Full name                                        |
| `title`        | string   | e.g. "UI/UX Designer"                            |
| `bio`          | string   | Profile description                              |
| `avatar`       | string   | Avatar image URL                                 |
| `skills`       | string[] | e.g. `["Figma", "UI Design"]`                    |
| `hourlyRate`   | number   | Hourly rate                                      |
| `currency`     | string   | `AZN` / `USD`                                    |
| `experience`   | number   | Years of experience                              |
| `location`     | string   | City, country                                    |
| `email`        | string   | Contact email                                    |
| `phone`        | string   | Contact phone                                    |
| `behanceUrl`   | string   | Behance profile URL                              |
| `dribbbleUrl`  | string   | Dribbble profile URL                             |
| `instagramUrl` | string   | Instagram profile URL                            |
| `isAvailable`  | boolean  | Open to new orders                               |
| `isVerified`   | boolean  | Verified badge                                   |
| `rating`       | number   | Average rating (auto-calculated from reviews)    |
| `reviewsCount` | number   | Number of reviews (auto-updated)                 |
| `createdAt`    | string   | ISO 8601 timestamp                               |

### Project (portfolio work)
| Field        | Type     | Description                                                      |
|--------------|----------|------------------------------------------------------------------|
| `id`         | string   | Unique identifier (UUID)                                         |
| `designerId` | string   | Owner designer ID                                                |
| `title`      | string   | Project title                                                    |
| `description`| string   | Project description                                              |
| `category`   | string   | `ui-ux` / `branding` / `illustration` / `motion` / `print` / `other` |
| `images`     | string[] | Image URLs                                                       |
| `tags`       | string[] | Freeform tags                                                    |
| `tools`      | string[] | e.g. `["Figma", "Photoshop"]`                                    |
| `likes`      | number   | Like counter                                                     |
| `views`      | number   | View counter                                                     |
| `createdAt`  | string   | ISO 8601 timestamp                                               |

### Service
| Field          | Type     | Description                          |
|----------------|----------|--------------------------------------|
| `id`           | string   | Unique identifier (UUID)             |
| `designerId`   | string   | Owner designer ID                    |
| `title`        | string   | Service title                        |
| `description`  | string   | What the service covers              |
| `deliveryDays` | number   | Delivery time in days                |
| `price`        | number   | Fixed price                          |
| `currency`     | string   | `AZN` / `USD`                        |
| `includes`     | string[] | What's included                      |
| `tier`         | string   | `basic` / `standard` / `premium`     |

### Order
| Field          | Type   | Description                                            |
|----------------|--------|--------------------------------------------------------|
| `id`           | string | Unique identifier (UUID)                               |
| `serviceId`    | string | Ordered service ID                                     |
| `designerId`   | string | Derived automatically from the service                 |
| `clientName`   | string | Client's name                                          |
| `clientEmail`  | string | Client's email                                         |
| `requirements` | string | Brief / requirements text                              |
| `status`       | string | `pending` / `in-progress` / `completed` / `cancelled`  |
| `createdAt`    | string | ISO 8601 timestamp                                     |

### Review
| Field             | Type   | Description                       |
|-------------------|--------|-----------------------------------|
| `id`              | string | Unique identifier (UUID)          |
| `designerId`      | string | Reviewed designer ID              |
| `clientName`      | string | Reviewer's name                   |
| `rating`          | number | 1 to 5                            |
| `comment`         | string | Review text                       |
| `projectCategory` | string | Category the work belonged to     |
| `createdAt`       | string | ISO 8601 timestamp                |

---

## API Endpoints

### Designers

---

#### `GET /api/designers` — Get all designers

**Query Parameters**

| Param         | Type    | Description                                                        |
|---------------|---------|--------------------------------------------------------------------|
| `skill`       | string  | Exact skill match, case-insensitive (e.g. `Figma`)                 |
| `minRate`     | number  | Minimum hourly rate                                                |
| `maxRate`     | number  | Maximum hourly rate                                                |
| `isAvailable` | boolean | `true` / `false`                                                   |
| `category`    | string  | Designers with at least one portfolio project in this category     |
| `search`      | string  | Searches name, title, bio, and skills                              |
| `sort`        | string  | `rating` (high→low) / `price` (low→high) / `newest`                |

**Example Request**
```
GET /api/designers?skill=Figma&isAvailable=true&sort=rating
```

**Example Response** `200 OK`
```json
[
  {
    "id": "d-001",
    "name": "Aysel Mammadova",
    "title": "UI/UX Designer",
    "bio": "Product designer with a passion for clean, accessible interfaces...",
    "avatar": "https://i.pravatar.cc/200?u=d-001",
    "skills": ["UI Design", "UX Research", "Prototyping", "Design Systems", "Figma"],
    "hourlyRate": 40,
    "currency": "AZN",
    "experience": 6,
    "location": "Baku, Azerbaijan",
    "email": "aysel.mammadova@example.com",
    "phone": "+994 50 111 22 33",
    "behanceUrl": "https://behance.net/ayselmammadova",
    "dribbbleUrl": "https://dribbble.com/aysel_mm",
    "instagramUrl": "https://instagram.com/aysel.designs",
    "isAvailable": true,
    "isVerified": true,
    "rating": 4.8,
    "reviewsCount": 4,
    "createdAt": "2025-05-07T10:00:00.000Z"
  }
]
```

---

#### `GET /api/designers/:id` — Get a single designer

**Example Response** `200 OK` — full designer object (as above).

**Error Response** `404 Not Found`
```json
{ "error": "Designer not found" }
```

---

#### `POST /api/designers` — Create a designer profile

**Request Body**

| Field          | Type     | Required | Description                                  |
|----------------|----------|----------|----------------------------------------------|
| `name`         | string   | Yes      | Full name                                    |
| `title`        | string   | Yes      | Professional title                           |
| `hourlyRate`   | number   | Yes      | Hourly rate                                  |
| `email`        | string   | Yes      | Contact email                                |
| `bio`          | string   | No       | Default `""`                                 |
| `avatar`       | string   | No       | Auto-generated placeholder if omitted        |
| `skills`       | string[] | No       | Default `[]`                                 |
| `currency`     | string   | No       | `AZN` (default) or `USD`                     |
| `experience`   | number   | No       | Default `0`                                  |
| `location`     | string   | No       | Default `""`                                 |
| `phone`        | string   | No       | Default `""`                                 |
| `behanceUrl`   | string   | No       | Default `""`                                 |
| `dribbbleUrl`  | string   | No       | Default `""`                                 |
| `instagramUrl` | string   | No       | Default `""`                                 |
| `isAvailable`  | boolean  | No       | Default `true`                               |

New profiles start with `isVerified: false`, `rating: 0`, `reviewsCount: 0`.

**Example Request Body**
```json
{
  "name": "Sevda Hajiyeva",
  "title": "Web Designer",
  "hourlyRate": 30,
  "currency": "AZN",
  "email": "sevda@example.com",
  "skills": ["Web Design", "Figma", "Webflow"],
  "location": "Baku, Azerbaijan"
}
```

**Example Response** `201 Created` — the full created designer object.

---

#### `PUT /api/designers/:id` — Update a designer

All fields optional, including `isVerified`. `rating` and `reviewsCount` cannot be set directly — they are managed by the reviews endpoint.

**Example Request Body**
```json
{ "hourlyRate": 45, "isAvailable": false }
```

**Example Response** `200 OK` — the full updated designer object.

---

#### `DELETE /api/designers/:id` — Delete a designer

Cascades: also deletes the designer's projects, services, reviews, and orders.

**Example Response** `200 OK`
```json
{ "message": "Designer deleted" }
```

---

### Portfolio Projects (nested)

---

#### `GET /api/designers/:id/projects` — Get a designer's portfolio

**Example Response** `200 OK`
```json
[
  {
    "id": "p-001",
    "designerId": "d-001",
    "title": "Banking App Redesign",
    "description": "Complete UX overhaul of a mobile banking app...",
    "category": "ui-ux",
    "images": ["https://picsum.photos/seed/d-001-p1-a/800/600"],
    "tags": ["fintech", "mobile", "dashboard"],
    "tools": ["Figma", "Principle"],
    "likes": 248,
    "views": 3100,
    "createdAt": "2026-04-27T10:00:00.000Z"
  }
]
```

---

#### `POST /api/designers/:id/projects` — Add a project

**Request Body**

| Field         | Type     | Required | Description                                  |
|---------------|----------|----------|----------------------------------------------|
| `title`       | string   | Yes      | Project title                                |
| `category`    | string   | Yes      | One of the valid categories                  |
| `description` | string   | No       | Default `""`                                 |
| `images`      | string[] | No       | A placeholder is generated if omitted        |
| `tags`        | string[] | No       | Default `[]`                                 |
| `tools`       | string[] | No       | Default `[]`                                 |

New projects start with `likes: 0` and `views: 0`.

**Example Request Body**
```json
{
  "title": "Crypto Wallet Concept",
  "description": "Dark-themed wallet app concept with focus on security UX.",
  "category": "ui-ux",
  "tags": ["crypto", "mobile"],
  "tools": ["Figma"]
}
```

**Example Response** `201 Created` — the full created project object.

---

#### `PUT /api/designers/:id/projects/:projectId` — Update a project

All fields from creation are optional. `likes` and `views` cannot be edited here.

**Example Request Body**
```json
{ "tags": ["crypto", "mobile", "fintech"] }
```

**Example Response** `200 OK` — the full updated project.

---

#### `DELETE /api/designers/:id/projects/:projectId` — Delete a project

**Example Response** `200 OK`
```json
{ "message": "Project deleted" }
```

---

#### `PATCH /api/designers/:id/projects/:projectId/like` — Like a project

Increments `likes` by 1. No request body needed.

**Example Response** `200 OK` — the full project with the new `likes` value.

---

### Services (nested)

---

#### `GET /api/designers/:id/services` — Get a designer's services

**Example Response** `200 OK`
```json
[
  {
    "id": "s-002",
    "designerId": "d-001",
    "title": "Mobile App Design",
    "description": "Full app design up to 15 screens with interactive prototype.",
    "deliveryDays": 14,
    "price": 1200,
    "currency": "AZN",
    "includes": ["15 screens", "Interactive prototype", "Design system starter", "2 revision rounds"],
    "tier": "standard"
  }
]
```

---

#### `POST /api/designers/:id/services` — Add a service

**Request Body**

| Field          | Type     | Required | Description                          |
|----------------|----------|----------|--------------------------------------|
| `title`        | string   | Yes      | Service title                        |
| `price`        | number   | Yes      | Fixed price                          |
| `deliveryDays` | number   | Yes      | Delivery time in days                |
| `description`  | string   | No       | Default `""`                         |
| `currency`     | string   | No       | `AZN` (default) or `USD`             |
| `includes`     | string[] | No       | Default `[]`                         |
| `tier`         | string   | No       | `basic` (default) / `standard` / `premium` |

**Example Request Body**
```json
{
  "title": "Landing Page Design",
  "description": "One landing page, responsive, with prototype.",
  "deliveryDays": 7,
  "price": 500,
  "currency": "AZN",
  "includes": ["Desktop + mobile", "Prototype", "2 revisions"],
  "tier": "basic"
}
```

**Example Response** `201 Created` — the full created service object.

---

#### `PUT /api/designers/:id/services/:serviceId` — Update a service

All creation fields are optional.

**Example Request Body**
```json
{ "price": 550, "deliveryDays": 5 }
```

**Example Response** `200 OK` — the full updated service.

---

#### `DELETE /api/designers/:id/services/:serviceId` — Delete a service

**Example Response** `200 OK`
```json
{ "message": "Service deleted" }
```

---

### Reviews (nested)

---

#### `GET /api/designers/:id/reviews` — Get reviews for a designer

**Example Response** `200 OK`
```json
[
  {
    "id": "r-001",
    "designerId": "d-001",
    "clientName": "Orkhan Babayev",
    "rating": 5,
    "comment": "Aysel transformed our banking app. Conversion on onboarding doubled.",
    "projectCategory": "ui-ux",
    "createdAt": "2026-05-02T14:00:00.000Z"
  }
]
```

---

#### `POST /api/designers/:id/reviews` — Add a review

Automatically recalculates the designer's `rating` (average, 1 decimal) and `reviewsCount`.

**Request Body**

| Field             | Type   | Required | Description                              |
|-------------------|--------|----------|------------------------------------------|
| `clientName`      | string | Yes      | Reviewer's name                          |
| `rating`          | number | Yes      | 1 to 5                                   |
| `comment`         | string | No       | Default `""`                             |
| `projectCategory` | string | No       | One of the valid categories (default: `other`) |

**Example Request Body**
```json
{
  "clientName": "John Doe",
  "rating": 5,
  "comment": "Outstanding work, delivered ahead of schedule.",
  "projectCategory": "ui-ux"
}
```

**Example Response** `201 Created` — the created review object.

**Error Response** `400 Bad Request`
```json
{ "error": "rating must be between 1 and 5" }
```

---

### Orders

---

#### `GET /api/orders` — Get all orders

**Example Response** `200 OK`
```json
[
  {
    "id": "o-001",
    "serviceId": "s-002",
    "designerId": "d-001",
    "clientName": "Orkhan Babayev",
    "clientEmail": "orkhan.b@example.com",
    "requirements": "Fitness app, 12 screens, dark theme preferred.",
    "status": "completed",
    "createdAt": "2026-04-22T10:00:00.000Z"
  }
]
```

---

#### `POST /api/orders` — Place an order

`designerId` is derived automatically from the service. New orders start as `pending`.

**Request Body**

| Field          | Type   | Required | Description                  |
|----------------|--------|----------|------------------------------|
| `serviceId`    | string | Yes      | ID of an existing service    |
| `clientName`   | string | Yes      | Client's name                |
| `clientEmail`  | string | Yes      | Client's email               |
| `requirements` | string | No       | Brief / requirements text    |

**Example Request Body**
```json
{
  "serviceId": "s-002",
  "clientName": "Aytan Suleymanova",
  "clientEmail": "aytan@example.com",
  "requirements": "Need a mobile app for my flower shop, ~12 screens."
}
```

**Example Response** `201 Created` — the full created order object.

**Error Response** `404 Not Found`
```json
{ "error": "Service not found" }
```

---

#### `PATCH /api/orders/:id/status` — Update order status

**Request Body**

| Field    | Type   | Required | Description                                          |
|----------|--------|----------|------------------------------------------------------|
| `status` | string | Yes      | `pending` / `in-progress` / `completed` / `cancelled` |

**Example Request Body**
```json
{ "status": "in-progress" }
```

**Example Response** `200 OK` — the full order with the new status.

---

### Explore Feed

---

#### `GET /api/projects` — Explore all portfolio projects

Each project includes a compact `designer` object for feed cards.

**Query Parameters**

| Param      | Type   | Description                                                       |
|------------|--------|-------------------------------------------------------------------|
| `category` | string | Filter by project category                                        |
| `tags`     | string | Comma-separated; project must have **all** listed tags            |
| `sort`     | string | `newest` (default) / `popular` (by likes)                         |

**Example Request**
```
GET /api/projects?category=ui-ux&tags=dashboard&sort=popular
```

**Example Response** `200 OK`
```json
[
  {
    "id": "p-001",
    "designerId": "d-001",
    "title": "Banking App Redesign",
    "category": "ui-ux",
    "tags": ["fintech", "mobile", "dashboard"],
    "likes": 248,
    "views": 3100,
    "createdAt": "2026-04-27T10:00:00.000Z",
    "designer": {
      "id": "d-001",
      "name": "Aysel Mammadova",
      "title": "UI/UX Designer",
      "avatar": "https://i.pravatar.cc/200?u=d-001",
      "isVerified": true
    }
  }
]
```

---

### Stats

---

#### `GET /api/stats` — Platform stats

| Field            | Type   | Description                                    |
|------------------|--------|------------------------------------------------|
| `totalDesigners` | number | Number of designers                            |
| `totalProjects`  | number | Number of portfolio projects                   |
| `totalOrders`    | number | Number of orders (any status)                  |
| `topCategories`  | array  | Top 5 project categories as `{ category, count }` |

**Example Response** `200 OK`
```json
{
  "totalDesigners": 8,
  "totalProjects": 26,
  "totalOrders": 6,
  "topCategories": [
    { "category": "ui-ux", "count": 9 },
    { "category": "illustration", "count": 5 },
    { "category": "print", "count": 4 },
    { "category": "branding", "count": 3 },
    { "category": "motion", "count": 3 }
  ]
}
```

---

## Project Structure

```
designer-marketplace-api/
├── src/
│   ├── index.js                  # Entry point
│   ├── routes/
│   │   ├── designers.js          # Designers + nested projects/services/reviews
│   │   ├── orders.js
│   │   ├── projects.js           # Global explore feed
│   │   └── stats.js
│   ├── controllers/
│   │   ├── designers.js          # Designer CRUD + filtering/sorting
│   │   ├── projects.js           # Portfolio CRUD + likes + explore feed
│   │   ├── services.js           # Service CRUD with tiers
│   │   ├── reviews.js            # Reviews + automatic rating recalc
│   │   ├── orders.js             # Orders + status flow
│   │   └── stats.js              # Platform stats
│   └── middleware/
│       └── db.js                 # JSON file read/write helpers
├── db.json                       # Persistent JSON database (seeded)
├── seed.js                       # Regenerates db.json with fresh dates
├── .env.example                  # PORT=5000
├── .gitignore
├── package.json
└── README.md
```
