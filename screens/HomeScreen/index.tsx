import { AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
import CustomListItem from '../../components/CustomListItem';
import { auth, ChatObjectShape, getChatsFromDB } from '../../firebase';
import useIsMounted from '../../hooks/useIsMounted';
import { RootStackParamList } from '../../types';

interface HomeScreenProps {}

const HomeScreen = (props: HomeScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [loggedinUser, setLoggedinUser] = useState<any>(null);
  const isMounted = useIsMounted();
  const [chats, setChats] = useState<ChatObjectShape[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const signOutUser = async () => {
    try {
      await auth.signOut();
      navigation.replace('LoginScreen');
    } catch (error) {}
  };

  const execute = async () => {
    if (isMounted()) {
      setIsLoading(true);
      const fetchedChats = await getChatsFromDB();
      setChats(fetchedChats);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!isLoading) {
      execute();
    }
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Signal',
      headerStyle: [tw`bg-white`, {}],
      headerTitleStyle: [tw`text-gray-800`],
      headerTintColor: 'black',
      headerLeft: () => (
        <View style={tw`p-4`}>
          <TouchableOpacity activeOpacity={0.5}>
            <Avatar
              onPress={signOutUser}
              rounded
              size={'medium'}
              source={{
                uri:
                  loggedinUser?.photoURL ??
                  'https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_User-Avatar-Profile-Photo-02-512.png',
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={tw`flex-row mr-10 w-28 justify-between`}>
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name='camerao' size={30} color='black' />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddChatScreen')}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name='pencil' size={30} color='black' />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [auth?.currentUser]);

  useLayoutEffect(() => {
    if (isMounted()) {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (!currentUser) {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          navigation.replace('LoginScreen');
        } else {
          setLoggedinUser(currentUser);
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [navigation]);

  const enterChatScreen = (id: string, chatText: string) => {
    navigation.navigate('ChatScreen', { id, chatText });
  };
  return (
    <View style={styles.container}>
      <ScrollView style={tw`w-full h-full`}>
        {!isLoading &&
          chats.map(({ id = '', chatText = '' }) => (
            <CustomListItem
              onPress={() => enterChatScreen(id, chatText)}
              key={id}
              title={chatText}
            />
          ))}
        {isLoading && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size='large'
            color='#2a99f3'
          />
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  activityIndicator: tw`mt-60`,
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
