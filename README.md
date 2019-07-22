#local-emailer
A simple form written with react-native that interacts directly with GMail APIs to send emails.

#Configuration
A project, set of credentials, and permanent refresh token should be generated using these instructions: https://stackoverflow.com/questions/48918069/how-to-use-google-sheets-rest-api-directly-to-create-a-sheet/48940829#48940829

Create a file, `src/Configuration/.google_token.json` with contents like this:
```
{
  "grant_type": "refresh_token",
  "refresh_token": "1234",
  "client_id": "abcd",
  "client_secret": "efgh"
}
```

Create another file, `src/Configuration/.recipients.json` with contents like this:
```
{
  "sender": "youremail@gmail.com",
  "defaultRecipient": "You",
  "recipients": [
    {
      "email": "youremail@gmail.com",
      "name": "You"
    },
    {
      "email": "yourotheremail@gmail.com",
      "name": "You 2"
    },
    {
      "email": "someoneelse@gmail.com",
      "name": "Not You"
    }
  ]
}
```