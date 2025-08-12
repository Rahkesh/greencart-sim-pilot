
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, UserPlus, Loader2, Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

type AuthForm = z.infer<typeof authSchema>;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp, loading, user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<AuthForm>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = async (data: AuthForm) => {
    if (isSignUp) {
      const { error } = await signUp(data.email, data.password, data.firstName, data.lastName);
      if (!error) {
        form.reset();
      }
    } else {
      const { error } = await signIn(data.email, data.password);
      if (!error) {
        navigate('/');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Truck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Delivery Simulation
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manager Authentication Portal
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Create Manager Account' : 'Manager Sign In'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? 'Register as a delivery manager to access the simulation tools'
                : 'Sign in to access delivery simulation and analytics'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {isSignUp && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="manager@company.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </>
                  ) : (
                    <>
                      {isSignUp ? <UserPlus className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                      {isSignUp ? 'Create Account' : 'Sign In'}
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={toggleMode}
                disabled={loading}
                className="text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>For managers only. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
