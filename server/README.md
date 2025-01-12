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

###### 1. Create Comment


### Pet Routes
_Coming soon..._

### Pet Owner Operations Routes
_Coming soon..._

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