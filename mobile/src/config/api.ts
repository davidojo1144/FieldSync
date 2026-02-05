import { Platform } from 'react-native'
import Constants from 'expo-constants'

const envUrl = process.env.EXPO_PUBLIC_API_URL
const hostUri = Constants.expoConfig?.hostUri
const fromExpo = hostUri ? `http://${hostUri.split(':')[0]}:3000` : undefined

const baseUrl =
  envUrl ||
  fromExpo ||
  (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000')

export default baseUrl
