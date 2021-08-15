import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import tw from 'tailwind-react-native-classnames';
interface CustomListItemProps {
  title: string;
  subtitle?: string;
  imageURL?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  onPress?: (...any: any[]) => void;
}

const CustomListItem = ({
  onPress = () => {},
  title,
  subtitle,
  imageURL = 'https://cdn0.iconfinder.com/data/icons/seo-web-4-1/128/Vigor_User-Avatar-Profile-Photo-02-512.png',
  size = 'large',
}: CustomListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
      <ListItem style={styles.container}>
        <Avatar
          rounded
          size={size}
          source={{ uri: imageURL }}
          title={
            title.toUpperCase().slice(0, 1) +
            title.toUpperCase().slice(title.length - 1, title.length)
          }
          overlayContainerStyle={{ backgroundColor: '#7575757b' }}
        />
        <ListItem.Content>
          <ListItem.Title style={styles.titleStyle}>{title}</ListItem.Title>
          <ListItem.Subtitle
            style={styles.subTitleStyle}
            ellipsizeMode='tail'
            numberOfLines={1}
          >
            {subtitle}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({
  container: tw`border-solid border-gray-300 border-b`,
  titleStyle: tw`text-lg font-bold`,
  subTitleStyle: tw`text-base`,
});
