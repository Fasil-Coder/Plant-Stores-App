// app/(tabs)/explore.tsx
import React, { useState, createContext, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
  RefreshControl,
} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Enable animation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ---------- Types ----------
type Plant = { id: string; name: string; price: string; image: string };
type CartItem = Plant & { key: number };

type PlantContextType = {
  plants: Plant[];
  cart: CartItem[];
  addToCart: (p: Plant) => void;
  placeOrder: () => void;
};

// ---------- Context ----------
const PlantContext = createContext<PlantContextType | null>(null);

const plantsData: Plant[] = [
  { id: "1", name: "Aloe Vera", price: "₹250", image: "https://m.media-amazon.com/images/I/61QLvIeEYQL._AC_UF1000,1000_QL80_.jpg" },
  { id: "2", name: "Snake Plant", price: "₹300", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQgdTFX-sv6QnU19JLFtxBn8kIy-t-0ydSOTs1ZK2EtQ9l5FhmqP4h7t1o-2RhU1tPWmw&usqp=CAU" },
  { id: "3", name: "Money Plant", price: "₹200", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlhUyWWlZhvAQCm2IsxnDfV_LUIfaXx3B2L98IqoUaik1T1iH0GMo7iYO-xufYIFOKfzs&usqp=CAU" },
  { id: "4", name: "Peace Lily", price: "₹350", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlhUyWWlZhvAQCm2IsxnDfV_LUIfaXx3B2L98IqoUaik1T1iH0GMo7iYO-xufYIFOKfzs&usqp=CAU" },
  { id: "5", name: "Bamboo Plant", price: "₹400", image: "https://www.shutterstock.com/image-photo/two-people-planting-tree-together-260nw-2495612457.jpg" },
];

// ---------- Provider ----------
const PlantProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Plant) => {
    LayoutAnimation.easeInEaseOut();
    setCart((prev) => [...prev, { ...item, key: Date.now() }]);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      Alert.alert("No items", "Add items before placing an order.");
      return;
    }

    Alert.alert("✅ Order Placed", `${cart.length} item(s) purchased.`);
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Order Confirmed 🌱",
          body: "Your plant order has been placed successfully!",
          sound: true,
        },
        trigger: { seconds: 2 },
      });
    } catch (err) {
      console.log("Notification error:", err);
    }
    setCart([]);
  };

  return (
    <PlantContext.Provider value={{ plants: plantsData, cart, addToCart, placeOrder }}>
      {children}
    </PlantContext.Provider>
  );
};

const usePlants = () => {
  const ctx = useContext(PlantContext);
  if (!ctx) throw new Error("usePlants must be used within PlantProvider");
  return ctx;
};

// ---------- Tabs ----------
const HomeTab = () => {
  const { plants } = usePlants();
  return (
    <FlatList
      data={plants}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.cardImg} />
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
        </View>
      )}
    />
  );
};

// ✅ Products tab with REFRESH (shuffle)
const ProductsTab = () => {
  const { plants, addToCart } = usePlants();
  const [refreshing, setRefreshing] = useState(false);
  const [shuffled, setShuffled] = useState<Plant[]>(plants);

  const onRefresh = () => {
    setRefreshing(true);
    const shuffledNow = [...plants].sort(() => Math.random() - 0.5);
    setTimeout(() => {
      setShuffled(shuffledNow);
      setRefreshing(false);
    }, 800);
  };

  return (
    <FlatList
      data={shuffled}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
      keyExtractor={(item) => item.id}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.cardImg} />
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>

          <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item)}>
            <Ionicons name="cart-outline" size={18} color="white" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

// ---------- Orders tab ----------
const OrdersTab = () => {
  const { cart, placeOrder } = usePlants();
  return (
    <View style={styles.ordersContainer}>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>🛒 Your cart is empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.key.toString()}
            renderItem={({ item }) => (
              <View style={styles.orderCard}>
                <Image source={{ uri: item.image }} style={styles.orderImg} />
                <Text style={styles.orderName}>{item.name}</Text>
                <Text style={styles.orderPrice}>{item.price}</Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
            <Text style={styles.orderBtnText}>Place Order</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// ---------- Tabs + Drawer ----------
const Tab = createMaterialTopTabNavigator();
const DrawerNav = createDrawerNavigator();

const MainTabs = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => (navigation as any).openDrawer()} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="#1a3c34" />
        </TouchableOpacity>
        <Text style={styles.title}>🌿 Plant Shop</Text>
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#2e8b57",
          tabBarIndicatorStyle: { backgroundColor: "#2e8b57", height: 3 },
        }}
      >
        <Tab.Screen name="Home" component={HomeTab} />
        <Tab.Screen name="Products" component={ProductsTab} />
        <Tab.Screen name="Orders" component={OrdersTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

// ---------- Drawer (Logout works) ----------
const DrawerNavigator = () => (
  <DrawerNav.Navigator screenOptions={{ headerShown: false }}>
    <DrawerNav.Screen
      name="Tabs"
      component={MainTabs}
      options={{
        title: "Home",
        drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
      }}
    />
    <DrawerNav.Screen
      name="Logout"
      component={() => null}
      options={{
        title: "Logout",
        drawerIcon: ({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />,
      }}
      listeners={{
        focus: async () => {
          await AsyncStorage.removeItem("isLoggedIn");
          await AsyncStorage.removeItem("savedCreds");
          router.replace("/"); // back to login
        },
      }}
    />
  </DrawerNav.Navigator>
);

// ---------- Export ----------
export default function ExploreScreen() {
  return (
    <ImageBackground
      source={{
        uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUhDee5dS-lqDjVI7nAudYX78rkqraF73TNg&s",
      }}
      style={styles.bg}
      blurRadius={3}
      imageStyle={{ opacity: 0.8 }}
    >
      <PlantProvider>
        <DrawerNavigator />
      </PlantProvider>
    </ImageBackground>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  bg: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#e7f0ec",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#1a3c34" },
  listContainer: { padding: 10, gap: 10 },
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 14,
    margin: 6,
    padding: 10,
    alignItems: "center",
  },
  cardImg: { width: "100%", height: 120, borderRadius: 12, marginBottom: 8 },
  cardTitle: { fontWeight: "700", fontSize: 16, color: "#0f172a" },
  cardPrice: { marginTop: 4, color: "#334155" },
  addBtn: {
    marginTop: 10,
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#2e8b57",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addBtnText: { color: "white", fontWeight: "700" },
  ordersContainer: { flex: 1, padding: 12 },
  emptyText: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#0f172a" },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  orderImg: { width: 60, height: 60, borderRadius: 8 },
  orderName: { flex: 1, fontWeight: "700", color: "#0f172a" },
  orderPrice: { fontWeight: "600", color: "#334155" },
  orderBtn: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  orderBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
