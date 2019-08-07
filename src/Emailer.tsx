// components/Hello.tsx
import _ from "lodash";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  TextInput,
  TextStyle,
  ToastAndroid,
  View,
} from "react-native";
import AwesomeButton from "react-native-really-awesome-button";
import v4 from "uuid/v4";

import { createHexBasesFromColor, hex, rgb } from "./colors/Solarizer";
import { configuration, Recipient } from "./Configuration";
import { sendEmail } from "./Google";

const blue = createHexBasesFromColor(rgb.blue, "base01");
const red = createHexBasesFromColor(rgb.red, "base01");
const green = createHexBasesFromColor(rgb.green, "base01");

export interface Props { }

interface State {
  recipients: { [name: string]: Recipient };
  subject?: string;
  body?: string;
  sending?: boolean;
}

export class Emailer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { recipients: {} };
    configuration.recipients.forEach((recipient) => {
      this.state.recipients[recipient.name] = recipient;
      if (recipient.name === configuration.defaultRecipient) {
        this.state.recipients[recipient.name].selected = true;
      }
    });
  }

  toggleRecipientSelection(recipientName: string) {
    const recipient = this.state.recipients[recipientName];
    recipient.selected = !recipient.selected;
    this.setState(this.state);
  }

  resetState() {
    this.setState({
      subject: undefined,
      body: undefined,
      sending: undefined,
    });
  }

  async sendEmail() {
    this.setState({ sending: true });
    const recipients = Object.keys(this.state.recipients).map((recipientName) => this.state.recipients[recipientName]);
    const addresses = recipients.filter((recipient) => recipient.selected).map((recipient) => recipient.email);
    const errors: any[] = [];
    for (const address of addresses) {
      try {
        ToastAndroid.showWithGravity(
          "Sending email(s)...",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      } catch (error) {
        // console.log(`Could not show sending toast.`);
      }
      try {
        await sendEmail(
          configuration.sender,
          address,
          this.state.subject,
          this.state.body);
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      try {
        console.log(`${JSON.stringify(errors, null, 2)}`);
        ToastAndroid.showWithGravity(
          JSON.stringify(errors, null, 2),
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } catch (error) {
        // console.log(`Could not show errors toast, error: ${error}`);
        // console.log(`Errors: ${errors}`);
      }
    } else {
      try {
        ToastAndroid.showWithGravity(
          "Successfully sent email(s)",
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      } catch (error) {
        // console.log(`Could not show success toast: ${error}`);
      }
    }
    this.resetState();
  }

  render() {
    const emailButtons = Object.keys(this.state.recipients).map((recipientName) => {
      const recipient = this.state.recipients[recipientName];
      return <AwesomeButton
        key={this.state.recipients[recipientName].email}
        onPress={() => this.toggleRecipientSelection(recipientName)}
        accessibilityLabel={recipientName}
        backgroundColor={recipient.selected ? blue.base01 : hex.base01}
        backgroundActive={recipient.selected ? blue.base02 : hex.base02}
        backgroundDarker={recipient.selected ? blue.base03 : hex.base03}
        disabled={this.state.sending}
      >
        {` ${recipientName} `}
      </AwesomeButton>;
    });
    return (
      <View style={styles.root} >
        <View style={styles.emailForm} >
          <View style={styles.recipientButtonGroup}>{emailButtons}</View>
          <View>
            <TextInput
              // Subject Field
              onChangeText={(subject) => this.setState({ subject })}
              style={styles.subject}
              value={this.state.subject}
              autoFocus={true}
              testID="cd7b46a4-2d81-47bf-abc1-7142aba8a7b0"
            />
          </View>
          <View>
            <TextInput
              // Body Field
              multiline={true}
              numberOfLines={8}
              onChangeText={(body) => this.setState({ body })}
              style={styles.body}
              value={this.state.body}
              testID="6b50a3ac-a102-4150-823c-e20d44f0c84d"
            />
          </View>
          <View style={styles.actionButtonGroup}>
            <AwesomeButton
              // Clear button
              key={v4()}
              onPress={() => this.resetState()}
              accessibilityLabel="Clear"
              width={width / 3}
              backgroundColor={this.state.sending ? hex.base01 : red.base01}
              backgroundActive={this.state.sending ? hex.base02 : red.base02}
              backgroundDarker={this.state.sending ? hex.base03 : red.base03}
              disabled={this.state.sending}
            >
              Clear
            </AwesomeButton>
            <AwesomeButton
              // Submit Button
              key={v4()}
              onPress={() => this.sendEmail()}
              accessibilityLabel="Send"
              testID="2d8395f6-03a5-4c61-9c3b-595143aec8bf"
              width={width / 3}
              backgroundColor={this.state.sending ? hex.base01 : green.base01}
              backgroundActive={this.state.sending ? hex.base02 : green.base02}
              backgroundDarker={this.state.sending ? hex.base03 : green.base03}
              disabled={this.state.sending}
            >
              Send
            </AwesomeButton>
          </View>
        </View>
      </View >);
  }
}

const width = Dimensions.get("window").width * .7;
const marginTop = Dimensions.get("window").height * .03;
const textInputBorder: TextStyle = {
  borderColor: hex.base01,
  borderRadius: 5,
  borderWidth: 1,
};
const styles = StyleSheet.create({
  actionButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop,
    width,
  },
  body: {
    paddingHorizontal: Dimensions.get("window").width * .01,
    paddingVertical: Dimensions.get("window").width * .01,
    backgroundColor: hex.base02,
    marginTop,
    textAlignVertical: "top",
    color: hex.base0,
    width,
  },
  recipientButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width * .6,
  },
  emailForm: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: hex.base03,
    flex: 1,
    justifyContent: "flex-start",
    marginTop: Dimensions.get("window").height * .1,
  },
  root: {
    backgroundColor: hex.base03,
    flex: 1,
  },
  subject: {
    paddingHorizontal: Dimensions.get("window").width * .01,
    paddingVertical: Dimensions.get("window").width * .01,
    backgroundColor: hex.base02,
    color: hex.base0,
    marginTop,
    width,
  },
});
