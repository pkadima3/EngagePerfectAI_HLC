// components/auth/SocialLogin.tsx
import { AuthButton } from './AuthButton';  // Import AuthButton from the same folder

export const SocialLogin = () => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <AuthButton variant="social" fullWidth>
          <img src="/google.svg" alt="" className="w-5 h-5" />
          Continue with Google
        </AuthButton>
        <AuthButton variant="social" fullWidth>
          <img src="/facebook.svg" alt="" className="w-5 h-5" />
          Continue with Facebook
        </AuthButton>
        <AuthButton variant="social" fullWidth>
          <img src="/linkedin.svg" alt="" className="w-5 h-5" />
          Continue with LinkedIn
        </AuthButton>
      </div>
    </div>
  );
};  