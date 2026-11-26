import { describe, expect, it } from 'vitest'
import { getMissingFirebaseEnv } from '@/infrastructure/firebase'

describe('getMissingFirebaseEnv', () => {
  it('필수 값이 모두 있으면 빈 배열을 반환한다', () => {
    const env = {
      VITE_FIREBASE_API_KEY: 'key',
      VITE_FIREBASE_AUTH_DOMAIN: 'demo.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'demo',
      VITE_FIREBASE_APP_ID: 'app',
    }
    expect(getMissingFirebaseEnv(env)).toEqual([])
  })

  it('비어 있는 필수 값의 이름을 알려준다', () => {
    expect(getMissingFirebaseEnv({ VITE_FIREBASE_API_KEY: 'key', VITE_FIREBASE_PROJECT_ID: '' })).toEqual([
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_APP_ID',
    ])
  })
})
