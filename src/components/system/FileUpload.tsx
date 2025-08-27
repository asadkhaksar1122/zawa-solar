'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useSystemSettings } from '@/contexts/SettingsContext';
import { Upload, File, X, AlertCircle, CheckCircle, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  onFileRemove?: (index: number) => void;
  maxFiles?: number;
  accept?: string;
  className?: string;
  disabled?: boolean;
  multiple?: boolean;
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  maxFiles = 5,
  accept,
  className,
  disabled = false,
  multiple = true,
}: FileUploadProps) {
  const { maxFileUploadSize, allowedFileTypes } = useSystemSettings();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Convert MB to bytes
  const maxSizeBytes = maxFileUploadSize * 1024 * 1024;

  // Create accept string from allowed file types
  const acceptTypes = accept || allowedFileTypes.map(type => {
    switch (type.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return `.${type}`;
    }
  }).join(',');

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeBytes) {
      return `File size exceeds ${maxFileUploadSize}MB limit`;
    }

    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension && !allowedFileTypes.includes(fileExtension)) {
      return `File type .${fileExtension} is not allowed. Allowed types: ${allowedFileTypes.join(', ')}`;
    }

    return null;
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejectedFile = rejectedFiles[0];
      if (rejectedFile.errors[0]?.code === 'file-too-large') {
        setError(`File size exceeds ${maxFileUploadSize}MB limit`);
      } else if (rejectedFile.errors[0]?.code === 'file-invalid-type') {
        setError(`File type not allowed. Allowed types: ${allowedFileTypes.join(', ')}`);
      } else {
        setError('File upload failed');
      }
      return;
    }

    // Validate accepted files
    const validFiles: File[] = [];
    for (const file of acceptedFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      validFiles.push(file);
    }

    // Check total file count
    if (uploadedFiles.length + validFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Add files to uploaded files list
    const newUploadedFiles = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
    }));

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    // Simulate upload progress
    newUploadedFiles.forEach((uploadedFile, index) => {
      const startIndex = uploadedFiles.length + index;
      simulateUpload(startIndex);
    });

    // Call onFileSelect callback
    if (onFileSelect) {
      onFileSelect(validFiles);
    }
  }, [uploadedFiles, maxFiles, maxFileUploadSize, allowedFileTypes, onFileSelect]);

  const simulateUpload = (index: number) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index].progress += 10;
          if (updated[index].progress >= 100) {
            updated[index].progress = 100;
            updated[index].status = 'success';
            clearInterval(interval);
          }
        }
        return updated;
      });
    }, 100);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (onFileRemove) {
      onFileRemove(index);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptTypes ? { [acceptTypes]: [] } : undefined,
    maxSize: maxSizeBytes,
    multiple,
    disabled,
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <Image className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className={cn('h-8 w-8', isDragActive ? 'text-primary' : 'text-muted-foreground')} />
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxFileUploadSize}MB per file • {allowedFileTypes.join(', ').toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length}/{maxFiles})</h4>
          <div className="space-y-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20"
              >
                <div className="flex-shrink-0">
                  {getFileIcon(uploadedFile.file.name)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(uploadedFile.file.size)}
                      </span>
                      {uploadedFile.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {uploadedFile.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {uploadedFile.status === 'uploading' && (
                    <Progress value={uploadedFile.progress} className="h-1" />
                  )}
                  
                  {uploadedFile.status === 'error' && uploadedFile.error && (
                    <p className="text-xs text-destructive">{uploadedFile.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Info */}
      <div className="text-xs text-muted-foreground">
        <p>• Maximum file size: {maxFileUploadSize}MB</p>
        <p>• Allowed file types: {allowedFileTypes.join(', ').toUpperCase()}</p>
        <p>• Maximum files: {maxFiles}</p>
      </div>
    </div>
  );
}