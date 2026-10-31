import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDECE7] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-[#18181B] tracking-tight">Event-drop</h1>
          <p className="text-xs text-[#71717A] mt-1">Sign in to save and access your event plans</p>
        </div>
        <div className="flex justify-center">
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}
