import Cookies from "js-cookie";

class TokenManager {
    getAccessToken(): string | undefined {
        if (typeof document === 'undefined') return undefined;
        return Cookies.get('AccessToken');
    }

    getRefreshToken(): string | undefined {
        if (typeof document === 'undefined') return undefined;
        return Cookies.get('RefreshToken');
    }

    clearTokens(): void {
        Cookies.remove('AccessToken');
        Cookies.remove('RefreshToken');
        Cookies.remove('ExpiresAt');
        Cookies.remove('UserId')
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    getUserId(): string | undefined {
        if (typeof document === 'undefined') return undefined;
        return Cookies.get('UserId');
    }

    getAccessTokenExpiration(): string | undefined {
        if (typeof document === 'undefined') return undefined;
        return Cookies.get('ExpiresAt');
    }
}

export const tokenManager = new TokenManager();