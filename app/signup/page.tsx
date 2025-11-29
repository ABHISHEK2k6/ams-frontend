'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student');
  
  // Form state
  const [formData, setFormData] = useState({
    // Common fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirmPassword: '',
    // Student fields
    admissionNumber: '',
    admissionYear: '',
    candidateCode: '',
    department: '',
    dateOfBirth: '',
    // Parent fields
    relation: '',
    // Teacher fields
    designation: '',
    dateOfJoining: '',
  });

  // Field errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Role selection data
  const roles = [
    { id: 'student' as const, label: 'Student', icon: '🎓' },
    { id: 'teacher' as const, label: 'Teacher', icon: '👨‍🏫' },
    { id: 'parent' as const, label: 'Parent', icon: '👨‍👩‍👧' }
  ];

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle role change
  const handleRoleChange = (role: 'student' | 'teacher' | 'parent') => {
    setSelectedRole(role);
    // Clear role-specific errors
    setErrors({});
  };

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Common field validations
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (formData.firstName.length < 2) newErrors.firstName = 'First name must be at least 2 characters';
    
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (formData.lastName.length < 2) newErrors.lastName = 'Last name must be at least 2 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (formData.phone.length < 10) newErrors.phone = 'Phone number must be at least 10 digits';
    
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";

    // Role-specific validations
    if (selectedRole === 'student') {
      if (!formData.admissionNumber.trim()) newErrors.admissionNumber = 'Admission number is required';
      if (!formData.admissionYear.trim()) newErrors.admissionYear = 'Admission year is required';
      if (!formData.candidateCode.trim()) newErrors.candidateCode = 'Candidate code is required';
      if (!formData.department) newErrors.department = 'Please select a department';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (selectedRole === 'parent') {
      if (!formData.relation) newErrors.relation = 'Please select a relation';
    }

    if (selectedRole === 'teacher') {
      if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
      if (!formData.department) newErrors.department = 'Please select a department';
      if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      setError('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with your actual signup API call
      console.log('Form submitted:', { ...formData, role: selectedRole });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      alert('Account created successfully!');
      
      // In production, redirect to dashboard or signin page
      // window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Google sign-up handler
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with your actual Google OAuth logic
      console.log('Google sign-up initiated');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Google sign-up initiated!');
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign up');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/ucek.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-end px-4 sm:px-10 md:px-20 py-8">
        <Card className="w-full max-w-md bg-white shadow-xl my-8">
          <CardHeader className="space-y-1">
            <div className="absolute bottom-4 left-4 text-sm text-gray-500">
              Built with 🔥 by μlearn UCEK
            </div>
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center">
                <img src="/logo.svg" alt="Logo" className="h-14 w-auto" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
            <CardDescription className="text-center">
              Create your account by selecting your role
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Select Role</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleChange(role.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        selectedRole === role.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl mb-1">{role.icon}</span>
                      <span className="text-xs font-medium">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="mail@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value: string) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
              </div>

              {/* Student-Specific Fields */}
              {selectedRole === 'student' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="admissionNumber">Admission No.</Label>
                      <Input 
                        id="admissionNumber" 
                        placeholder="29CSE555"
                        value={formData.admissionNumber}
                        onChange={(e) => handleInputChange('admissionNumber', e.target.value)}
                      />
                      {errors.admissionNumber && <p className="text-sm text-red-500">{errors.admissionNumber}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admissionYear">Admission Year</Label>
                      <Input 
                        id="admissionYear" 
                        type="number" 
                        placeholder="2026"
                        value={formData.admissionYear}
                        onChange={(e) => handleInputChange('admissionYear', e.target.value)}
                      />
                      {errors.admissionYear && <p className="text-sm text-red-500">{errors.admissionYear}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="candidateCode">Candidate Code</Label>
                    <Input 
                      id="candidateCode" 
                      placeholder="41529505078"
                      value={formData.candidateCode}
                      onChange={(e) => handleInputChange('candidateCode', e.target.value)}
                    />
                    {errors.candidateCode && <p className="text-sm text-red-500">{errors.candidateCode}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value: string) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        <SelectItem value="cs">CSE</SelectItem>
                        <SelectItem value="ec">ECE</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                    {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
                  </div>
                </>
              )}

              {/* Parent-Specific Fields */}
              {selectedRole === 'parent' && (
                <div className="space-y-2">
                  <Label htmlFor="relation">Relation</Label>
                  <Select value={formData.relation} onValueChange={(value: string) => handleInputChange('relation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="father">Father</SelectItem>
                      <SelectItem value="mother">Mother</SelectItem>
                      <SelectItem value="guardian">Guardian</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.relation && <p className="text-sm text-red-500">{errors.relation}</p>}
                </div>
              )}

              {/* Teacher-Specific Fields */}
              {selectedRole === 'teacher' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input 
                      id="designation" 
                      placeholder="Assistant Professor"
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                    />
                    {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacherDept">Department</Label>
                    <Select value={formData.department} onValueChange={(value: string) => handleInputChange('department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cs">Computer Science</SelectItem>
                        <SelectItem value="ec">Electronics</SelectItem>
                        <SelectItem value="me">Mechanical</SelectItem>
                        <SelectItem value="ce">Civil</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfJoining">Date of Joining</Label>
                    <Input 
                      id="dateOfJoining" 
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    />
                    {errors.dateOfJoining && <p className="text-sm text-red-500">{errors.dateOfJoining}</p>}
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>

              <Button className="w-full bg-black text-white hover:bg-gray-800" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              type="button" 
              disabled={isLoading} 
              onClick={handleGoogleSignUp} 
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              Google
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center text-sm text-gray-600 pt-4">
            <p>
              Already have an account?{" "}
              <a 
                href="/signin" 
                className="font-medium text-gray-900 hover:underline underline-offset-4 transition-all"
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}