import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Avatar, Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { addMessageToChat, auth, MessageObjectShape } from '../../firebase';
import { MainRouteProp, RootStackParamList } from '../../types';
import { getMessagesFromDb } from './../../firebase/index';

interface ChatScreenProps {}

const ChatScreen = (props: ChatScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<MainRouteProp<'ChatScreen'>>();
  const [messages, setMessages] = useState<MessageObjectShape[]>([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerRight: () => (
        <View style={tw`flex-row w-28`}>
          <TouchableOpacity style={tw`mr-6`} activeOpacity={0.5}>
            <FontAwesome name='video-camera' color='white' size={30} />
          </TouchableOpacity>
          <TouchableOpacity style={tw`mr-6`} activeOpacity={0.5}>
            <Ionicons name='call' color='white' size={30} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={tw`ml-4`}
          onPress={() => navigation.goBack()}
          activeOpacity={0.5}
        >
          <AntDesign size={30} color='white' name='arrowleft' />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <View style={tw`w-1/4 flex-row items-center justify-between`}>
          <Avatar
            containerStyle={tw`mr-4`}
            overlayContainerStyle={{
              backgroundColor: '#ffffff',
              color: 'black',
            }}
            titleStyle={tw`text-gray-700`}
            rounded
            title={`${
              route.params.chatText.charAt(0) + route.params.chatText.charAt(1)
            }`}
          />

          <Text
            numberOfLines={route.params.chatText.length > 10 ? 1 : undefined}
            ellipsizeMode={'tail'}
            style={[tw`text-white`]}
          >
            {route.params.chatText}
          </Text>
        </View>
      ),
    });
  }, []);
  const loadMessage = async () => {
    const fetchedMessages = await getMessagesFromDb(route.params.id);
    setMessages(fetchedMessages);
  };
  useEffect(() => {
    loadMessage();
  }, [route]);

  const sendMessage = async () => {
    Keyboard.dismiss();
    await addMessageToChat(route.params.id, message);
    await loadMessage();
    setMessage('');
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
        keyboardVerticalOffset={65}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <>
            <ScrollView style={styles.chats}>
              {messages.map(
                ({ id, email, text, photoURL, displayName, timestamp }) => (
                  <View
                    style={
                      email === auth?.currentUser?.email
                        ? styles.receiver
                        : styles.sender
                    }
                    key={id}
                  >
                    {email === auth?.currentUser?.email ? (
                      <>
                        <Avatar
                          rounded
                          position='absolute'
                          bottom={-15}
                          right={-15}
                          size={30}
                          source={{ uri: photoURL }}
                        />
                        <Text style={styles.receiverText}>{text}</Text>
                      </>
                    ) : (
                      <>
                        <Avatar
                          rounded
                          position='absolute'
                          //web
                          bottom={-15}
                          left={-5}
                          size={30}
                          source={{ uri: photoURL }}
                        />
                        <Text style={styles.senderText}>{text}</Text>
                        <Text style={styles.senderName}>{displayName}</Text>
                      </>
                    )}
                    <Text
                      style={[
                        styles.timeStamp,
                        email === auth?.currentUser?.email
                          ? styles.timeRight
                          : styles.timeLeft,
                      ]}
                    >
                      {timestamp.toDate().toLocaleDateString()}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <Input
                onSubmitEditing={() => sendMessage()}
                inputContainerStyle={{
                  borderColor: 'white',
                  borderRadius: 50,
                  padding: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  backgroundColor: '#EBEBEB',
                }}
                value={message}
                onChangeText={(text) => setMessage(text)}
                placeholder='Enter your message'
                style={styles.text}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => sendMessage()}
                    disabled={!message}
                    activeOpacity={0.5}
                  >
                    <Ionicons
                      style={{}}
                      name='send'
                      size={40}
                      color={!!message ? '#1782FF' : 'gray'}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  keyboardAvoiding: tw``,
  chats: { height: '90%' },
  footer: tw``,
  text: tw``,
  receiver: {
    padding: 15,
    backgroundColor: '#ececec',
    alignSelf: 'flex-end',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
    position: 'relative',
  },
  sender: {
    padding: 15,
    backgroundColor: '#2b68e6',
    alignSelf: 'flex-start',
    borderRadius: 20,
    margin: 15,
    maxWidth: '80%',
    position: 'relative',
  },
  senderText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15,
  },
  receiverText: {
    color: 'black',
    fontWeight: '500',
    marginLeft: 10,
  },
  senderName: {
    position: 'absolute',
    color: 'white',
    bottom: 0,
    marginLeft: 10,
    marginBottom: 5,
    fontWeight: '200',
    fontSize: 10,
  },
  timeStamp: {
    position: 'absolute',
    bottom: -20,
    marginTop: 10,
    color: 'gray',
    fontSize: 12,
  },
  timeLeft: {
    left: 5,
  },
  timeRight: {
    left: -10,
  },
});
