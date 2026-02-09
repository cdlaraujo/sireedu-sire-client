import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';
import FaceIcon from '@mui/icons-material/Face';
import SchoolIcon from '@mui/icons-material/School';
import RateReviewIcon from '@mui/icons-material/RateReview'; // Novo ícone

const Role = (props) => {
    const { onClose, availableRoles, selectedValue, open } = props;
    const [roles, setRoles] = React.useState([]);

    React.useEffect(() => {
        const newRoles = availableRoles.map((role) => {
            if (role === 'Student') {
                return { name: 'Estudante', value: role, icon: <FaceIcon /> };
            } else if (role === 'Professor') {
                return { name: 'Professor', value: role, icon: <SchoolIcon /> };
            } else if (role === 'Revisor') {
                return { name: 'Revisor', value: role, icon: <RateReviewIcon /> };
            }
            return null;
        }).filter(Boolean); // Remove nulos (como 'Admin' se não tiver ícone definido)
    
        setRoles(newRoles);
    }, [availableRoles]);

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Selecione o papel a ser utilizado na sessão</DialogTitle>
            <List sx={{ pt: 0 }}>
                {roles?.map((role) => (
                    <ListItem disableGutters key={role.value}>
                        <ListItemButton onClick={() => handleListItemClick(role.value)}>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    { role.icon }
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={role.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

Role.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    availableRoles: PropTypes.array.isRequired,
};

export default Role;