import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import TablePagination from '@mui/material/TablePagination';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import RecommendationDialog from '../RecommendationDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#10A37F',
        color: theme.palette.common.white,
        fontSize: 16,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const DataTable = ({ rows }) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [openRecommendationDialogBox, setOpenRecommendationDialogBox] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState(null);

    const navigate = useNavigate();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleOpenRecommendation = (row) => {
        setSelectedRow(row);
        setOpenRecommendationDialogBox(true);
    };
    
    const handleCloseRecommendation = () => {
        setOpenRecommendationDialogBox(false);
    };

    const handleClickRecommendation = (recommendationId) => {
        navigate(`/recommendation/${recommendationId}/class/${selectedRow.relatory.classId}`);
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Ano</StyledTableCell>
                            <StyledTableCell align="left">Semestre</StyledTableCell>
                            <StyledTableCell align="left">Turma</StyledTableCell>
                            <StyledTableCell align="left">Estudo</StyledTableCell>
                            <StyledTableCell align="left">Respostas</StyledTableCell>
                            <StyledTableCell align="left">Relatório</StyledTableCell>
                            <StyledTableCell align="left">Recomendação</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.year}
                                </StyledTableCell>
                                <StyledTableCell align="left">{row.semester}</StyledTableCell>
                                <StyledTableCell align="left">{row.sclass}</StyledTableCell>
                                <StyledTableCell align="left">{row.study}</StyledTableCell>
                                <StyledTableCell align="left">{row.totalAnswers}/{row.totalStudents}</StyledTableCell>
                                <StyledTableCell align="left">
                                    <ButtonGroup
                                        variant="contained"
                                        aria-label="Basic button group"
                                        sx={{ '& .MuiButtonGroup-grouped:not(:last-of-type)': { borderColor: 'transparent', } }}
                                    >
                                        <Button
                                            sx={{
                                                backgroundColor: '#F9B13D',
                                                '&:hover': {
                                                    backgroundColor: '#e09b36',
                                                },
                                                fontSize: 13
                                            }}
                                            href={`/report/class/${row.relatory.classId}/study/${row.relatory.studyId}/synthetic`}
                                        >
                                            Sintético
                                        </Button>
                                        <Button
                                            sx={{
                                                backgroundColor: '#FF4747',
                                                '&:hover': {
                                                    backgroundColor: '#e03e3e',
                                                },
                                                fontSize: 13
                                            }}
                                            href={`/report/class/${row.relatory.classId}/study/${row.relatory.studyId}/analytical`}
                                        >
                                            Analítico
                                        </Button>
                                    </ButtonGroup>
                                </StyledTableCell>
                                <StyledTableCell>
                                    <Button
                                        variant="contained"
                                        startIcon={<StarIcon />}
                                        sx={{
                                            backgroundColor: '#10A37F',
                                            '&:hover': {
                                                backgroundColor: '#0d8b6c',
                                            },
                                            fontSize: 13,
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
                                        onClick={() => handleOpenRecommendation(row)}
                                    >
                                        Acessar Recomendação
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            <RecommendationDialog
                open={openRecommendationDialogBox}
                onClose={handleCloseRecommendation}
                selectedRow={selectedRow}
                onRecommendationClick={handleClickRecommendation}
            />
        </>
    );
}

export default DataTable;