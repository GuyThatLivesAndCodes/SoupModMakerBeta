/**
 * Auto-save hook for projects
 * Automatically saves the current project at specified intervals
 */

import { useEffect, useRef, useState } from 'react';

interface AutoSaveOptions {
  /** Enable auto-save */
  enabled: boolean;

  /** Interval in milliseconds (default: 300000 = 5 minutes) */
  interval?: number;

  /** Callback when auto-save succeeds */
  onSaveSuccess?: () => void;

  /** Callback when auto-save fails */
  onSaveError?: (error: Error) => void;
}

export function useAutoSave(
  projectData: any | null,
  options: AutoSaveOptions
) {
  const {
    enabled = true,
    interval = 300000, // 5 minutes
    onSaveSuccess,
    onSaveError,
  } = options;

  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const projectRef = useRef(projectData);

  // Keep project ref updated
  useEffect(() => {
    projectRef.current = projectData;
  }, [projectData]);

  // Auto-save function
  const performAutoSave = async () => {
    if (!projectRef.current || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const { ipcRenderer } = window.require('electron');

      // Create project file structure
      const projectFile = {
        version: '1.0.0',
        project: {
          ...projectRef.current,
          timestamps: {
            ...projectRef.current.timestamps,
            modified: Date.now(),
          },
        },
      };

      const result = await ipcRenderer.invoke('project:save', projectFile);

      if (result.success) {
        setLastSaved(new Date());
        onSaveSuccess?.();
      } else {
        throw new Error(result.error || 'Failed to auto-save');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      onSaveError?.(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  // Set up auto-save interval
  useEffect(() => {
    if (!enabled || !projectData) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval
    intervalRef.current = setInterval(performAutoSave, interval);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, projectData]);

  return {
    lastSaved,
    isSaving,
    performAutoSave, // Allow manual trigger
  };
}
