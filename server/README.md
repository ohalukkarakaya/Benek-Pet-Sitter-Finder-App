# Benek API Documentation

Welcome to the **Benek API Documentation**! This document provides detailed instructions on how to interact with the Benek API, which powers the Benek pet-sitting application. The API is designed to help developers integrate and utilize the core features of the platform seamlessly.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
   - [Base URL](#base-url)
   - [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Auth Routes](#auth-routes)
   - [Log Routes](#log-routes)
   - [RefreshToken Routes](#refreshtoken-routes)
   - [Payment Routes](#payment-routes)
   - [Edit User Routes](#edit-user-routes)
   - [Pet Routes](#pet-routes)
   - [Pet Owner Operations Routes](#pet-owner-operations-routes)
   - [Animal Keyword Routes](#animal-keyword-routes)
   - [Care Give Routes](#care-give-routes)
   - [Chat Routes](#chat-routes)
   - [Notification Routes](#notification-routes)
   - [Admin Routes](#admin-routes)
4. [Error Codes](#error-codes)
5. [Contact](#contact)

## Overview
The Benek API allows you to:
- Register and authenticate users.
- Manage pet sitter profiles.
- Schedule and verify daily pet care tasks.
- Access user and task information.

The API follows RESTful principles and returns data in JSON format.

---

## Getting Started

### Base URL
The base URL for all API requests:

```
https://api.benekapp.com/v1
```

### Authentication
The API uses **JWT (JSON Web Tokens)** for authentication. To access most endpoints, you must include a valid token in the `Authorization` header.

Example:
```http
Authorization: Bearer <your_token>
```

#### How to Obtain a Token
1. Register or log in using the [Auth Routes](#auth-routes).
2. Receive the token in the response.
3. Use this token for subsequent requests.

---

## Endpoints

### Auth Routes

#### 1. Sign Up
**Endpoint:** `/auth/signUp`

**Method:** `POST`

**Description:** Create a new user account.

**Request Body:**
```json
{
  "userName": "string",
  "email": "string",
  "password": "string",
  "gender": "Male|Female",
  "identity": "string",
  "location": "string",
  "ip": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "success": true,
     "message": "Verification email sent successfully",
     "data": {
       "userId": "123456",
       "email": "example@example.com"
     }
   }
   ```

2. **User Already Exists**
   ```json
   {
     "error": true,
     "message": "User Already Exists"
   }
   ```

3. **User Banned**
   ```json
   {
     "error": false,
     "isUserBanned": true,
     "message": "This User Can't Be Enrolled Again",
     "desc": "Reason provided by admin"
   }
   ```

4. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation error message"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. Validates the request body using `signUpBodyValidation`. Returns a 400 status if validation fails.
2. Checks if the user is banned using the `BannedUsers` collection. If banned, responds with a message and admin description.
3. Checks if the user already exists in the `User` collection by username or email. If found, responds with an error.
4. Encrypts the password using bcrypt with a salt from environment variables.
5. Generates a random default avatar based on the user's gender.
6. Creates a new user record in the database, including their username, email, gender, default avatar, identity, location, hashed password, and trusted IPs.
7. Sends an OTP verification email to the user upon successful registration.

#### 2. Log In
**Endpoint:** `/auth/login`

**Method:** `POST`

**Description:** Authenticate an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "ip": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "isLoggedInIpTrusted": true,
     "isEmailVerified": true,
     "roleId": 0,
     "accessToken": "string",
     "refreshToken": "string",
     "message": "Logged In Successfully"
   }
   ```

2. **Invalid Email or Password**
   ```json
   {
     "error": true,
     "message": "Invalid email or password"
   }
   ```

3. **Email Verification Required**
   ```json
   {
     "error": true,
     "message": "Email verification is required please check your inbox"
   }
   ```

4. **Untrusted Device**
   ```json
   {
     "error": true,
     "isLoggedInIpTrusted": false,
     "message": "Your device Id is not trusted, therefore verification code sent to your email"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. Verifies if the user exists in the `User` collection by email.
2. Checks if the user's password matches the stored hash or a temporary password.
3. Handles scenarios where the user's email is not verified by sending a new verification code.
4. Verifies if the login request is from a trusted IP address and updates the trust status accordingly.
5. Reactivates deactivated accounts by resetting deactivation flags.
6. Generates access and refresh tokens using the `generateTokens` utility.
7. Deletes any temporary passwords associated with the user upon successful login.

#### 3. Verify OTP
**Endpoint:** `/auth/verifyOTP`

**Method:** `POST`

**Description:** Verify the OTP (One-Time Password) sent to the user for email or device verification.

**Request Body:**
```json
{
  "userId": "string",
  "otp": "string",
  "ip": "string"
}
```

**Response Examples:**

1. **Success: Email Verified**
   ```json
   {
     "error": false,
     "message": "User email verified successfully"
   }
   ```

2. **Success: IP Verified**
   ```json
   {
     "error": false,
     "message": "IP verified successfully"
   }
   ```

3. **Empty OTP Details**
   ```json
   {
     "error": true,
     "message": "Empty OTP details are not allowed"
   }
   ```

4. **Invalid OTP**
   ```json
   {
     "error": true,
     "message": "Invalid code passed. Check your inbox"
   }
   ```

5. **Expired OTP**
   ```json
   {
     "error": true,
     "message": "Code has expired. Please request again"
   }
   ```

6. **Untrusted IP**
   ```json
   {
     "error": true,
     "message": "IP is not trusted. Please try to login from your device"
   }
   ```

7. **Account Already Verified**
   ```json
   {
     "error": true,
     "message": "Account record doesn't exist or has been verified already"
   }
   ```

**Functionality:**
1. Validates the presence of `userId`, `otp`, and `ip` in the request body.
2. Checks if the OTP record exists for the provided `userId`.
3. Verifies if the OTP has expired and deletes expired records.
4. Compares the provided OTP with the hashed OTP stored in the database.
5. Updates the user's `isEmailVerified` or `trustedIps` field based on verification type.
6. Deletes the OTP record after successful verification.

#### 4. Resend OTP
**Endpoint:** `/auth/resendOtp`

**Method:** `POST`

**Description:** Resend the OTP (One-Time Password) to the user's email.

**Request Body:**
```json
{
  "userId": "string",
  "email": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "OTP sent successfully"
   }
   ```

2. **Empty Details**
   ```json
   {
     "error": true,
     "message": "Empty OTP details are not allowed"
   }
   ```

3. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

---

### Log Routes

#### 1. Get Logs By Date Period
**Endpoint:** `/log/byDatePeriod`

**Method:** `GET`

**Description:** Retrieve logs within a specific date period. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Request Query Parameters:**
```json
{
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "action": "User login",
         "details": "User ID 123456 logged in"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "action": "Payment processed",
         "details": "Payment ID 789123 completed"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires `startDate` and `endDate` as query parameters to define the date range for logs retrieval.
4. Logs are fetched from the database where the `date` field falls within the specified range.
5. Responds with the retrieved logs or appropriate error messages based on the conditions encountered.

#### 2. Get Logs By User ID
**Endpoint:** `/log/byUserId/:userId`

**Method:** `GET`

**Description:** Retrieve logs for a specific user by their user ID. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Path Parameters:**
- `userId` (string): The ID of the user whose logs are to be retrieved.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "action": "User login",
         "details": "User ID 123456 logged in"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "action": "Payment processed",
         "details": "Payment ID 789123 completed"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires the `userId` as a path parameter to identify the user whose logs are being requested.
4. Logs are fetched from the database where the `userId` matches the specified parameter.
5. Responds with the retrieved logs or appropriate error messages based on the conditions encountered.

#### 3. Get Logs By Request URL
**Endpoint:** `/log/byRequestUrl`

**Method:** `POST`

**Description:** Retrieve logs matching a specific request URL. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Request Body:**
```json
{
  "requestUrl": "string",
  "method": "GET|POST|PUT|DELETE"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "url": "/api/resource",
         "method": "GET",
         "details": "Fetched resource details"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "url": "/api/resource",
         "method": "GET",
         "details": "Fetched resource list"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires the `requestUrl` and `method` as body parameters to identify the logs to retrieve.
4. It utilizes a utility function `findMatchingRouteHelper` to match the provided URL and method.
5. Logs are fetched from the database where the `url` matches the constructed regex pattern.
6. Responds with the retrieved logs or appropriate error messages based on the conditions encountered.

#### 4. Get Logs By User ID and Date Period
**Endpoint:** `/log/byUserIdAndDatePeriod/:userId`

**Method:** `GET`

**Description:** Retrieve logs for a specific user within a specified date period. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Path Parameters:**
- `userId` (string): The ID of the user whose logs are to be retrieved.

**Request Query Parameters:**
```json
{
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "action": "User login",
         "details": "User ID 123456 logged in"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "action": "Payment processed",
         "details": "Payment ID 789123 completed"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires `userId` as a path parameter and `startDate` and `endDate` as query parameters to filter the logs.
4. Converts the `startDate` and `endDate` strings into `Date` objects.
5. Logs are fetched from the database where the `userId` matches the specified parameter and the `date` falls within the given range.
6. Responds with the retrieved logs or appropriate error messages based on the conditions encountered.

#### 5. Get Logs By Request URL and Date Period
**Endpoint:** `/log/byRequestUrlAndDatePeriod`

**Method:** `POST`

**Description:** Retrieve logs for a specific request URL within a specified date period. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Request Body:**
```json
{
  "requestUrl": "string",
  "method": "GET|POST|PUT|DELETE",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "url": "/api/resource",
         "method": "GET",
         "details": "Fetched resource details"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "url": "/api/resource",
         "method": "POST",
         "details": "Updated resource details"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires `requestUrl`, `method`, `startDate`, and `endDate` as body parameters to filter the logs.
4. Converts the `startDate` and `endDate` strings into `Date` objects.
5. Utilizes the `findMatchingRouteHelper` function to match the provided URL and method.
6. Logs are fetched from the database where the `url` matches the constructed regex pattern and the `date` falls within the specified range.
7. Responds with the retrieved logs or appropriate error messages based on the conditions encountered.

#### 6. Get Logs By Request URL and User ID
**Endpoint:** `/log/byRequestUrlAndUserId`

**Method:** `POST`

**Description:** Retrieve logs for a specific request URL and user ID. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Request Body:**
```json
{
  "requestUrl": "string",
  "method": "GET|POST|PUT|DELETE",
  "searchingUserId": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "url": "/api/resource",
         "method": "GET",
         "userId": "123456",
         "details": "Fetched resource details"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "url": "/api/resource",
         "method": "POST",
         "userId": "123456",
         "details": "Updated resource details"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires `requestUrl`, `method`, and `searchingUserId` as body parameters to filter the logs.
4. Utilizes the `findMatchingRouteHelper` function to match the provided URL and method.
5. Logs are fetched from the database where the `url` matches the constructed regex pattern and the `userId` matches the specified parameter.
6. Responds with the retrieved logs or appropriate error messages based on the conditions encountered.

#### 7. Get Logs By Request URL, User ID, and Date Period
**Endpoint:** `/log/byRequestUrlAndUserIdAndPeriod`

**Method:** `POST`

**Description:** Retrieve logs for a specific request URL, user ID, and date period. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Request Body:**
```json
{
  "requestUrl": "string",
  "method": "GET|POST|PUT|DELETE",
  "searchingUserId": "string",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "url": "/api/resource",
         "method": "GET",
         "userId": "123456",
         "details": "Fetched resource details"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "url": "/api/resource",
         "method": "POST",
         "userId": "123456",
         "details": "Updated resource details"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires `requestUrl`, `method`, `searchingUserId`, `startDate`, and `endDate` as body parameters to filter the logs.
4. Converts the `startDate` and `endDate` strings into `Date` objects.
5. Utilizes the `findMatchingRouteHelper` function to match the provided URL and method.
6. Logs are fetched from the database where the `url` matches the constructed regex pattern, `userId` matches the specified parameter, and the `date` falls within the specified range.
7. Responds with the retrieved logs or appropriate error messages based on the conditions encountered.

#### 8. Get Logs By Status Code
**Endpoint:** `/log/byStatusCode/:statusCode`

**Method:** `GET`

**Description:** Retrieve logs filtered by a specific HTTP status code. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Path Parameters:**
- `statusCode` (integer): The HTTP status code to filter logs by.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logCount": 2,
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "status": 404,
         "details": "Resource not found"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "status": 404,
         "details": "Endpoint does not exist"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Logs Not Found**
   ```json
   {
     "error": true,
     "message": "Logs Not Found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. The endpoint requires the `statusCode` as a path parameter to filter logs by the specified HTTP status code.
4. Retrieves logs from the database where the `status` matches the given status code.
5. Responds with the retrieved logs, a count of the logs, or appropriate error messages based on the conditions encountered.

#### 9. Get Error Logs
**Endpoint:** `/log/errorLogs`

**Method:** `GET`

**Description:** Retrieve all logs where the HTTP status code is not `200`. Only accessible by admin or developer roles.

**Request Headers:**
```http
x-access-token: <your_admin_or_developer_token>
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logs Prepared Successfully",
     "logCount": 3,
     "logs": [
       {
         "date": "2025-01-01T12:00:00Z",
         "status": 500,
         "details": "Internal server error occurred"
       },
       {
         "date": "2025-01-02T15:30:00Z",
         "status": 404,
         "details": "Endpoint does not exist"
       },
       {
         "date": "2025-01-03T10:15:00Z",
         "status": 403,
         "details": "Access denied"
       }
     ]
   }
   ```

2. **Logs Not Found**
   ```json
   {
     "error": true,
     "message": "Logs Not Found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence of the `x-access-token` header to ensure the user is authenticated.
2. It checks if the token corresponds to an admin or developer role.
3. Retrieves logs from the database where the `status` field is not equal to `200`.
4. Responds with the retrieved logs, a count of the logs, or appropriate error messages based on the conditions encountered.

---

### RefreshToken Routes

#### 1. Refresh Access Token
**Endpoint:** `/api/refreshToken/`

**Method:** `POST`

**Description:** Generates a new access token using a valid refresh token. This endpoint ensures secure token lifecycle management.

**Request Headers:**
None

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Access token created successfully",
     "role": 0,
     "accessToken": "<new_access_token>"
   }
   ```

2. **Invalid Refresh Token Format**
   ```json
   {
     "error": true,
     "message": "<Validation error message>"
   }
   ```

3. **Expired Refresh Token**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

4. **Invalid Refresh Token**
   ```json
   {
     "error": true,
     "message": "Invalid Refresh Token"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. Validates the `refreshToken` parameter in the request body using the `refreshTokenBodyValidation` utility.
2. Verifies the refresh token using the `verifyRefreshToken` utility.
3. Extracts user details (`_id` and `roles`) from the verified refresh token.
4. Generates a new access token with a 5-minute expiration period.
5. Responds with the new access token and the user role if validation and verification succeed.
6. Handles various error scenarios, including expired tokens, invalid tokens, and server-side errors.

#### 2. Logout User
**Endpoint:** `/api/refreshToken/`

**Method:** `DELETE`

**Description:** Logs out a user by removing the associated refresh token from the database.

**Request Headers:**
None

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Logged Out Successfully"
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "<Validation error message>"
   }
   ```

3. **Token Not Found**
   ```json
   {
     "error": false,
     "message": "Logged Out Successfully"
   }
   ```

4. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server"
   }
   ```

**Functionality:**
1. Validates the `refreshToken` parameter in the request body using the `refreshTokenBodyValidation` utility.
2. Searches the `UserToken` collection for the provided `refreshToken`.
3. If the token exists, it removes the token from the database.
4. If the token is not found, it still responds with a success message to avoid exposing information about the token.
5. Handles errors and provides appropriate messages for validation or internal server issues.

### Payment Routes

#### 1. 3D Payment Redirect
**Endpoint:** `/api/payment/redirect`

**Method:** `POST`

**Description:** Handles 3D Secure payment redirects by validating the payment and updating the payment status. Redirects the user based on the payment result.

**Request Headers:**
None

**Request Body:**
```json
{
  "OtherTrxCode": "string",
  "hashValue": "string",
  "resultMessage": "string",
  "trxCode": "string"
}
```

**Response Examples:**

1. **Successful Payment**
   Redirects to:
   ```http
   <BASE_URL>/api/payment/redirect?isSuccess=true&ticketId=<ticketId>
   ```

2. **Failed Payment**
   Redirects to:
   ```http
   <BASE_URL>/api/payment/redirect?isSuccess=false
   ```

3. **Already Paid**
   Redirects to:
   ```http
   <BASE_URL>/api/payment/redirect?isSuccess=false&alreadyPaid=true
   ```

4. **Internal Server Error**
   Redirects to:
   ```http
   <BASE_URL>/api/payment/redirect?isSuccess=false
   ```

**Functionality:**
1. Validates the presence of `OtherTrxCode`, `hashValue`, and `trxCode` from the request body.
2. Fetches the payment data using the `OtherTrxCode` (unique payment identifier).
3. Checks if the payment is already processed:
   - If already paid, redirects with `alreadyPaid=true`.
4. Validates the `hashValue` to determine the payment result:
   - **Successful Hash:** Updates the payment data as paid and generates a ticket ID if applicable.
   - **Failed Hash:** Deletes the payment record.
   - **Unexpected Hash:** Logs an error and redirects with `isSuccess=false`.
5. Handles exceptions such as unexpected errors or missing parameters by redirecting with `isSuccess=false`.

**Additional Information:**
- **Helper Functions:** Utilizes `mokaAfter3dPaySuccesHelper` to handle ticket preparation for successful payments.
- **Redirection Logic:** Constructs the redirection URL based on the payment result and attaches relevant query parameters.

#### 2. 3D Payment Redirect (GET)
**Endpoint:** `/api/payment/redirect`

**Method:** `GET`

**Description:** Returns the result of a 3D Secure payment process. Indicates whether the transaction was successful or failed, and provides a ticket ID if applicable.

**Request Headers:**
None

**Request Query Parameters:**
```json
{
  "isSuccess": "true|false",
  "alreadyPaid": "true|false",
  "ticketId": "string (optional)"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "İşlem Başarılı, Yönlendiriliyorsunuz",
     "ticketId": "123456789"
   }
   ```

2. **Failure** (Transaction already paid)
   ```json
   {
     "error": true,
     "message": "İşlem işlem zaten gerçekleşti, Yönlendiriliyorsunuz",
     "ticketId": null
   }
   ```

3. **Failure** (Transaction unsuccessful)
   ```json
   {
     "error": true,
     "message": "İşlem Başarısız, Yönlendiriliyorsunuz",
     "ticketId": null
   }
   ```

**Functionality:**
1. Validates the `isSuccess`, `alreadyPaid`, and `ticketId` query parameters.
2. Determines the transaction outcome based on the `isSuccess` parameter:
   - **If true:** Responds with a success message and the `ticketId`.
   - **If false:** Checks if the `alreadyPaid` flag is true to include a specific failure message for already paid transactions.
3. Returns the appropriate JSON response indicating the transaction result.

**Notes:**
- The `ticketId` parameter is optional and only included in the response for successful transactions.

#### 3. Get Registered Cards
**Endpoint:** `/api/payment/getRegisteredCards`

**Method:** `GET`

**Description:** Retrieves a list of registered credit/debit cards for the authenticated user.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Card List Prepared Successfully",
     "totalCardCount": 2,
     "cards": [
       {
         "cardToken": "abc123xyz",
         "bank": "Example Bank",
         "cardNo": "123456...7890",
         "exprDate": "12/25",
         "cardHoldersFulName": "John Doe",
         "cardType": "Credit",
         "maxInstallmentNumber": 12
       },
       {
         "cardToken": "def456uvw",
         "bank": "Another Bank",
         "cardNo": "654321...0987",
         "exprDate": "08/24",
         "cardHoldersFulName": "Jane Doe",
         "cardType": "Debit",
         "maxInstallmentNumber": 6
       }
     ]
   }
   ```

2. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

3. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

4. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. Validates the presence of `x-access-token` in the request headers using the `auth` middleware.
2. Decodes the token to authenticate the user and retrieves the `userId`.
3. Calls `mokaGetCustomersCardsList` utility to fetch the list of cards for the authenticated user.
4. Checks for errors in the response from the utility and returns an internal server error if necessary.
5. Parses the returned card data to construct a user-friendly response with details like card token, bank name, masked card number, expiration date, cardholder's name, card type, and maximum installment number.
6. Responds with the parsed card list or an appropriate error message based on the conditions encountered.

#### 4. Delete Registered Card
**Endpoint:** `/api/payment/deleteCard/:cardToken`

**Method:** `DELETE`

**Description:** Deletes a registered card for the authenticated user using the card token.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Path Parameters:**
- `cardToken` (string): The token of the card to be deleted.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Card Removed Successfully"
   }
   ```

2. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

3. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. Validates the presence of the `x-access-token` in the request headers using the `auth` middleware.
2. Verifies the user authentication token and retrieves the `userId`.
3. Fetches the list of registered cards for the user using the `mokaGetCustomersCardsList` utility.
4. Checks if the card token belongs to the authenticated user:
   - **If not:** Returns an unauthorized error.
5. Deletes the card using the `mokaDeleteCard` utility.
6. Responds with a success message if the deletion is successful or an internal server error otherwise.

**Notes:**
- This endpoint ensures the card token belongs to the requesting user before performing any deletion.
- Handles errors gracefully to avoid exposing sensitive information.

### Edit User Routes

#### 1. Provide More User Information
**Endpoint:** `/api/user/moreUserInfo`

**Method:** `POST`

**Description:** Updates user information such as profile image, cover image, job title, and bio after the user's first login.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
- **Form Data:**
  - `profileImg`: Profile image file (optional)
  - `coverImg`: Cover image file (optional)
- **JSON:**
  ```json
  {
    "job": "string (optional)",
    "bio": "string (optional, max 150 characters)"
  }
  ```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "profileImageUrl": "https://example.com/profile.jpg",
     "coverImageUrl": "https://example.com/cover.jpg",
     "job": "Software Engineer",
     "bio": "I love coding!"
   }
   ```

2. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

3. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

4. **Bio Too Long**
   ```json
   {
     "error": true,
     "message": "Bio info can't take more than 150 characters."
   }
   ```

5. **Empty Request Body**
   ```json
   {
     "error": true,
     "message": "Empty Request Body"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. **Authentication:** Ensures the user is authenticated using the `auth` middleware.
2. **File Handling:** Handles profile and cover image uploads using `uploadProfileAssetsHelper`.
   - Deletes existing images if new ones are uploaded.
   - Saves new images to a media server.
3. **Field Updates:** Updates job title and bio if provided.
   - Validates that bio length does not exceed 150 characters.
4. **Validation:** Ensures at least one of the following is present in the request:
   - `profileImg`
   - `coverImg`
   - `job`
   - `bio`
5. **Response:** Returns updated fields or appropriate error messages based on validation and processing outcomes.

**Notes:**
- The endpoint supports both form-data and JSON input.
- Uploaded images are stored securely, and temporary files are cleaned up after processing.

#### 2. Update Profile Image
**Endpoint:** `/api/user/profileImage`

**Method:** `PUT`

**Description:** Updates the user's profile image. If no image is provided, the default profile image will be restored.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
- **Form Data:**
  - `profileImg`: Profile image file (optional)

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Profile Image Updated Successfully",
     "data": {
       "imgUrl": "https://example.com/profile.jpg",
       "recordedImgName": "profileAssets/userId_abc123_profileImg.jpg",
       "isDefaultImg": false
     }
   }
   ```

2. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

3. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

4. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. **Authentication:** Ensures the user is authenticated using the `auth` middleware.
2. **File Handling:**
   - Deletes the existing profile image if a new image is provided.
   - Uploads the new profile image to the media server.
   - If no image is provided, the user's profile image is reset to the default.
3. **Validation:**
   - Checks if the uploaded image exists in the request.
   - Handles any errors during file deletion or upload.
4. **Response:** Returns the updated profile image details or appropriate error messages based on validation and processing outcomes.

**Notes:**
- The endpoint supports only form-data input for file uploads.
- Temporary files are cleaned up after processing.

#### 3. Update User Bio

**Endpoint:** `/api/user/bio`

**Method:** `PUT`

**Description:** Update the user's bio information. The bio must be less than 150 characters.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Body:**
```json
{
  "bio": "string (max 150 characters)"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Bio Updated Succesfully",
     "data": "Updated bio content"
   }
   ```

2. **Missing Bio**
   ```json
   {
     "error": true,
     "message": "Bio is required"
   }
   ```

3. **Bio Too Long**
   ```json
   {
     "error": true,
     "message": "Bio must be less than 150 characters"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

#### 4. Update User Address

**Endpoint:** `/api/user/adress`

**Method:** `PUT`

**Description:** Updates the user's address information including country, city, latitude, longitude, and open address. If the user has a `careGiveGUID`, their address details will also be updated in the external `Moka` payment system.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Body:**
```json
{
  "country": "string",
  "city": "string",
  "lat": "number",
  "lng": "number",
  "openAdress": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Address Updated Successfully",
     "data": {
       "country": "Germany",
       "city": "Berlin",
       "lat": 52.520008,
       "lng": 13.404954,
       "openAdress": "Alexanderplatz 1, 10178 Berlin"
     }
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Country, city, lat, lng and openAdress are required"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

#### 5. Update Full Name

**Endpoint:** `/api/user/fullname`

**Method:** `PUT`

**Description:** Update the full name of a user. This endpoint requires authentication and updates the user's first name, middle name(s), and last name based on the provided full name.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Body:**
```json
{
  "fullname": "John Michael Doe"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Full Name Updated Succesfuly",
     "data": {
       "firstName": "John",
       "middleName": "Michael",
       "lastName": "Doe"
     }
   }
   ```

2. **Missing Full Name**
   ```json
   {
     "error": true,
     "message": "Full Name must contain at least 2 parts"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Moka Subseller Update Error**
   ```json
   {
     "error": true,
     "message": "Internal server error",
     "data": "Invalid request data"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Validation Rules:**
- The `fullname` field is required.
- The `fullname` must contain at least two words (e.g., first name and last name).

**Additional Notes:**
- The first letter of each name part is capitalized automatically.
- If the user is a caregiver and associated with Moka, their subseller information will be updated accordingly.
- If Moka subseller update fails, the request will return an error with the appropriate message.

**Authentication:**
- A valid `x-access-token` header is required for accessing this endpoint.

#### 6. Update User Birthday
**Endpoint:** `/api/user/birthday`

**Method:** `PUT`

**Description:** Updates the user's birthday. Requires user authentication.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "birthday": "YYYY-MM-DD"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Birthday Updated Successfully",
     "birthday": "1990-01-01"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing param"
   }
   ```

3. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User not found"
   }
   ```

4. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### 7. Get Logged-In User Information

**Endpoint:** `/api/user/getLoggedInUserInfo`

**Method:** `GET`

**Description:** Retrieves detailed information about the currently logged-in user, including their pets and depended users.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "User Info Prepared Succesfully",
     "user": {
       "_id": "1234567890abcdef12345678",
       "email": "user@example.com",
       "identity": {
         "firstName": "John",
         "lastName": "Doe",
         "birthday": "1990-01-01",
         "openAdress": "123 Example Street",
         "job": "Software Engineer",
         "bio": "A passionate developer."
       },
       "pets": [
         {
           "petId": "abcdef1234567890abcdef12",
           "isDefaultImg": false,
           "petProfileImgUrl": "https://example.com/pet1.jpg",
           "petName": "Buddy"
         },
         {
           "petId": "123456abcdef1234567890ab",
           "isDefaultImg": true,
           "petProfileImgUrl": "https://example.com/default.jpg",
           "petName": "Max"
         }
       ],
       "dependedUsers": [
         {
           "_id": "abcdef1234567890abcdef34",
           "firstName": "Jane",
           "lastName": "Doe",
           "email": "jane.doe@example.com",
           "profileImg": "https://example.com/jane.jpg"
         }
       ],
       "stars": 4.5,
       "totalStar": 10
     }
   }
   ```

2. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

3. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

4. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User Not Found"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### 8. Get Private User Info

**Endpoint:** `/api/user/getPrivateUserInfo`

**Method:** `GET`

**Description:** Retrieve private information of the currently logged-in user. This endpoint provides sensitive user information such as name, username, email, phone number, IBAN, and decrypted national ID number.

**Request Headers:**
```http
x-access-token: <your_valid_access_token>
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "data": {
       "name": "John A. Doe",
       "userName": "johndoe123",
       "email": "john.doe@example.com",
       "phone": "+1234567890",
       "iban": "DE12345678901234567890",
       "nationalIdNo": "12345678901"
     }
   }
   ```

2. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User Not Found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### 9. Get User By ID

**Endpoint:** `/api/user/getUserById/:userId`

**Method:** `GET`

**Description:** Retrieve detailed information about a specific user by their user ID. Includes associated pet information and depended user details. Accessible only to authenticated users.

**Request Headers:**
```http
x-access-token: <your_valid_access_token>
```

**Request Path Parameters:**
```json
{
  "userId": "string"
}

**Response Examples:**

1. **Success**
   ```json
   {
    "error": false,
    "message": "User Info Prepared Succesfully",
    "user": {
        "_id": "63f1b5c88f1b2a001a3f9a56",
        "identity": {
            "firstName": "John",
            "middleName": "Doe",
            "lastName": "Smith"
        },
        "userName": "johnsmith",
        "email": "john.smith@example.com",
        "phone": "+123456789",
        "pets": [
            {
                "petId": "6402d4a64e512f001c5b0e98",
                "isDefaultImg": false,
                "petProfileImgUrl": "https://example.com/images/pet1.jpg",
                "petName": "Buddy"
            }
        ],
        "dependedUsers": [
            {
                "_id": "63f1c8d98f1b2a001a3f9a67",
                "userName": "janesmith",
                "email": "jane.smith@example.com"
            }
        ],
        "stars": 4.5,
        "totalStar": 10
     }
    }
   ```

2. **Missing Params**
   ```json
    {
        "error": true,
        "message": "Missing Params"
    }
   ```

3. **User Not Found**
   ```json
    {
        "error": true,
        "message": "User Not Found"
    }
   ```
   
4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### 10. Get All Invitations

**Endpoint:** `/api/user/allInvitations/:lastItemId/:limit`

**Method:** `GET`

**Description:** Retrieve a list of all invitations for the authenticated user. This includes secondary owner invitations, pet handover invitations, event organizer invitations, event invitations, and caregive invitations.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "lastItemId": "string (optional, ID of the last fetched item for pagination)",
  "limit": "integer (maximum number of invitations to retrieve)"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Invitations found successfully",
     "totalCount": 42,
     "invitations": [
       {
         "_id": "63f1b5c88f1b2a001a3f9a56",
         "type": "SecondaryOwnerInvitation",
         "details": {
           "to": "user123",
           "from": "user456",
           "status": "pending"
         },
         "createdAt": "2025-01-15T12:00:00Z"
       },
       {
         "_id": "63f1b5c88f1b2a001a3f9a57",
         "type": "PetHandOverInvitation",
         "details": {
           "to": "user123",
           "petId": "pet789",
           "status": "accepted"
         },
         "createdAt": "2025-01-14T15:30:00Z"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

#### 11. Get Users and Events by Location

**Endpoint:** `/api/user/getUsersAndEventsByLocation/:lastItemId/:limit`

**Method:** `POST`

**Description:** Retrieve a list of nearby users and events based on location coordinates (latitude and longitude). The list is sorted by proximity, and paginated based on the provided parameters.

**Request Headers:**
```http
x-access-token: <your_user_access_token>
```

**Request Parameters:**
- `:lastItemId` (string): The ID of the last item retrieved in the previous call for pagination.
- `:limit` (integer): The number of items to retrieve.

**Request Body:**
```json
{
  "lat": <latitude>,
  "lng": <longitude>
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "discover screen users and events list is prepared successfully",
     "totalDataCount": 25,
     "dataList": [
       {
         "_id": "64b7f783de9a1a3",
         "type": "user",
         "distance": 0.0043,
         "totalStar": 15,
         "stars": 4.6,
         "pets": [
           {
             "petId": "64b7a393de4b5a1",
             "isDefaultImg": true,
             "petProfileImgUrl": "https://example.com/pet1.jpg",
             "petName": "Max"
           }
         ]
       },
       {
         "_id": "64b7f8c3de9b2b1",
         "type": "event",
         "distance": 0.0091,
         "eventAdmin": {
           "userId": "64a3e1927b8d2f3",
           "isProfileImageDefault": false,
           "userProfileImg": "https://example.com/admin1.jpg",
           "username": "admin_user",
           "userFullName": "John Doe"
         },
         "usersWhoWillJoin": [
           {
             "userId": "64a3e1937b8d2f4",
             "isProfileImageDefault": true,
             "userProfileImg": "https://example.com/user1.jpg",
             "username": "guest_user",
             "usersFullName": "Jane Smith"
           }
         ]
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "missing params"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### 12. Get Users and Events by Search Value

**Endpoint:** `/api/user/getUsersAndEventsBySearchValue/:lastItemId/:limit`

**Method:** `POST`

**Description:** Retrieve a list of users and events based on a search term and geographical location. The results can be filtered by type (user or event) and sorted by distance from the specified location.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "lastItemId": "<ID of the last item in the previous result set, or 'null' for the first request>",
  "limit": "<Maximum number of items to return in the result set>"
}
```

**Request Body:**
```json
{
  "lat": "<latitude>",
  "lng": "<longitude>",
  "searchValue": "<search term>",
  "filter": "<optional filter: 'user' or 'event'>"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "discover screen users and events list is prepared succesfully",
     "totalDataCount": 25,
     "dataList": [
       {
         "_id": "user1_id",
         "userName": "JohnDoe",
         "identity": {
           "firstName": "John",
           "lastName": "Doe"
         },
         "stars": 4.5,
         "totalStar": 20,
         "distance": 2.3,
         "pets": [
           {
             "petId": "pet1_id",
             "petProfileImgUrl": "https://example.com/pet1.jpg",
             "petName": "Buddy"
           }
         ]
       },
       {
         "_id": "event1_id",
         "name": "Pet Adoption Fair",
         "adress": {
           "adressDesc": "123 Main St",
           "lat": 40.7128,
           "long": -74.0060
         },
         "distance": 1.8,
         "eventAdmin": {
           "userId": "admin_id",
           "userName": "Admin123",
           "userFullName": "Admin Name"
         }
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "missing params"
   }
   ```

3. **Wrong Filter**
   ```json
   {
     "error": true,
     "message": "wrong type of filter"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### 13. Get Caregivers by Location

**Endpoint:** `/api/user/getCareGiversByLocation/:lastItemId/:limit`

**Method:** `POST`

**Description:** Retrieve a paginated list of caregivers near a given location. Filters out blocked and deactivated users and calculates their distance from the specified location.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Parameters:**
- `lastItemId` (path parameter): The ID of the last item from the previous request (use 'null' if this is the first request).
- `limit` (path parameter): The maximum number of caregivers to return per request.

**Request Body:**
```json
{
  "lat": <latitude>,
  "lng": <longitude>
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "careGiver list prepared succesfully",
     "totalDataCount": 25,
     "careGiverList": [
       {
         "_id": "63f9a2b8b5f6c1e7d4a5b10d",
         "stars": 4.5,
         "totalStar": 12,
         "distance": 2.34,
         "pets": [
           {
             "petId": "63f9a2c3b5f6c1e7d4a5b110",
             "isDefaultImg": false,
             "petProfileImgUrl": "https://example.com/images/pet.jpg",
             "petName": "Buddy"
           }
         ],
         "userName": "caregiver123",
         "followersCount": 35,
         "followingUsersOrPetsCount": 10,
         "caregiverCareerCount": 5
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Behavior:**
1. Authenticates the user using the provided `x-access-token`.
2. Calculates the caregivers' distances from the given latitude and longitude.
3. Filters out caregivers who are:
   - Deactivated (`deactivation.isDeactive` is `true`)
   - Blocked by the requesting user.
4. Sorts the caregivers by distance and various other metrics such as stars, followers, and career count.
5. Returns a paginated list of caregivers based on the `lastItemId` and `limit` parameters.

**Notes:**
- The `distance` field is calculated using the Euclidean formula.
- Pagination is handled by skipping items up to the `lastItemId` and returning the next set of items defined by `limit`.

#### 14. Get Care Givers by Search Value

**Endpoint:** `/api/user/getCareGiversBySearchValue/:lastItemId/:limit`

**Method:** `POST`

**Description:** Retrieves a list of caregivers based on a search value, geographical location, and pagination parameters. Results are sorted by proximity and other predefined metrics.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Path Parameters:**
```json
{
  "lastItemId": "<ID of the last item from previous results or 'null'>",
  "limit": "<Number of items to retrieve>"
}
```

**Request Body Parameters:**
```json
{
  "lat": "<Latitude of the user's location>",
  "lng": "<Longitude of the user's location>",
  "searchValue": "<Search term for filtering caregivers>"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "careGiver list prepared successfully",
     "totalCount": 25,
     "careGiverList": [
       {
         "_id": "63af9c8e8f9b7c0012345678",
         "userName": "JohnDoe",
         "identity": {
           "firstName": "John",
           "lastName": "Doe",
           "openAdress": "123 Elm Street"
         },
         "stars": 4.5,
         "totalStar": 100,
         "distance": 2.3,
         "pets": [
           {
             "petId": "63af9c8e8f9b7c0098765432",
             "isDefaultImg": false,
             "petProfileImgUrl": "https://example.com/pet.jpg",
             "petName": "Buddy"
           }
         ]
       },
       {
         "_id": "63af9c8e8f9b7c0023456789",
         "userName": "JaneDoe",
         "identity": {
           "firstName": "Jane",
           "lastName": "Doe",
           "openAdress": "456 Maple Avenue"
         },
         "stars": 4.9,
         "totalStar": 200,
         "distance": 1.7,
         "pets": []
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### 15. Get Lightweight User Info

**Endpoint:** `/api/user/getLightWeightUserInfo`

**Method:** `POST`

**Description:** Retrieve lightweight information for a list of user IDs. The endpoint returns minimal user details such as user ID, profile image, username, and full name.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "userIdList": ["<userId1>", "<userId2>", "<userId3>"]
}
```

**Request Parameters:**
- `userIdList` (array of strings): A list of user IDs to retrieve lightweight information for. Duplicate IDs in the list will be automatically removed.


**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "User info prepared successfully",
     "userList": [
       {
         "userId": "64b7d6c4e4b0a23d5f9c1234",
         "isProfileImageDefault": false,
         "userProfileImg": "https://example.com/profileImg1.jpg",
         "username": "john_doe",
         "userFullName": "John A. Doe"
       },
       {
         "userId": "64b7d6c4e4b0a23d5f9c5678",
         "isProfileImageDefault": true,
         "userProfileImg": "",
         "username": "jane_smith",
         "userFullName": "Jane Smith"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Logic Explanation:**
1. The `auth` middleware verifies the `x-access-token` header to authenticate the user.
2. The `userIdList` from the request body is sanitized to remove duplicates and ensure all entries are strings.
3. Each user ID in the list is looked up in the database to fetch lightweight information, including:
   - `userId`: The unique identifier of the user.
   - `isProfileImageDefault`: Indicates if the user’s profile image is set to a default value.
   - `userProfileImg`: The URL of the user’s profile image.
   - `username`: The user’s username.
   - `userFullName`: The user’s full name, combining first, middle, and last names.
4. If a user ID does not correspond to a valid user in the database, it is skipped.
5. The response contains an array of user information objects, or an error message if something goes wrong.

#### User Settings Routes

##### 1. Reset Username

**Endpoint:** `/api/user/profileSettings/resetUsername`

**Method:** `PUT`

**Description:** Allows the authenticated user to reset their username.

---

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "newUserName": "string"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Username has been updated succesfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "New username is required"
   }
   ```

3. **Username Already Taken**
   ```json
   {
     "error": true,
     "message": "This username already used by another user"
   }
   ```

4. **Username is the Same as Current**
   ```json
   {
     "error": true,
     "message": "You can change your username only with a new one"
   }
   ```

5. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User not found"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Additional Notes:**
- **Authentication:** A valid `x-access-token` must be provided in the request headers.
- **Validation:**
  - `newUserName` is required and must be unique.
  - The new username cannot be the same as the current username.
- **Error Handling:**
  - If the username is already taken, a relevant error message is returned.
  - If the user is not found or deactivated, the request will fail with a `404` error.
- **Database Interaction:** The username is updated in the database, and the change is saved.

##### 2. Reset User Email

**Endpoint:** `/api/user/profileSettings/resetEmail`

**Method:** `POST`

**Description:** Allows a user to reset their email address. The user must provide a new email address that is not already in use by another account. The system will validate the request and send an OTP (One-Time Password) to the new email for verification.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Validation Rules:**
- `newEmail`: Must be a valid email address format.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "OTP sent successfully to the new email address"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "New email is required"
   }
   ```

3. **Email Already Used**
   ```json
   {
     "error": true,
     "message": "This email is already used by another user"
   }
   ```

4. **Same as Current Email**
   ```json
   {
     "error": true,
     "message": "You can change your email only with a new email"
   }
   ```

5. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User couldn't be found"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Process Details:**
1. The request body is validated to ensure a `newEmail` field is provided and is in the correct format.
2. The system checks if the new email is already associated with another account.
3. If the email is valid and unique, any existing OTP records for the user are deleted.
4. An OTP email is sent to the provided email address for verification.
5. The response confirms the OTP has been sent or details the encountered error.

**Notes:**
- Users must verify the OTP sent to the new email address to complete the email reset process.
- The endpoint is secured with JWT-based authentication.

##### 3. Verify Reset Email OTP

**Endpoint:** `/api/user/profileSettings/verifyResetEmailOTP`

**Method:** `POST`

**Description:** Verifies the OTP sent to the user's new email address for resetting their email.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "email": "new_email@example.com",
  "otp": "123456"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "message": "Email updated succesfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Empty otp details are not allowed"
   }
   ```

3. **Account Record Doesn't Exist or Already Verified**
   ```json
   {
     "error": true,
     "message": "Account record doesn't exist or has been verified already"
   }
   ```

4. **OTP Expired**
   ```json
   {
     "error": true,
     "message": "Code has expired. Please request again"
   }
   ```

5. **Invalid OTP**
   ```json
   {
     "error": true,
     "message": "Invalid code passed. Check your inbox"
   }
   ```

6. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User not found"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Workflow:**
- The endpoint requires the `x-access-token` header for authentication.
- It verifies that the `email` and `otp` fields are provided in the request body.
- Checks for an existing OTP record linked to the user and the provided email.
- Validates if the OTP has expired. If expired, the record is deleted, and an error is returned.
- Compares the provided OTP with the stored hashed OTP.
- If valid, the user's email is updated in the database.
- Deletes the OTP verification record after successful email update.
- If the user is a caregiver with a `careGiveGUID`, updates the email in the external Moka system as well.

**Edge Cases:**
- If the OTP is invalid, an appropriate error is returned.
- If the OTP has expired, the user must request a new OTP.
- Handles scenarios where the user record is deactivated or not found.
- Ensures the new email is not already in use by another user.

##### 4. Reset Password

**Endpoint:** `/api/user/profileSettings/resetPassword`

**Method:** `PUT`

**Description:** Allows the user to reset their password by providing their current password and a new password. The user must be authenticated to use this endpoint.

**Request Headers:**
```http
x-access-token: <user_authentication_token>
```

**Request Body:**
```json
{
  "oldPassword": "<current_password>",
  "oldPasswordReply": "<repeat_current_password>",
  "newPassword": "<new_password>"
}
```

- **oldPassword**: The current password of the user (required).
- **oldPasswordReply**: A confirmation of the current password (required; must match `oldPassword`).
- **newPassword**: The new password to set for the account (required).

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Password changed successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Validation error: <description_of_missing_parameter>"
   }
   ```

3. **Password Mismatch**
   ```json
   {
     "error": true,
     "message": "Old passwords are not same"
   }
   ```

4. **Invalid Password**
   ```json
   {
     "error": true,
     "message": "Invalid password"
   }
   ```

5. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User couldn't found"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Validation Rules:**
1. The `oldPassword` and `oldPasswordReply` fields must match.
2. The `newPassword` field must meet the security requirements defined in the backend validation schema.

**Error Handling:**
- If the `x-access-token` header is missing or invalid, the server responds with a `403` status code and an appropriate error message.
- If the provided current password does not match the stored password, the server responds with a `401` status code.
- If the user is not found or their account is deactivated, the server responds with a `404` status code.

**Notes:**
- Passwords are securely hashed using bcrypt before being stored in the database.
- The system enforces a strong password policy to ensure account security.
- This endpoint is only accessible to authenticated users.


**Developer Tips:**
- Ensure the `x-access-token` is sent in the request headers.
- Use a secure HTTPS connection when calling this endpoint to prevent sensitive data from being intercepted.

##### 5. Forget My Password

**Endpoint:** `/api/user/profileSettings/forgetMyPassword`

**Method:** `PUT`

**Description:** This endpoint allows a user to reset their password by generating a one-time temporary password that is sent to their email address.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```
- **email**: (string, required) The email address associated with the user's account.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "New password sent to your email"
   }
   ```

2. **Missing Email**
   ```json
   {
     "error": true,
     "message": "Email required"
   }
   ```

3. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User couldn't found"
   }
   ```

4. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Data Processing:**
1. Extracts the email from the request body.
2. Validates the email field; returns an error if it is missing.
3. Searches for the user in the database using the provided email address.
   - Returns an error if the user does not exist or if the account is deactivated.
4. Generates a one-time password (OTP).
   - Uses `crypto` to generate a random password.
   - Hashes the password using `bcrypt`.
5. Sends the OTP to the user's email using the `sendOneTimePassword` utility.
6. Removes any existing tokens for the user and saves the new temporary password in the `TempPassword` collection.

**Error Handling:**
- If the email is missing, a `400` status with an appropriate message is returned.
- If the user is not found or the account is deactivated, a `404` status is returned.
- Any other errors, including database or email sending issues, result in a `500` status.

**Models Affected:**
- **User:** Verifies the existence of the user.
- **TempPassword:** Stores the hashed temporary password.
- **UserToken:** Deletes existing tokens to invalidate current sessions.

**Utilities Used:**
- **sendOneTimePassword:** Sends the OTP to the user's email.
- **bcrypt:** Hashes the generated OTP for secure storage.
- **crypto:** Generates a secure random OTP.

##### 6. Add Phone Number

**Endpoint:** `/api/user/profileSettings/addPhoneNumber`

**Method:** `POST`

**Description:** This endpoint allows users to add or update their phone number. Depending on the phone number's country, validation and OTP verification mechanisms are used.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Body:**
```json
{
  "phoneNumber": "+905xxxxxxxxx"
}
```

**Body Parameters:**
- `phoneNumber` (string, required): The new phone number to be added or updated.

**Response Examples:**

1. **Success:**
   ```json
   {
     "error": false,
     "message": "OTP has been sent to your phone number"
   }
   ```

2. **Missing Parameters:**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

3. **Phone Number Already Used:**
   ```json
   {
     "error": true,
     "message": "This number already used"
   }
   ```

4. **Invalid Phone Number:**
   ```json
   {
     "error": true,
     "message": "Invalid Phone Number"
   }
   ```

5. **User Not Found:**
   ```json
   {
     "error": true,
     "message": "User couldn't found"
   }
   ```

6. **Internal Server Error:**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Workflow Details:**
1. **Input Validation:**
   - The input `phoneNumber` is validated to check if it is in the correct format and does not already exist in the database.

2. **Phone Number Categorization:**
   - The phone number is checked to determine if it is Turkish or international.

3. **SMS Balance Check:** (For Turkish Numbers)
   - If the phone number is Turkish and the system has sufficient SMS balance, an OTP is sent using the Vatan SMS service.

4. **Send OTP Verification:**
   - For non-Turkish numbers or when Turkish SMS balance is insufficient, a fallback SMS service is used to send the OTP.

5. **Database Update:**
   - Existing OTP records for the user and the phone number are deleted.
   - A new OTP record is generated and saved for verification purposes.

**Notes:**
- The endpoint ensures the uniqueness of phone numbers across all users.
- Turkish phone numbers are formatted to include the leading `0` when necessary.
- The Vatan SMS service is used primarily for Turkish numbers with sufficient balance.

**Developer Notes:**
- Ensure that the `vatanSmsBalanceQueryApiRequest` utility correctly retrieves and validates SMS balance.
- Logs should be maintained for debugging issues related to SMS services or database operations.
- The response messages should remain user-friendly and descriptive.

##### 7. Verify Phone Number

**Endpoint:** `/api/user/profileSettings/verifyPhoneNumber`

**Method:** `POST`

**Description:** Verify a phone number by checking the OTP (One-Time Password) sent to the user's phone. Handles Turkish and foreign phone numbers with separate validation processes.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Body:**
```json
{
  "phoneNumber": "<string>",
  "otp": "<string>"
}
```
- `phoneNumber`: The phone number to verify.
- `otp`: The One-Time Password sent to the specified phone number.

**Possible Responses:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Phone number verified successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "validation error - <details>"
   }
   ```

3. **Invalid Phone Number**
   ```json
   {
     "error": true,
     "message": "Invalid Phone Number"
   }
   ```

4. **Verification Not Requested**
   ```json
   {
     "error": true,
     "message": "Verification didn't request for this phone number"
   }
   ```

5. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User couldn't found"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Processing Logic:**
1. **Input Validation**:
   - Validates `phoneNumber` and `otp` using `verifyPhoneBodyValidation`.
   - Returns error if validation fails.

2. **Check Phone Number Format**:
   - Identifies Turkish numbers starting with "+9" and ensures proper formatting.
   - Validates numbers without `05` in Turkish format.

3. **User Validation**:
   - Retrieves the user based on the authenticated session.
   - Ensures the user exists and is active.

4. **Verification Object Retrieval**:
   - Checks for an existing OTP verification request for the provided phone number.
   - Returns error if no request exists.

5. **Verify OTP**:
   - Uses `vatanSmsVerifyOtp` for Turkish numbers if the Vatan SMS service is active.
   - Uses `verifyOTPVerificationSMS` for foreign numbers or fallback.

6. **Response**:
   - Returns success upon successful verification.
   - Deletes verification objects from the database after successful verification.

**Notes:**
- Handles both Turkish and foreign numbers.
- Uses Vatan SMS API for Turkish number validation.
- Ensures that OTP expiration, duplication, and reuse are properly managed.

##### 8. Add ID Number

**Endpoint:** `/api/user/profileSettings/addIdNo`

**Method:** `PUT`

**Description:** Adds a national ID or passport number to the user’s profile based on their citizenship status. The ID number is encrypted before being saved to the database.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Body:**
```json
{
  "isTCCitizen": "true", // "true" or "false" based on citizenship status
  "idNo": "12345678901", // National ID or Passport Number
  "countryCode": "US" // Required if isTCCitizen is "false"
}
```

**Response Examples:**

1. **Success:**
   ```json
   {
     "error": false,
     "message": "Id number inserted successfully",
     "idNumber": "123...01"
   }
   ```

2. **Missing Parameters:**
   ```json
   {
     "error": true,
     "message": "Missing required params"
   }
   ```

3. **Invalid ID Number:**
   ```json
   {
     "error": true,
     "message": "Id number is not valid"
   }
   ```

4. **Invalid Citizenship Status:**
   ```json
   {
     "error": true,
     "message": "TC ID No is required for you"
   }
   ```
   OR
   ```json
   {
     "error": true,
     "message": "Passport No is required for you"
   }
   ```

5. **User Not Found:**
   ```json
   {
     "error": true,
     "message": "User not found"
   }
   ```

6. **Encryption or Saving Error:**
   ```json
   {
     "error": true,
     "message": "ERROR: while saving user data"
   }
   ```

7. **Moka Request Error:**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```
   OR
   ```json
   {
     "error": true,
     "message": "<Moka error message>"
   }
   ```

**Workflow Explanation:**
1. **Authentication:**
   - The `auth` middleware verifies the `x-access-token` header to authenticate the user.

2. **Input Validation:**
   - Ensures `idNo`, `isTCCitizen`, and (if required) `countryCode` are provided.
   - Validates the format of the national ID or passport number based on citizenship status.

3. **Encryption:**
   - Encrypts the ID number using the configured algorithm and encryption key.

4. **Data Validation:**
   - Checks if the user exists and is active.
   - Validates ID number type based on citizenship status.

5. **Database Update:**
   - Saves the encrypted ID number to the user's profile.

6. **Integration with Moka (if applicable):**
   - If the user has a `careGiveGUID`, updates the subseller information via a Moka API request.

7. **Response:**
   - Returns a success message with a partially masked ID number.
   - Handles and returns appropriate error messages for any failures.

**Notes:**
- This endpoint requires the user to be authenticated.
- TC ID numbers are validated using the `validateTcNo` utility.
- Passport numbers are validated using the `validator.isPassportNumber` method.
- Errors during Moka API requests or database operations are logged and returned as internal server errors.
- All sensitive data is encrypted before storage for security compliance.

##### 9. Add Address

**Endpoint:** `/api/user/profileSettings/addAdress`

**Method:** `PUT`

**Description:** Adds or updates the address for the authenticated user.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Body:**
```json
{
  "adress": "<User's address as a string>"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Address inserted successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "missing params"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User not found"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Logic and Data Handling:**
1. Extracts `adress` from the request body.
2. Validates the presence of the `adress` field. If missing, responds with a 400 status.
3. Verifies the user's identity using the `x-access-token` header.
4. Checks if the user exists and is not deactivated. If not, responds with a 404 status.
5. If the user is linked to a `careGiveGUID`, updates the address in the external `paramUpdateSubSellerRequest` service:
   - If the request fails, responds with a 500 status and the appropriate error message.
6. Updates the user's `identity.openAdress` field in the database and saves the changes.
7. Returns a success response if all operations complete successfully.

##### 10. Certificate Upload

**Endpoint:** `/api/user/profileSettings/certificate`

**Method:** `POST`

**Description:**
Allows caregivers to upload certificates (PDF or image files) to verify their qualifications. The uploaded certificate is processed and stored in the user's profile.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Body:**
- Multipart/form-data:
  - `file` (required): The certificate file to be uploaded (JPEG, JPG, or PDF).
  - `desc` (optional): A description of the certificate.

**Response Examples:**

1. **Success:**
   ```json
   {
     "error": false,
     "message": "Certificate Inserted Succesfully",
     "url": "profileAssets/<userId>/careGiveCertificates/<fileName>",
     "desc": "Child Care Training Certificate"
   }
   ```

2. **Missing File:**
   ```json
   {
     "error": true,
     "message": "Missing file parameter"
   }
   ```

3. **Invalid File Format:**
   ```json
   {
     "error": true,
     "message": "Wrong File Format"
   }
   ```

4. **Token Expired:**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error:**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- Only JPEG, JPG, and PDF formats are accepted for upload.
- The file is temporarily stored on the server and then moved to a permanent storage location.
- File names are auto-generated using the user ID and a random identifier to ensure uniqueness.
- If the user is linked to an external service (e.g., payment processing), additional updates are made to synchronize the certificate data.
- If the certificate upload fails at any stage, appropriate error messages are returned.

**Processing Logic:**
1. **Authentication:** Verifies the `x-access-token` header to authenticate the user.
2. **File Validation:** Ensures the uploaded file is in an accepted format.
3. **Temporary Storage:** Temporarily saves the file for processing.
4. **Permanent Storage:** Uploads the file to the server’s permanent storage location.
5. **User Profile Update:** Adds the certificate URL and description to the user’s profile under the `identity.certificates` array.
6. **Error Handling:** Deletes temporary files and handles errors during the upload or synchronization process.

##### 11. Edit Caregiver Certificate Description

**Endpoint:** `/api/user/profileSettings/editCertificate`

**Method:** `PUT`

**Description:** Edit the description of an existing caregiver certificate uploaded by the user.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Body:**
```json
{
  "certificateUrl": "<string>",
  "desc": "<string>"
}
```

- **certificateUrl**: The URL of the certificate file to be updated. *(Required)*
- **desc**: The new description for the certificate. *(Required)*

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "New Desc Inserted Succesfully",
     "newDesc": "Updated description of the certificate."
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Certificate Not Found**
   ```json
   {
     "error": true,
     "message": "Certificate Not Found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Error Handling:**
- If the request body is missing `certificateUrl` or `desc`, a `400 Bad Request` response is returned.
- If the specified certificate URL does not exist for the user, a `404 Not Found` response is returned.
- If the user is not authenticated, a `403 Forbidden` response is returned.
- In case of an expired token, a `403 Forbidden` response is returned.
- For unexpected errors, a `500 Internal Server Error` response is returned.

**Notes:**
- The `x-access-token` header is required for authentication.
- This endpoint modifies the description of an existing certificate. Ensure that the `certificateUrl` corresponds to a valid certificate uploaded by the user.
- All updates are immediately persisted to the database.

##### 12. Delete Caregiver Certificates

**Endpoint:** `/api/user/profileSettings/certificate`

**Method:** `DELETE`

**Description:** Deletes one or more caregiver certificates associated with the authenticated user. Files are removed from the storage, and the corresponding database entries are updated.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "urlList": [
    "https://example.com/path/to/certificate1",
    "https://example.com/path/to/certificate2"
  ]
}
```
- `urlList` (array of strings): List of URLs of the certificates to be deleted. This field is required and must contain at least one URL.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Certificates deleted successfully",
     "remainedCertificates": [
       {
         "desc": "Certificate Description 1",
         "fileUrl": "https://example.com/path/to/remaining_certificate1"
       },
       {
         "desc": "Certificate Description 2",
         "fileUrl": "https://example.com/path/to/remaining_certificate2"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "File url to delete is required"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Certificate Not Found**
   ```json
   {
     "error": true,
     "message": "Certificate Not Found"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Validation Rules:**
- The `urlList` must not be empty and must contain valid URLs of certificates.
- The user must be authenticated via a valid `x-access-token`.

##### 13. CareGiver Payment Info

**Endpoint:** `/api/user/profileSettings/careGiverPaymentInfo`

**Method:** `PUT`

**Description:** Update the caregiver payment information for a user.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "paymentInfo": {
    "iban": "TRXXXXXXXXXXXXXXXXXX",
    "name": "John Doe",
  }
}
```
**Notes:**
- All fields inside the `paymentInfo` object are required.
- IBAN should comply with international banking standards.

**Response Examples:**

1. **Success**
   ```json
   {
    "error": false,
    "message": "Payment information updated successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
    "error": true,
    "message": "Missing or invalid payment information"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Validation Rules:**
- IBAN: Must be validated for length and format.
- The user must be authenticated via a valid `x-access-token`.

##### 14. Become a Caregiver

**Endpoint:** `/api/user/profileSettings/becomeCareGiver`

**Method:** `PUT`

**Description:** Allows a user to register as a caregiver by providing required personal and banking details. The user must have pre-filled essential fields such as IBAN, phone number, ID, and address in their profile.

**Request Headers:**
```http
x-access-token: <your_access_token>
```
**Response Examples:**

1. **Success**
   ```json
   {
    "error": false,
    "message": "Became Caregiver Operation Successful"
   }

   ```

2. **Missing IBAN**
    ```json
    {
    "error": true,
    "message": "You haveto insert iban firstly"
    }
    ```

3. **Missing ID Number**
     ```json
    {
     "error": true,
     "message": "You haveto insert your id number or passport number firstly"
    }
    ```

4. **Missing Phone Number**
     ```json
    {
        "error": true,
        "message": "You haveto insert your id number or passport number firstly"
    }
    ```

5. **Missing Address**
     ```json
    {
    "error": true,
    "message": "You have to insert openAdress"
    }
    ```

6. **User Already Caregiver**
     ```json
    {
     "error": true,
     "message": "User Is Already CareGiver"
    }
    ```

7. **User Not Found**
     ```json
    {
     "error": true,
     "message": "User couldn't found"
    }
    ```

8.  **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Process:**
- The request verifies the user's token.
- Checks whether the user has pre-filled:
    - IBAN
    - National ID or Passport Number
    - Phone Number
    - Email
    - Address
- If any of these fields are missing, the request fails with appropriate messages.
- If the user is eligible, the backend integrates with Moka POS to register the user as a caregiver.
- If Moka POS registration is successful, the user’s status is updated to isCareGiver: true.

**Validation Rules:**
- IBAN: Must be valid and unique.
- National ID or Passport Number: Properly encrypted and validated.
- Phone Number: Must be registered in the user's profile.
- Email Address: A valid email address must be associated with the user.
- Address: Must be non-empty and complete.

##### 15. Block User

**Endpoint:** `/api/user/profileSettings/block/:userId`

**Method:** `PUT`

**Description:** Blocks a user specified by `userId`. The blocking user will no longer interact with the blocked user through pets, events, chats, notifications, or dependencies.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Parameters:**
- `:userId` (string) - The ID of the user to be blocked.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "User blocked successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "missing params"
   }
   ```

3. **User Not Found**
   ```json
   {
     "error": true,
     "message": "user not found"
   }
   ```

4. **Dependency Exists**
   ```json
   {
     "error": true,
     "message": "You have dependency with user"
   }
   ```

5. **User Already Blocked**
   ```json
   {
     "error": true,
     "message": "User already blocked"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Process:**

1. **Authorization:**
   - Validates the user's token via the `auth` middleware.
   - Retrieves the authenticated user's ID from the token.

2. **Parameter Validation:**
   - Checks if `userId` is provided in the URL.

3. **User Lookup:**
   - Ensures both the blocking and target users exist and are active.

4. **Dependency Check:**
   - Verifies there are no dependencies (e.g., pets, invitations, chats) between the users.

5. **Remove Interactions:**
   - Removes any mutual connections, such as:
     - Pet ownership or followership.
     - Chat group memberships.
     - Notifications sent or received.
     - Invitations sent or received.

6. **Add to Blocked Users:**
   - Adds the target user to the blocking user's `blockedUsers` list.
   - Saves the updated user data to the database.

7. **Success Response:**
   - Returns a success message if the operation completes without errors.

##### 16. Unblock User

**Endpoint:** `/api/user/profileSettings/unblock/:userId`

**Method:** `PUT`

**Description:** Unblock a previously blocked user.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Path Parameters:**
- `userId` (string): The ID of the user to unblock.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "User unblocked succesfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "missing params"
   }
   ```

3. **User Not Found**
   ```json
   {
     "error": true,
     "message": "user not found"
   }
   ```

4. **User Not Blocked**
   ```json
   {
     "error": true,
     "message": "User is not blocked"
   }
   ```

5. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

##### 17. Deactivate User Account

**Endpoint:** `/api/user/profileSettings/deactivate`

**Method:** `PUT`

**Description:** Deactivates the user's account, removing them from all associated chats, notifications, and invitations, and marking the account as deactivated. The user will not be deleted but marked as inactive.

**Request Headers:**
```http
x-access-token: <your_auth_token>
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "User deactivated"
   }
   ```

2. **User Not Found**
   ```json
   {
     "error": true,
     "message": "user not found"
   }
   ```

3. **Linked Care Give Exists**
   ```json
   {
     "error": true,
     "message": "You have a care give linked to you"
   }
   ```

4. **User Already Deactivated**
   ```json
   {
     "error": true,
     "message": "user is already deactive"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

##### 18. Delete User Account

**Endpoint:** `/api/user/profileSettings/deleteUser`

**Method:** `DELETE`

**Description:** Deletes a user account and deactivates it, marking it for deletion after 30 days. Also removes related data such as notifications, chat memberships, and invitations.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Parameters:**
None

**Request Body:**
None

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "User deactivated and will be deleted after 30 days"
   }
   ```

2. **User Not Found**
   ```json
   {
     "error": true,
     "message": "user not found"
   }
   ```

3. **User Already Deactivated**
   ```json
   {
     "error": true,
     "message": "user is already deactive"
   }
   ```

4. **Linked CareGive Exists**
   ```json
   {
     "error": true,
     "messaage": "You have a care give linked to you"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

#### User Interractions Routes

##### 1. Follow or Unfollow a User
**Endpoint:** `/api/user/interractions/followUser/:followingUserId`

**Method:** `PUT`

**Description:** Allows the authenticated user to follow or unfollow another user. If the user is already following, this endpoint will unfollow the target user and vice versa.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Path Parameters:**
```plaintext
:followingUserId - The ID of the user to follow or unfollow.
```

**Request Body:**
No additional body parameters required.

**Response Examples:**

1. **Success - User Followed**
   ```json
   {
     "error": false,
     "message": "user followed or unfollowed succesfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Id of the user which you want to follow is required"
   }
   ```

3. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User not found"
   }
   ```

4. **Target User Does Not Exist**
   ```json
   {
     "error": true,
     "message": "User which you want to follow doesn't exists"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

6. **Unfollow Due to Record Inconsistency**
   ```json
   {
     "error": true,
     "message": "pet unfollowed because there was an issue with records. Please re try to follow"
   }
   ```

##### Story Endpoints

##### 1. Create Story

**Endpoint:** `/api/user/interractions/story/`

**Method:** `POST`

**Description:** This endpoint allows authenticated users to create a story about an event, pet, or user. The story can contain an image or video.

**Request Headers:**
```http
x-access-token: <your_authentication_token>
```

**Request Body Parameters:**
| Parameter      | Type   | Required | Description                                      |
|----------------|--------|----------|--------------------------------------------------|
| `file`         | File   | Yes      | Image (JPEG/JPG) or Video (MP4) for the story.  |
| `aboutId`      | String | Yes      | ID of the entity the story is about.            |
| `aboutType`    | String | Yes      | Type of the entity (`event`, `pet`, or `user`). |
| `desc`         | String | No       | Description or caption for the story.           |

---

**Response Examples:**

1. **Success**
   ```json
   {
       "error": false,
       "message": "Story with id 62a34567b89c123d456e789f, created succesfully",
       "storyId": "62a34567b89c123d456e789f",
       "contentUrl": "https://example.com/path/to/story",
       "storyExpireDate": "2025-01-13T12:00:00Z"
   }
   ```

2. **Missing Parameters**
   ```json
   {
       "error": true,
       "message": "Story must be about an event, pet or user"
   }
   ```

3. **Invalid File Type**
   ```json
   {
       "error": true,
       "message": "Wrong File Format"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
       "error": true,
       "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**
   ```json
   {
       "error": true,
       "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
       "error": true,
       "message": "Internal server error"
   }
   ```

##### 2. Delete Story

**Endpoint:** `/api/user/interractions/story/`

**Method:** `DELETE`

**Description:** Deletes a user's story from the system. The user must be the owner of the story to perform this action. The content associated with the story is also removed from the storage.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Body:**
```json
{
  "storyId": "string" // The ID of the story to be deleted
}
```

**Response Examples:**

**Success:**
```json
{
  "error": false,
  "message": "Story deleted succesfully"
}
```

**Missing Parameters:**
```json
{
  "error": true,
  "message": "storyId is required"
}
```

**Story Not Found:**
```json
{
  "error": true,
  "message": "Story couldn't found"
}
```

**Unauthorized Action:**
```json
{
  "error": true,
  "message": "you can't delete this story"
}
```

**Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

##### 3. Like or Unlike a Story

**Endpoint:** `/api/user/interractions/story/:storyId`

**Method:** `PUT`

**Description:** This endpoint allows a user to like or unlike a story. If the user has already liked the story, their like is removed. Otherwise, the user likes the story.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Path Parameters:**
```json
{
  "storyId": "string (required)" // ID of the story to be liked or unliked
}
```

**Response Examples:**

1. **Success**  
When the user successfully likes or unlikes a story:
   ```json
   {
     "error": false,
     "message": "Story liked or like removed succesfully"
   }
   ```

2. **Missing Parameters**  
When the `storyId` parameter is missing:
   ```json
   {
     "error": true,
     "message": "storyId is required"
   }
   ```

3. **Story Not Found**  
When the specified story does not exist:
   ```json
   {
     "error": true,
     "message": "Story couldn't found"
   }
   ```

4. **Unauthorized Access**  
When the user provides an invalid or missing token:
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**  
When the user's token has expired:
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**  
When an unexpected error occurs:
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

##### 4. Get Story By User ID

**Endpoint:** `/api/user/interractions/story/getStoryByUserId/:userId`

**Method:** `GET`

**Description:** Retrieve stories associated with a specific user by their user ID. The endpoint provides detailed information about the stories, including tagged entities, likes, comments, and other metadata. If no `userId` is provided, the requester's user ID will be used by default.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "userId": "<target_user_id>"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Story List Prepared Successfully",
     "stories": [
       {
         "_id": "60b8a7f28f1a2c0017d3e0c3",
         "contentUrl": "https://example.com/story1.jpg",
         "about": {
           "aboutType": "pet",
           "taged": {
             "_id": "60b8a7f28f1a2c0017d3e0c4",
             "name": "Buddy",
             "type": "dog"
           }
         },
         "user": {
           "_id": "60b8a7f28f1a2c0017d3e0c1",
           "name": "John Doe",
           "avatar": "https://example.com/avatar.jpg"
         },
         "firstFiveLikedUser": [
           {
             "_id": "60b8a7f28f1a2c0017d3e0c5",
             "name": "Jane Smith",
             "avatar": "https://example.com/avatar2.jpg"
           }
         ],
         "didUserLiked": true,
         "likeCount": 15,
         "lastComment": {
           "text": "Great story!",
           "lastReply": {
             "text": "Thank you!",
             "likeCount": 5
           },
           "replyCount": 1,
           "likeCount": 10,
           "lastThreeRepliedUsers": [
             {
               "_id": "60b8a7f28f1a2c0017d3e0c6",
               "name": "Alice Green",
               "avatar": "https://example.com/avatar3.jpg"
             }
           ]
         },
         "commentCount": 5
       }
     ]
   }
   ```

2. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User Not Found"
   }
   ```

3. **No Story Found**
   ```json
   {
     "error": true,
     "message": "No Story Found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

##### 5. Get Recommended Story List

**Endpoint:** `/api/user/interractions/story/getRecomendedStoryList/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieves a list of recommended stories for the user based on their following list and related events.

---

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Parameters:**
Path Parameters:
| Parameter        | Type   | Required | Description                                                                 |
|------------------|--------|----------|-----------------------------------------------------------------------------|
| `lastElementId`  | String | No       | The ID of the last story element retrieved. If not provided, fetches from the beginning. |
| `limit`          | Number | No       | The number of stories to retrieve. Default is 15.                          |

---

**Response Examples:**

1. **Success**
```json
{
  "error": false,
  "message": "Story List Prepared Succesfully",
  "stories": [
    {
      "user": {
        "id": "123456",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "about": {
        "aboutType": "pet",
        "taged": {
          "id": "789123",
          "name": "Buddy",
          "type": "dog"
        }
      },
      "likeCount": 10,
      "lastComment": {
        "user": {
          "id": "654321",
          "name": "Jane Doe"
        },
        "text": "Cute story!",
        "likeCount": 5
      },
      "commentCount": 2,
      "createdAt": "2025-01-12T12:00:00Z"
    }
  ]
}
```

2. **No Stories Found**
```json
{
  "error": true,
  "message": "No Story Found"
}
```

3. **Unauthorized Access**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

4. **Token Expired**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

5. **Internal Server Error**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

##### Story Comment Endpoints

###### 1. Add Comment or Reply to Story

**Endpoint:** `/api/user/interractions/story/comments/:storyId`

**Method:** `POST`

**Description:** Add a comment or reply to a specific story.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Parameters:**

- **Path Parameters:**
  ```json
  {
    "storyId": "<string>" // The ID of the story to which the comment or reply is being added.
  }
  ```

- **Body Parameters:**
  ```json
  {
    "desc": "<string>", // The content of the comment or reply (required).
    "commentId": "<string>" // (Optional) The ID of the comment being replied to. If omitted, a new comment will be created.
  }
  ```

**Response Examples:**

1. **Success (New Comment Added)**
   ```json
   {
     "error": false,
     "commentId": "63e5e1234abcd56789012345",
     "replyId": null,
     "message": "comment or reply inserted succesfully"
   }
   ```

2. **Success (Reply Added)**
   ```json
   {
     "error": false,
     "commentId": null,
     "replyId": "63e5e1234abcd56789054321",
     "message": "comment or reply inserted succesfully"
   }
   ```

3. **Missing `desc` Field**
   ```json
   {
     "error": true,
     "message": "desc is required"
   }
   ```

4. **Invalid `storyId`**
   ```json
   {
     "error": true,
     "message": "storyId is required"
   }
   ```

5. **Story Not Found**
   ```json
   {
     "error": true,
     "message": "Story couldn't found"
   }
   ```

6. **Comment Not Found (for Reply)**
   ```json
   {
     "error": true,
     "message": "comment not found"
   }
   ```

7. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

8. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

9. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Notes:**
- The `desc` field is required for both comments and replies.
- If `commentId` is provided, a reply will be added to the specified comment.
- The endpoint verifies the user's authentication token before processing the request.
- Notifications are sent to the story owner or comment owner based on the action performed.
- The response will include either `commentId` or `replyId` based on the type of action.

###### 2. Edit Comment or Reply on Story
**Endpoint:** `/api/user/interractions/story/comments/edit/:storyId`

**Method:** `PUT`

**Description:** Allows editing a comment or a reply on a specific story.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Path Parameters:**
| Name      | Type   | Required | Description                  |
|-----------|--------|----------|------------------------------|
| `storyId` | String | Yes      | The ID of the story.         |

**Request Body:**
| Name       | Type   | Required | Description                                      |
|------------|--------|----------|--------------------------------------------------|
| `commentId`| String | Yes      | The ID of the comment to be edited.             |
| `replyId`  | String | No       | The ID of the reply to be edited (if applicable).|
| `desc`     | String | Yes      | The updated content of the comment or reply.    |

**Response Examples:**

**1. Success**
**Status Code:** `200 OK`
```json
{
  "error": false,
  "message": "comment or reply inserted successfully"
}
```

**2. Missing Path Parameter**
**Status Code:** `400 Bad Request`
```json
{
  "error": true,
  "message": "storyId is required"
}
```

**3. Missing Body Parameter (commentId)**
**Status Code:** `400 Bad Request`
```json
{
  "error": true,
  "message": "commentId is required"
}
```

**4. Missing Body Parameter (desc)**
**Status Code:** `400 Bad Request`
```json
{
  "error": true,
  "message": "desc is required"
}
```

**5. Story Not Found**
**Status Code:** `404 Not Found`
```json
{
  "error": true,
  "message": "Story couldn't found"
}
```

**6. Comment Not Found**
**Status Code:** `404 Not Found`
```json
{
  "error": true,
  "message": "comment not found"
}
```

**7. Reply Not Found**
**Status Code:** `404 Not Found`
```json
{
  "error": true,
  "message": "reply not found"
}
```

**8. Internal Server Error**
**Status Code:** `500 Internal Server Error`
```json
{
  "error": true,
  "message": "Internal server error"
}
```

###### 3. Delete Story Comment or Reply

**Endpoint:** `/api/user/interractions/story/comments/:storyId`

**Method:** `DELETE`

**Description:** Deletes a specific comment or reply associated with a story.

**Request Headers:**
```http
x-access-token: <your_valid_access_token>
```

**Request Parameters:**

**Request Path Parameters:**
| Parameter   | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `storyId`   | String | The ID of the story to delete comment or reply from. |

**Request Body:**
| Parameter   | Type   | Description                              |
|-------------|--------|------------------------------------------|
| `commentId` | String | The ID of the comment to be deleted.     |
| `replyId`   | String | (Optional) The ID of the reply to delete. If provided, the reply is deleted instead of the entire comment. |

**Response Examples:**

**1. Success**
```json
{
  "error": false,
  "message": "comment or reply deleted successfully"
}
```

**2. Missing Parameters**
```json
{
  "error": true,
  "message": "storyId is required"
}
```

**3. Comment Not Found**
```json
{
  "error": true,
  "message": "comment not found"
}
```

**4. Unauthorized Access**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

**5. Internal Server Error**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Notes:**
- Ensure the `x-access-token` header contains a valid token.
**Notes:**
- If `replyId` is provided, the endpoint will delete the specified reply under the comment.
- If `replyId` is not provided, the entire comment along with its replies will be deleted.
- The endpoint returns `404` if the story or comment does not exist.
- The endpoint is protected and requires authentication.

###### 4. Get Story Comments by Story ID

**Endpoint:** `/api/user/interractions/story/comments/:storyId/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieves a list of comments for a specific story, allowing pagination through the `lastElementId` parameter. Users can fetch a limited number of comments at a time, including details about replies, likes, and metadata for each comment.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "storyId": "<Story ID to fetch comments for>",
  "lastElementId": "<ID of the last comment fetched, or 'null' for initial fetch>",
  "limit": "<Number of comments to fetch, default is 15>"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comments Prepared successfully",
     "totalCommentCount": 20,
     "commentCount": 10,
     "comments": [
       {
         "_id": "63bfc5ab347a42d9a9823a1b",
         "user": {
           "userId": "123456",
           "username": "user1",
           "profilePicture": "path/to/profile/pic"
         },
         "comment": "This is a comment",
         "firstFiveLikedUser": [
           {
             "userId": "789101",
             "username": "user2",
             "profilePicture": "path/to/profile/pic"
           }
         ],
         "didUserLiked": true,
         "likeCount": 5,
         "lastReply": {
           "_id": "123abc",
           "reply": "This is a reply",
           "likeCount": 2
         },
         "replyCount": 3,
         "lastThreeRepliedUsers": [
           {
             "userId": "654321",
             "username": "user3",
             "profilePicture": "path/to/profile/pic"
           }
         ]
       }
     ]
   }
   ```

2. **No Comments Found**
   ```json
   {
     "error": true,
     "message": "No Comment Found"
   }
   ```

3. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

###### 5. Get Replies for a Comment

**Endpoint:** `/api/user/interractions/story/comments/getReplies/:storyId/:commentId/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieves a paginated list of replies for a specific comment on a story.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Parameters:**
| Parameter       | Type     | Description                                     |
|------------------|----------|-------------------------------------------------|
| `storyId`        | `String` | The ID of the story containing the comment.    |
| `commentId`      | `String` | The ID of the comment to fetch replies for.    |
| `lastElementId`  | `String` | The ID of the last reply fetched (for pagination). Use `null` for the first request. |
| `limit`          | `Number` | The maximum number of replies to fetch.        |

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Reply List Prepared Successfully",
     "totalReplyCount": 25,
     "replyCount": 15,
     "replies": [
       {
         "replyId": "649e4c2f9f4c5e1a2b7c3a11",
         "user": {
           "userId": "1234567890abcdef",
           "username": "user1",
           "profilePicture": "https://example.com/profile.jpg"
         },
         "reply": "This is a reply.",
         "likeCount": 10,
         "didUserLiked": true,
         "firstFiveLikedUser": [
           {
             "userId": "abcdef1234567890",
             "username": "liked_user",
             "profilePicture": "https://example.com/liked_user.jpg"
           }
         ]
       },
       {
         "replyId": "649e4c3f9f4c5e1a2b7c3a22",
         "user": {
           "userId": "abcdef1234567890",
           "username": "user2",
           "profilePicture": "https://example.com/user2.jpg"
         },
         "reply": "Another reply here.",
         "likeCount": 5,
         "didUserLiked": false,
         "firstFiveLikedUser": []
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

###### 6. Like or Unlike a Story Comment or Reply

**Endpoint:** `PUT` `/api/user/interractions/story/comments/likeCommentOrReply`

**Description:** This endpoint allows a user to like or unlike a comment or a reply on a story. If a `replyId` is provided, the like/unlike action will be applied to the reply. Otherwise, it will be applied to the comment.

**Request Headers**
```http
x-access-token: <your_user_token>
```

**Request Body**
```json
{
  "storyId": "string",    // Required: ID of the story containing the comment
  "commentId": "string",  // Required: ID of the comment
  "replyId": "string"     // Optional: ID of the reply (if targeting a reply)
}
```

**Response Examples**

**Success**
```json
{
  "error": false,
  "message": "Story Comment or Story Comment Reply Liked or Like Removed Successfully"
}
```

**Missing Parameters**
```json
{
  "error": true,
  "message": "Missing params"
}
```

**Story Not Found**
```json
{
  "error": true,
  "message": "Story Not Found"
}
```

**Comment Not Found**
```json
{
  "error": true,
  "message": "Comment Not Found"
}
```

**Reply Not Found**
```json
{
  "error": true,
  "message": "Reply Not Found"
}
```

**Internal Server Error**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Controller Logic**
- **Validation**:
  - Checks if `storyId` and `commentId` are provided.
  - Ensures that the story exists.
  - Validates the existence of the comment within the story.
  - If `replyId` is provided, validates the existence of the reply within the comment.

- **Like/Unlike Logic**:
  - For comments:
    - If the user has already liked the comment, their like is removed.
    - Otherwise, the user's like is added to the comment.
  - For replies:
    - If the user has already liked the reply, their like is removed.
    - Otherwise, the user's like is added to the reply.

- **Database Operations**:
  - Marks the `comments` field as modified.
  - Saves the updated story document.

- **Response**:
  - Returns success or appropriate error messages based on the operations performed.

##### Event Endpoints

###### 1. Create Event

**Endpoint:** `/api/user/interractions/event/`

**Method:** `POST`

**Description:** Creates a new event based on the provided data. Only accessible to authorized users with a valid `careGiveGUID`.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body Parameters:**
```json
{
  "desc": "string",          // Description of the event (required)
  "adressDesc": "string",    // Address description of the event (required)
  "lat": "number",           // Latitude of the event location (required)
  "long": "number",          // Longitude of the event location (required)
  "date": "string",          // Date of the event in ISO format (required)
  "ticketPrice": "number",   // Ticket price for the event (optional)
  "ticketPriceType": "string", // Type of ticket price (e.g., 'fixed', 'donation') (optional)
  "maxGuest": "number",      // Maximum number of guests allowed (optional)
  "isPrivate": "boolean"     // Indicates if the event is private (optional)
}
```

**Response Examples:**

**1. Success**
```json
{
  "error": false,
  "message": "Event with id <event_id>, planned successfully at <event_date>",
  "eventId": "<event_id>",
  "desc": "<event_description>",
  "ticketPrice": {
    "priceType": "<price_type>",
    "price": <price>
  },
  "adress": {
    "adressDesc": "<address_description>",
    "lat": <latitude>,
    "long": <longitude>
  },
  "maxGuest": <max_guest>,
  "date": "<event_date>"
}
```

**2. Missing Property**
```json
{
  "error": true,
  "message": "Missing property"
}
```

**3. Missing Property for Ticket Price**
```json
{
  "error": true,
  "message": "Missing property for ticketprice"
}
```

**4. User Not Found**
```json
{
  "error": true,
  "message": "User couldn't found"
}
```

**5. Not a Subseller**
```json
{
  "error": true,
  "message": "You are not subseller"
}
```

**6. Internal Server Error**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

###### 2. Upload Event Image

**Endpoint:** `/api/user/interractions/event/image/:eventId`

**Method:** `PUT`

**Description:** Uploads or updates the image associated with an event. Ensures proper authorization and validates the image format before saving the image.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Path Parameters:**
- **eventId** (string): The ID of the event for which the image is being uploaded.

**Request Body (Form-Data):**
- **file** (file): The image file to be uploaded. Only `image/jpeg` or `image/jpg` formats are allowed.

**Response Examples:**

**1. Success**
```json
{
  "error": false,
  "message": "image uploaded succesfully",
  "imgUrl": "https://example.com/events/<eventId>/<imageName>.jpg"
}
```

**2. Missing File**
```json
{
  "error": true,
  "message": "image is required"
}
```

**4. Unauthorized Access**
```json
{
  "error": true,
  "message": "Un Authorized"
}
```

**3. Wrong File Format**
```json
{
  "error": true,
  "message": "Wrong File Format"
}
```

**5. Internal Server Error**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Workflow and Logic:**
1. **Authentication:**
   - Verifies the `x-access-token` header to authenticate the user.
   - Ensures the user is authorized to upload an image for the event.

2. **Image Validation:**
   - Checks the MIME type of the uploaded file to ensure it is either `image/jpeg` or `image/jpg`.

3. **Event Existence:**
   - Validates the `eventId` provided in the path to ensure the event exists.

4. **Delete Existing Image:**
   - If an image already exists for the event, it is deleted before uploading the new one.

5. **Upload Process:**
   - Generates a unique filename for the image.
   - Saves the image temporarily and uploads it to the server.
   - Deletes the temporary file after the upload.

6. **Response:**
   - Returns the URL of the uploaded image upon success.
   - Handles and returns appropriate error messages for validation failures or server errors.

###### 3. Edit Event

**Endpoint:** `/api/user/interractions/event/:eventId`

**Method:** `PUT`

**Description:** Update the details of an event by its ID. Only the event creator can edit the event details.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "string" // ID of the event to be updated
}
```

**Request Body Parameters:**
```json
{
  "newEventDesc": "string", // (Optional) New event description
  "newEventDate": "string", // (Optional) New event date in ISO format
  "newAdress": {
    "adressDesc": "string", // (Required if updating address) New address description
    "lat": "number",       // (Required if updating address) Latitude of the new address
    "long": "number"       // (Required if updating address) Longitude of the new address
  },
  "newPrice": {
    "priceType": "string", // (Required if updating ticket price) Price type (e.g., "fixed")
    "price": "number"      // (Required if updating ticket price) Ticket price amount
  }
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "event updated successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "event not found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "you are not authorized to edit this event"
   }
   ```

5. **Invalid Date**
   ```json
   {
     "error": true,
     "message": "New event date is not valid"
   }
   ```

6. **Too Late to Edit Event**
   ```json
   {
     "error": true,
     "message": "too late to edit this event"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Notes:**
- At least one of the following parameters is required in the request body to update the event: `newEventDesc`, `newEventDate`, `newAdress`, or `newPrice`.
- The event cannot be edited if the event date has already passed.
- Only the event creator is authorized to make changes to the event.

###### 4. Delete Event

**Endpoint:** `/api/user/interractions/event/:eventId`

**Method:** `DELETE`

**Description:** Deletes a specific event if the requester is authorized and the event has not yet occurred.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Parameters:**

- **Path Parameters:**
  - `eventId` (string): ID of the event to be deleted.

**Behavior:**
1. Checks for a valid `x-access-token` in the request headers.
2. Verifies the user's authorization using the token.
3. Ensures the event exists and that the user is authorized to delete it.
4. Cancels all ticket payments for the event if applicable.
5. Deletes all associated event images from the storage bucket.
6. Deletes the event record from the database.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Event deleted successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "missing params"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "you are not authorized to delete this event"
   }
   ```

4. **Too Late to Delete**
   ```json
   {
     "error": true,
     "message": "too late to delete this event"
   }
   ```

5. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

###### 5. Get Event By ID

**Endpoint:** `/api/user/interractions/event/getEvent/:eventId`

**Method:** `GET`

**Description:** Retrieves detailed information about a specific event. For private events, access is restricted to authorized users such as the event admin, organizers, or participants.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Parameters:**

- **Path Parameters:**
  - `eventId` (string): The ID of the event to retrieve.

**Behavior:**
1. Validates the `x-access-token` header for authentication.
2. Ensures the `eventId` is provided in the request path.
3. Checks if the event exists.
4. For private events, verifies that the requester is authorized (e.g., event admin, organizer, or participant).
5. Returns detailed information about the event.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Event info prepared successfully",
     "event": {
       "id": "12345",
       "desc": "Event description",
       "date": "2025-01-15T18:00:00Z",
       "adress": {
         "adressDesc": "Event location details",
         "lat": 40.7128,
         "long": -74.0060
       },
       "ticketPrice": {
         "priceType": "Paid",
         "price": 25.0
       },
       "isPrivate": true
     }
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```  

###### 6. Get Events by User ID

**Endpoint:** `/api/user/interractions/event/getEvents`

**Method:** `GET`

**Description:** Retrieves a list of events related to the authenticated user. The user can be related to an event as an admin, organizer, participant, or attendee.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "List of Events Which Releated to You Had Prepared Successfully",
     "eventCount": 2,
     "events": [
       {
         "eventId": "641f9a4e3f2a4b0017b19c5a",
         "eventName": "Pet Care Workshop",
         "eventDate": "2025-01-20T10:00:00Z",
         "eventLocation": {
           "adressDesc": "123 Pet Street",
           "lat": 37.7749,
           "long": -122.4194
         },
         "eventAdmin": "user12345",
         "ticketPrice": {
           "priceType": "Paid",
           "price": 20.0
         }
       },
       {
         "eventId": "641f9a4e3f2a4b0017b19c5b",
         "eventName": "Dog Walking Meetup",
         "eventDate": "2025-02-15T15:00:00Z",
         "eventLocation": {
           "adressDesc": "456 Canine Avenue",
           "lat": 34.0522,
           "long": -118.2437
         },
         "eventAdmin": "user54321",
         "ticketPrice": {
           "priceType": "Free",
           "price": 0.0
         }
       }
     ]
   }
   ```

2. **No Events Found**
   ```json
   {
     "error": true,
     "message": "No Event Found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   
###### 7. Get Recomended Events by User Id

**Endpoint:** `/api/user/interractions/event/getRecomendedEvents/:lastItemId/:limit`

**Method:** `GET`

**Description:** Retrieve a list of recommended events related to users followed by the authenticated user. Events are filtered and paginated.

**Request Headers**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters**
| Parameter     | Type   | Description                                      |
|---------------|--------|--------------------------------------------------|
| `lastItemId`  | String | ID of the last retrieved event. Use `"null"` if starting from the beginning. |
| `limit`       | Number | The maximum number of events to retrieve.        |

**Response Examples**

**1. Success**
```json
{
  "error": false,
  "message": "List of Recommended Events Which Related to Users You Follow Had Been Prepared Successfully",
  "totlaEventCount": 120,
  "eventCount": 15,
  "recomendedEvents": [
    {
      "eventId": "eventId12345",
      "eventAdmin": "userId67890",
      "eventTitle": "Pet Adoption Meetup",
      "eventDate": "2025-01-20T10:00:00Z",
      "ticketPrice": {
        "priceType": "Free",
        "price": 0
      },
      "adress": {
        "adressDesc": "Central Park, NYC",
        "lat": 40.785091,
        "long": -73.968285
      }
    }
  ]
}
```

**2. Missing Parameters**
```json
{
  "error": true,
  "message": "Missing Params"
}
```

**3. Unauthorized Access**
```json
{
  "error": true,
  "message": "Unauthorized"
}
```

**4. Token Expired**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

**5. Internal Server Error**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Notes**
- Ensure the `x-access-token` header is provided for authentication.
- Events are recommended based on the user's followed users or pets.
- Pagination is controlled via the `lastItemId` and `limit` parameters.

###### Organizer Endpoints

###### 1. Add Organizer to Event

**Endpoint:** `/api/user/interractions/event/organizer/:eventId`

**Method:** `POST`

**Description:** Invite a user to be an organizer for a specific event.

**Request Headers**
```http
x-access-token: <user_access_token>
```

**Request Parameters**

**Path Parameters:**
| Name       | Type   | Description             |
|------------|--------|-------------------------|
| `eventId`  | String | ID of the event to edit |

**Body Parameters:**
| Name          | Type   | Description                      |
|---------------|--------|----------------------------------|
| `organizerId` | String | ID of the user to be invited     |

**Response Examples**

**1. Success**
```json
{
  "error": false,
  "message": "You invited user \"<organizerId>\" successfully"
}
```

**2. Missing Parameters**
```json
{
  "error": true,
  "message": "Missing or wrong params"
}
```

**3. Event Not Found**
```json
{
  "error": true,
  "message": "Event not found"
}
```

**4. Unauthorized**
```json
{
  "error": true,
  "message": "You are not authorized to invite organizer to this event"
}
```

**5. Event Expired**
```json
{
  "error": true,
  "message": "This event is expired"
}
```

**6. User Not Found**
```json
{
  "error": true,
  "message": "User not found"
}
```

**7. Internal Server Error**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Notes**
- The user making the request must be the admin of the event.
- Events that have already occurred cannot be edited.
- The invited user must exist, be active, and not block the event admin.
- The endpoint creates an invitation record in the `OrganizerInvitation` collection for tracking purposes.

###### 2. Get Organizer Invitations

**Endpoint:** `/api/user/interractions/event/organizer/getInvitations/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieve a list of organizer invitations for the authenticated user, with optional pagination.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
| Parameter      | Type     | Description                                  |
|----------------|----------|----------------------------------------------|
| `lastElementId` | `string` | (Optional) ID of the last invitation to paginate from. Use `'null'` for no pagination. |
| `limit`         | `number` | (Optional) Maximum number of invitations to retrieve. Default is `15`. |

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Invitation list prepared succesfully",
     "totalInvitationCount": 50,
     "organizerInvitations": [
       {
         "invitationId": "63f1e72045dbb5e16c7843b7",
         "eventAdminId": "63f1e72045dbb5e16c7843b2",
         "eventId": "63f1e72045dbb5e16c7843b1",
         "invitedId": "63f1e72045dbb5e16c7843b9",
         "eventDate": "2025-01-15T12:00:00Z",
         "eventDetails": {
           "title": "Community Meetup",
           "location": "123 Event St, City, Country",
           "date": "2025-01-15T12:00:00Z"
         }
       },
       {
         "invitationId": "63f1e72045dbb5e16c7843b8",
         "eventAdminId": "63f1e72045dbb5e16c7843b3",
         "eventId": "63f1e72045dbb5e16c7843b6",
         "invitedId": "63f1e72045dbb5e16c7843ba",
         "eventDate": "2025-01-20T14:00:00Z",
         "eventDetails": {
           "title": "Tech Conference",
           "location": "456 Innovation Rd, Tech City",
           "date": "2025-01-20T14:00:00Z"
         }
       }
     ]
   }
   ```

2. **No Invitations Found**
   ```json
   {
     "error": true,
     "message": "No Organizer Invitation Found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```  

###### 3. Get Sended Organizer Invitations

**Endpoint:** `/api/user/interractions/event/organizer/getSendedInvitations/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieve a list of organizer invitations sent by the authenticated user.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "lastElementId": "<string> (optional)",
  "limit": "<integer> (default: 15)"
}
```

- **lastElementId**: The ID of the last invitation retrieved, used for pagination. Pass "null" to get the first batch.
- **limit**: The number of invitations to retrieve. Defaults to 15.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Invitation list prepared succesfully",
     "totalInvitationCount": 20,
     "organizerInvitations": [
       {
         "event": {
           "eventId": "645f2c3b8e6b9a0012d34b67",
           "desc": "Charity Gala",
           "date": "2025-03-01T18:00:00.000Z",
           "maxGuests": 150,
           "isPrivate": false,
           "adress": {
             "adressDesc": "City Hall, Downtown",
             "lat": 40.7128,
             "long": -74.0060
           }
         },
         "invitedUser": {
           "userId": "645f2b3c9e6a9a0012c44b12",
           "name": "Jane Doe",
           "email": "janedoe@example.com",
           "profilePicture": "https://example.com/profile/janedoe.jpg"
         },
         "eventAdmin": {
           "userId": "645f2b2c8e6a9a0012c34a89",
           "name": "John Smith",
           "email": "johnsmith@example.com",
           "profilePicture": "https://example.com/profile/johnsmith.jpg"
         }
       }
     ]
   }
   ```

2. **No Invitations Found**
   ```json
   {
     "error": true,
     "message": "No Organizer Invitation Found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Unauthorized"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

###### 4. Accept or Reject Organizer Invitation

**Endpoint:** `/api/user/interractions/event/organizer/:inviteId/:response`

**Method:** `DELETE`

**Description:** Accept or reject an invitation to become an organizer for a specific event.

**Request Headers:**
```http
x-access-token: <your_user_token>
```

**Request Path Parameters:**
```json
{
  "inviteId": "string", // ID of the invitation
  "response": "string" // Accept (`true`) or reject (`false`) the invitation
}
```

**Response Examples:**

1. **Success: Invitation Accepted**
   ```json
   {
     "error": false,
     "message": "invitation accepted successfully"
   }
   ```

2. **Success: Invitation Rejected**
   ```json
   {
     "error": false,
     "message": "invitation rejected successfully"
   }
   ```

3. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing or wrong params"
   }
   ```

4. **Invitation Not Found**
   ```json
   {
     "error": true,
     "message": "invitation not found"
   }
   ```

5. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "meetingEvent not found"
   }
   ```

6. **Event Expired**
   ```json
   {
     "error": true,
     "message": "This event is expired"
   }
   ```

7. **Unauthorized**
   ```json
   {
     "error": true,
     "message": "You are not authorized to accept this invitation"
   }
   ```

8. **Already an Organizer**
   ```json
   {
     "error": true,
     "message": "you are already organizer"
   }
   ```

9. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```  

###### 5. Remove Organizer from Event

**Endpoint:** `/api/user/interractions/event/organizer/remove/:eventId`

**Method:** `PUT`

**Description:** Remove an organizer from a specified event. Only the event admin or the organizer themselves can perform this action.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Parameters:**
- **Path Parameters:**
  - `eventId` (string) : The ID of the event.
- **Body Parameters:**
  ```json
  {
      "organizerId": "<organizer_id>"  // Required only if the user is the event admin.
  }
  ```

**Response Examples:**

1. **Success**
   ```json
   {
       "error": false,
       "message": "organizer removed successfully"
   }
   ```

2. **Missing or Wrong Parameters**
   ```json
   {
       "error": true,
       "message": "missing or wrong param"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
       "error": true,
       "message": "You are not authorized to remove this organizer"
   }
   ```

4. **Event Not Found**
   ```json
   {
       "error": true,
       "message": "meeting not found"
   }
   ```

5. **Internal Server Error**
   ```json
   {
       "error": true,
       "message": "Internal server error"
   }
   ```

**Process Overview:**
1. **Authentication:**
   - Verify the user's `x-access-token`. If invalid or expired, respond with a 403 status.
2. **Validate Request:**
   - Ensure `eventId` and necessary parameters are provided.
3. **Event Retrieval:**
   - Fetch the event using `eventId`. If not found, respond with a 404 status.
4. **Authorization:**
   - Verify if the user is:
     - The event admin (can remove any organizer).
     - The organizer themselves (can remove their own organizer status).
   - Respond with 403 if unauthorized.
5. **Remove Organizer:**
   - Remove the organizer from the `eventOrganizers` array in the event document.
   - Delete any associated invitations.
   - Save the updated event document.
6. **Response:**
   - Return a success message if the organizer was removed successfully.
   - Handle and log any errors.

**Notes:**
- The endpoint ensures proper authorization checks to prevent unauthorized actions.
- The `organizerId` parameter is required only if the request is made by the event admin. The admin can remove any organizer.
- Organizers can remove themselves without providing the `organizerId` parameter.

###### Event Join Endpoints

###### 1. Invite User to Private Event

**Endpoint:**
`/api/user/interractions/event/eventJoin/invitation/:eventId/:invitedUserId`

**Method:** 
`POST`

**Description:**
Invites a user to a private event. Only event admins or organizers can send invitations for private events. Ensures the invited user is eligible to join the event.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Path Parameters:**
- `eventId` (string): The unique identifier of the event.
- `invitedUserId` (string): The unique identifier of the user being invited.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "User <invitedUserId> invited successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "eventId is required"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **User Not Found**
   ```json
   {
     "error": true,
     "message": "User not found"
   }
   ```

5. **Unauthorized**
   ```json
   {
     "error": true,
     "message": "You are not authorized to invite any user to this event"
   }
   ```

6. **Event Expired**
   ```json
   {
     "error": true,
     "message": "Event is expired"
   }
   ```

7. **Guest Quota Exceeded**
   ```json
   {
     "error": true,
     "message": "Guest quota exceeded"
   }
   ```

8. **User Already Participating**
   ```json
   {
     "error": true,
     "message": "Invited user is already participant of event"
   }
   ```

9. **User Already Invited**
   ```json
   {
     "error": true,
     "message": "User already invited"
   }
   ```

10. **Internal Server Error**
    ```json
    {
      "error": true,
      "message": "Internal server error"
    }
    ```

###### 2. Accept Event Invitation

**Endpoint:** `/api/user/interractions/event/eventJoin/invitation/:invitationId/:response`

**Method:** `PUT`

**Description:** Accept or reject an event invitation. If the event requires a ticket payment, the payment process is initiated.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```plaintext
:invitationId (string): The ID of the invitation to accept or reject.
:response (string): `true` to accept the invitation, `false` to reject it.
```

**Request Body (for paid events):**
```json
{
  "cardGuid": "<optional_card_guid>",
  "cardNo": "<card_number>",
  "cvv": "<cvv>",
  "cardExpiryDate": "<MM/YY>",
  "recordCard": "true|false"
}
```

**Response Examples:**

**1. Success - Free Event:**
```json
{
  "error": false,
  "message": "Free event joined successfully",
  "ticket": {
    "ticketId": "1234567890",
    "eventName": "Sample Event",
    "eventDate": "2025-01-20T12:00:00Z"
  }
}
```

**2. Success - Paid Event (Waiting for Payment Approval):**
```json
{
  "error": false,
  "message": "Waiting for 3d payment approval",
  "payData": {
    "paymentDataId": "payment123456",
    "paymentUniqueCode": "unique12345",
    "threeDUrl": "https://paymentgateway.com/3d-secure"
  },
  "ticket": null
}
```

**3. Invitation Rejected:**
```json
{
  "error": true,
  "message": "Invitation rejected successfully"
}
```

**4. Missing or Wrong Parameters:**
```json
{
  "error": true,
  "message": "Missing or wrong parameter"
}
```

**5. Unauthorized Access:**
```json
{
  "error": true,
  "message": "This is not your invitation"
}
```

**6. Already Joined:**
```json
{
  "error": true,
  "message": "You are already a participant of the event"
}
```

**7. Payment Error:**
```json
{
  "error": true,
  "message": "Error While Payment",
  "payError": {
    "serverStatus": 0,
    "errorMessage": "Daily Limit Exceeded"
  }
}
```

**8. Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Additional Information:**
1. **Authorization:** Only the user who received the invitation can respond.
2. **Ticket Payment:**
   - If the event is paid, card details or `cardGuid` are required for payment.
   - A redirection URL for 3D Secure payment is provided if required.
3. **Invitation Handling:**
   - If the invitation is invalid or expired, it will be deleted automatically.
   - If the event has expired or is at full capacity, the invitation will be rejected.
4. **Event Ticket:** For free events, a ticket is generated immediately upon acceptance.
5. **Error Handling:** Comprehensive error responses for various scenarios like unauthorized access, invalid invitation, or payment failures.

###### 3. Buy Ticket for Event

**Endpoint:** `/api/user/interractions/event/eventJoin/:eventId`

**Method:** `POST`

**Description:** Allows a user to join an event or cancel their ticket if already joined. Handles payment processing for paid events and ensures compliance with event-specific rules like guest quota and organizer restrictions.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Parameters:**

**Path Parameters:**
```json
{
  "eventId": "string" // The unique identifier of the event
}
```

**Body Parameters:** (Only required for paid events)
```json
{
  "cardGuid": "string", // (Optional) Card GUID for stored payment cards
  "cardNo": "string",   // Credit card number
  "cvv": "string",      // Card security code
  "cardExpiryDate": "string", // Expiry date in MM/YY format
  "recordCard": "boolean" // Whether to store card for future use
}
```

**Response Examples:**

**1. Success (Ticket Removed)**
```json
{
  "error": false,
  "message": "Ticket removed and payment canceled successfully"
}
```

**2. Success (Waiting for 3D Payment Approval)**
```json
{
  "error": false,
  "message": "Waiting for 3D payment approve",
  "payData": {
    "paymentUrl": "https://securepayment.com",
    "orderId": "123456"
  },
  "ticket": null
}
```

**3. Success (Free Event Ticket Generated)**
```json
{
  "ticketId": "abcdef123456",
  "eventId": "eventId",
  "userId": "userId",
  "careGiverGUID": "careGiverGUID",
  "paymentCode": "Free_Event",
  "error": false
}
```

**Error Responses:**

1. **Missing Event ID**
```json
{
  "error": true,
  "message": "eventId is required"
}
```

2. **Event Not Found**
```json
{
  "error": true,
  "message": "Event not found"
}
```

3. **Event Expired**
```json
{
  "error": true,
  "message": "You can't plan to join event today or cancel ticket anymore"
}
```

4. **User is Organizer**
```json
{
  "error": true,
  "message": "You are organizer"
}
```

5. **Private Event**
```json
{
  "error": true,
  "message": "You can join only if you invented"
}
```

6. **Guest Quota Exceeded**
```json
{
  "error": true,
  "message": "Guest quota exceeded"
}
```

7. **Payment Error**
```json
{
  "error": true,
  "message": "Error While Payment",
  "payError": {
    "message": "Daily Limit Exceeded",
    "serverStatus": 500
  }
}
```

8. **CareGiver Not Found**
```json
{
  "error": true,
  "message": "CareGiver not Found"
}
```

9. **Token Expired**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

10. **Unauthorized Access**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

11. **Internal Server Error**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Business Logic:**
1. **Token Validation:** Ensures the user has a valid token and the token is not expired.
2. **Event Validation:** Checks if the event exists, is not expired, and is not a private event unless the user is invited.
3. **User Role Check:** Verifies if the user is an organizer of the event to prevent ticket purchase.
4. **Guest Quota Management:** Ensures the event has available guest slots.
5. **Payment Processing:** Handles ticket payment using Moka POS integration for paid events.
6. **Free Ticket Handling:** Generates and returns a free event ticket if the event is free.
7. **Error Handling:** Provides detailed error responses for various failure scenarios.
8. **Cancellation:** Cancels payment and removes tickets if the user already joined the event but wants to cancel.

**Notes:**
- Ensure the `x-access-token` header is included in all requests.
- The `recordCard` field is optional but must be provided as `true` or `false` for paid events.
- All timestamps are handled in UTC.

###### 4. Use Ticket

**Endpoint:** `/api/user/interractions/event/eventJoin/:eventId`

**Method:** `PUT`

**Description:** Allows an event organizer to validate and approve a user's ticket for an event. Ensures the ticket's validity, processes payments if applicable, and updates the event's guest list.

**Request Headers:**
```http
x-access-token: <user_access_token>
```

**Request Parameters:**

**Path Parameters:**
```json
{
  "eventId": "string" // The unique identifier of the event
}
```

**Body Parameters:**
```json
{
  "ticketId": "string",         // The unique identifier of the ticket
  "userId": "string",           // The ID of the ticket owner
  "ticketPassword": "string"    // The password associated with the ticket
}
```

**Response Examples:**

1. **Success (Ticket Approved)**
```json
{
  "error": false,
  "message": "You accepted the ticket of the user with the id \"userId\", successfully"
}
```

2. **Success (Payment Approved)**
```json
{
  "error": false,
  "message": "You accepted the ticket of the user with the id \"userId\", successfully",
  "paymentData": {
    "paymentId": "123456",
    "status": "Approved",
    "amount": 50.00
  }
}
```

**Error Responses:**

1. **Missing Parameters**
```json
{
  "error": true,
  "message": "missing param"
}
```

2. **Event Not Found**
```json
{
  "error": true,
  "message": "event not found"
}
```

3. **Ticket Not Found**
```json
{
  "error": true,
  "message": "ticket not found"
}
```

4. **Wrong Event**
```json
{
  "error": true,
  "message": "wrong event"
}
```

5. **Unexpected Guest**
```json
{
  "error": true,
  "message": "Unexpected guest"
}
```

6. **Ticket Owner Not Found**
```json
{
  "error": true,
  "message": "User with the id \"userId\" not found therefore ticket has been terminated"
}
```

7. **Event Not Today**
```json
{
  "error": true,
  "message": "Event is not today"
}
```

8. **Unauthorized Access (Organizer Only)**
```json
{
  "error": true,
  "message": "You are not authorized to accept tickets"
}
```

9. **Invalid Ticket Password**
```json
{
  "error": true,
  "message": "Invalid ticket"
}
```

10. **Payment Approval Error**
```json
{
  "error": true,
  "message": "error on approve payment"
}
```

11. **Internal Server Error**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Business Logic:**
1. **Token Validation:** Ensures the user has a valid token and the token is not expired.
2. **Event Validation:** Confirms the event exists and matches the provided ticket.
3. **Ticket Validation:** Verifies the ticket ID, event ID, and ticket owner's credentials.
4. **Role Check:** Ensures the requester is an organizer authorized to approve tickets.
5. **Payment Processing:** Approves pending payments for paid tickets using Moka POS integration.
6. **Guest List Management:** Updates the event's guest and joined lists accordingly.
7. **Error Handling:** Provides detailed error responses for various failure scenarios.

**Notes:**
- Ensure the `x-access-token` header is included in all requests.
- The ticket password must be hashed and compared securely.
- Payment approval is only applicable for non-free events.

###### 5. Get Invitation List

**Endpoint:** `/api/user/interractions/event/eventJoin/getInvitationList/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieve a list of event invitations for the authenticated user. The endpoint supports pagination using `lastElementId` and `limit` parameters.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "lastElementId": "<string, optional>",
  "limit": "<integer, optional> (default: 15)"
}
```

**Request Flow:**
1. Authenticate the request using the `x-access-token` header.
2. Retrieve the authenticated user's ID from the token.
3. Apply pagination filters:
   - If `lastElementId` is provided, fetch the invitation corresponding to it and filter by `createdAt` greater than the `lastElementId`'s `createdAt`.
   - Use the `limit` parameter to restrict the number of results.
4. Fetch the list of invitations from the `EventInvitation` collection.
5. For each invitation:
   - Fetch the event admin's information from the `User` collection.
   - Fetch the event details from the `Event` collection.
   - Include lightweight user and event information in the response.
   - Remove sensitive or unnecessary fields from the invitation objects.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Releated Invitation List Prepared Successfully",
     "totalInvitationCount": 10,
     "invitations": [
       {
         "_id": "64b7d3e5a8f2a3c9a2345678",
         "admin": {
           "_id": "64b7d3e5a8f2a3c9a1234567",
           "name": "John Doe",
           "profilePicture": "https://example.com/images/profile.jpg"
         },
         "event": {
           "_id": "64b7d3e5a8f2a3c9a3456789",
           "name": "Annual Meetup",
           "location": "Conference Hall A",
           "date": "2025-01-20",
           "ticketPrice": 25.0
         },
         "ticketPrice": 25.0
       }
     ]
   }
   ```

2. **No Invitations Found**
   ```json
   {
     "error": true,
     "message": "No Invitation Found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Ensure that the `lastElementId` and `limit` parameters are properly sanitized to avoid injection attacks.
- Sensitive fields like `invitedId`, `__v`, `createdAt`, and `updatedAt` are excluded from the response for security and privacy reasons.

###### 6. Get Sent Invitation List

**Endpoint:** `/api/user/interractions/event/eventJoin/getSendedInvitationList/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieve a list of event invitations sent by the authenticated user. The endpoint supports pagination using `lastElementId` and `limit` parameters.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "lastElementId": "<string, optional>",
  "limit": "<integer, optional> (default: 15)"
}
```

**Request Flow:**
1. Authenticate the request using the `x-access-token` header.
2. Retrieve the authenticated user's ID from the token.
3. Apply pagination filters:
   - If `lastElementId` is provided, fetch the invitation corresponding to it and filter by `createdAt` greater than the `lastElementId`'s `createdAt`.
   - Use the `limit` parameter to restrict the number of results.
4. Fetch the list of sent invitations from the `EventInvitation` collection.
5. For each invitation:
   - Fetch the invited user's information from the `User` collection.
   - Fetch the event details from the `Event` collection.
   - Include lightweight user and event information in the response.
   - Remove sensitive or unnecessary fields from the invitation objects.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Sent Invitation List Prepared Successfully",
     "totalInvitationCount": 5,
     "invitations": [
       {
         "_id": "64b7d3e5a8f2a3c9a2345678",
         "invitedUser": {
           "_id": "64b7d3e5a8f2a3c9a1234567",
           "name": "Jane Doe",
           "profilePicture": "https://example.com/images/profile.jpg"
         },
         "event": {
           "_id": "64b7d3e5a8f2a3c9a3456789",
           "name": "Tech Conference 2025",
           "location": "Hall B",
           "date": "2025-02-15",
           "ticketPrice": 50.0
         },
         "ticketPrice": 50.0
       }
     ]
   }
   ```

2. **No Invitations Found**
   ```json
   {
     "error": true,
     "message": "No Invitation Found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Ensure that the `lastElementId` and `limit` parameters are properly sanitized to avoid injection attacks.
- Sensitive fields like `eventAdminId`, `__v`, `createdAt`, and `updatedAt` are excluded from the response for security and privacy reasons.

###### 7. Get Owned Tickets

**Endpoint:** `/api/user/interractions/event/eventJoin/getOwnedTickets`

**Method:** `GET`

**Description:** Retrieve a list of tickets owned by the authenticated user for events they have joined.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Flow:**
1. Authenticate the request using the `x-access-token` header.
2. Retrieve the authenticated user's ID from the token.
3. Query the `EventTicket` collection for tickets associated with the user ID.
4. For each ticket:
   - Fetch the related event details from the `Event` collection.
   - Use `getTicketInfoHelper` to compile detailed information for the ticket and its event.
5. Return the list of ticket details.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Ticket List Prepared Successfully",
     "tickets": [
       {
         "ticketId": "64b7d3e5a8f2a3c9a2345678",
         "event": {
           "_id": "64b7d3e5a8f2a3c9a3456789",
           "name": "Music Fest 2025",
           "location": "Open Air Venue",
           "date": "2025-06-20",
           "ticketPrice": 100.0
         },
         "seatNumber": "A12",
         "purchaseDate": "2025-01-10"
       }
     ]
   }
   ```

2. **No Tickets Found**
   ```json
   {
     "error": true,
     "message": "No ticket found"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Ensure proper error handling for scenarios where no tickets are found or database queries fail.
- Sensitive fields like internal database identifiers and timestamps are excluded from the response for user clarity and security.

###### 8. Get Ticket By ID

**Endpoint:** `/api/user/interractions/event/eventJoin/getTicketById/:ticketId`

**Method:** `GET`

**Description:** Retrieve detailed information about a specific ticket owned by the authenticated user.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "ticketId": "<string>"
}
```

**Request Flow:**
1. Authenticate the request using the `x-access-token` header.
2. Retrieve the authenticated user's ID from the token.
3. Validate the `ticketId` parameter. If not provided, return a `400 Bad Request` response.
4. Query the `EventTicket` collection by `ticketId`:
   - Check if the ticket exists.
   - Verify that the ticket belongs to the authenticated user.
5. Fetch the associated event details from the `Event` collection.
6. Use `getTicketInfoHelper` to compile detailed information about the ticket and its event.
7. Return the ticket details in the response.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Ticket Data Prepared Successfully",
     "ticket": {
       "ticketId": "64b7d3e5a8f2a3c9a2345678",
       "event": {
         "_id": "64b7d3e5a8f2a3c9a3456789",
         "name": "Tech Conference 2025",
         "location": "Convention Center",
         "date": "2025-03-15",
         "ticketPrice": 150.0
       },
       "seatNumber": "B15",
       "purchaseDate": "2025-01-05"
     }
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Ticket Not Found**
   ```json
   {
     "error": true,
     "message": "Ticket not found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Ensure the `ticketId` is sanitized to prevent injection attacks.
- This endpoint only allows access to tickets owned by the authenticated user. If the ticket does not belong to the user, a `404 Not Found` error is returned.

###### 9. Get Tickets By Event ID

**Endpoint:** `/api/user/interractions/event/eventJoin/getTicketsByEventId/:eventId/:lastElementId/:limit`

**Method:** `GET`

**Description:** Retrieve a list of tickets for a specific event. Only event organizers or admins are authorized to access this information. Supports pagination using `lastElementId` and `limit` parameters.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "lastElementId": "<string, optional>",
  "limit": "<integer, optional> (default: 15)"
}
```

**Request Flow:**
1. Authenticate the request using the `x-access-token` header.
2. Retrieve the authenticated user's ID from the token.
3. Validate the `eventId` parameter. If not provided, return a `400 Bad Request` response.
4. Query the `EventTicket` collection for tickets associated with the event:
   - If `lastElementId` is provided, fetch the ticket corresponding to it and filter by `createdAt` greater than the `lastElementId`'s `createdAt`.
   - Use the `limit` parameter to restrict the number of results.
5. Check if the authenticated user is an organizer or admin of the event.
   - If not authorized, return a `401 Unauthorized` response.
6. Compile detailed ticket information for each ticket using `getTicketInfoHelper`.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Ticket List Prepared Successfully",
     "totalTicketCount": 50,
     "tickets": [
       {
         "ticketId": "64b7d3e5a8f2a3c9a2345678",
         "event": {
           "_id": "64b7d3e5a8f2a3c9a3456789",
           "name": "Annual Science Fair",
           "location": "Main Auditorium",
           "date": "2025-04-10",
           "ticketPrice": 75.0
         },
         "seatNumber": "C20",
         "purchaseDate": "2025-02-01"
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **No Tickets Found**
   ```json
   {
     "error": true,
     "message": "No ticket found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You are not authorized to see all tickets"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Ensure the `eventId`, `lastElementId`, and `limit` parameters are sanitized to prevent injection attacks.
- This endpoint restricts access to event organizers or admins only.

###### After Event Endpoints

###### 1. Upload After Event Content

**Endpoint:** `/api/user/interractions/event/afterEvent/:eventId`

**Method:** `POST`

**Description:** Allows authenticated users who attended an event to upload content (e.g., images or videos) related to the event after its conclusion.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>"
}
```

**Request Body:**
For textual content:
```json
{
  "content": "<string>"
}
```
For file uploads (image or video):
- The file must be attached in the `file` field of a `multipart/form-data` request.

**Supported File Types:**
- `image/jpeg`
- `image/jpg`
- `video/mp4`

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId` parameter. If not provided, return a `400 Bad Request` response.
3. Check if the user is a participant in the specified event. If not, return a `401 Unauthorized` response.
4. Handle file uploads if present:
   - Validate the file type.
   - Save the file temporarily.
   - Upload the file to the appropriate storage path.
5. Process content and add it to the `afterEvent` section of the event document in the database.
6. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Content added successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "eventId is required"
   }
   ```

3. **Invalid File Format**
   ```json
   {
     "error": true,
     "message": "Wrong File Format"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Un Authorized"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Only participants of the event can upload content.
- If a file is uploaded, it replaces any existing content associated with the `contentId`.
- File uploads are temporarily stored on the server before being transferred to permanent storage.
- Proper error handling is in place for invalid file types, unauthorized access, and server errors.

###### 2. Edit After Event Content

**Endpoint:** `/api/user/interractions/event/afterEvent/:eventId/:contentId`

**Method:** `PUT`

**Description:** Allows authenticated users who attended an event to edit previously uploaded content (e.g., images, videos, or text) associated with the event.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "contentId": "<string>"
}
```

**Request Body:**
For textual content:
```json
{
  "newContent": "<string>"
}
```
For file uploads (image or video):
- The file must be attached in the `file` field of a `multipart/form-data` request.

**Supported File Types:**
- `image/jpeg`
- `image/jpg`
- `video/mp4`

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId` and `contentId` parameters. If not provided, return a `400 Bad Request` response.
3. Retrieve the associated event and content.
4. If a file is uploaded:
   - Validate the file type.
   - Delete the existing file if present.
   - Save the new file temporarily and upload it to permanent storage.
5. Update the content details in the `afterEvent` section of the event document in the database.
6. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Content updated successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "eventId and contentId are required"
   }
   ```

3. **Invalid File Format**
   ```json
   {
     "error": true,
     "message": "Wrong File Format"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Un Authorized"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Only participants of the event can edit content.
- If a file is uploaded, it replaces the existing file associated with the `contentId`.
- Temporary files are securely deleted after upload to permanent storage.
- Proper error handling is in place for invalid file types, unauthorized access, and server errors.

###### 3. Delete After Event Content

**Endpoint:** `/api/user/interractions/event/afterEvent/:eventId/:contentId`

**Method:** `DELETE`

**Description:** Allows authenticated users to delete specific content (e.g., images, videos, or text) that they have uploaded for an event. Event admins can delete any content related to their events.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "contentId": "<string>"
}
```

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId` and `contentId` parameters. If not provided, return a `400 Bad Request` response.
3. Retrieve the associated event and content.
4. Check if the authenticated user is authorized to delete the content:
   - The user must either be the uploader of the content or the admin of the event.
   - If not authorized, return a `401 Unauthorized` response.
5. If the content includes a file stored on the server, delete the file.
6. Remove the content from the event’s `afterEvent` section in the database.
7. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Content deleted successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Meeting event not found"
   }
   ```

4. **Content Not Found**
   ```json
   {
     "error": true,
     "message": "Content not found"
   }
   ```

5. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You are not authorized to edit this post"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Only the content uploader or the event admin is authorized to delete content.
- File deletions from the server are performed securely.
- Proper error handling is in place for missing parameters, unauthorized access, and server errors.

###### 4. Like or Remove Like for After Event Content

**Endpoint:** `/api/user/interractions/event/afterEvent/like/:eventId/:contentId`

**Method:** `PUT`

**Description:** Allows authenticated users to like or remove their like for a specific content (e.g., images, videos, or text) associated with an event after its conclusion.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "contentId": "<string>"
}
```

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId` and `contentId` parameters. If not provided, return a `400 Bad Request` response.
3. Retrieve the associated event and content.
4. Check if the content exists. If not, return a `404 Not Found` response.
5. Check if the user has already liked the content:
   - If yes, remove the user's like.
   - If no, add the user's like.
6. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Content liked or like removed successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **Content Not Found**
   ```json
   {
     "error": true,
     "message": "Content not found"
   }
   ```

5. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- The user's like is toggled based on whether they have already liked the content or not.
- Proper error handling is in place for missing parameters, unauthorized access, and server errors.

###### 5. Get After Event Content List

**Endpoint:** `/api/user/interractions/event/afterEvent/get/:eventId/:lastItemId/:limit`

**Method:** `GET`

**Description:** Retrieve a paginated list of contents shared after an event. Only authorized users (event participants, organizers, or admins) can access private event contents.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "lastItemId": "<string, optional>",
  "limit": "<integer, optional> (default: 15)"
}
```

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId`, `lastItemId`, and `limit` parameters. If `eventId` is missing, return a `400 Bad Request` response.
3. Retrieve the event and verify the user's access rights:
   - Check if the user is an admin, organizer, or participant for private events.
4. Retrieve the `afterEvent` contents based on the `lastItemId` and `limit` parameters.
5. Process each content item:
   - Include the last comment with its reply count (if any).
   - Include up to 5 liked users' lightweight information.
   - Attach the shared user's lightweight information.
6. Return the paginated content list along with metadata.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "After event contents prepared successfully",
     "data": {
       "eventId": "64b7d3e5a8f2a3c9a1234567",
       "totalAfterEventCount": 10,
       "afterEventContents": [
         {
           "_id": "64b7d3e5a8f2a3c9a3456789",
           "content": "This is a shared photo or video.",
           "lastComment": {
             "_id": "64b7d3e5a8f2a3c9a4567890",
             "text": "Nice post!",
             "replyCount": 2
           },
           "commentCount": 5,
           "firstFiveLikedUser": [
             {
               "_id": "64b7d3e5a8f2a3c9a5678901",
               "name": "John Doe",
               "profilePicture": "https://example.com/profile.jpg"
             }
           ],
           "user": {
             "_id": "64b7d3e5a8f2a3c9a6789012",
             "name": "Jane Smith",
             "profilePicture": "https://example.com/profile2.jpg"
           }
         }
       ]
     }
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Event Not Found or Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Event Not Found"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Pagination is supported using `lastItemId` and `limit`. If `lastItemId` is not provided, retrieval starts from the first item.
- Proper error handling is in place for missing parameters, unauthorized access, and server errors.

###### After Event Comment Endpoints

###### 1. Add or Reply to After Event Content Comment

**Endpoint:** `/api/user/interractions/event/afterEvent/comment/:eventId/:contentId`

**Method:** `PUT`

**Description:** Allows authenticated users to add a comment or reply to an existing comment on content shared after an event.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "contentId": "<string>"
}
```

**Request Body:**
For adding a comment:
```json
{
  "desc": "<string>"
}
```
For replying to a comment:
```json
{
  "desc": "<string>",
  "commentId": "<string>"
}
```

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId`, `contentId`, and `desc` parameters. If any are missing, return a `400 Bad Request` response.
3. Retrieve the associated event and content.
4. For replies, locate the parent comment using `commentId`. If the comment is not found, return a `404 Not Found` response.
5. Add the new comment or reply to the content’s `comments` section.
6. Send a notification to the relevant user (content owner or parent comment owner).
7. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Content added successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **Content Not Found**
   ```json
   {
     "error": true,
     "message": "Content not found"
   }
   ```

5. **Comment Not Found (for replies)**
   ```json
   {
     "error": true,
     "message": "Comment not found"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Comments and replies are stored in the `afterEvent` section of the event document.
- Notifications are sent to the owner of the content or the parent comment.
- Proper error handling is in place for missing parameters, unauthorized access, and server errors.

###### 2. Edit After Event Comment or Reply

**Endpoint:** `/api/user/interractions/event/afterEvent/comment/edit/:eventId/:contentId`

**Method:** `PUT`

**Description:** Allows authenticated users to edit their comments or replies on content shared after an event. Event admins can edit any comment or reply.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "contentId": "<string>"
}
```

**Request Body:**
For editing a comment:
```json
{
  "commentId": "<string>",
  "desc": "<string>"
}
```
For editing a reply:
```json
{
  "commentId": "<string>",
  "replyId": "<string>",
  "desc": "<string>"
}
```

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId`, `contentId`, `commentId`, and `desc` parameters. If any are missing, return a `400 Bad Request` response.
3. Retrieve the associated event and content.
4. Locate the comment using `commentId`. If the comment is not found, return a `404 Not Found` response.
5. If a `replyId` is provided, locate the reply within the comment. If the reply is not found, return a `404 Not Found` response.
6. Check if the user is authorized to edit the comment or reply:
   - The user must be the author of the comment/reply or an admin of the event.
   - If unauthorized, return a `401 Unauthorized` response.
7. Update the comment or reply with the new content (`desc`).
8. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comment or reply edited successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **Content Not Found**
   ```json
   {
     "error": true,
     "message": "After event content not found"
   }
   ```

5. **Comment Not Found**
   ```json
   {
     "error": true,
     "message": "Comment not found"
   }
   ```

6. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can not edit this comment object"
   }
   ```

7. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

8. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Only the author of the comment/reply or the event admin is authorized to make edits.
- Proper error handling is in place for missing parameters, unauthorized access, and server errors.

###### 3. Delete After Event Comment or Reply

**Endpoint:** `/api/user/interractions/event/afterEvent/comment/:eventId/:contentId`

**Method:** `DELETE`

**Description:** Allows authenticated users to delete their comments or replies on content shared after an event. Event admins can delete any comment or reply.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "contentId": "<string>"
}
```

**Request Body:**
For deleting a comment:
```json
{
  "commentId": "<string>"
}
```
For deleting a reply:
```json
{
  "commentId": "<string>",
  "replyId": "<string>"
}
```

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId`, `contentId`, and `commentId` parameters. If any are missing, return a `400 Bad Request` response.
3. Retrieve the associated event and content.
4. Locate the comment using `commentId`. If the comment is not found, return a `404 Not Found` response.
5. If a `replyId` is provided, locate the reply within the comment. If the reply is not found, return a `404 Not Found` response.
6. Check if the user is authorized to delete the comment or reply:
   - The user must be the author of the comment/reply or an admin of the event.
   - If unauthorized, return a `401 Unauthorized` response.
7. Remove the comment or reply from the `afterEvent` section.
8. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comment or reply deleted successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **Content Not Found**
   ```json
   {
     "error": true,
     "message": "After event content not found"
   }
   ```

5. **Comment Not Found**
   ```json
   {
     "error": true,
     "message": "Comment not found"
   }
   ```

6. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can not delete this comment object"
   }
   ```

7. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

8. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Only the author of the comment/reply or the event admin is authorized to delete the object.
- Proper error handling is in place for missing parameters, unauthorized access, and server errors.

###### 4. Like or Unlike After Event Comment or Reply

**Endpoint:** `/api/user/interractions/event/afterEvent/comment/like/:eventId/:contentId`

**Method:** `PUT`

**Description:** Allows authenticated users to like or unlike a comment or reply on content shared after an event.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string>",
  "contentId": "<string>"
}
```

**Request Body:**
For liking or unliking a comment:
```json
{
  "commentId": "<string>"
}
```
For liking or unliking a reply:
```json
{
  "commentId": "<string>",
  "replyId": "<string>"
}
```

**Request Flow:**
1. Authenticate the user using the `x-access-token` header.
2. Validate the `eventId`, `contentId`, and `commentId` parameters. If any are missing, return a `400 Bad Request` response.
3. Retrieve the associated event and content.
4. Locate the comment using `commentId`. If the comment is not found, return a `404 Not Found` response.
5. If a `replyId` is provided, locate the reply within the comment. If the reply is not found, return a `404 Not Found` response.
6. Toggle the like status for the comment or reply:
   - If the user has already liked the object, remove their like.
   - Otherwise, add their like.
7. Save the updated event document.

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comment or reply like status toggled successfully"
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **Content Not Found**
   ```json
   {
     "error": true,
     "message": "After event content not found"
   }
   ```

5. **Comment Not Found**
   ```json
   {
     "error": true,
     "message": "Comment not found"
   }
   ```

6. **Reply Not Found**
   ```json
   {
     "error": true,
     "message": "Reply not found"
   }
   ```

7. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

8. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Notes:**
- The `x-access-token` must be a valid JWT token signed with the server's private key.
- Proper error handling is in place for missing parameters, unauthorized access, and server errors.
- The like status is toggled for both comments and replies depending on the provided `replyId`.

###### 5. Get After Event Comments

**Endpoint:** `/api/user/interractions/event/afterEvent/comment/getComments/:eventId/:contentId/:lastItemId/:limit`

**Method:** `GET`

**Description:** Retrieve comments for a specific after-event content associated with an event. Includes user details, likes, and reply metadata for each comment.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string> - ID of the event",
  "contentId": "<string> - ID of the after-event content",
  "lastItemId": "<string | null> - ID of the last comment item for pagination, or 'null' for the first page",
  "limit": "<integer> - Maximum number of comments to retrieve"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comments Prepared successfully",
     "commentCount": 10,
     "comments": [
       {
         "_id": "<string>",
         "text": "Great event!",
         "createdAt": "2025-01-10T12:00:00Z",
         "likeCount": 3,
         "firstFiveLikedUser": [
           {
             "userId": "<string>",
             "username": "johndoe",
             "profilePicture": "<string>"
           }
         ],
         "replyCount": 2,
         "lastReply": {
           "_id": "<string>",
           "text": "Thanks!",
           "likeCount": 1,
           "createdAt": "2025-01-11T14:30:00Z"
         },
         "user": {
           "userId": "<string>",
           "username": "janedoe",
           "profilePicture": "<string>"
         }
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Param"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event Not Found"
   }
   ```

4. **AfterEvent Not Found**
   ```json
   {
     "error": true,
     "message": "AfterEvent Not Found"
   }
   ```

5. **No Comments Found**
   ```json
   {
     "error": true,
     "message": "No Comment Found"
   }
   ```

6. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

7. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

8. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
    ```

**Functionality Overview:**
- **Authentication:** Verifies the provided `x-access-token` header. Denies access if the token is invalid, missing, or expired.
- **Validation:** Ensures `eventId` and `contentId` parameters are present. Returns `400` for missing parameters.
- **Authorization:** Confirms the user's relationship to the event (e.g., admin, organizer, participant) before granting access.
- **Pagination:** Supports paginated comment retrieval using `lastItemId` and `limit` parameters.
- **Metadata:** Enhances comment data with user details, like counts, and reply summaries.
- **Error Handling:** Responds with appropriate error messages and HTTP status codes for various failure scenarios.

###### 6. Get Replies of After Event Comment

**Endpoint:** `/api/user/interractions/event/afterEvent/comment/getReplies/:eventId/:contentId/:commentId/:lastItemId/:limit`

**Method:** `GET`

**Description:** Retrieve replies for a specific comment on after-event content. Includes user details, likes, and metadata for each reply.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "eventId": "<string> - ID of the event",
  "contentId": "<string> - ID of the after-event content",
  "commentId": "<string> - ID of the comment",
  "lastItemId": "<string | null> - ID of the last reply item for pagination, or 'null' for the first page",
  "limit": "<integer> - Maximum number of replies to retrieve"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Replies Prepared successfully",
     "replyCount": 10,
     "replies": [
       {
         "_id": "<string>",
         "text": "I agree with your comment!",
         "createdAt": "2025-01-10T14:00:00Z",
         "likeCount": 5,
         "firstFiveLikedUser": [
           {
             "userId": "<string>",
             "username": "johndoe",
             "profilePicture": "<string>"
           }
         ],
         "user": {
           "userId": "<string>",
           "username": "janedoe",
           "profilePicture": "<string>"
         }
       }
     ]
   }
   ```

2. **Missing Parameters**
   ```json
   {
     "error": true,
     "message": "Missing Params"
   }
   ```

3. **Event Not Found**
   ```json
   {
     "error": true,
     "message": "Event not found"
   }
   ```

4. **AfterEvent Not Found**
   ```json
   {
     "error": true,
     "message": "AfterEvent Not Found"
   }
   ```

5. **Comment Not Found**
   ```json
   {
     "error": true,
     "message": "Comment Not Found"
   }
   ```

6. **No Replies Found**
   ```json
   {
     "error": true,
     "message": "No Reply Found"
   }
   ```

7. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

8. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

9. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality Overview:**
- **Authentication:** Verifies the provided `x-access-token` header. Denies access if the token is invalid, missing, or expired.
- **Validation:** Ensures `eventId`, `contentId`, and `commentId` parameters are present. Returns `400` for missing parameters.
- **Authorization:** Confirms the user's relationship to the event (e.g., admin, organizer, participant) before granting access.
- **Pagination:** Supports paginated reply retrieval using `lastItemId` and `limit` parameters.
- **Metadata:** Enhances reply data with user details and like counts.
- **Error Handling:** Responds with appropriate error messages and HTTP status codes for various failure scenarios.

### Pet Routes

#### 1. Create a Pet

**Endpoint:** `/api/pet/createPet`

**Method:** `POST`

**Description:** Create a new pet profile for the authenticated user. The pet information is validated, and a default avatar is generated if not provided.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "name": "<string> - Name of the pet",
  "petBio": "<string> - Brief description or bio of the pet",
  "sex": "<string> - Gender of the pet (e.g., male, female)",
  "birthDay": "<date> - Birth date of the pet in YYYY-MM-DD format",
  "kindCode": "<string> - Code representing the kind of pet (e.g., dog, cat)",
  "speciesCode": "<string> - Code representing the species of the pet"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Pet created successfully",
     "data": {
       "petId": "<string>",
       "petName": "Buddy",
       "petAge": "3 years old",
       "petKind": "Dog",
       "petSpecies": {
         "tr": "Golden Retriever",
         "en": "Golden Retriever"
       }
     }
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation Error: <details of the validation issue>"
   }
   ```

3. **Pet Already Exists**
   ```json
   {
     "error": true,
     "message": "Pet Already Exists",
     "petId": "<string>",
     "petName": "Buddy"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality Overview:**
- **Authentication:** Validates the `x-access-token` header for authentication.
- **Validation:** Validates request body using `createPetReqBodyValidation`. Returns detailed errors for invalid inputs.
- **Duplicate Check:** Ensures no duplicate pet profiles exist for the user.
- **Default Avatar Generation:** Creates a unique default avatar for the pet if no custom avatar is provided.
- **Data Linking:** Links the new pet to the authenticated user's profile.
- **Error Handling:** Handles various errors, including missing parameters, unauthorized access, and server issues.

#### 2. Update Pet Profile and Cover Image

**Endpoint:** `/api/pet/petProfileImage/:petId`

**Method:** `PUT`

**Description:** Upload or update the profile and cover images of a specific pet. Ensures validation, storage, and cleanup of old images where applicable.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "petId": "<string> - ID of the pet to update the profile and cover images"
}
```

**Request Body:**
- Form-Data fields:
  - `petProfileImg`: Profile image file (optional)
  - `petCoverImg`: Cover image file (optional)

**Response Examples:**

1. **Success**
   ```json
   {
     "petProfilePath": "pets/12345/petProfileAssets/profileImg12345.png",
     "petCoverPath": "pets/12345/petProfileAssets/coverImg12345.png"
   }
   ```

2. **No File Uploaded**
   ```json
   {
     "error": true,
     "message": "No File Uploaded"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

4. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

5. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality Overview:**
- **Authentication:** Verifies the provided `x-access-token` header for user authentication.
- **Image Cleanup:** Removes old profile and cover images from the server if they are not default images and new images are provided.
- **Image Upload:** Saves new profile and cover images to the server and updates the pet's image paths in the database.
- **Validation:** Ensures proper handling of form-data fields and pet ID.
- **Error Handling:** Handles errors such as missing files, unauthorized access, and server issues.

#### 3. Edit Pet Bio

**Endpoint:** `/api/pet/editPetBioCertificate/:petId`

**Method:** `PUT`

**Description:** Update the bio of a specific pet. Only the primary owner of the pet can edit its bio.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "petId": "<string> - ID of the pet whose bio is being updated"
}
```

**Request Body:**
```json
{
  "newBio": "<string> - New bio for the pet (required)"
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "newPetBio": "Loves playing in the park and chasing butterflies."
   }
   ```

2. **Missing Property**
   ```json
   {
     "error": true,
     "message": "Property \"newBio\" with \"String\" value is required"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

4. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can't edit this pet"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality Overview:**
- **Authentication:** Ensures the user is authenticated using the `x-access-token` header.
- **Authorization:** Verifies that the user is the primary owner of the pet.
- **Validation:** Confirms that the `newBio` field is provided and is a string.
- **Error Handling:** Handles scenarios such as unauthorized access, missing pet, and server issues.
- **Bio Update:** Saves the updated bio to the pet's profile and marks the bio field as modified in the database.

#### 4. Upload Pet Images

**Endpoint:** `/api/pet/petsImages/:petId`

**Method:** `PUT`

**Description:** Upload new images for a specific pet. A maximum of 6 images can be uploaded for a pet. Only the primary owner of the pet can upload images.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "petId": "<string> - ID of the pet whose images are being uploaded"
}
```

**Request Body:**
- Form-Data field:
  - `files`: Array of image files to be uploaded. The number of files is limited to the remaining image slots for the pet (max 6 images in total).

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "data": [
       "pets/12345/petsImages/petsImage_abc123.png",
       "pets/12345/petsImages/petsImage_def456.png"
     ]
   }
   ```

2. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can't edit this pet"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

4. **Maximum Image Limit Reached**
   ```json
   {
     "error": true,
     "message": "Maximum image limit reached"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality Overview:**
- **Authentication:** Verifies the provided `x-access-token` header for user authentication.
- **Authorization:** Ensures that the user is the primary owner of the pet.
- **Image Upload:**
  - Validates the number of images being uploaded to ensure the limit is not exceeded.
  - Saves the uploaded images to the server.
  - Updates the pet's image list in the database.
- **Error Handling:** Handles scenarios such as unauthorized access, missing pet, and server errors.

#### 5. Delete Pet Images

**Endpoint:** `/api/pet/petsImages/:petId`

**Method:** `DELETE`

**Description:** Delete specified images of a specific pet. Only the primary owner of the pet can delete images.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
```json
{
  "petId": "<string> - ID of the pet whose images are being deleted"
}
```

**Request Body:**
```json
{
  "urlList": ["<string>", "<string>"] - Array of image URLs to be deleted (required)
}
```

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "images deleted successfully",
     "remainedPetImages": [
       {
         "imgUrl": "pets/12345/petsImages/petsImage_abc123.png"
       }
     ]
   }
   ```

2. **Missing URL List**
   ```json
   {
     "error": true,
     "message": "Image url to delete is required"
   }
   ```

3. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can't edit this pet"
   }
   ```

4. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

5. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

6. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality Overview:**
- **Authentication:** Verifies the provided `x-access-token` header for user authentication.
- **Authorization:** Ensures the user is the primary owner of the pet.
- **Image Deletion:**
  - Deletes images specified in the `urlList` from the server.
  - Removes the corresponding image URLs from the pet's image list in the database.
- **Validation:** Ensures the `urlList` is provided and contains valid URLs.
- **Error Handling:** Handles scenarios such as missing parameters, unauthorized access, and server errors.

#### 6. Insert Vaccination Certificate of the Pet

**Endpoint:**  `/api/pet/petsVaccinationCertificate/:petId`

**Method:** `PUT`

**Description:** This endpoint allows authenticated users to upload a vaccination certificate for a specific pet.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Authorization:**
- Only the primary owner of the pet can upload the vaccination certificate.
- The owner's ID is compared with the `user` field in the token.
- If the pet does not exist, or the user is not the primary owner, a `403` or `404` status code is returned.

**Request Parameters:**
**Path Parameters:**
```http
:petId - The unique identifier of the pet whose vaccination certificate is being uploaded.
```

**Request Body:**
**Form-Data:**
- `file` (Required): The vaccination certificate file. Supported formats: JPEG, JPG, PDF.
- `desc` (Optional): A description of the vaccination certificate.

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "url": "pets/123456/petsVaccinationCertificates/123456_abc123_vaccinationCertificate.pdf",
  "desc": "First vaccination for Rabies"
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Unauthorized Access:**
```json
{
  "error": true,
  "message": "You can't edit this pet"
}
```

5. **Invalid File Format:**
```json
{
  "error": true,
  "message": "Wrong File Format"
}
```

6. **Pet Not Found:**
```json
{
  "error": true,
  "message": "Pet couldn't found"
}
```

7. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication and Authorization:**
   - The `auth` middleware checks if the request has a valid token and decodes it to retrieve the user information.
   - The `editPetAuth` middleware ensures that the pet exists and the authenticated user is the primary owner of the pet.

2. **File Handling:**
   - The `serverHandlePetVaccinationCertificatesHelper` middleware processes the file upload.
   - It ensures the file is of the correct format (JPEG, JPG, or PDF).
   - It generates a unique file name and path to store the vaccination certificate.

3. **Database Update:**
   - The `insertPetVaccinationCertificateController` middleware updates the pet document in the database by adding the vaccination details and the file URL.

#### 7. Edit Pet Vaccination Certificate Description

**Endpoint:** `/api/pet/editVaccinationCertificate/:petId`

**Method:** `PUT`

**Description:** This endpoint allows authenticated users to update the description of an existing vaccination certificate for a specific pet.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Authorization:**
- Only the primary owner of the pet can update the vaccination certificate description.
- The owner's ID is compared with the `user` field in the token.
- If the pet does not exist, or the user is not the primary owner, a `403` or `404` status code is returned.

**Request Parameters:**
**Path Parameters:**
```http
:petId - The unique identifier of the pet whose vaccination certificate is being updated.
```

**Request Body:**
**JSON:**
```json
{
  "certificateUrl": "<url_of_the_certificate>",
  "newDesc": "<new_description_for_the_certificate>"
}
```

- `certificateUrl` (Required): The URL of the vaccination certificate to be updated.
- `newDesc` (Required): The new description to be added to the vaccination certificate.

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "petsVaccinations": [
    {
      "desc": "Updated Rabies Vaccination",
      "fileUrl": "pets/123456/petsVaccinationCertificates/123456_abc123_vaccinationCertificate.pdf"
    }
  ]
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Unauthorized Access:**
```json
{
  "error": true,
  "message": "You can't edit this pet"
}
```

5. **Invalid Request Body:**
```json
{
  "error": true,
  "message": "\"certificateUrl\" is required"
}
```

6. **Certificate Not Found:**
```json
{
  "error": true,
  "message": "Certificate Not Found"
}
```

7. **Pet Not Found:**
```json
{
  "error": true,
  "message": "Pet couldn't found"
}
```

8. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication and Authorization:**
   - The `auth` middleware verifies the JWT token and decodes the user information.
   - The `editPetAuth` middleware ensures that the pet exists and the authenticated user is the primary owner of the pet.

2. **Validation:**
   - The `editVaccinationCertificateValidation` function validates the request body to ensure `certificateUrl` and `newDesc` are provided and correctly formatted.

3. **Updating the Certificate:**
   - The `editPetVaccinationCertificateDescController` finds the certificate in the pet's vaccination array using the provided `certificateUrl`.
   - Updates the `desc` field with the new description.
   - Saves the updated pet document to the database.

#### 8. Delete Vaccination Certificate of the Pet

**Endpoint:** `/api/pet/petsVaccinationCertificate/:petId`

**Method:** `DELETE`

**Description:** This endpoint allows authenticated users to delete one or more vaccination certificates for a specific pet.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Authorization:**
- Only the primary owner of the pet can delete the vaccination certificates.
- The owner's ID is compared with the `user` field in the token.
- If the pet does not exist, or the user is not the primary owner, a `403` or `404` status code is returned.

**Request Parameters:**
**Path Parameters:**
```http
:petId - The unique identifier of the pet whose vaccination certificates are being deleted.
```

**Request Body:**
**JSON:**
```json
{
  "urlList": [
    "<url_of_certificate_1>",
    "<url_of_certificate_2>"
  ]
}
```
- `urlList` (Required): A list of URLs for the vaccination certificates to be deleted.

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "vaccination deleted successfully",
  "remainedVaccinations": [
    {
      "desc": "Rabies Vaccination",
      "fileUrl": "pets/123456/petsVaccinationCertificates/123456_abc123_vaccinationCertificate.pdf"
    }
  ]
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Unauthorized Access:**
```json
{
  "error": true,
  "message": "You can't edit this pet"
}
```

5. **Invalid Request Body:**
```json
{
  "error": true,
  "message": "File url to delete is required"
}
```

6. **Pet Not Found:**
```json
{
  "error": true,
  "message": "Pet couldn't found"
}
```

7. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication and Authorization:**
   - The `auth` middleware verifies the JWT token and decodes the user information.
   - The `editPetAuth` middleware ensures that the pet exists and the authenticated user is the primary owner of the pet.

2. **Validation:**
   - The request body must include a valid `urlList` containing one or more URLs of certificates to delete.
   - If `urlList` is missing or empty, a `400` status code is returned.

3. **Certificate Deletion:**
   - The `deletePetVaccinationCertificateController` iterates through the provided `urlList`.
   - Each URL is validated and passed to the `deleteFileHelper` function to delete the file.
   - If the file deletion is successful, the corresponding entry is removed from the pet's `vaccinations` array.
   - The updated pet document is saved to the database.

#### 9. Delete Pet and Clean Dependency

**Endpoint:** `/api/pet/deletePet/:petId`

**Method:** `DELETE`

**Description:** This endpoint allows authenticated users to delete a specific pet, along with its associated dependencies and references.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Authorization:**
- Only the primary owner of the pet can delete the pet.
- The owner's ID is compared with the `user` field in the token.
- If the pet does not exist, or the user is not the primary owner, a `403` or `404` status code is returned.

**Request Parameters:**
**Path Parameters:**
```http
:petId - The unique identifier of the pet to be deleted.
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "Pet deleted successfully"
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Unauthorized Access:**
```json
{
  "error": true,
  "message": "You can't edit this pet"
}
```

5. **Pet in CareGive:**
```json
{
  "error": true,
  "message": "Pet is on care give"
}
```

6. **Pet with Reports:**
```json
{
  "error": true,
  "message": "There is reported mission about this pet"
}
```

7. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication and Authorization:**
   - The `auth` middleware verifies the JWT token and decodes the user information.
   - The `editPetAuth` middleware ensures that the pet exists and the authenticated user is the primary owner of the pet.

2. **Dependency Check:**
   - The system checks if the pet is currently under caregiving (`CareGive`) or has active reports (`ReportMission`).
   - If so, the deletion is aborted, and a relevant error message is returned.

3. **Follower Cleanup:**
   - All followers of the pet are identified and their `followingUsersOrPets` field is updated to remove references to the pet.

4. **Owner Dependency Cleanup:**
   - Dependencies of the primary and secondary owners are cleaned.
   - `dependedUsers` and `pets` fields are updated for each user.

5. **File Deletion:**
   - The pet's associated files (e.g., images) are deleted using `deleteFileHelper`.

6. **Pet Deletion:**
   - The pet document is deleted from the database.

#### 10. Get Pet by Pet Id

**Endpoint:** `/api/pet/getPetById/:petId`

**Method:** `GET`

**Description:** This endpoint retrieves detailed information about a specific pet by its ID.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Request Parameters:**
**Path Parameters:**
```http
:petId - The unique identifier of the pet whose information is being retrieved.
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "Pet found successfully",
  "pet": {
    "name": "Buddy",
    "age": 3,
    "breed": "Golden Retriever",
    "vaccinations": [
      { "desc": "Rabies Vaccine", "date": "2024-12-01" },
      { "desc": "Parvo Vaccine", "date": "2024-10-15" }
    ],
    "primaryOwner": "John Doe",
    "followers": 5
  }
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Pet Not Found:**
```json
{
  "error": true,
  "message": "Pet not found"
}
```

5. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication:**
   - The `auth` middleware verifies the JWT token and decodes the user information.

2. **Parameter Validation:**
   - The `petId` parameter is extracted from the request URL.
   - If `petId` is missing, a `400` status code is returned.

3. **Pet Retrieval:**
   - The `getPetByIdController` queries the database to retrieve the pet by its ID.
   - If the pet is not found or the primary owner is deactivated or has blocked the user, a `404` status code is returned.

4. **Data Transformation:**
   - The pet data is processed using `getLightWeightPetInfoHelper` to prepare a lightweight response object.

5. **Response:**
   - A successful response includes the pet's details, such as name, age, breed, vaccination records, owner details, and the number of followers.

#### 11. Get Pets by JWT Token

**Endpoint:** `/api/pet/getPets`

**Method:** `GET`

**Description:** This endpoint retrieves a list of pets owned by the authenticated user based on their JWT token.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "pet info prepared successfully",
  "pets": [
    {
      "name": "Buddy",
      "age": 3,
      "breed": "Golden Retriever",
      "vaccinations": [
        { "desc": "Rabies Vaccine", "date": "2024-12-01" },
        { "desc": "Parvo Vaccine", "date": "2024-10-15" }
      ],
      "followers": 5
    },
    {
      "name": "Mittens",
      "age": 2,
      "breed": "Tabby",
      "vaccinations": [
        { "desc": "Feline Leukemia Vaccine", "date": "2024-11-10" }
      ],
      "followers": 8
    }
  ]
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication:**
   - The `auth` middleware verifies the JWT token and decodes the user information.

2. **Pet Retrieval:**
   - The `getPetsByJwtController` fetches the authenticated user from the database using the user ID from the JWT token.
   - For each pet ID in the user's `pets` array, the corresponding pet details are retrieved from the `Pet` collection.
   - Each pet's data is processed through `getLightWeightPetInfoHelper` to create a lightweight response object.

3. **Response:**
   - A successful response includes an array of the user's pets, each with details such as name, age, breed, vaccination records, and the number of followers.

#### 12. Get Pets by User Id

**Endpoint:** `/api/pet/getPetsByUserId/:userId`

**Method:** `GET`

**Description:** This endpoint retrieves a list of pets owned by a specific user, identified by their user ID. The requesting user must be authenticated.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Request Parameters:**
**Path Parameters:**
```http
:userId - The unique identifier of the user whose pets are being retrieved.
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "Pet list prepared successfully",
  "pets": [
    {
      "name": "Buddy",
      "age": 3,
      "breed": "Golden Retriever",
      "vaccinations": [
        { "desc": "Rabies Vaccine", "date": "2024-12-01" },
        { "desc": "Parvo Vaccine", "date": "2024-10-15" }
      ],
      "followers": 5
    },
    {
      "name": "Mittens",
      "age": 2,
      "breed": "Tabby",
      "vaccinations": [
        { "desc": "Feline Leukemia Vaccine", "date": "2024-11-10" }
      ],
      "followers": 8
    }
  ]
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **User Not Found:**
```json
{
  "error": true,
  "message": "User Not Found"
}
```

5. **Missing Params:**
```json
{
  "error": true,
  "message": "Missing Params"
}
```

6. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication:**
   - The `auth` middleware verifies the JWT token and decodes the user information.

2. **Parameter Validation:**
   - The `userId` parameter is extracted from the request URL.
   - If `userId` is missing, a `400` status code is returned.

3. **User Validation:**
   - The `getPetsByUserIdController` verifies if the target user exists, is active, and has not blocked the requesting user.
   - If the target user is not valid, a `404` status code is returned.

4. **Pet Retrieval:**
   - The controller iterates through the target user's `pets` array, retrieving each pet's details from the `Pet` collection.
   - Each pet's data is processed through `getLightWeightPetInfoHelper` to create a lightweight response object.

5. **Response:**
   - A successful response includes an array of the target user's pets, each with details such as name, age, breed, vaccination records, and the number of followers.

#### 13. Get Pets by Search Value

**Endpoint:** `/api/pet/getPetsBySearchValue/:searchValue/:lastItemId/:limit`

**Method:** `GET`

**Description:** This endpoint retrieves a paginated list of pets based on a search value. It allows users to search for pets using keywords in their name or bio fields.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Request Parameters:**
**Path Parameters:**
```http
:searchValue - The search term used to query the pet database.
:lastItemId - The ID of the last pet item from the previous response for pagination. Pass 'null' for the first page.
:limit - The maximum number of pets to return in the response.
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "totalDataCount": 25,
  "pets": [
    {
      "name": "Buddy",
      "age": 3,
      "breed": "Golden Retriever",
      "bio": "A friendly and playful companion.",
      "followers": 5
    },
    {
      "name": "Mittens",
      "age": 2,
      "breed": "Tabby",
      "bio": "Loves cuddles and naps.",
      "followers": 8
    }
  ]
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Missing Params:**
```json
{
  "error": true,
  "message": "Missing Params"
}
```

5. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Working Details:**
1. **Authentication:**
   - The `auth` middleware verifies the JWT token and decodes the user information.

2. **Search Logic:**
   - The `searchValue` parameter is split into individual terms.
   - A MongoDB query searches for pets where their `name` or `bio` fields match the full `searchValue` or any of its terms (case-insensitive).

3. **Pagination:**
   - If `lastItemId` is provided, the response skips pets up to the index of the last item ID from the previous response.
   - The number of pets returned is limited by the `limit` parameter.

4. **Data Processing:**
   - Each pet in the result is processed using `getLightWeightPetInfoHelper` to return a simplified response object.

5. **Response:**
   - A successful response includes the total count of matching pets and a paginated list of pet objects.

#### 14. Get Recommended Pets

**Endpoint:** `/api/pet/getRecommendedPets`

**Method:** `GET`

**Description:** This endpoint retrieves a list of recommended pets for the authenticated user based on their owned pets and caregiving history.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "recommended pets info prepared successfully",
  "pets": [
    {
      "name": "Buddy",
      "age": 3,
      "breed": "Golden Retriever",
      "bio": "A friendly and playful companion.",
      "followers": 5
    },
    {
      "name": "Mittens",
      "age": 2,
      "breed": "Tabby",
      "bio": "Loves cuddles and naps.",
      "followers": 8
    }
  ]
}
```

2. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

3. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

4. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication:**
   - The `auth` middleware verifies the JWT token and decodes the user information.

2. **Pet Retrieval:**
   - The `getRecommendedPetsController` fetches the authenticated user's owned pets from their `pets` array.
   - It also retrieves pets from the user's caregiving history (`caregiverCareer` array).

3. **Data Deduplication:**
   - Duplicate pets are removed from the combined list of owned and caregiving pets.

4. **Data Processing:**
   - Each pet in the final list is processed through `getLightWeightPetInfoHelper` to create a simplified response object.

5. **Response:**
   - A successful response includes an array of recommended pets, each with details such as name, age, breed, bio, and the number of followers.

#### 15. Get Pet Image Comments

**Endpoint:** `/api/pet/getImageComments/:petId/:imageId/:lastItemId/:limit`

**Method:** `GET`

**Description:** This endpoint retrieves paginated comments for a specific image of a pet. It provides information about each comment, including the user who commented, likes, and replies.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Request Parameters:**
**Path Parameters:**
```http
:petId - The unique identifier of the pet.
:imageId - The unique identifier of the image whose comments are being retrieved.
:lastItemId - The ID of the last comment from the previous response for pagination. Pass 'null' for the first page.
:limit - The maximum number of comments to return in the response.
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "Comments Prepared successfully",
  "totalCommentCount": 50,
  "comments": [
    {
      "user": {
        "userId": "12345",
        "username": "john_doe",
        "profileImage": "https://example.com/john_doe.jpg"
      },
      "content": "Great picture!",
      "createdAt": "2025-01-10T12:00:00Z",
      "likeCount": 10,
      "firstFiveLikedUser": [
        { "userId": "67890", "username": "jane_doe" }
      ],
      "replyCount": 2,
      "lastReply": {
        "userId": "67890",
        "username": "jane_doe",
        "content": "I agree!",
        "createdAt": "2025-01-11T15:00:00Z"
      }
    }
  ]
}
```

2. **No Comments Found:**
```json
{
  "error": true,
  "message": "No Comment Found"
}
```

3. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

4. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

5. **Missing Params:**
```json
{
  "error": true,
  "message": "Missing Params"
}
```

6. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication:**
   - The `auth` middleware verifies the JWT token and decodes the user information.

2. **Parameter Validation:**
   - The `petId` and `imageId` are extracted from the request URL.
   - If `petId` or `imageId` is missing, a `400` status code is returned.

3. **Comment Retrieval:**
   - The `getPetImageCommentsController` fetches the pet and image using the provided IDs.
   - Comments are paginated based on the `lastItemId` and `limit` parameters.

4. **Data Processing:**
   - Each comment includes user details (processed via `getLightWeightUserInfoHelper`), likes, and replies.
   - Replies and likes are summarized, with only the first five liked users and the last reply included.

5. **Response:**
   - A successful response includes the total number of comments and a paginated list of comment objects, each containing user info, content, likes, and replies.

#### 16. Get Pet Image Comment Replies

**Endpoint:** `/api/pet/getImageCommentsReplies/:petId/:imageId/:commentId/:lastItemId/:limit`

**Method:** `GET`

**Description:** This endpoint retrieves paginated replies to a specific comment on a pet's image. It provides detailed information about each reply, including the user who replied, likes, and additional metadata.

**Authentication:**
- The endpoint requires a valid JWT token to be provided in the request headers.
- The token is verified using the private key specified in the environment variable `ACCESS_TOKEN_PRIVATE_KEY`.
- If the token is missing or expired, the user will receive a `403` status code with an appropriate error message.

**Request Headers:**
```http
x-access-token: <your_valid_jwt_token>
```

**Request Parameters:**
**Path Parameters:**
```http
:petId - The unique identifier of the pet.
:imageId - The unique identifier of the image.
:commentId - The unique identifier of the comment whose replies are being retrieved.
:lastItemId - The ID of the last reply from the previous response for pagination. Pass 'null' for the first page.
:limit - The maximum number of replies to return in the response.
```

**Response Examples:**

1. **Success:**
```json
{
  "error": false,
  "message": "Reply List Prepared Successfully",
  "replyCount": 25,
  "replies": [
    {
      "user": {
        "userId": "12345",
        "username": "john_doe",
        "profileImage": "https://example.com/john_doe.jpg"
      },
      "content": "I love this image!",
      "createdAt": "2025-01-10T12:00:00Z",
      "likeCount": 10,
      "firstFiveLikedUser": [
        { "userId": "67890", "username": "jane_doe" }
      ]
    }
  ]
}
```

2. **No Replies Found:**
```json
{
  "error": true,
  "message": "No Comment Found"
}
```

3. **Token Missing:**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

4. **Token Expired:**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

5. **Missing Params:**
```json
{
  "error": true,
  "message": "Missing Params"
}
```

6. **Internal Server Error:**
```json
{
  "error": true,
  "message": "Internal Server Error"
}
```

**Working Details:**
1. **Authentication:**
   - The `auth` middleware verifies the JWT token and decodes the user information.

2. **Parameter Validation:**
   - The `petId`, `imageId`, and `commentId` are extracted from the request URL.
   - If any of these parameters are missing, a `400` status code is returned.

3. **Reply Retrieval:**
   - The `getPetImageCommentsRepliesController` fetches the specified pet, image, and comment using their IDs.
   - Replies are paginated based on the `lastItemId` and `limit` parameters.

4. **Data Processing:**
   - Each reply includes user details (processed via `getLightWeightUserInfoHelper`) and metadata such as likes and reply content.
   - Likes are summarized, with only the first five liked users included.

5. **Response:**
   - A successful response includes the total count of replies and a paginated list of reply objects, each containing user info, content, likes, and other metadata.

#### Pet Interaction Endpoints

##### 1. Follow or Unfollow a Pet

**Endpoint:** `/api/pet/followPet/:petId`

**Method:** `PUT`

**Description:** Allows authenticated users to follow or unfollow a pet by its ID. Ensures proper handling of user-pet relationships and verifies data consistency between user and pet records.

**Authentication:**
**Header:**
```http
x-access-token: <your_access_token>
```
**Required:** Yes

- The endpoint requires a valid JWT token in the `x-access-token` header.
- If the token is expired or invalid, appropriate error messages are returned.

**Path Parameters:**
- `petId` (string): The unique identifier of the pet to follow or unfollow.

**Request Example:**
```http
PUT /api/pet/followPet/12345 HTTP/1.1
Host: api.example.com
x-access-token: <your_access_token>
```

**Response Examples**

**200 OK - Success**
```json
{
  "error": false,
  "message": "pet followed or follow pet removed successfully"
}
```

**400 Bad Request - Missing `petId`**
```json
{
  "error": true,
  "message": "pet id parameter is required"
}
```

**404 User Not Found**
```json
{
  "error": true,
  "message": "user couldn't found"
}
```

**404 Pet Not Found**
```json
{
  "error": true,
  "message": "pet couldn't found"
}
```

**403 Forbidden**
```json
{
  "error": true,
  "message": "Access Denied: token expired"
}
```

**403 Forbidden**
```json
{
  "error": true,
  "message": "Access Denied: No token provided"
}
```

**500 Internal Server Error**
```json
{
  "error": true,
  "message": "Internal server error"
}
```

**Workflow and Logic**

1. **Authentication:**
   - Validates the provided JWT token.
   - Denies access if the token is missing, invalid, or expired.

2. **Validation:**
   - Ensures `petId` is present and valid.

3. **User and Pet Retrieval:**
   - Retrieves the user from the database using the ID in the decoded JWT token.
   - Ensures the user is not deactivated.
   - Fetches the pet and its primary owner from the database.
   - Verifies that the pet exists and the primary owner is not deactivated or has not blocked the user.

4. **Follow/Unfollow Logic:**
   - Checks if the user already follows the pet.
   - Ensures data consistency between the user's following list and the pet's followers.
   - Adds or removes the pet from the user's following list and the user from the pet's followers list based on the current relationship.

5. **Database Updates:**
   - Saves updates to both user and pet records.
   - Handles and logs errors during the save operations.

6. **Response:**
   - Returns success or error messages based on the operation's outcome.

**Notes:**
- If inconsistencies are detected between the user's following list and the pet's followers list, the system automatically fixes the issue and unfollows the pet to maintain data integrity.
- This endpoint is idempotent; following or unfollowing a pet multiple times results in consistent behavior.

##### 2. Like or Remove Like from Pet Image

**Endpoint:** `/api/pet/likeImage`

**Method:** `PUT`

**Description:** This endpoint allows users to like or remove their like from a specific pet image. The user must be authenticated to perform this action.

**Authentication:**
The endpoint requires a valid JWT token to be passed in the `x-access-token` header.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "petId": "<pet_id>",
  "imgId": "<image_id>"
}
```

| Field    | Type   | Required | Description                                |
|----------|--------|----------|--------------------------------------------|
| petId    | String | Yes      | The ID of the pet to which the image belongs. |
| imgId    | String | Yes      | The ID of the image to like or unlike.      |

**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "image has been liked or like has been removed"
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation error: <error_details>"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

4. **Image Not Found**
   ```json
   {
     "error": true,
     "message": "image couldn't found"
   }
   ```

5. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Functionality:**
1. The endpoint first validates the presence and structure of the `petId` and `imgId` fields in the request body.
2. It verifies the JWT token provided in the `x-access-token` header.
3. If the `petId` is valid, the server retrieves the pet from the database.
4. It looks for the image within the pet's `images` array using the `imgId`.
5. If the image exists, the server checks whether the authenticated user has already liked the image:
   - If the user has liked the image, their ID is removed from the `likes` array (removing the like).
   - If the user has not liked the image, their ID is added to the `likes` array (adding the like).
6. The `images` array is marked as modified, and the pet document is saved to the database.
7. A success response is returned.

**Edge Cases:**
- If `petId` or `imgId` is invalid, a `404 Not Found` error is returned.
- If the `x-access-token` is missing or invalid, a `403 Unauthorized` error is returned.
- If the token has expired, the response explicitly mentions the expiration.
- If any unexpected error occurs during database operations, a `500 Internal Server Error` is returned.

##### 3. Like or Remove Like from Pet Comment

**Endpoint:** `/api/pet/likeComment`

**Method:** `PUT`

**Description:** This endpoint allows users to like or remove their like from a specific comment or reply associated with a pet image. The user must be authenticated to perform this action.

**Authentication:**
The endpoint requires a valid JWT token to be passed in the `x-access-token` header.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "petId": "<pet_id>",
  "imgId": "<image_id>",
  "commentId": "<comment_id>",
  "replyId": "<reply_id>" // Optional
}
```

| Field      | Type   | Required | Description                                 |
|------------|--------|----------|---------------------------------------------|
| petId      | String | Yes      | The ID of the pet to which the comment belongs. |
| imgId      | String | Yes      | The ID of the image associated with the comment. |
| commentId  | String | Yes      | The ID of the comment to like or unlike.      |
| replyId    | String | No       | The ID of the reply to like or unlike (if applicable). |


**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "comment or reply has been liked or like has been removed"
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation error: <error_details>"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

4. **Image Not Found**
   ```json
   {
     "error": true,
     "message": "image couldn't found"
   }
   ```

5. **Comment Not Found**
   ```json
   {
     "error": true,
     "message": "Comment not found"
   }
   ```

6. **Reply Not Found**
   ```json
   {
     "error": true,
     "message": "Reply Not Found"
   }
   ```

7. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

8. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

9. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Functionality:**
1. The endpoint first validates the presence and structure of `petId`, `imgId`, and `commentId` in the request body.
2. It verifies the JWT token provided in the `x-access-token` header.
3. If the `petId` is valid, the server retrieves the pet from the database.
4. It looks for the image within the pet's `images` array using the `imgId`.
5. If the image exists, it retrieves the comment using `commentId`.
6. If the `replyId` is provided, the server checks for the specific reply:
   - If the reply exists, it toggles the like status for the reply.
   - If the reply does not exist, a `404 Reply Not Found` error is returned.
7. If the `replyId` is not provided, it toggles the like status for the comment.
8. The `images` array is marked as modified, and the pet document is saved to the database.
9. A success response is returned.

**Edge Cases:**
- If any ID (`petId`, `imgId`, `commentId`, or `replyId`) is invalid, a `404 Not Found` error is returned.
- If the `x-access-token` is missing or invalid, a `403 Unauthorized` error is returned.
- If the token has expired, the response explicitly mentions the expiration.
- If any unexpected error occurs during database operations, a `500 Internal Server Error` is returned.

##### 4. Create or Reply to a Comment on Pet Image

**Endpoint:** `/api/pet/petImageComment`

**Method:** `PUT`

**Description:** This endpoint allows users to add a new comment to a pet image or reply to an existing comment. The user must be authenticated to perform this action.

**Authentication:**
The endpoint requires a valid JWT token to be passed in the `x-access-token` header.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "petId": "<pet_id>",
  "imgId": "<image_id>",
  "commentId": "<comment_id>", // Optional for replies
  "comment": "<comment_text>"
}
```

| Field      | Type   | Required | Description                                      |
|------------|--------|----------|--------------------------------------------------|
| petId      | String | Yes      | The ID of the pet associated with the image.     |
| imgId      | String | Yes      | The ID of the image to comment on or reply to.   |
| commentId  | String | No       | The ID of the comment to reply to (if replying). |
| comment    | String | Yes      | The text of the comment or reply.                |


**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comment saved successfully"
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation error: <error_details>"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

4. **Image Not Found**
   ```json
   {
     "error": true,
     "message": "image couldn't found"
   }
   ```

5. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "Access Denied: No token provided"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence and structure of `petId`, `imgId`, and `comment` in the request body.
2. It verifies the JWT token provided in the `x-access-token` header.
3. If the `petId` is valid, the server retrieves the pet from the database.
4. It looks for the image within the pet's `images` array using the `imgId`.
5. If the `commentId` is provided, the server considers the request as a reply:
   - Finds the parent comment using `commentId`.
   - Appends the reply to the `replies` array of the parent comment.
6. If the `commentId` is not provided, it adds a new comment to the image's `comments` array.
7. The `images` array is marked as modified, and the pet document is saved to the database.
8. A notification is sent to the appropriate user(s) via the `sendNotification` utility.
9. A success response is returned.

**Edge Cases:**
- If any ID (`petId`, `imgId`, `commentId`) is invalid, a `404 Not Found` error is returned.
- If the `x-access-token` is missing or invalid, a `403 Unauthorized` error is returned.
- If the token has expired, the response explicitly mentions the expiration.
- If any unexpected error occurs during database operations, a `500 Internal Server Error` is returned.

##### 5. Edit a Comment or Reply on Pet Image

**Endpoint:** `/api/pet/petEditImageComment`

**Method:** `PUT`

**Description:** This endpoint allows users to edit a specific comment or reply associated with a pet image. The user must have appropriate permissions to perform this action.

**Authentication:**
The endpoint requires a valid JWT token to be passed in the `x-access-token` header.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "petId": "<pet_id>",
  "imgId": "<image_id>",
  "commentId": "<comment_id>",
  "replyId": "<reply_id>", // Optional for replies
  "newComment": "<new_comment_text>"
}
```

| Field       | Type   | Required | Description                                       |
|-------------|--------|----------|---------------------------------------------------|
| petId       | String | Yes      | The ID of the pet associated with the image.      |
| imgId       | String | Yes      | The ID of the image containing the comment.       |
| commentId   | String | Yes      | The ID of the comment to be edited.               |
| replyId     | String | No       | The ID of the reply to be edited (if applicable). |
| newComment  | String | Yes      | The updated text for the comment or reply.        |


**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comment edited successfully"
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation error: <error_details>"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

4. **Image Not Found**
   ```json
   {
     "error": true,
     "message": "image couldn't found"
   }
   ```

5. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can't edit this comment"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence and structure of `petId`, `imgId`, `commentId`, and `newComment` in the request body.
2. It verifies the JWT token provided in the `x-access-token` header.
3. If the `petId` is valid, the server retrieves the pet from the database.
4. It looks for the image within the pet's `images` array using the `imgId`.
5. It retrieves the comment using `commentId`.
6. If the `replyId` is provided, it identifies the specific reply for editing. Permissions are checked to ensure the user is authorized to edit:
   - Users can edit their own comments or replies.
   - Pet owners can edit any comment or reply on their pet's images.
7. The `newComment` is updated in the database, and the `images` array is marked as modified.
8. The pet document is saved to the database, and a success response is returned.

**Edge Cases:**
- If any ID (`petId`, `imgId`, `commentId`, or `replyId`) is invalid, a `404 Not Found` error is returned.
- If the `x-access-token` is missing or invalid, a `403 Unauthorized` error is returned.
- If the token has expired, the response explicitly mentions the expiration.
- If any unexpected error occurs during database operations, a `500 Internal Server Error` is returned.

##### 6. Delete a Comment or Reply on Pet Image

**Endpoint:** `/api/pet/petImageComment`

**Method:** `DELETE`

**Description:** This endpoint allows users to delete a specific comment or reply associated with a pet image. The user must have appropriate permissions to perform this action.

**Authentication:**
The endpoint requires a valid JWT token to be passed in the `x-access-token` header.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Body:**
```json
{
  "petId": "<pet_id>",
  "imgId": "<image_id>",
  "commentId": "<comment_id>",
  "replyId": "<reply_id>" // Optional for replies
}
```

| Field       | Type   | Required | Description                                       |
|-------------|--------|----------|---------------------------------------------------|
| petId       | String | Yes      | The ID of the pet associated with the image.      |
| imgId       | String | Yes      | The ID of the image containing the comment.       |
| commentId   | String | Yes      | The ID of the comment to be deleted.              |
| replyId     | String | No       | The ID of the reply to be deleted (if applicable). |


**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "message": "Comment deleted successfully"
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation error: <error_details>"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet couldn't found"
   }
   ```

4. **Image Not Found**
   ```json
   {
     "error": true,
     "message": "image couldn't found"
   }
   ```

5. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can't edit this comment"
   }
   ```

6. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

7. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal server error"
   }
   ```

**Functionality:**
1. The endpoint validates the presence and structure of `petId`, `imgId`, and `commentId` in the request body.
2. It verifies the JWT token provided in the `x-access-token` header.
3. If the `petId` is valid, the server retrieves the pet from the database.
4. It looks for the image within the pet's `images` array using the `imgId`.
5. It retrieves the comment using `commentId`.
6. If the `replyId` is provided, it identifies the specific reply for deletion. Permissions are checked to ensure the user is authorized to delete:
   - Users can delete their own comments or replies.
   - Pet owners can delete any comment or reply on their pet's images.
7. The comment or reply is removed from the database, and the `images` array is marked as modified.
8. The pet document is saved to the database, and a success response is returned.

**Edge Cases:**
- If any ID (`petId`, `imgId`, `commentId`, or `replyId`) is invalid, a `404 Not Found` error is returned.
- If the `x-access-token` is missing or invalid, a `403 Unauthorized` error is returned.
- If the token has expired, the response explicitly mentions the expiration.
- If any unexpected error occurs during database operations, a `500 Internal Server Error` is returned.

### Pet Owner Operations Routes

#### 1. Invite Secondary Owner to Pet

**Endpoint:** `/api/petOwner/inviteSecondaryOwner/:petId/:secondaryOwnerId`

**Method:** `POST`

**Description:** This endpoint allows the primary owner of a pet to invite another user as a secondary owner of the pet. The user must be authenticated to perform this action.

**Authentication:**
The endpoint requires a valid JWT token to be passed in the `x-access-token` header.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
| Parameter          | Type   | Required | Description                           |
|--------------------|--------|----------|---------------------------------------|
| petId              | String | Yes      | The ID of the pet to which the user is being invited. |
| secondaryOwnerId   | String | Yes      | The ID of the user to be invited as a secondary owner. |


**Response Examples:**

1. **Success**
   ```json
   {
     "error": false,
     "invitation": {
       "from": "primaryOwnerId",
       "to": "secondaryOwnerId",
       "petId": "petId",
       "_id": "invitationId"
     }
   }
   ```

2. **Validation Error**
   ```json
   {
     "error": true,
     "message": "Validation error: <error_details>"
   }
   ```

3. **Pet Not Found**
   ```json
   {
     "error": true,
     "message": "Pet not found"
   }
   ```

4. **User Not Found or Inactive**
   ```json
   {
     "error": true,
     "message": "User which you are trying to record as secondary owner is not found"
   }
   ```

5. **User Already Recorded as Owner**
   ```json
   {
     "error": false,
     "message": "This user is already recorded as owner"
   }
   ```

6. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can edit just your pet"
   }
   ```

7. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

8. **Internal Server Error**
   ```json
   {
     "error": true,
     "message": "Internal Server Error"
   }
   ```

**Functionality:**
1. Validates the `petId` and `secondaryOwnerId` parameters using the `secondaryOwnerInvitationReqParamsValidation` utility.
2. Ensures the authenticated user is the primary owner of the pet.
3. Checks if the `secondaryOwnerId` user exists, is active, and has not blocked the primary owner.
4. Verifies that the `secondaryOwnerId` user is not already recorded as an owner of the pet.
5. Creates a new secondary owner invitation in the database.
6. Sends a notification to the invited user.
7. Returns the created invitation details upon success.

**Edge Cases:**
- If the `petId` or `secondaryOwnerId` is invalid, a `400 Validation Error` is returned.
- If the pet does not belong to the authenticated user, a `401 Unauthorized Access` error is returned.
- If the user to be invited is deactivated, blocked, or does not exist, a `404 User Not Found` error is returned.
- If the user is already an owner, a `400 User Already Recorded as Owner` response is returned.
- If the `x-access-token` is missing or invalid, a `403 Unauthorized` error is returned.
- If the token has expired, the response explicitly mentions the expiration.
- If any unexpected error occurs during database operations, a `500 Internal Server Error` is returned.

#### 2. Respond to Secondary Owner Invitation

**Endpoint:** `/api/petOwner/secondaryOwnerInvitation/:invitationId/:usersResponse`

**Method:** `PUT`

**Description:** This endpoint allows a user to respond to a secondary owner invitation for a pet. The user must be authenticated to perform this action.


**Authentication:**
The endpoint requires a valid JWT token to be passed in the `x-access-token` header.

**Request Headers:**
```http
x-access-token: <your_access_token>
```

**Request Path Parameters:**
| Parameter        | Type   | Required | Description                                        |
|------------------|--------|----------|----------------------------------------------------|
| invitationId     | String | Yes      | The ID of the invitation to respond to.           |
| usersResponse    | String | Yes      | The user's response to the invitation (`true` or `false`). |


**Response Examples:**

1. **Success (Invitation Accepted)**
   ```json
   {
     "error": false,
     "message": "@username recorded as owner successfully"
   }
   ```

2. **Success (Invitation Rejected)**
   ```json
   {
     "error": false,
     "message": "Invitation rejected successfully"
   }
   ```

3. **Invalid Response Type**
   ```json
   {
     "error": true,
     "message": "You can only respond to the invitation with a boolean"
   }
   ```

4. **Missing Invitation ID**
   ```json
   {
     "error": true,
     "message": "Invitation ID is required"
   }
   ```

5. **Invitation Not Found**
   ```json
   {
     "error": true,
     "message": "Invitation couldn't be found"
   }
   ```

6. **User or Pet Not Found**
   ```json
   {
     "error": true,
     "message": "User or Pet not found"
   }
   ```

7. **User Already an Owner**
   ```json
   {
     "error": true,
     "message": "User is already an owner"
   }
   ```

8. **Unauthorized Access**
   ```json
   {
     "error": true,
     "message": "You can't edit this pet"
   }
   ```

9. **Token Expired**
   ```json
   {
     "error": true,
     "message": "Access Denied: token expired"
   }
   ```

10. **Internal Server Error**
    ```json
    {
      "error": true,
      "message": "Internal Server Error"
    }
    ```

**Functionality:**
1. Validates the `invitationId` and `usersResponse` parameters.
2. Ensures the `usersResponse` is either `true` (accept) or `false` (reject).
3. If the user rejects the invitation, the invitation is deleted.
4. If the user accepts the invitation:
   - Validates the existence of the invitation, owner, secondary owner, and pet.
   - Ensures the secondary owner is not already recorded as an owner for the pet.
   - Updates the pet's `allOwners` list to include the secondary owner.
   - Updates the dependency status between the primary and secondary owners.
   - Deletes the invitation after successful processing.
5. Returns a success response or appropriate error messages.

**Edge Cases:**
- If the `invitationId` or `usersResponse` is invalid, a `400 Validation Error` is returned.
- If the `usersResponse` is not a boolean, a `400 Invalid Response Type` error is returned.
- If the invitation does not exist, a `404 Invitation Not Found` error is returned.
- If the pet, owner, or secondary owner does not exist or is inactive, a `404 User or Pet Not Found` error is returned.
- If the user is already recorded as an owner, a `400 User Already an Owner` error is returned.
- If the `x-access-token` is missing or invalid, a `403 Unauthorized` error is returned.
- If the token has expired, the response explicitly mentions the expiration.
- If any unexpected error occurs during database operations, a `500 Internal Server Error` is returned.

#### 3. 

### Animal Keyword Routes
_Coming soon..._

### Care Give Routes
_Coming soon..._

### Chat Routes
_Coming soon..._

### Notification
_Coming soon..._

### Admin Routes
_Coming soon..._

---

## Error Codes

The API uses standard HTTP status codes to indicate the success or failure of a request. Here are some common responses:

| Status Code | Meaning                 |
|-------------|-------------------------|
| 200         | OK                      |
| 201         | Created                 |
| 400         | Bad Request             |
| 401         | Unauthorized            |
| 403         | Forbidden               |
| 404         | Not Found               |
| 500         | Internal Server Error   |

---

## Contact
For questions or support, please contact the development team:

- **Email:** support@benekapp.com
- **GitHub Issues:** [Benek GitHub Repository](https://github.com/your-repo-link)

---

_This documentation is a work in progress. Updates will be made regularly._