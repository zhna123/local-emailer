import { View, Text } from 'react-native';
import { rgbStrings as bases } from "solarizer";
import {Picker} from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { recipientConfiguration } from '../Configuration/Recipients';
import { Recipient } from '../Configuration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootDrawerScreenProps } from '../../types';


export default function Settings({ route, navigation }: RootDrawerScreenProps<'Settings'>) {
  
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [recipients, setRecipients] = useState<Recipient[]>([])

  useEffect(() => {
    setRecipients(recipientConfiguration.recipients)
  }, [])

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('default-recipient');
        if (value !== null) {
          setSelectedRecipient(value)
        }
      } catch (e) {
        console.log(`settings-error reading async storage value: ${e}`)
      }
    };
    getData()
  }, [])

  // store the value each time selectedRecipient changes
  useEffect(() => {
    const storeData = async (value: string) => {
      try {
        if (value !== '') {
          await AsyncStorage.setItem('default-recipient', value);
        }
      } catch (e) {
        console.log(`error storing default recipient: ${value}, error: ${e}`)
      }
    };
    storeData(selectedRecipient)
  }, [selectedRecipient])

  const showPickerItems = recipients.map(recipient => {
    return <Picker.Item key={recipient.id} label={recipient.name} value={recipient.name} 
      style={{backgroundColor: bases.base00, color: "white"}} />
  })
  
  return (
    <View style={{ flex: 1, backgroundColor: bases.base03, padding: 20 }}>
      <Text style={{color: "white", fontSize: 18, backgroundColor: bases.base01, padding: 10}}>Default Recipient</Text>

      <Picker
        selectedValue={selectedRecipient}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedRecipient(itemValue)
        }  
        style={{color: "white", fontSize: 16, backgroundColor: bases.base00}}
        dropdownIconColor={"white"}
        mode='dropdown'
      >
        {showPickerItems}
      </Picker>
      
    </View>
  )
}