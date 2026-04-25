import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  TextInput,
  RefreshControl 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Toast from 'react-native-toast-message';

const ProductsScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { state, dispatch } = useCart();

  // 1. RESTORED LOGOUT BUTTON
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
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'CLEAR_CART' });
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts().finally(() => setLoading(false));
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await fetchProducts();
    setRefreshing(false);
  }, []);

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }) => {
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

        {currentQuantity > 0 ? (
          <TouchableOpacity style={[styles.addBtn, styles.addedBtn]} disabled>
            <Text style={styles.addedBtnText}>✓ Added to Cart</Text>
          </TouchableOpacity>
        ) : (
          // 2. MOVED TOAST LOGIC HERE
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => {
              dispatch({ type: 'ADD_TO_CART', payload: item });
              Toast.show({
                type: 'success',
                text1: 'Added to Cart',
                text2: `${item.title} was added to your cart.`,
                position: 'top',
                visibilityTime: 1000,
              });
            }}
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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="#0a84ff" 
            colors={['#0a84ff']} 
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
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
  
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#121212',
  },
  searchInput: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    fontSize: 16,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  
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
  
  addedBtn: {
    backgroundColor: 'rgba(50, 215, 75, 0.15)',
    borderTopWidth: 1,
    borderColor: 'rgba(50, 215, 75, 0.3)',
  },
  addedBtnText: { color: '#32d74b', fontSize: 16, fontWeight: 'bold' },
});

export default ProductsScreen;