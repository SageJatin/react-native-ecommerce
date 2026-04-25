# React Native E-Commerce Mini-App

A fully functional React Native mobile application built with Expo. It features a mock authentication flow, dark-themed UI, Bottom Tab Navigation, and a fully persistent shopping cart.

## Tech Stack
* **Framework:** React Native (Expo)
* **Navigation:** React Navigation (Native Stack + Bottom Tabs)
* **State Management:** Context API + `useReducer`
* **Data Fetching:** Axios (via DummyJSON API)
* **Local Storage:** `@react-native-async-storage/async-storage`

## Setup Instructions
To run this project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone [https://github.com/SageJatin/react-native-ecommerce.git](https://github.com/SageJatin/react-native-ecommerce.git)
   ```

2. Navigate into the project directory:
   ```bash
   cd react-native-ecommerce
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Start the Expo development server:
   ```bash
   npx expo start -c
   ```

5. **To view the app:**
   * Download the **Expo Go** app on your iOS or Android device and scan the QR code in the terminal.
   * Alternatively, press `w` in the terminal to view it in a web browser, or `i` / `a` to open it in an iOS Simulator / Android Emulator if you have them installed.

**Test Credentials for Login:**
* **Username:** `emilys`
* **Password:** `emilyspass`

---

## State Management Choice: Context + `useReducer`
For this application, I implemented the recommended **Context API paired with `useReducer`**. 

### Why Context + useReducer?
* **Structured State Transitions:** While standard state works for simple web apps, an e-commerce mobile app benefits from the strict, predictable state transitions provided by a reducer (e.g., `ADD_TO_CART`, `UPDATE_QUANTITY`, `CLEAR_CART`).
* **Lightweight Alternative to Redux:** It provides the architectural benefits and predictability of Redux without the massive boilerplate or external dependency overhead.
* **Native Persistence:** The Context Provider is natively wired to `AsyncStorage`, ensuring that the cart safely loads into memory when the app mounts and saves back to the device storage whenever an action is dispatched.

## Assumptions & Trade-offs
* **Authentication Security:** The token is stored in `AsyncStorage` for persistence. In a production environment with real user data, this would be swapped for `expo-secure-store` to encrypt the token.
* **Dark Mode Default:** To ensure a cohesive and modern UI across all screens, the application forces a dark theme implementation rather than relying purely on the system device settings.

## Native Enhancements
* **Pull-to-Refresh:** Implemented native `RefreshControl` on the `FlatList` for intuitive API refetching.
* **Native Toast Notifications:** Integrated `react-native-toast-message` for non-intrusive bottom-up alerts.
* **Live Search:** Added a native `<TextInput>` for real-time catalog filtering.
* **OLED Dark Mode:** Styled the application with a deep dark theme and subtle borders to reduce eye strain and feel premium.