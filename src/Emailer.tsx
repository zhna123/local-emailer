// components/Hello.tsx
import React from "react";
import {
  Button, Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  // ToastAndroid,
  View,
} from "react-native";
import { NativeModules, Platform } from "react-native";
import v4 from "uuid/v4";
import { Recipient } from "./Configuration";
import { configuration } from "./environment";
import { sendEmail } from "./Google";

export interface Props { }

interface State {
  recipients: { [name: string]: Recipient };
  subject?: string;
  body?: string;
  sending?: boolean;
  sendingError?: string;
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

  clearFields() {
    // ToastAndroid.show("A pikachu appeared nearby !", ToastAndroid.SHORT);
    this.setState({
      body: undefined,
      subject: undefined,
    });
  }

  sendEmail() {
    this.setState({ sending: true, sendingError: undefined });
    const recipients = Object.keys(this.state.recipients).map((recipientName) => this.state.recipients[recipientName]);
    const addresses = recipients.filter((recipient) => recipient.selected).map((recipient) => recipient.email);
    for (const address of addresses) {
      sendEmail(
        configuration.sender,
        address,
        this.state.subject,
        this.state.body).then((error) => {
          if (error) {
            this.setState({ sending: false, sendingError: error });
            setTimeout(() => this.setState({ sendingError: undefined }), 5000);
          } else {
            this.setState({ sending: false });
            this.clearFields();
          }
        });
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
              onPress={() => this.clearFields()}
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
