export interface Configuration {
  defaultRecipient: string;
  recipients: Recipient[];
  googleAuth: any;
  sender: string;
}

export interface Recipient {
  email: string;
  name: string;
  selected?: boolean;
}
