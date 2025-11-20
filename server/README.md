# Benek – NoSQL Backend (Operational Data Store)

Benek is a mobile application that allows users to find trusted caregivers nearby and manage pet ownership and task submission processes. The project's backend is developed on Node.js, Express.js, and MongoDB (NoSQL). The system has a complex data model that includes task management, payment records, user authentication, OTP mechanisms, pet-owner relationships, story sharing, and moderation tools.

---

# 1. Use Cases

The main use cases currently implemented in the application are listed below:

## ✔ User & Identity Management

User registration, login, email and phone OTP verification
JWT-based session token generation
OTP for email change
One-time temporary password for password reset

## ✔ Pet Management

Creating and editing pets, profile pictures
Multiple owners (primary and secondary owners) structure
Comments/replies on pet profile photos and media
Creating pet stories (24-hour story system)

## ✔ Caregiver Management

Task creation, task schedule
Task video upload + timecode verification
Task rejection/complaint
Extra task purchase management

## ✔ Payment System & Invoices

Payment processes via Moka POS
Virtual POS ID matching
E-invoice and expense records (expense/invoice records)

## ✔ Moderation & Penalty System

Ban mechanism (banned users + ban ASAP)
Punishment records
Admin cancellation records

## ✔ Invitation Systems

Pet hand-over invitation
Secondary owner invitation
Caregiver invitation

---

# 2. Development Setup (README Setup Instructions)
## Requirements:

* Node.js 18+
* MongoDB 6+
* npm / yarn

## Installation:

* Clone the repo
* Go to the server/ directory
* Create the .env file:
   ```
   MONGO_URI=mongodb://localhost:27017/benek
   JWT_PRIVATE_KEY=...
   JWT_PUBLIC_KEY=...
   MOKA_API_KEY=...
   S3_ACCESS_KEY=...
   S3_SECRET_KEY=...
   ```
* Install dependencies:
  ```
  npm install
  ```
* Start the development server:
  ```
  npm run dev
  ```
---
# 3. Database Setup
The project uses MongoDB. The connection is made via `mongoose`.
   * Each model is located under server/models/*.js.
   * The connection is made in the server/config/db.js file.
   * Database schema validation is automatically performed via Mongoose.
   * All CRUD operations are implemented in the relevant service/controller layer.
---
# 4. NoSQL Data Model

This project has a highly complex, relationally intensive structure that requires the flexibility of NoSQL.
### Model Highlights

* Document-based MongoDB model
* Heavyly embedded documents (comments, replies, missions, addresses, identity, price data, story replies, etc.)
* Use of "soft relations" instead of references → consistent with NoSQL's design philosophy
* Nested structures in critical locations for performance
* Use of sharding-friendly UUID/ObjectID

## Model Diagram
<img width="10044" height="10531" alt="Benek" src="https://github.com/user-attachments/assets/1c92caa0-11dc-4acb-a586-a6838d81ec16" />

---
# 5. Data Quantity

The dataset used in the development process does not contain real user data.
The system consists of the following:

* A limited number of real sample records to test application functions
* Manually generated test data for some collections
* Small-scale fake data generated with scripts where necessary
---
# 6. Data Layer

Data access in this backend has three layers:

## 1. Model Layer (Mongoose Schemas)

Schema for each entity
Validation + defaults + nested structure

## 2. Repository Layer (Service / Helper)

Examples:
* UserTokenService
* StoryService
* PetService
* MissionService

In this layer:
* Queries
* Aggregation pipelines
* Text search
* Pagination & indexing

## 3. Controller Layer

Redirects HTTP requests to the service layer Authorization / Input validation is performed here

---

# 7. NoSQL Optimization Decisions

* Index created for frequently used fields
* Partial index for story and pet media
* Array indexing for followers/following
* Time-based indexing for caregiver missions
* TTL index → ​​UserToken (30 days)
* Embedded documents → "comments", "replies", "missionCalendar" (no joins → high speed)
* Sharding-ready ObjectId usage strategy

