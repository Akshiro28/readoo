import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { firebaseApp } from "./config";

const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
const apiBase = process.env.NEXT_PUBLIC_API_URL;

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const token = await user.getIdToken();

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/save-user`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
        photo: user.photoURL,
      }),
    });

    console.log("User info sent to backend.");
  } catch (error) {
    console.error("Sign-in failed:", error);
  }
};

export const logOut = () => signOut(auth);

export { auth };

