import { useState } from 'react';
import { StyleSheet } from 'react-native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {CountryPicker, CountryList} from "react-native-country-codes-picker";

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [countryCode, setCountryCode] = useState("+55");

  return (
    <View style={styles.container}>
    <Text>{countryCode}</Text>
       <CountryList
          lang={'pl'}
          pickerButtonOnPress={(item) => {
              console.log(item);
          }}
       />

        <CountryPicker
        show={true}
        // when picker button press you will get the country object with dial code
        pickerButtonOnPress={(item) => {
          console.log(item);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
