import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  StyleSheet,
  TextInput,
  ToastAndroid,
  View,
  ScrollView,
  Platform
} from "react-native";

import AwesomeButton from "react-native-really-awesome-button";

import { createBasesFromColor, rgb, rgbStrings as bases } from "solarizer";
import { configuration, Recipient } from "./Configuration";
import { sendEmail as send } from "./Google";

const blue = createBasesFromColor(rgb.blue, "base01");
const red = createBasesFromColor(rgb.red, "base01");
const green = createBasesFromColor(rgb.green, "base01");

interface RecipientDict {
  [index: string]: Recipient
}

export const Emailer: React.FC = () => {
  
  const [recipients, setRecipients] = useState<RecipientDict>({})
  const [subject, setSubject] = useState<string>('')
  const [body, setBody] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)

  const { styles, width } = useStyle()

  useEffect(() => {
    configuration.recipients.forEach((recipient) => {
      const recipientName: string = recipient.name;
      setRecipients((previousRecipients) => {
        const updatedRecipients = {...previousRecipients, [recipientName]: recipient}

        if (recipientName === configuration.defaultRecipient) {
          recipient.selected = true;
          updatedRecipients[recipientName] = recipient
        }

        return updatedRecipients
      })
      
    });
  }, [])

  const toggleRecipientSelection = (recipientName: string) => {
    const recipient = recipients[recipientName];
    recipient.selected = !recipient.selected;
    setRecipients({...recipients, [recipientName]: recipient})
  }

  const showToast = (message: string, duration=ToastAndroid.SHORT) => {
    if (Platform.OS === 'android') {
      try {
        ToastAndroid.show(
          message,
          duration,
        );
        return
      } catch (error) {
        console.log(`error when showing toast - message: ${message}; error: ${error}`);
      }
    } else {
      console.log(`Not supported on platform: ${Platform.OS}`)
    }
  }

  const resetState = () => {
    setSubject('')
    setBody('')
    setSending(false)
  }

  const sendEmail = async () => {
    if (Object.keys(recipients).filter((name) => recipients[name].selected).length === 0) {
      showToast("At least one recipient needs to be selected.")
    }

    if (subject.trim().length === 0) {
      showToast("Subject is required.");
    }
    
    setSending(true)
    const recipientsArray = Object.keys(recipients).map((name) => recipients[name]);
    const addresses = recipientsArray.filter((recipient) => recipient.selected).map((recipient) => recipient.email);
    const errors: any[] = [];
    for (const address of addresses) {
      showToast("Sending email(s)...")
      try {
        await send(
          configuration.sender,
          address,
          subject,
          body);
      } catch (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      console.log(`errors when sending email: ${JSON.stringify(errors, null, 2)}`);
      showToast(JSON.stringify(errors, null, 2), ToastAndroid.LONG)
    } else {
      showToast("Successfully sent email(s)")
    }
    resetState();
  }

  const emailButtons = Object.keys(recipients).map((name, index) => {
    const recipient = recipients[name];
    return <AwesomeButton
      key={recipient.id}
      onPress={() => toggleRecipientSelection(name)}
      accessibilityLabel={name}
      backgroundColor={recipient.selected ? blue.base01 : bases.base01}
      backgroundActive={recipient.selected ? blue.base02 : bases.base02}
      backgroundDarker={recipient.selected ? blue.base03 : bases.base03}
      disabled={sending}
    >
      {` ${name} `}
    </AwesomeButton>;
  });

  return (
    <ScrollView style={styles.root} 
      keyboardShouldPersistTaps='handled' >
        <View style={styles.emailForm} >
          <View style={styles.recipientButtonGroup}>{emailButtons}</View>
          <View>
            <TextInput
              // Subject Field
              onChangeText={(subject) => setSubject(subject)}
              style={styles.subject}
              value={subject}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              testID="cd7b46a4-2d81-47bf-abc1-7142aba8a7b0"
            />
          </View>
          <View>
            <TextInput
              // Body Field
              multiline={true}
              numberOfLines={8}
              onChangeText={(body) => setBody(body)}
              style={styles.body}
              value={body}
              autoCapitalize="none"
              autoCorrect={false}
              testID="6b50a3ac-a102-4150-823c-e20d44f0c84d"
            />
          </View>
          <View style={styles.actionButtonGroup}>
            <AwesomeButton
              // Clear button
              onPress={() => resetState()}
              accessibilityLabel="Clear"
              width={width / 3}
              backgroundColor={sending ? bases.base01 : red.base01}
              backgroundActive={sending ? bases.base02 : red.base02}
              backgroundDarker={sending ? bases.base03 : red.base03}
              disabled={sending}
            >
              Clear
            </AwesomeButton>
            <AwesomeButton
              // Submit Button
              onPress={() => sendEmail()}
              accessibilityLabel="Send"
              testID="2d8395f6-03a5-4c61-9c3b-595143aec8bf"
              width={width / 3}
              backgroundColor={sending ? bases.base01 : green.base01}
              backgroundActive={sending ? bases.base02 : green.base02}
              backgroundDarker={sending ? bases.base03 : green.base03}
              disabled={sending}
            >
              Send
            </AwesomeButton>
          </View>
        </View>
      </ScrollView >
  )
}

const useStyle = () => {
  const dimensions = useWindowDimensions();
  const width = dimensions.width * .8;
  const marginTop = dimensions.height * .03;
  const marginBottom = dimensions.height * .03;

  const styles = StyleSheet.create({
    actionButtonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop,
      marginBottom,
      width,
    },
    body: {
      paddingHorizontal: dimensions.width * .01,
      paddingVertical: dimensions.width * .01,
      backgroundColor: bases.base02,
      marginTop,
      textAlignVertical: "top",
      color: bases.base0,
      width,
    },
    recipientButtonGroup: {
      flexDirection: "row",
      justifyContent: "space-around",
      width
    },
    emailForm: {
      alignItems: "center",
      flex: 1,
      justifyContent: "flex-start",
      paddingTop: dimensions.height * .1,
    },
    root: {
      flex: 1,
    },
    subject: {
      paddingHorizontal: dimensions.width * .01,
      paddingVertical: dimensions.width * .01,
      backgroundColor: bases.base02,
      color: bases.base0,
      marginTop,
      width
    },
  });

  return { styles, width }
}
