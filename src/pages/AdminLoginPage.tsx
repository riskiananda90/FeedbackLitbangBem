
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminAuth, setAdminAuth] = useLocalStorage('adminAuth', null);
  const navigate = useNavigate();

  useEffect(() => {
    if (adminAuth?.isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [adminAuth, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (username === 'admin' && password === 'password') {
      setAdminAuth({
        isAuthenticated: true,
        username: 'Administrator'
      });
      toast.success('Login berhasil!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Kredensial salah. Coba lagi.');
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gray-900 rounded-lg flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Admin Portal
            </CardTitle>
            <p className="text-gray-600 mt-2">Masuk ke dashboard admin BEM</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                placeholder="Masukkan username admin"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 px-4 bg-white border-gray-200 focus:border-gray-400 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Masukkan password admin"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 px-4 pr-12 bg-white border-gray-200 focus:border-gray-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleLogin} 
            disabled={loading || !username || !password}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Memverifikasi...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Masuk Admin</span>
              </div>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Demo credentials: admin / password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
