/**
 * Source Files Panel - Shows REAL files from disk
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  CircularProgress,
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as FileIcon,
  Code as CodeIcon,
  ExpandMore as ExpandIcon,
  ChevronRight as CollapseIcon,
} from '@mui/icons-material';
import { readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

interface SourceFilesPanelProps {
  project: any;
  onOpenFile?: (file: { path: string; content: string }) => void;
}

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

const SourceFilesPanelReal: React.FC<SourceFilesPanelProps> = ({ project, onOpenFile }) => {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Load file tree when project changes or is modified
  useEffect(() => {
    if (project?.projectPath) {
      loadFileTree();
    }
  }, [project?.projectPath, project?.timestamps?.modified]);

  const loadFileTree = async () => {
    if (!project?.projectPath) return;

    setLoading(true);
    try {
      const tree = await buildFileTree(project.projectPath, project.projectPath, project.metadata?.name || 'Project');
      setFileTree(tree);
      // Auto-expand src folder
      if (tree) {
        const srcPath = await join(project.projectPath, 'src');
        setExpandedFolders(new Set([srcPath]));
      }
    } catch (error) {
      console.error('Error loading file tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildFileTree = async (dirPath: string, basePath: string, displayName?: string): Promise<FileNode> => {
    try {
      const entries = await readDir(dirPath);
      const children: FileNode[] = [];

      for (const entry of entries) {
        const entryPath = await join(dirPath, entry.name);

        if (entry.isDirectory) {
          const childNode = await buildFileTree(entryPath, basePath, entry.name);
          children.push(childNode);
        } else if (entry.isFile && shouldShowFile(entry.name)) {
          children.push({
            name: entry.name,
            path: entryPath,
            isDirectory: false,
          });
        }
      }

      // Sort: directories first, then files, both alphabetically
      children.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      return {
        name: displayName || 'Project',
        path: dirPath,
        isDirectory: true,
        children,
      };
    } catch (error) {
      console.error('Error building file tree for', dirPath, error);
      return {
        name: dirPath.split('/').pop() || dirPath,
        path: dirPath,
        isDirectory: true,
        children: [],
      };
    }
  };

  const shouldShowFile = (fileName: string): boolean => {
    // Show Java, Gradle, TOML, properties, JSON files
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ['java', 'gradle', 'toml', 'properties', 'json', 'md'].includes(ext || '');
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = async (path: string) => {
    setSelectedFile(path);
    try {
      const content = await readTextFile(path);
      setFileContent(content);
      if (onOpenFile) {
        onOpenFile({ path, content });
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setFileContent(`// Error reading file: ${error}`);
    }
  };

  const renderFileTree = (node: FileNode, level: number = 0): React.ReactNode => {
    const isExpanded = expandedFolders.has(node.path);

    if (node.isDirectory) {
      return (
        <Box key={node.path}>
          <ListItemButton
            onClick={() => toggleFolder(node.path)}
            sx={{ pl: level * 2 }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isExpanded ? <ExpandIcon /> : <CollapseIcon />}
            </ListItemIcon>
            <ListItemIcon sx={{ minWidth: 32 }}>
              {isExpanded ? <FolderOpenIcon /> : <FolderIcon />}
            </ListItemIcon>
            <ListItemText
              primary={node.name}
              primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace' }}
            />
          </ListItemButton>
          {node.children && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {node.children.map((child) => renderFileTree(child, level + 1))}
              </List>
            </Collapse>
          )}
        </Box>
      );
    } else {
      return (
        <ListItemButton
          key={node.path}
          onClick={() => handleFileClick(node.path)}
          selected={selectedFile === node.path}
          sx={{ pl: (level + 1) * 2 }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <FileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary={node.name}
            primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace' }}
          />
        </ListItemButton>
      );
    }
  };

  if (!project?.projectPath) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CodeIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
        <Typography variant="body2" sx={{ opacity: 0.5 }}>
          No project open
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.5, mt: 1 }}>
          Create or open a project to view source files
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
      {/* File Tree */}
      <Box
        sx={{
          width: 300,
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'auto',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 1, fontSize: 18 }} />
            Source Files
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {project.projectPath}
          </Typography>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : fileTree ? (
          <List dense>
            {fileTree.children?.map((child) => renderFileTree(child, 0))}
          </List>
        ) : (
          <Typography variant="body2" sx={{ p: 2, opacity: 0.5 }}>
            No files found
          </Typography>
        )}
      </Box>

      {/* File Viewer */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedFile ? (
          <>
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>
                {selectedFile}
              </Typography>
            </Box>
            <Box
              component="pre"
              sx={{
                flex: 1,
                m: 0,
                p: 2,
                overflow: 'auto',
                bgcolor: 'grey.900',
                color: 'grey.100',
                fontSize: '0.813rem',
                fontFamily: 'monospace',
                lineHeight: 1.5,
              }}
            >
              {fileContent}
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <CodeIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              Select a file to view its contents
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SourceFilesPanelReal;
