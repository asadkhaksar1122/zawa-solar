'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface CaptchaComponentProps {
  onVerify: (isValid: boolean) => void;
  disabled?: boolean;
}

export function CaptchaComponent({ onVerify, disabled = false }: CaptchaComponentProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random CAPTCHA text
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsValid(false);
    onVerify(false);
  };

  // Draw CAPTCHA on canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 70%)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw CAPTCHA text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < captchaText.length; i++) {
      const char = captchaText[i];
      const x = (canvas.width / captchaText.length) * (i + 0.5);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
      const rotation = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 30%)`;
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Add noise dots
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  };

  // Verify user input
  const verifyCaptcha = (input: string) => {
    const valid = input.toLowerCase() === captchaText.toLowerCase();
    setIsValid(valid);
    onVerify(valid);
    return valid;
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setUserInput(value);
    if (value.length === captchaText.length) {
      verifyCaptcha(value);
    } else {
      setIsValid(false);
      onVerify(false);
    }
  };

  // Initialize CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Redraw when CAPTCHA text changes
  useEffect(() => {
    if (captchaText) {
      drawCaptcha();
    }
  }, [captchaText]);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Security Verification</Label>
      
      {/* CAPTCHA Canvas */}
      <div className="flex items-center gap-2">
        <canvas
          ref={canvasRef}
          width={180}
          height={60}
          className="border rounded bg-gray-50"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={generateCaptcha}
          disabled={disabled}
          title="Generate new CAPTCHA"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Input Field */}
      <div className="space-y-1">
        <Input
          type="text"
          placeholder="Enter the text shown above"
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          disabled={disabled}
          className={`${
            userInput.length > 0
              ? isValid
                ? 'border-green-500 focus:border-green-500'
                : 'border-red-500 focus:border-red-500'
              : ''
          }`}
        />
        {userInput.length > 0 && (
          <p className={`text-xs ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? '✓ Verification successful' : '✗ Incorrect, please try again'}
          </p>
        )}
      </div>
    </div>
  );
}