
import React from 'react';
import { Button } from '@/components/ui/button';

const SocialLogin = () => {
  const handleVkLogin = () => {
    // Implement VK login logic
    console.log('VK login');
  };

  const handleTelegramLogin = () => {
    // Implement Telegram login logic
    console.log('Telegram login');
  };

  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        className="w-full bg-[#4C75A3] hover:bg-[#3B5998] text-white hover:text-white" 
        onClick={handleVkLogin}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M21.579 6.855c.14-.465 0-.806-.662-.806h-2.193c-.558 0-.813.295-.953.619 0 0-1.115 2.719-2.695 4.482-.51.513-.743.675-1.021.675-.139 0-.341-.162-.341-.627V6.855c0-.558-.161-.806-.626-.806H9.642c-.348 0-.558.258-.558.504 0 .528.79.649.871 2.138v3.228c0 .707-.128.836-.406.836-.743 0-2.551-2.729-3.624-5.853-.209-.607-.42-.849-.98-.849H2.752c-.627 0-.752.295-.752.619 0 .582.743 3.462 3.461 7.271 1.812 2.601 4.363 4.011 6.687 4.011 1.393 0 1.565-.313 1.565-.853v-1.966c0-.626.133-.752.574-.752.324 0 .882.163 2.183 1.417 1.486 1.486 1.732 2.153 2.567 2.153h2.193c.627 0 .94-.313.759-.932-.197-.615-.907-1.508-1.849-2.566-.51-.604-1.277-1.254-1.51-1.579-.325-.419-.231-.606 0-.979.001 0 2.672-3.761 2.95-5.04z" 
          />
        </svg>
        Войти через VK
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full bg-[#0088cc] hover:bg-[#0072b1] text-white hover:text-white" 
        onClick={handleTelegramLogin}
      >
        <svg 
          className="w-5 h-5 mr-2" 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M19.44 3.06L3.06 9.27c-1.18.48-1.14 2.88.08 3.32l3.84 1.18 1.46 4.74c.28.89 1.16 1.48 2.06 1.29.88-.18 1.64-.89 1.96-1.83l.45-1.28 2.76 2.07c.57.4 1.47.17 1.83-.51L22.99 3.7c.36-.66-.5-1.31-1.19-1.02l-2.36.38zM8.15 14.5L5.08 13.1l10.6-4.01-8.38 5.9.85-.49z" 
          />
        </svg>
        Войти через Telegram
      </Button>
    </div>
  );
};

export default SocialLogin;
