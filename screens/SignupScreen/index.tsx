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
import { RootStackParamList } from '../../types';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter your email'),
  password: Yup.string()
    .required('Please Enter your password')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
    ),
  imageURL: Yup.string(),
});

const defaultValues = {
  name: '',
  email: '',
  password: '',
  imageURL: '',
};
declare interface defaultValuesProps {
  name: string;
  email: string;
  password: string;
  imageURL: string;
}
interface SignupScreenProps {}

const SignupScreen = (props: SignupScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleFormSubmit = async (
    values: defaultValuesProps,
    options: FormikHelpers<defaultValuesProps>
  ) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );
      await user?.updateProfile({
        displayName: values.name,
        photoURL: values.imageURL,
      });
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
    validationSchema: SignupSchema,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: 'Back to Login',
    });
  }, [navigation]);
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
            <View style={styles.topInputView}>
              <Input
                placeholder='Enter your Name'
                inputContainerStyle={[styles.inputContainer, styles.name]}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                errorMessage={touched.name ? errors.name : ''}
                errorStyle={styles.errorMessage}
                inputStyle={tw`text-gray-500 no-underline`}
              />
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
            </View>
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
            <Input
              placeholder='Enter your Image URL(optional)'
              inputContainerStyle={[styles.inputContainer, styles.imageURL]}
              errorMessage={touched.imageURL ? errors.imageURL : ''}
              secureTextEntry
              onChangeText={handleChange('imageURL')}
              onBlur={handleBlur('imageURL')}
              value={values.imageURL}
              errorStyle={styles.errorMessage}
              inputStyle={tw`text-gray-500 no-underline`}
            />
          </View>
          <Button
            disabled={!!errors.email || !!errors.password || !!errors.name}
            containerStyle={tw`mt-10`}
            titleStyle={styles.buttonTitleStyle}
            type='outline'
            buttonStyle={styles.button}
            title='Signup'
            onPress={handleSubmit as any}
          />
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  topInputView: {},
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
  imageURL: {},
  name: {},
  formContainer: tw`w-full`,
  button: tw`h-20  w-60 rounded-2xl`,
  login: tw``,
  signup: tw``,
});
