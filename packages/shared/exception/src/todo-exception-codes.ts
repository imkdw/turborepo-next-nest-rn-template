export const TODO_EXCEPTION_CODES = {
  TODO_NOT_FOUND: 'TODO-0001',
} as const;

type TodoExceptionCode = (typeof TODO_EXCEPTION_CODES)[keyof typeof TODO_EXCEPTION_CODES];

export const TODO_EXCEPTION_MESSAGES: Record<TodoExceptionCode, string> = {
  [TODO_EXCEPTION_CODES.TODO_NOT_FOUND]: 'Todo를 찾을 수 없습니다',
};
