# local-emailer
A simple form written with react-native that interacts directly with GMail APIs to send emails.

![image](https://raw.githubusercontent.com/champgm/local-emailer/React-Native/screenshot-smaller.png)

# Configuration
A project, set of credentials, and permanent refresh token should be generated using these instructions: https://stackoverflow.com/questions/48918069/how-to-use-google-sheets-rest-api-directly-to-create-a-sheet/48940829#48940829

Create a file, `src/Configuration/GoogleToken.ts` with contents like this:
```typescript
export const googleToken = {
  grant_type: "refresh_token",
  refresh_token: "1234",
  client_id: "abcd",
  client_secret: "efgh"
}
```

Create another file, `src/Configuration/Recipients.ts` with contents like this:
```typescript
export const recipientConfiguration = {
  sender: "youremail@gmail.com",
  defaultRecipient: "You",
  recipients: [
    {
      email: "youremail@gmail.com",
      name: "You"
    },
    {
      email: "yourotheremail@gmail.com",
      name: "You 2"
    },
    {
      email: "someoneelse@gmail.com",
      name: "Not You"
    }
  ]
}
```

# Start for testing
```
npm install -g expo
npm run start
```

# Build packages
You will need to configure your [expo](https://expo.io) account, but it should prompt you to do so if you haven't already
```
npm run build
```