import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

const screenWidth = Dimensions.get('window').width;
const isTablet = screenWidth >= 768;

const RowItem = ({ iconName, text, onPress, valueCount, invalid }) => {
  return (
    <View
      style={{
        height: isTablet ? 65 : 25,
        width: isTablet ? '60%' : '90%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        marginVertical: isTablet ? 20 : 10,
        backgroundColor: '#FFC300',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 25,
        }}
        onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {invalid && <Ionicons name="medical" size={15} color="red" style={{ marginLeft: -20, marginRight: 5 }} />}
          <Ionicons name={iconName} size={25} color={'black'} />
        </View>
        <Text style={{ fontWeight: '500', fontSize: isTablet ? 18 : 14 }}>{text}</Text>
        <View style={{ alignItems: 'center' }}>
          {valueCount > 0
            ? <Text style={{ fontWeight: '700', color: 'green' }}>{valueCount}</Text>
            : <Ionicons name="caret-forward-outline" size={25} color={'black'} />
          }
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default RowItem;

