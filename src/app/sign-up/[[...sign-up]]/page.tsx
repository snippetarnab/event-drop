import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#EDECE7] p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-[#18181B] tracking-tight">Event-drop</h1>
          <p className="text-xs text-[#71717A] mt-1">Create an account to track all your wedding, birthday & community events</p>
        </div>
        <div className="flex justify-center">
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
        </div>
      </div>
    </div>
  );
}
