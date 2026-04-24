import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = () => {
  const { state, dispatch } = useCart();

  // Calculate grand total dynamically
  const totalCartValue = state.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.image} />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        
        <View style={styles.controlsRow}>
          {/* Quantity Controls */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, amount: -1 } })}
            >
              <Text style={styles.qtyBtnText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.qtyBtn}
              onPress={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, amount: 1 } })}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          
          {/* Subtotal */}
          <Text style={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      </View>

      {/* Remove Item Button */}
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id })}
      >
        <Ionicons name="trash-outline" size={24} color="#ff453a" />
      </TouchableOpacity>
    </View>
  );

  // Render the empty state if the array is empty
  if (state.cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#555" />
        <Text style={styles.emptyText}>Your cart is currently empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state.cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
      />
      
      {/* Footer Grand Total */}
      <View style={styles.summaryContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${totalCartValue.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' },
  emptyText: { color: '#aaaaaa', fontSize: 18, marginTop: 16 },
  listContainer: { padding: 16 },
  
  card: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#333333',
    alignItems: 'center',
  },
  image: { width: 80, height: 80, resizeMode: 'contain', backgroundColor: '#ffffff', borderRadius: 8 },
  detailsContainer: { flex: 1, marginLeft: 16 },
  title: { fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  price: { fontSize: 14, color: '#aaaaaa', marginBottom: 8 },
  
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 8 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2c2c2e', borderRadius: 8 },
  qtyBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  qtyBtnText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  qtyValue: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', paddingHorizontal: 8 },
  
  subtotal: { fontSize: 16, fontWeight: 'bold', color: '#32d74b' },
  removeBtn: { padding: 8 },
  
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1e1e1e',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  totalLabel: { fontSize: 20, color: '#ffffff', fontWeight: 'bold' },
  totalValue: { fontSize: 24, color: '#32d74b', fontWeight: 'bold' },
});

export default CartScreen;