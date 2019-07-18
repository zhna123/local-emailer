
import qs from "qs";
import { configuration } from "../src/environment";

export async function getAccessToken() {
  const parameters: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify({
      ...configuration.googleAuth.tokenRequestBody,
    }),
  };
  console.log(`Fetching token with parameters ${JSON.stringify(parameters, null, 2)}`);
  const fetchResult = await fetch(configuration.googleAuth.tokenEndpoint, parameters);
  return (await fetchResult.json()).access_token;
}

function formatEmail(sender: string, recipient: string, subject: string, body: string) {
  return `To: ${recipient}
From: ${sender}
Subject: ${subject}

${body ? body : "."}\n`;
}

export async function sendEmail(sender: string, recipient: string, subject: string, body: string) {
  const bearerToken = await getAccessToken();
  console.log(`got bearer token ${JSON.stringify(bearerToken, null, 2)}`);
  const authorizationHeader = `Bearer ${bearerToken}`;
  const parameters: RequestInit = {
    method: "POST",
    headers: {
      "content-type": "message/rfc822",
      authorization: authorizationHeader,
    },
    body: formatEmail(sender, recipient, subject, body),
  };
  console.log(`Sending email with parameters: ${JSON.stringify(parameters, null, 2)}`);
  const fetchResult = await fetch(configuration.googleAuth.gmailEndpoint, parameters);
  console.log(`Send email result: ${JSON.stringify(fetchResult, null, 2)}`);
  const fetchResultJson = await fetchResult.json();
  console.log(`Send email result JSON: ${JSON.stringify(fetchResultJson, null, 2)}`);
}
