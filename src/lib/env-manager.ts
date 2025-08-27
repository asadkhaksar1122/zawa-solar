import fs from 'fs';
import path from 'path';

/**
 * Utility class to manage environment variables in .env file
 * This allows secure storage of sensitive data like email passwords
 */
export class EnvManager {
  private static envPath = path.join(process.cwd(), '.env');

  /**
   * Read the current .env file content
   */
  private static readEnvFile(): string {
    try {
      return fs.readFileSync(this.envPath, 'utf8');
    } catch (error) {
      // If .env doesn't exist, return empty string
      return '';
    }
  }

  /**
   * Parse .env content into key-value pairs
   */
  private static parseEnvContent(content: string): Record<string, string> {
    const env: Record<string, string> = {};
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          env[key.trim()] = value;
        }
      }
    }

    return env;
  }

  /**
   * Convert key-value pairs back to .env format
   */
  private static stringifyEnvContent(env: Record<string, string>): string {
    return Object.entries(env)
      .map(([key, value]) => {
        // Add quotes if value contains spaces or special characters
        const needsQuotes = /[\s#"'\\]/.test(value);
        const quotedValue = needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value;
        return `${key}=${quotedValue}`;
      })
      .join('\n');
  }

  /**
   * Update or add an environment variable
   */
  static updateEnvVariable(key: string, value: string): void {
    try {
      const currentContent = this.readEnvFile();
      const env = this.parseEnvContent(currentContent);

      // Update the value
      env[key] = value;

      // Write back to file
      const newContent = this.stringifyEnvContent(env);
      fs.writeFileSync(this.envPath, newContent, 'utf8');

      // Update process.env for immediate use
      process.env[key] = value;

      console.log(`Environment variable ${key} updated successfully`);
    } catch (error) {
      console.error(`Failed to update environment variable ${key}:`, error);
      throw new Error(`Failed to update environment variable: ${error}`);
    }
  }

  /**
   * Get an environment variable value
   */
  static getEnvVariable(key: string): string | undefined {
    return process.env[key];
  }

  /**
   * Check if an environment variable exists
   */
  static hasEnvVariable(key: string): boolean {
    return key in process.env && process.env[key] !== undefined && process.env[key] !== '';
  }

  /**
   * Remove an environment variable
   */
  static removeEnvVariable(key: string): void {
    try {
      const currentContent = this.readEnvFile();
      const env = this.parseEnvContent(currentContent);

      // Remove the key
      delete env[key];

      // Write back to file
      const newContent = this.stringifyEnvContent(env);
      fs.writeFileSync(this.envPath, newContent, 'utf8');

      // Remove from process.env
      delete process.env[key];

      console.log(`Environment variable ${key} removed successfully`);
    } catch (error) {
      console.error(`Failed to remove environment variable ${key}:`, error);
      throw new Error(`Failed to remove environment variable: ${error}`);
    }
  }

  /**
   * Backup current .env file
   */
  static backupEnvFile(): string {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(process.cwd(), `.env.backup.${timestamp}`);
      const currentContent = this.readEnvFile();

      fs.writeFileSync(backupPath, currentContent, 'utf8');
      console.log(`Environment file backed up to: ${backupPath}`);

      return backupPath;
    } catch (error) {
      console.error('Failed to backup .env file:', error);
      throw new Error(`Failed to backup .env file: ${error}`);
    }
  }

  /**
   * Validate .env file format
   */
  static validateEnvFile(): { isValid: boolean; errors: string[] } {
    try {
      const content = this.readEnvFile();
      const errors: string[] = [];
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('#')) {
          if (!line.includes('=')) {
            errors.push(`Line ${i + 1}: Invalid format, missing '=' separator`);
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to read .env file: ${error}`]
      };
    }
  }
}

// Constants for email-related environment variables
export const EMAIL_ENV_KEYS = {
  SMTP_PASSWORD: 'EMAIL_SMTP_PASSWORD',
  SMTP_HOST: 'EMAIL_SMTP_HOST',
  SMTP_PORT: 'EMAIL_SMTP_PORT',
  SMTP_SECURE: 'EMAIL_SMTP_SECURE',
  SMTP_USER: 'EMAIL_SMTP_USER',
  FROM_EMAIL: 'EMAIL_FROM_EMAIL',
  FROM_NAME: 'EMAIL_FROM_NAME',
} as const;

// CAPTCHA env keys
export const CAPTCHA_ENV_KEYS = {
  SECRET_KEY: 'CAPTCHA_SECRET_KEY',
} as const;