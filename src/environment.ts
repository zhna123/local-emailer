import { Configuration } from "./Configuration";
export const configuration: Configuration = {
  sender: "gilbertmccoy@gmail.com",
  defaultRecipient: "Mac",
  recipients: [{
    email: "gchampion@liveperson.com",
    name: "Mac Work",
  }, {
    email: "gilbertmccoy@gmail.com",
    name: "Mac",
  }, {
    email: "cszhna@gmail.com",
    name: "Na",
  }],
  googleAuth: {
    gmailEndpoint: "https://www.googleapis.com/upload/gmail/v1/users/gilbertmccoy@gmail.com/messages/send",
    tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
    tokenRequestBody: {
      grant_type: "refresh_token",
      refresh_token: "1/cCLcQodmj2gSJD7D8QT37Pq0NnBj2xPogjRZF1m3MmM",
      client_id: "326766742366-uiquje9qk14qeuqeka1ao6arc4592if6.apps.googleusercontent.com",
      client_secret: "dQOwuhF4k0eS0IIKtejhwmKM",
    },
  },
};
