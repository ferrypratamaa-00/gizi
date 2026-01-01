export interface SignUpResult {
    authUserId: string;
    email: string;
}

export interface SignInResult {
    authUserId: string;
    email: string;
    accessToken: string;
}

export interface VerifyTokenResult {
    authUserId: string;
    email: string;
    expiresAt: Date;
}

export interface IAuthProvider {
    /**
     * Sign up user via auth provider
     */
    signUp(email: string, password: string): Promise<SignUpResult>;

    /**
     * Sign in user via auth provider
     */
    signIn(email: string, password: string): Promise<SignInResult>;

    /**
     * Verify JWT token
     */
    verifyToken(token: string): Promise<VerifyTokenResult>;

    /**
     * Send password reset email
     */
    sendPasswordResetEmail(email: string): Promise<void>;

    /**
     * Reset password with token
     */
    resetPassword(token: string, newPassword: string): Promise<void>;
}
