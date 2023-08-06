import React, { useState, useEffect } from 'react'
import { auth } from "./firebase/Firebase";
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

const AuthStack = createNativeStackNavigator();
const NonAuthStack = createNativeStackNavigator();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isAuthenticated ? (
          <AuthStack.Navigator>
            <AuthStack.Screen options={{ headerShown: false}} name={"Home"} component={Home} />
            <AuthStack.Screen options={{ headerShown: false}} name={"NewDelivery"} component={NewDelivery}  />
            <AuthStack.Screen options={{ headerShown: false}} name={"DeliveryHistory"} component={DeliveryHistory} />
            <AuthStack.Screen options={{ headerShown: false}} name={"Filter"} component={Filter} />
            <AuthStack.Screen options={{ headerShown: false}} name={"SingleReceipt"} component={SingleReceipt} />
            <AuthStack.Screen options={{ headerShown: false}} name={'UploadReceipts'} component={UploadReceipts} />
            <AuthStack.Screen options={{ headerShown: false}} name={'UploadPhotos'} component={UploadPhotos} />
            <AuthStack.Screen options={{ headerShown: false}} name={'Settings'} component={Settings} />
          </AuthStack.Navigator>
        ) : (
          <NonAuthStack.Navigator>
            <NonAuthStack.Screen options={{ headerShown: false}} name={"Register"} component={Register} />
            <NonAuthStack.Screen options={{ headerShown: false}} name={"Login"} component={Login} />
          </NonAuthStack.Navigator>
        )}
      </NavigationContainer>
    </Provider>
  )
}

export default App
