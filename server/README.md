# Benek Backend 

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

---

## 10. Cyber Security

## 10.1 Threat Model

This threat model reflects the real security architecture of Benek, including:
- Trusted Device Validation (`clientId` + `trustedDeviceIds`)
- QR-based Admin Login (WhatsApp Web–style)
- Custom dedicated media server (NO S3)
- AES-256 (crypto) encryption with salted secrets for sensitive fields (TC No, IBAN, etc.)
- Mission video verification using time-bound recording + one-time spoken code
- Complaint → human moderation → penalty system
- JWT RS256 authentication with strict RBAC
- Payment flows via Moka POS
- Admin panel WebSocket binding

# MISSION VIDEO VERIFICATION — ANTI-FRAUD MODEL

A pet owner assigns a mission (e.g., *feed Pasha*).  
The caregiver must record video during the defined mission time window.  
Critical risks include:
- Re-submitting old videos  
- Uploading unrelated footage  
- Editing/forging mission content  
- Submitting videos outside permitted time  

### Controls

1. **Strict client-side enforcement**
   - Only IN-APP camera recording allowed  
   - No gallery uploads (no reusing old clips)
   - Video cannot be edited; only deleted & re-recorded

2. **Time-window bound recording**
   - Backend enforces mission window:
     - Example: missionDate ± 10 minutes
   - Video upload attempted outside the window fails

3. **One-time mission code (speech required)**
   - Backend generates a mission-specific one-time code (`timePassword`)
   - Caregiver must clearly speak the code aloud
   - Ensures:
     - The video belongs to *that mission*
     - The recording’s audio proves recency
     - Fraud becomes extremely difficult

4. **Complaint → Moderator Review → Penalty System**
   - Owner can file a complaint if:
     - Code not spoken correctly
     - Wrong pet, wrong context
     - Video suspicious/unrelated
   - Moderator reviews video
   - If complaint is accepted:
     - Caregiver gets a penalty point  
     - Payment for that mission is blocked  
   - Caregiver is notified **1 week AFTER** pet returned  
     (to prevent retaliation)

This is one of the strongest anti-fraud / integrity assurance mechanisms in the app.

---

# STRIDE Threat Model

# S — SPOOFING

### **Threat: JWT token theft / impersonation**
**Risk:** Attacker impersonates a caregiver or pet owner  
**Mitigations:**
- RS256 asymmetric JWT signing  
- Short-lived access tokens, long-lived refresh tokens  
- Mandatory token rotation  
- IP logging & anomaly detection  

---

### **Threat: Fake client device impersonation**
**Risk:** Attacker fakes a `clientId` to skip email verification  
**Mitigations:**
- `trustedDeviceIds` list stored server-side  
- Unknown device → forced email verification flow  
- Every token issuance checks device trust state  
- ClientId generated on first run (UUID), stored securely  

---

### **Threat: QR-based admin login spoofing**
**Risk:** Attacker prints or replays QR codes  
**Mitigations:**
- QR contains `{adminPanelClientId, oneTimeLoginCode}`  
- One-time code = single use + short expiry (30–60s)  
- Code bound to the exact admin panel client  
- After scanning:
  - User identity extracted from JWT
  - Role checked (`admin`)
  - Only then WebSocket session authorized  

---

### **Threat: OTP interception (SMS / Email)**
**Risk:** Attacker captures OTP  
**Mitigations:**
- OTP hashed in DB  
- Short expiration times  
- Rate limiting  
- OTP bound to the target userId  
- OTP auto-invalidation after error attempts  

---

# T — TAMPERING

### **Threat: Caregiver uploads old or unrelated mission video**  
**Mitigations:**
- Only live recording allowed  
- Recording locked to mission time window  
- One-time mission code (spoken aloud)  
- Moderator review workflow  
- Mission state locked after approval  
- Backend rejects uploads that do not match mission context  

---

### **Threat: Video tampering on media server**
Risk: replacing or altering video files  
Mitigations:
- Media server requires API-key + user authentication  
- Backend signs upload requests using HMAC or JWT  
- Video filename includes:
  - missionId
  - caregiverId
  - timestamp  
- Videos stored as immutable after mission is locked  
- Hash (checksum) stored in DB for integrity verification  

---

### **Threat: Payment or mission record modification**
Mitigations:
- All write operations must go through RBAC-checked backend endpoints  
- Schema validation in DB layer  
- No client-side trust for IDs or updates  
- Audit logs for admin actions  

---


# R — REPUDIATION

### **Threat: Caregiver denies performing a mission**
Mitigations:
- Evidence bundle:
  - Video
  - Audio with spoken mission code
  - Mission timestamp
  - careGiverId + petId  
- Complaint pipeline creates a permanent audit record  
- Final moderator decision logged  

---

### **Threat: Admin denies performing a sensitive action**
Mitigations:
- Admin actions logged:
  - adminId  
  - clientId  
  - IP address  
  - timestamp  
  - action type  

---

# I — INFORMATION DISCLOSURE

### **Threat: Sensitive data leakage (TC No, IBAN, real name, address)**
Mitigations:
- AES-256 + random salt using Node.js crypto library  
- Encrypted fields:
  - nationalId.idNumber  
  - IBAN  
  - Certificates  
  - Open address  
- Secrets stored in environment variables  
- Crypto keys rotated periodically  
- Sensitive fields never embedded in JWT  

---

### **Threat: Media server leak**
Risk: Private mission videos leaked publicly  
Mitigations:
- Media server is fully private  
- Access controlled via:
  - Backend-signed URLs  
  - Short-lived tokens  
  - Permission checks based on mission.owner or admin  

---

### **Threat: Admin panel WebSocket hijacking**
Mitigations:
- WebSocket handshake requires admin JWT  
- Bound to adminPanel clientId  
- No tokens in query params  

---

# D — DENIAL OF SERVICE

### **Threat: OTP spam**
Mitigations:
- express-rate-limit  
- Temporary phone/email cooldown  
- Suspicious activity detection  

---

### **Threat: Video upload flooding**
Mitigations:
- File size limit  
- Upload rate throttling  
- Reject concurrent uploads  

---

### **Threat: Mission brute-force / heavy DB queries**
Mitigations:
- DB indexes on missionId, userId, petId  
- Pagination  
- Query depth limits  

---

# E — ELEVATION OF PRIVILEGE

### **Threat: Normal user tries to act as caregiver/admin**
Mitigations:
- Strict RBAC (role verified on every endpoint)  
- Role stored server-side  
- Admin login must go through QR login + mobile token flow  

---

### **Threat: Exploiting QR login to escalate privileges**
Mitigations:
- QR code does NOT grant admin access by itself  
- Backend checks:  
  - JWT identity  
  - JWT role === admin  
  - loginCode validity  
  - adminPanelClientId match  

---

### **Threat: Abusing trusted devices**
Mitigations:
- trustedDeviceIds stored and verified server-side  
- Unknown device → email verification required  
- Admin roles require both:
  - trusted device  
  - correct QR login flow  

---



### 10.2 Implemented Security Measures

#### ✔ Secure Authentication
- JWT (RS256)
- Short-lived tokens with TTL
- Token blacklist for revocation

#### ✔ Secure Authorization
- Role-Based Access Control (RBAC)
- User roles: admin, caregiver, regular user

#### ✔ Input Validation & Sanitization
- express-validator for schema validation
- Input sanitization
- XSS protection layer
- File size and MIME-type validation

#### ✔ Encryption & Signing
- AES-256 encryption for national identity fields
- bcrypt for password hashing
- Signed URLs for protected media access

#### ✔ Transport Layer Security
- HTTPS enforcement
- HSTS enabled
- Strict CORS policy

#### ✔ Database Security
- Safe query patterns (no dynamic eval)
- Rate limiting on login and OTP requests
- No exposure of MongoDB root roles

#### ✔ Secure DevOps Practices
- Environment isolation (.env)
- No secrets in repository
- Hardened production build
- Application logs & security monitoring

---

## 11. How Security Works in Benek

### Authentication
- JWT RS256 with asymmetric keypair
- No refresh tokens → short-lived access tokens + revoke list

### Authorization
Middleware layers:
- isAuthenticated
- isAdmin
- isCaregiver

### TLS
- SSL termination via Nginx reverse proxy (when it was deployed)
- Full transport-layer encryption between client and server

### Attack Prevention
- CSRF: Stateless API → naturally protected
- NoSQL Injection: mongoose validation + sanitizer
- XSS mitigation: sanitization + strict payload validation
- File upload hardening: MIME-type & size validation

