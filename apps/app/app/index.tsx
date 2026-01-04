import { Platform, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

const WEB_APP_PORT = 3000;
const PRODUCTION_URL = 'https://your-production-url.com';
const ANDROID_EMULATOR_LOCALHOST = '10.0.2.2';

const getWebAppUrl = () => {
  if (!__DEV__) {
    return PRODUCTION_URL;
  }

  const host = Platform.OS === 'android' ? ANDROID_EMULATOR_LOCALHOST : 'localhost';
  return `http://${host}:${WEB_APP_PORT}`;
};

export default function Index() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: getWebAppUrl() }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      allowsInlineMediaPlayback={true}
      mixedContentMode="compatibility"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
