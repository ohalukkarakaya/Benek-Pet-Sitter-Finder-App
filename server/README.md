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
_Coming soon..._

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