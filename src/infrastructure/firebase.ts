import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

/**
 * Firebase 인스턴스를 앱 전체에서 하나만 만들어 공유한다.
 * 처음 호출될 때 초기화하고(lazy), 이후에는 같은 인스턴스를 돌려준다.
 */

const REQUIRED_ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const

interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

let services: FirebaseServices | null = null

/** 비어 있는 필수 환경 변수 이름 목록을 반환한다. */
export function getMissingFirebaseEnv(env: Record<string, string | undefined> = import.meta.env): string[] {
  return REQUIRED_ENV_KEYS.filter((key) => !env[key])
}

export function getFirebase(): FirebaseServices {
  if (services) return services

  const missing = getMissingFirebaseEnv()
  if (missing.length > 0) {
    throw new Error(`Firebase 설정 값이 없습니다: ${missing.join(', ')} (.env.local 을 확인하세요)`)
  }

  const app = initializeApp({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  })

  services = { app, auth: getAuth(app), db: getFirestore(app) }
  return services
}
