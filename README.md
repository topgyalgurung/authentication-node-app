# User Authentication with Sessions and Cookies

- This project demonstrates how to implement user authentication using sessions and cookies, explaining the key concepts and practical implementation steps.
- provides a foundation for implementing session-based user authentication. By storing sessions in MongoDB and securely managing cookies, you can ensure a scalable and secure authentication system.

Overview

Authentication in websites often involves verifying user credentials and maintaining their logged-in state. This can be achieved through:
	1.	Sessions and Cookies.
	2.	Signed Encrypted Tokens (e.g., JWTs).

Why Sessions and Cookies?

The HTTP protocol is stateless, meaning that the client and server forget about each other after every request-response cycle. To make connections stateful, sessions and cookies come into play:
	1.	When a client sends a request to the server, the server:
	•	Creates a session.
	•	Stores the session in a database.
	•	Responds with a cookie that contains the session ID.
	2.	The browser saves this cookie. On subsequent requests:
	•	The cookie is sent to the server.
	•	The server uses the session ID from the cookie to retrieve session details and identify the user.

Important Note:
	•	No cookie is created if saveUninitialized is set to false.
	•	When req.session.isAuth = true is set, the session is initialized, and a cookie is created in the browser. This cookie is signed with the secret provided in the session middleware.
	•	The session ID in the database matches the session ID in the cookie.

Session Storage with MongoDB

To save session data into a MongoDB database, the package connect-mongodb-session is used. This package integrates seamlessly with the express-session middleware.

Key Features
	•	Session Management:
	•	Server-side sessions stored in MongoDB.
	•	Cookies sent to the browser, signed for security.
	•	Authentication Flow:
	•	Login and registration forms created using EJS.
	•	User data stored and validated against MongoDB.