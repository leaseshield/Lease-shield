import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Clear as ClearIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const FilePreview = React.memo(({ file, onRemove, isLoading }) => {
  const isImage = file.type.startsWith('image/');
  
  return (
    <ListItem
      secondaryAction={
        <IconButton 
          edge="end" 
          aria-label="delete" 
          onClick={() => onRemove(file.name)} 
          disabled={isLoading}
        >
          <ClearIcon />
        </IconButton>
      }
    >
      <ListItemIcon>
        {isImage ? (
          <img 
            src={file.preview} 
            alt={file.name} 
            loading="lazy"
            width={40}
            height={40}
            style={{ 
              width: 40, 
              height: 40, 
              objectFit: 'cover', 
              borderRadius: '4px' 
            }} 
          />
        ) : (
          <DescriptionIcon />
        )}
      </ListItemIcon>
      <ListItemText 
        primary={file.name} 
        secondary={`${(file.size / 1024).toFixed(1)} KB`} 
      />
    </ListItem>
  );
});

FilePreview.displayName = 'FilePreview';

export default FilePreview; 