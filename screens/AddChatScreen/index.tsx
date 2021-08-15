import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Input } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import { addChatToDB } from '../../firebase';
import useIsMounted from '../../hooks/useIsMounted';
import { RootStackParamList } from '../../types';
interface AddChatScreenProps {}

const AddChatScreen = (props: AddChatScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [chatText, setChatText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useIsMounted();

  const createChat = async () => {
    try {
      setIsSubmitting(true);
      await addChatToDB({ chatText });
      navigation.replace('HomeScreen');
    } catch (error) {
      Alert.alert(
        error.title,
        error.message,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add a new chat',
      headerBackTitle: 'Chats',
    });
  }, []);
  return (
    <View style={styles.container}>
      <Input
        autoFocus
        placeholder='Enter a chat name'
        inputStyle={tw`text-gray-700 text-xl no-underline`}
        inputContainerStyle={[styles.inputContainer]}
        value={chatText}
        onChangeText={(text) => setChatText(text)}
        leftIcon={
          <Ionicons
            name='md-chatbox-ellipses-outline'
            size={30}
            color='black'
          />
        }
        rightIcon={
          <TouchableOpacity
            disabled={!chatText || isSubmitting}
            onPress={createChat}
            activeOpacity={0.5}
          >
            <Ionicons
              name='send'
              size={30}
              color={!!chatText || isSubmitting ? 'black' : 'gray'}
            />
          </TouchableOpacity>
        }
      />
      {isSubmitting && (
        <ActivityIndicator
          style={styles.activityIndicator}
          size={100}
          color='#2a99f3'
        />
      )}
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {},
  activityIndicator: tw`mt-60`,
  inputContainer: tw`h-16 p-3 text-gray-200  rounded-xl`,
});
