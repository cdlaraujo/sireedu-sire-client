import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import ExtensionIcon from '@mui/icons-material/Extension';

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#10A37F',
  color: 'white',
  padding: theme.spacing(2),
}));

const RecommendationDialog = ({ 
  open, 
  onClose, 
  selectedRow, 
  onRecommendationClick 
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      <StyledDialogTitle>
        <Typography variant="h6" component="div">
          Recomendações para a Turma
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent dividers>
        {selectedRow && (
          <Box sx={{ p: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Turma: {selectedRow.sclass} - {selectedRow.study}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" color="#10A37F" gutterBottom>
              Recomendações Personalizadas para sua Turma
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                Baseado no perfil cognitivo da turma, serão sugeridos Produtos Educacionais e Metodologias de Ensino.
              </Typography>
              
              <Typography variant="body1" paragraph>
                Dessa forma, considere utilizar ferramentas e metodologias que estimulem
                todos os tipos de estilos de aprendizados e inteligências predominantes.
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '24px',
              mt: 2
            }}>
              <Button
                variant="contained"
                startIcon={<ImportantDevicesIcon />}
                sx={{
                  backgroundColor: '#10A37F',
                  '&:hover': { backgroundColor: '#0d8b6c' },
                  fontSize: 16,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:active': {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: 'translateY(1px)'
                  }
                }}
                onClick={() => onRecommendationClick(1)}
              >
                Produtos Educacionais
              </Button>
              <Button
                variant="contained"
                startIcon={<ExtensionIcon />}
                sx={{
                  backgroundColor: '#10A37F',
                  '&:hover': { backgroundColor: '#0d8b6c' },
                  fontSize: 16,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 'medium',
                  boxShadow: '0 3px 5px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  '&:active': {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transform: 'translateY(1px)'
                  }
                }}
                onClick={() => onRecommendationClick(2)}
              >
                Metodologias de Ensino
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecommendationDialog;