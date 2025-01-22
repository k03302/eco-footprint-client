let idTokenCache: null | string = null;

export function login(idToken: string) {
    idTokenCache = idToken;
}
export function logout() {
    idTokenCache = null;
}

export function getIdToken() {
    return idTokenCache;
}

export function getAdminIdToken() {
    return '1';
}