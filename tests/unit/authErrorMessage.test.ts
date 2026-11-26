import { describe, expect, it } from 'vitest'
import { DEFAULT_AUTH_ERROR, toAuthErrorMessage } from '@/utils/authErrorMessage'

describe('toAuthErrorMessage', () => {
  it('알려진 Firebase 오류 코드를 한국어 안내로 바꾼다', () => {
    expect(toAuthErrorMessage({ code: 'auth/invalid-credential' })).toBe(
      '이메일 또는 비밀번호가 올바르지 않습니다.',
    )
    expect(toAuthErrorMessage({ code: 'auth/email-already-in-use' })).toBe('이미 가입된 이메일입니다.')
  })

  it('알 수 없는 코드나 형식이 다른 오류는 기본 안내로 처리한다', () => {
    expect(toAuthErrorMessage({ code: 'auth/unknown' })).toBe(DEFAULT_AUTH_ERROR)
    expect(toAuthErrorMessage(new Error('boom'))).toBe(DEFAULT_AUTH_ERROR)
    expect(toAuthErrorMessage(null)).toBe(DEFAULT_AUTH_ERROR)
  })
})
