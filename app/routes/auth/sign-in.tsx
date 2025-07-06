import { Link, redirect } from "react-router";
import { loginWithGoogle } from "../../appwrite/auth";
import { account } from "../../appwrite/client";
import { Button } from "../../components/ui/button";

export async function clientLoader() {
  try {
    // First check if we have a session
    const session = await account.getSession("current");

    // If session exists, try to get user data
    if (session.userId) {
      const user = await account.get();
      if (user.$id) return redirect("/");
    }

    return null;
  } catch (error) {
    // All errors here mean user is not authenticated
    return null;
  }
}

export function HydrateFallback() {
  return (
    <p className="h-screen flex items-center justify-center">Loading Game...</p>
  );
}

const SignIn = () => {
  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold">Tourvisto</h1>
          </header>
          <article>
            <h2 className="p-28-bold text-dark-100 text-center">
              Start your journey
            </h2>
            <p className="p-18-regular text-center text-gray-100 !leading-7">
              Sign in with your Tourvisto account
            </p>
          </article>
          <Button
            onClick={loginWithGoogle}
            className="cursor-pointer button-class !h-11 !w-full"
          >
            <img
              src="/assets/icons/google.svg"
              className="button-class"
              alt="google"
            />
            <span className="p-18-semibold">Sign in with Google</span>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
