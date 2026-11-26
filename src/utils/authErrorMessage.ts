/**
 * Firebase Auth 오류 코드를 사용자에게 보여줄 한국어 문장으로 바꾼다.
 * 알 수 없는 코드는 일반 안내 문구로 처리해 내부 오류가 그대로 노출되지 않게 한다.
 */
const MESSAGES: Record<string, string> = {
  'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
  'auth/missing-password': '비밀번호를 입력해주세요.',
  'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
  'auth/email-already-in-use': '이미 가입된 이메일입니다.',
  'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'auth/user-not-found': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'auth/wrong-password': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'auth/too-many-requests': '시도 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요.',
  'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
}

export const DEFAULT_AUTH_ERROR = '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.'

export function toAuthErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: unknown }).code
    if (typeof code === 'string' && code in MESSAGES) return MESSAGES[code]!
  }
  return DEFAULT_AUTH_ERROR
}
