import React from 'react'
import 'react-native-get-random-values';


// screen imports
import Register from './screens/auth/Register'
import Login from './screens/auth/Login'
import Home from './screens/Home'
import NewDelivery from './screens/new/NewDelivery'
import DeliveryHistory from './screens/feed/DeliveryHistory'
import SingleReceipt from './screens/SingleReceipt'
import UploadReceipts from './screens/UploadReceipts'
import UploadPhotos from './screens/UploadPhotos'
import Settings from './screens/Settings'
import Filter from './screens/feed/Filter'

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
          <Stack.Screen options={{ headerShown: false}} name={"NewDelivery"} component={NewDelivery}  />
          <Stack.Screen options={{ headerShown: false}} name="DeliveryHistory" component={DeliveryHistory} />
          <Stack.Screen options={{ headerShown: false}} name="Filter" component={Filter} />
          <Stack.Screen options={{ headerShown: false}} name="SingleReceipt" component={SingleReceipt} />
          <Stack.Screen options={{ headerShown: false}} name={'UploadReceipts'} component={UploadReceipts} />
          <Stack.Screen options={{ headerShown: false}} name={'UploadPhotos'} component={UploadPhotos} />
          <Stack.Screen options={{ headerShown: false}} name={'Settings'} component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App
