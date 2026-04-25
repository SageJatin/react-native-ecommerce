import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Import Expo's built-in icons
import Toast from 'react-native-toast-message';

// Import our screens and context
import LoginScreen from './src/screens/LoginScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import CartScreen from './src/screens/CartScreen';
import { CartProvider } from './src/context/CartContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// This component holds our two Bottom Tabs
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Dynamically assign icons based on the route name
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Products') {
            iconName = focused ? 'pricetags' : 'pricetags-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Apply the Dark Theme styling to the Tab Bar
        tabBarActiveTintColor: '#0a84ff',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#1e1e1e',
          borderTopColor: '#333333',
        },
        // Header styling applied globally to both tabs
        headerStyle: { backgroundColor: '#1e1e1e' },
        headerTintColor: '#ffffff',
      })}
    >
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Home" 
            component={HomeTabs} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </CartProvider>
  );
}