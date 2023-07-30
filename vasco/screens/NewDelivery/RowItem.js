import { ScrollView, Text, TouchableOpacity, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

const RowItem = ({ iconName, text, onPress, valueCount }) => {
  return (
    <ScrollView style={{ borderRadius: 10, borderWidth: 2, borderColor: 'black', marginVertical: 15, marginRight: 25,  backgroundColor: '#FFC300' }}>
      <TouchableOpacity
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 25,
        }}
        onPress={onPress}>
        <View>
          <Ionicons name={iconName} size={25} color={'black'} />
        </View>
        <View>
          <Text style={{ fontWeight: 500, marginTop: 5 }}>{text}</Text>
        </View>
        <View>
          {valueCount > 0 ? <Text style={{ fontWeight: 700, color: 'green', marginTop: 5 }}>{valueCount}</Text> : <Ionicons name="caret-forward-outline" size={25} color={'black'} />}
        </View>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default RowItem