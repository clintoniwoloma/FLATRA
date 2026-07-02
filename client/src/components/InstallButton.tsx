import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';

interface InstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'lg';
  showText?: boolean;
}

export function InstallButton({ 
  variant = 'default', 
  size = 'sm',
  showText = true 
}: InstallButtonProps) {
  const { isInstallable, isInstalled, install } = useInstallPrompt();

  if (isInstalled) {
    return (
      <Button 
        variant="ghost" 
        size={size}
        disabled
        className="gap-2 text-green-500"
      >
        <CheckCircle className="w-4 h-4" />
        {showText && 'Installed'}
      </Button>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <Button 
      onClick={install}
      variant={variant}
      size={size}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {showText && 'Install FLATRA'}
    </Button>
  );
}
