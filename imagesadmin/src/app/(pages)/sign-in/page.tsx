"use client"
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError(null);
    setPasswordError(null);

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run validation
    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    const obj = { email, password };

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push("/");
        toast.success('Logged in successfully!');
      } else {
        throw new Error('Token not received');
      }
    } catch (error) {
      toast.error("Error while signing in!");
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className='text-center px-6 flex flex-col items-center justify-center'>
        <h2 className='text-h2 text-white mb-10 font-semibold'>Sign in</h2>
        <div className='flex flex-col gap-6 w-full max-w-80'>
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <Input
              placeholder='Email'
              type='email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <Input
              placeholder='Password'
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {passwordError && <span className="text-red-500 text-sm">{passwordError}</span>}
          </div>

          {/* Remember Me Checkbox */}
          <Checkbox label='Remember me' className="mx-auto" />

          {/* Submit Button */}
          <Button onClick={handleSubmit}>Login</Button>
        </div>
      </div>
    </div>
  );
}
