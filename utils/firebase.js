// Mock Firebase for demo - no real deps needed
export const auth = {};
export const db = {};

// Mock functions for compatibility
export const signInWithEmailAndPassword = async () => ({ user: { email: 'demo@test.com' } });
export const createUserWithEmailAndPassword = async () => ({ user: { email: 'new@test.com' } });
export const onAuthStateChanged = (cb) => cb(null); // Mock logged out
export const signOut = async () => {};
export const collection = () => ({});
export const getDocs = async () => ({ docs: [] });
export const doc = () => ({});
export const setDoc = async () => {};

const app = {};
export default app;

