# About
<<<<<<< HEAD
Bryan Kohler, Jason Birdsong, Luke Cerminaro, Ryan Egan, Luke Johnson
=======
Bryan Kohler, Jason Birdsong, Luke Cerimano, Ryan Eagan, Luke Johnson
>>>>>>> 098b304d1e9c366127c0d6bce08cf02fab169b40

University of Dayton

Department of Computer Science

CPS 490 - Capstone - Fall 2024

Instructor: Ms. Lacie Stiffler

# Case Study: Messanger Application

## System Analysis

## User Requirements
Below are the features we want our messanger app to have. They are separated into use cases and each have a sequence diagram and activity diagram associated with them.

## 1) User Login
    Summary: The user is able to login to their existing account, currently only with their username. With a valid login, they will be taken to thier messanger app home page

    Basic Course of Events:
        1) Student enters their username in the login page

        2)Once they click "Submit" they will be taken to the corresponding account's homepage
    
    Alternative Paths: N/A

    Exception paths: If their is no username connected to the one entered, or they entern nothing into the username field, their access will be denied, and an error message will appear.

    Trigger: Entering an existing username and clicking "Submit"

    Assumptions: The user can access the login page, and has an existing account

    Precondition: The user is on the login page

    Postcondition: The user is taken to the corresponding account's homepage
Activity Diagram:

Communication Diagram:


## 2) Sending a Message
    Summary: The user will be able to type a message into a text box and send their message to a user(s)

    Basic Course of Events:
        1) User will type a message into a text box

        2) User will hit send button

        3) Message will be sent and text box will be empty of their last message, and the chat log will show their sent message

    Alternative Paths: If the user types nothing into the text box, nothing will be sent.

    Exception Paths: N/A

    Trigger: User typing into the text box and clicking the send button
    
    Assumptions: User specified the person/group they are sending the message to, user has an existing account

    Precondition: User has an account and is sending a message to someone who has an account

    Postcondition: User's message will be sent and displayed in their chat log, and they can continue using the site.
Activity Diagram:

Communication Diagram:

## 3) Sending a Message to a Single Reciever
    Summary:The user will specify who they want to send a message to via the reciever's username. They will then type their message into a text box, click the send button, and the message will be sent to that user. The text box will then clear.

    Basic Course of Events:
        1) User will specify who they want to send a message to by looking up their username

        2) User will type a message into a text box

        3) User will hit send button

        4) Message will be sent and text box will be empty of their last message, and the chat log will show their sent message

    Alternative Paths: If the user types nothing into the text box, nothing will be sent.

    Exception Paths: N/A

    Trigger: User selecting an existing user, typing into the text box and clicking the send button
    
    Assumptions: The user sending and recieving the message exist.

    Precondition: User has an account and is sending a message to someone who has an account

    Postcondition: User's message will be sent to the specified user, displayed in their chat log, and they can continue using the site.
Activity Diagram:

Communication Diagram:

## 4) Receiving a Message
    Summary: User will get a message notification that specifies what user is sending them a message. When they click into that chat log, they will see their chat history, including the new message sent to them

    Basic Course of Events:
        1) User will get a notification in their homepage

        2) User will click into chat log from the homepage and enter thier message page.

        3) User will see both chat history, and newly recieved message

    Alternative Paths: If user is already in the chat page of the user who is sending them a message, they will see the message pop up there. If the user isn't logged in to the site, they will see the notification when logged in.

    Exception Paths: N/A

    Trigger: User is sent a message
    
    Assumptions: User has an existing account, and at least one other user exists

    Precondition: User is sent a message

    Postcondition: User cn read message and continue using the site
Activity Diagram:

Communication Diagram:

# Screenshots of Progress

## Begining

## Middle

## End