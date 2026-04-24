import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Bring in our global state and dispatcher
  const { state, dispatch } = useCart();

  // Dynamically add the Logout button to the top header 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
      headerStyle: { backgroundColor: '#1e1e1e' },
      headerTintColor: '#ffffff',
    });
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Clear auth token [cite: 145]
    dispatch({ type: 'CLEAR_CART' }); // Wipe global cart state [cite: 147]
    
    // Reset the entire navigation stack and push user back to Login [cite: 148]
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Fetch the data on screen load [cite: 119]
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // The component that renders every individual item in the FlatList [cite: 119]
  const renderProduct = ({ item }) => {
    // Check if this specific item is already sitting in our global cart state
    const cartItem = state.cartItems.find(c => c.id === item.id);
    const currentQuantity = cartItem ? cartItem.quantity : 0;

    return (
      <View style={styles.card}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>

        {/* Dynamic Cart Controls  */}
        {currentQuantity > 0 ? (
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.qtyBtn} 
              onPress={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, amount: -1 } })}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.qtyValue}>{currentQuantity}</Text>
            
            <TouchableOpacity 
              style={styles.qtyBtn} 
              onPress={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, amount: 1 } })}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => dispatch({ type: 'ADD_TO_CART', payload: item })}
          >
            <Text style={styles.addBtnText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0a84ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  listContainer: { padding: 16 },
  logoutButton: { marginRight: 16 },
  logoutText: { color: '#ff453a', fontWeight: 'bold', fontSize: 16 },
  
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  image: { width: '100%', height: 200, resizeMode: 'contain', backgroundColor: '#ffffff' },
  infoContainer: { padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  description: { fontSize: 14, color: '#aaaaaa', marginBottom: 8 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#32d74b' },
  
  addBtn: {
    backgroundColor: '#0a84ff',
    padding: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  addBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c2c2e',
    padding: 8,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  qtyBtn: {
    backgroundColor: '#3a3a3c',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  qtyBtnText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  qtyValue: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
});

export default ProductsScreen;