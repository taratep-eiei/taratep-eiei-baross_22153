const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

async function hashPassword(password, salt) {
    const value = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest('SHA-256', value);
    return toHex(new Uint8Array(digest));
}

export async function createPasswordCredential(password) {
    const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
    return { salt, passwordHash: await hashPassword(password, salt) };
}

export async function verifyPassword(password, record) {
    if (!record?.salt || !record?.passwordHash) return false;
    const actual = await hashPassword(password, record.salt);
    if (actual.length !== record.passwordHash.length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index += 1) {
        difference |= actual.charCodeAt(index) ^ record.passwordHash.charCodeAt(index);
    }
    return difference === 0;
}
