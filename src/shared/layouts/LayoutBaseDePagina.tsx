import { ReactNode } from 'react';
import {
  Icon,
  IconButton,
  Theme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';

import { useDrawerContext } from '../contexts';

interface ILayoutBaseDePaginaProps {
  titulo: string;
  children: ReactNode;
  barraDeFerramentas?: ReactNode;
}
export const LayoutBaseDePagina: React.FC<ILayoutBaseDePaginaProps> = ({
  children,
  titulo,
  barraDeFerramentas,
}) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const theme = useTheme();

  const { toggleDrawerOpen } = useDrawerContext();

  return (
    <Box height='100%' display='flex' flexDirection='column' gap={1}>
      <Box
        padding={1}
        display='flex'
        alignItems='center'
        // justifyContent='space-between' // Adiciona espaçamento entre os elementos
        gap={1}
        height={theme.spacing(smDown ? 6 : mdDown ? 8 : 12)}
        flexWrap={smDown ? 'wrap' : 'nowrap'} // Permite que os elementos quebrem linha em telas pequenas
      >
        {smDown && (
          <IconButton onClick={toggleDrawerOpen}>
            <Icon>menu</Icon>
          </IconButton>
        )}
        <Typography
          overflow='hidden'
          whiteSpace='nowrap'
          textOverflow='ellipses'
          variant={smDown ? 'h5' : mdDown ? 'h4' : 'h3'}
        >
          {titulo}
        </Typography>

        <Box
          component='img'
          sx={{
            width: smDown ? '50%' : '25%', // A largura se adapta em telas pequenas
            maxWidth: '100px', // Tamanho máximo da imagem
            height: 'auto', // Mantém a proporção
            borderRadius: '8px', // Bordas arredondadas
            boxShadow: 3, // Sombra da imagem
            marginTop: smDown ? theme.spacing(1) : 0, // Adiciona espaço no topo em telas pequenas
          }}
          alt='Descrição da imagem'
          src='https://riosoft.com.br/wp-content/uploads/2024/01/Riosoft-Logo-512x512-1.png'
        />
      </Box>

      {barraDeFerramentas && <Box>{barraDeFerramentas}</Box>}

      <Box flex={1} overflow='auto'>
        {children}
      </Box>
    </Box>
  );
};
