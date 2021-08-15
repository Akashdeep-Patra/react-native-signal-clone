import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { FormikHelpers, useFormik } from 'formik';
import * as React from 'react';
import { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  View,
} from 'react-native';
import { Button } from 'react-native-elements';
import { Image } from 'react-native-elements/dist/image/Image';
import { Input } from 'react-native-elements/dist/input/Input';
import tw from 'tailwind-react-native-classnames';
import * as Yup from 'yup';
import { auth } from '../../firebase';
import useIsMounted from '../../hooks/useIsMounted';
import { RootStackParamList } from '../../types';
import { googleAuthProvider } from './../../firebase/index';
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    ),
});

const defaultValues = {
  email: '',
  password: '',
};
declare interface defaultValuesProps {
  email: string;
  password: string;
}
interface LoginScreenProps {}

const LoginScreen = (props: LoginScreenProps) => {
  const isMounted = useIsMounted();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const signinWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {}
  };
  const handleFormSubmit = async (
    values: defaultValuesProps,
    options: FormikHelpers<defaultValuesProps>
  ) => {
    try {
      const currentUser = await auth.signInWithEmailAndPassword(
        values.email,
        values.password
      );
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
    }
  };

  useLayoutEffect(() => {
    if (isMounted()) {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
          navigation.replace('HomeScreen');
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [navigation, auth?.currentUser]);

  const {
    handleSubmit,
    handleBlur,
    handleChange,
    values,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: defaultValues,
    onSubmit: handleFormSubmit,
    validationSchema: LoginSchema,
  });

  return (
    <KeyboardAvoidingView behavior='padding' style={styles.container}>
      <StatusBar style='light' />
      <Image
        style={styles.logo}
        source={{
          uri: 'https://image.flaticon.com/icons/png/512/906/906383.png',
        }}
      />
      {isSubmitting ? (
        <ActivityIndicator size='large' color='#2a99f3' />
      ) : (
        <>
          <View style={styles.formContainer}>
            <Input
              placeholder='Enter your Email'
              inputContainerStyle={[styles.inputContainer, styles.email]}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              errorMessage={touched.email ? errors.email : ''}
              errorStyle={styles.errorMessage}
              inputStyle={tw`text-gray-500 no-underline`}
            />
            <Input
              placeholder='Enter your Password'
              inputContainerStyle={[styles.inputContainer, styles.password]}
              errorMessage={touched.password ? errors.password : ''}
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              errorStyle={styles.errorMessage}
              inputStyle={tw`text-gray-500 no-underline`}
            />
          </View>
          <Button
            titleStyle={styles.buttonTitleStyle}
            disabled={!!errors.password || !!errors.email}
            buttonStyle={styles.button}
            title='Login'
            onPress={handleSubmit as any}
          />
          <Button
            // disabled={!Object.keys(errors).length}
            containerStyle={tw`mt-10`}
            titleStyle={styles.buttonTitleStyle}
            type='outline'
            buttonStyle={styles.button}
            title='Signup'
            onPress={() => navigation.navigate('SignupScreen')}
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  buttonTitleStyle: tw`text-2xl`,
  errorMessage: {
    color: 'red',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  statusBar: {},
  logo: tw`w-40 h-40 m-10 mx-auto`,
  inputContainer: tw`h-16 p-3 text-gray-200 border-solid border-2 border-blue-200 rounded-xl`,
  email: {},
  password: {},
  formContainer: tw`w-full`,
  button: tw`h-20  w-60 rounded-2xl`,
  login: tw``,
  signup: tw``,
});
