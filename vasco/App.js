// ui imports
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
// screen imports
import Register from './screens/Register'
import Login from './screens/Login'
import Home from './screens/Home'
import AddReceipt from './screens/AddReceipt'
import ReceiptHistory from './screens/ReceiptHistory'
import SingleReceipt from './screens/SingleReceipt'
// navigation imports
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator} from 'react-native-screens/native-stack'
// redux imports
import { Provider } from 'react-redux'
import { store } from './redux/redux'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen options={{ headerShown: false}} name="Register" component={Register} />
          <Stack.Screen options={{ headerShown: false}} name="Login" component={Login} />
          <Stack.Screen options={{ headerShown: false}} name="Home" component={Home} />
          <Stack.Screen options={{ headerShown: false}} name="AddReceipt" component={AddReceipt} />
          <Stack.Screen options={{ headerShown: false}} name="ReceiptHistory" component={ReceiptHistory} />
          <Stack.Screen options={{ headerShown: false}} name="SingleReceipt" component={SingleReceipt} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App
