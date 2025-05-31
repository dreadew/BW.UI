// Валидации для request.types.ts на основе FluentValidation
// Используйте эти описания для генерации схем zod или для автогенерации swagger

export interface RenewRequest {
  /**
   * @minLength 1
   */
  refreshToken: string;
  /**
   * @minLength 1
   */
  accessToken: string;
}

export interface RevokeRequest {
  /**
   * @minLength 1
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
}

export interface SignInRequest {
  /**
   * @minLength 1
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9._]+$
   */
  username: string;
  /**
   * @minLength 8
   * @maxLength 32
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.?]+$
   */
  password: string;
  rememberMe: boolean;
}

export interface SignUpRequest {
  /**
   * @minLength 1
   * @maxLength 24
   * @pattern ^[a-zA-Z0-9._]+$
   */
  username: string;
  /**
   * @minLength 1
   * @maxLength 100
   * @format email
   */
  email: string;
  /**
   * @minLength 12
   * @maxLength 12
   */
  phoneNumber: string;
  /**
   * @minLength 8
   * @maxLength 32
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.?]+$
   */
  password: string;
}

export interface CreateSkillRequest {
  /**
   * @minLength 2
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.?]+$
   */
  name: string;
}

export interface UpdateSkillRequest {
  /**
   * @minLength 1
   * @pattern [a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}
   */
  id: string;
  /**
   * @minLength 2
   * @pattern ^[a-zA-Z0-9!@$%^&*()_+{}:;<>,.?]+$
   */
  name: string;
}

// ...дальнейшие интерфейсы по аналогии...
