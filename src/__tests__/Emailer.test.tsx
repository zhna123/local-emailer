import React from "react";
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import renderer from "react-test-renderer";
import { recipientConfiguration } from "../Configuration/Recipients";
import { Emailer } from "../screens/Emailer";
import * as google from "../Google";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("../Google", () => {
  const originalModule = jest.requireActual('../Google')
  return {
    __esModule: true,
    ...originalModule,
    sendEmail: jest.fn(() => console.log(`Mocked 'sendEmail' function called.`))
  }
})

jest.mock('react-native-really-awesome-button', () => "AwesomeButton");

describe("Emailer", () => {
  beforeEach(async () => {
    (google.sendEmail as any).mockClear();
    await waitFor(() => render(<Emailer />));
  });

  it("renders correctly", async () => {
    const tree = await waitFor(() => renderer.create(<Emailer />));
    const treeJson = tree.toJSON();
    expect(treeJson).toMatchSnapshot()
  });

  it('checks if Async Storage is used', async () => {
    await waitFor(() => 
      expect(AsyncStorage.getItem).toBeCalledWith('default-recipient')
    )
  });

  it("Should gather and send all fields", async () => {
    const testSubject = "Test Subject";
    const testBody = "Test Body";

    const subject = screen.getByTestId("cd7b46a4-2d81-47bf-abc1-7142aba8a7b0");
    fireEvent.changeText(subject, testSubject);

    const body = screen.getByTestId("6b50a3ac-a102-4150-823c-e20d44f0c84d");
    fireEvent.changeText(body, testBody);

    const sendButton = screen.getByTestId("2d8395f6-03a5-4c61-9c3b-595143aec8bf");
    // Why getByText doesn't work?
    // const sendButton = screen.getByText('Send')
    fireEvent.press(sendButton);

    const defaultRecipient = recipientConfiguration.recipients
      .find((recipient) => recipient.name === 'Mac');
    
    await waitFor(() => {
      expect(google.sendEmail).toHaveBeenCalledWith(
        recipientConfiguration.sender,
        defaultRecipient!.email,
        testSubject,
        testBody,
      );
    })
  });

  it("Should be able to handle chinese text", async () => {
    const testSubject = "我是一只猫";
    const testBody = "我有一个弟弟";

    const subject = screen.getByTestId("cd7b46a4-2d81-47bf-abc1-7142aba8a7b0");
    fireEvent.changeText(subject, testSubject);

    const body = screen.getByTestId("6b50a3ac-a102-4150-823c-e20d44f0c84d");
    fireEvent.changeText(body, testBody);

    const sendButton = screen.getByTestId("2d8395f6-03a5-4c61-9c3b-595143aec8bf");
    fireEvent.press(sendButton);

    const defaultRecipient = recipientConfiguration.recipients
      .find((recipient) => recipient.name === recipientConfiguration.defaultRecipient);

    await waitFor(() => {
      expect(google.sendEmail).toHaveBeenCalledWith(
        recipientConfiguration.sender,
        defaultRecipient!.email,
        testSubject,
        testBody,
      );
    })
  });
});