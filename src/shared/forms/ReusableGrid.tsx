// Arquivo: ReusableGrid.tsx
import { Grid2, SxProps, Theme } from '@mui/material';
import React from 'react';

// Define as props para aceitar children e estilos customizados
interface ReusableGridProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const ReusableGrid: React.FC<ReusableGridProps> = ({ children, sx }) => {
  return (
    <Grid2
      sx={{
        width: {
          xs: '100%',
          sm: '100%',
          md: '50%',
          lg: '33%',
          xl: '25%',
        },
        ...sx, // Permite sobreposição de estilos se necessário
      }}
    >
      {children}
    </Grid2>
  );
};
