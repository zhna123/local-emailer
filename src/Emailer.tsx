// components/Hello.tsx
import _ from "lodash";
import React from "react";
import {
  Button, Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import v4 from "uuid/v4";
import { configuration, Recipient } from "./Configuration";
import { sendEmail } from "./Google";

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
    console.log(`Recipient, '${recipientName}' selected indicator now, '${recipient.selected}'`);
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
      ToastAndroid.showWithGravity(
        "Sending email(s)...",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
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
      ToastAndroid.showWithGravity(
        JSON.stringify(errors, null, 2),
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    } else {
      this.resetState();
      ToastAndroid.showWithGravity(
        "Successfully sent email(s)",
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
      );
    }
  }

  render() {
    const emailButtons = Object.keys(this.state.recipients).map((recipientName) => {
      const recipient = this.state.recipients[recipientName];
      return <Button
        key={v4()}
        onPress={() => this.toggleRecipientSelection(recipientName)}
        title={recipientName}
        color={
          recipient.selected
            ? "#5dc672"
            : "#bababa"
        }
        accessibilityLabel={recipientName}
      />;
    });
    return (
      <SafeAreaView style={styles.root} >
        <View style={styles.emailForm} >
          <View style={styles.recipientButtonGroup}>{emailButtons}</View>
          <View>
            <TextInput
              // Subject Field
              onChangeText={(subject) => this.setState({ subject })}
              style={styles.subject}
              value={this.state.subject}
              autoFocus={true}
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
            />
          </View>
          <View style={styles.actionButtonGroup}>
            <Button
              // Clear button
              key={v4()}
              onPress={() => this.resetState()}
              title="Clear"
              color="red"
              accessibilityLabel="Clear"
            />
            <Button
              // Submit Button
              key={v4()}
              onPress={() => this.sendEmail()}
              title="Send"
              color="green"
              accessibilityLabel="Send"
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const itemWidth = .7;
const itemMargin = .03;
const styles = StyleSheet.create({
  actionButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Dimensions.get("window").height * itemMargin,
    width: Dimensions.get("window").width * itemWidth,
  },
  body: {
    borderWidth: 1,
    marginTop: Dimensions.get("window").height * itemMargin,
    width: Dimensions.get("window").width * itemWidth,
  },
  recipientButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: Dimensions.get("window").width * .6,
  },
  emailForm: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    justifyContent: "flex-start",
    marginTop: Dimensions.get("window").height * .1,
  },
  root: {
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  subject: {
    borderWidth: 1,
    marginTop: Dimensions.get("window").height * itemMargin,
    width: Dimensions.get("window").width * itemWidth,
  },
});
