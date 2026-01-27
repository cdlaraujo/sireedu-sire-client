import React, { useEffect, useState } from "react";
import "./styles.css";
import config from "../../services/config";
import useFetch from "../../hooks/useFetch";
import DataTable from "./DataTable";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import { useNavigate } from "react-router-dom";
import RecommendationGroup from "../../components/RecommendationGroup";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Skeleton from '@mui/material/Skeleton';
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import ExportCSV from "../../components/ExportCSV";

// Material UI Components for the Cards
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SchoolIcon from '@mui/icons-material/School';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import ExtensionIcon from '@mui/icons-material/Extension';

const Professor = () => {
    const { fetchEntryPoint } = useFetch();
    
    // --- STATE MANAGEMENT ---
    const [availableClassroomStudy, setAvailableClassroomStudy] = useState([]); // All data
    const [uniqueClasses, setUniqueClasses] = useState([]); // Just the class list
    const [selectedClass, setSelectedClass] = useState(null); // THE SWITCH: null = List, object = Dashboard
    
    const [loading, setLoading] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // Helper to format data coming from API
    const createData = (id, year, semester, sclass, study, totalStudents, totalAnswers, relatory, classId) => {
        return { id, year, semester, sclass, study, totalAnswers, totalStudents, relatory, classId };
    }

    // --- FETCH DATA (Run once on load) ---
    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            try {
                const { role } = JSON.parse(localStorage.getItem(config.tokenName));
                
                // 1. Fetch EVERYTHING
                const studies = await fetchEntryPoint(role, controller);

                // 2. Prepare Table Data (Add classId to each row so we can filter later)
                const newRows = studies.map((classStudy, index) => 
                    createData(
                        index,
                        classStudy.sclass.year, 
                        classStudy.sclass.semester,
                        classStudy.sclass.description, 
                        classStudy.study.description,
                        classStudy.total_students,
                        classStudy.total_answered,
                        { classId: classStudy.sclass.id, studyId: classStudy.study.id },
                        classStudy.sclass.id // We save this ID to filter the table later!
                    )
                );
                setAvailableClassroomStudy(newRows);

                // 3. Extract Unique Classes for the Cards
                const classesMap = new Map();
                studies.forEach(item => {
                    if (!classesMap.has(item.sclass.id)) {
                        classesMap.set(item.sclass.id, {
                            id: item.sclass.id,
                            description: item.sclass.description,
                            year: item.sclass.year,
                            semester: item.sclass.semester,
                            code: item.sclass.code
                        });
                    }
                });
                setUniqueClasses(Array.from(classesMap.values()));

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log("Error during fetch:", error);
                }
            } finally {
                setLoading(false);
            }
        }

        handleFetch();
        return () => controller.abort();
    }, []);

    // --- HANDLERS ---
    
    // Switch to Dashboard View
    const handleClassSelect = (classItem) => {
        setSelectedClass(classItem);
        window.scrollTo(0, 0); // Scroll to top
    };

    // Switch back to Card View
    const handleBackToSelection = () => {
        setSelectedClass(null);
    };

    // --- RENDER HELPERS ---

    // Filter the big table data to show only the selected class
    const filteredRows = selectedClass 
        ? availableClassroomStudy.filter(row => row.classId === selectedClass.id)
        : [];

    // Prepare CSV data for the selected class
    const csvData = filteredRows.map((row) => ({
        ano: row.year, 
        semestre: row.semester,
        turma: row.sclass,
        estudo: row.study,
        respostas: `${row.totalAnswers}/${row.totalStudents}`,
    }));

    // Tutorial Steps Logic
    const getTutorialSteps = () => {
        if (!selectedClass) {
            return [
                {
                    targetSelector: '.professor-header',
                    title: 'Seleção de Turmas',
                    description: 'Bem-vindo! Aqui você vê todas as suas turmas cadastradas.'
                },
                {
                    targetSelector: '.MuiCard-root',
                    title: 'Cartão da Turma',
                    description: 'Clique em um cartão para acessar os relatórios e recomendações específicos daquela turma.'
                }
            ];
        } else {
            return [
                {
                    targetSelector: '.professor-header',
                    title: 'Painel da Turma',
                    description: 'Aqui você visualiza os dados detalhados da turma selecionada.'
                },
                {
                    targetSelector: '.professor-datatable-section',
                    title: 'Relatórios',
                    description: 'Acesse os relatórios Sintético e Analítico para ver o perfil dos alunos.'
                },
                {
                    targetSelector: '[data-tutorial="materiais-de-apoio"]',
                    title: 'Recomendações',
                    description: 'Com base nos resultados, o sistema gera recomendações de materiais e metodologias.'
                }
            ];
        }
    };

    // --- COMPONENT RENDER ---
    return (
        <div className="professor">
            <PageTitleUpdater title={"Início"} />
            <div className="professor-container">
                
                {/* === VIEW 1: CLASS SELECTION (PRE-ROOM) === */}
                {!selectedClass && (
                    <>
                        <div className="professor-header">
                            <p className="primary-heading">Minhas Turmas</p>
                            <p className="secondary-text">Selecione uma turma para visualizar os relatórios e recomendações.</p>
                        </div>

                        {loading ? (
                            <Skeleton variant="rectangular" height={200} sx={{mt: 2, borderRadius: 2}} />
                        ) : (
                            <Grid container spacing={3} justifyContent="center" sx={{ marginTop: '1rem' }}>
                                {uniqueClasses.map((cls) => (
                                    <Grid item xs={12} sm={6} md={4} key={cls.id}>
                                        <Card 
                                            sx={{ 
                                                height: '100%', 
                                                display: 'flex', 
                                                flexDirection: 'column',
                                                transition: '0.3s',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                '&:hover': { transform: 'scale(1.03)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } 
                                            }}
                                        >
                                            <CardActionArea 
                                                onClick={() => handleClassSelect(cls)} 
                                                sx={{ height: '100%', p: 2 }}
                                            >
                                                <CardContent sx={{ textAlign: 'center' }}>
                                                    <SchoolIcon sx={{ fontSize: 50, color: '#40A3A6', mb: 2 }} />
                                                    <Typography gutterBottom variant="h5" component="div" sx={{fontWeight: 600, color: '#4c4c4c'}}>
                                                        {cls.description}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                        Código: {cls.code}
                                                    </Typography>
                                                    <div style={{marginTop: '10px', display: 'inline-block', padding: '4px 12px', backgroundColor: '#e0f2f1', borderRadius: '16px', color: '#00695c', fontSize: '0.8rem', fontWeight: 600}}>
                                                        {cls.year} • {cls.semester}º Semestre
                                                    </div>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </>
                )}

                {/* === VIEW 2: DASHBOARD (SELECTED CLASS) === */}
                {selectedClass && (
                    <div className="fade-in">
                        <Button 
                            startIcon={<ArrowBackIcon />} 
                            onClick={handleBackToSelection}
                            sx={{ mb: 2, color: '#40A3A6', fontWeight: 600 }}
                        >
                            Voltar para Turmas
                        </Button>

                        <div className="professor-header">
                            <p className="primary-heading">Painel da Turma</p>
                            <h3 style={{ textAlign: 'center', color: '#666', marginTop: '0.5rem' }}>
                                {selectedClass.description}
                            </h3>
                        </div>

                        <div className="about-section-text-container">
                            <div className="professor-text-section border-red-color">
                                <p className="secondary-text">
                                    Abaixo estão os estudos disponíveis para esta turma. Os instrumentos utilizados foram o questionário de 
                                    estilos de aprendizagem de Honey-Alonso e o inventário das inteligências múltiplas de Armstrong.
                                </p>
                            </div>
                        </div>

                        <div className="professor-datatable-section">
                            <ExportCSV data={csvData} filename={`estudos_${selectedClass.code}.csv`}/>
                            <DataTable rows={filteredRows} />
                        </div>

                        <div data-tutorial="recommendation-group">
                            <div className="professor-text-section border-orange-color">
                                <p className="secondary-text">
                                    Acesse as recomendações personalizadas para sua turma e materiais de apoio:
                                </p>
                            </div >
                            <div data-tutorial="materiais-de-apoio">
                                <RecommendationGroup 
                                    navigate={navigate}
                                    // Custom handler to include the Class ID in the URL
                                    onCardClick={(recId) => {
                                        if (recId === 3) {
                                            // Support Materials (No class ID needed)
                                            navigate(`/recommendation/${recId}`);
                                        } else {
                                            // Products (1) and Methodologies (2) NEED Class ID
                                            navigate(`/recommendation/${recId}/class/${selectedClass.id}`);
                                        }
                                    }}
                                    recommendations={[
                                        {
                                            id: 1,
                                            title: 'Produtos Educacionais',
                                            color: 'ligth-blue-color',
                                            background: 'bg-ligth-blue',
                                            icon: <ImportantDevicesIcon />,
                                        },
                                        {
                                            id: 2,
                                            title: 'Metodologias de Ensino',
                                            color: 'primary-color',
                                            background: 'bg-primary-color',
                                            icon: <ExtensionIcon />,
                                        },
                                        {
                                            id: 3,
                                            title: 'Materiais de Apoio',
                                            color: 'red-color',
                                            background: 'bg-red',
                                            icon: <MenuBookIcon />,
                                        }
                                    ]}
                                />   
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Tutorial & Help Buttons */}
            <TutorialGuide 
                steps={getTutorialSteps()}
                isOpen={showTutorial}
                onClose={() => setShowTutorial(false)}
                onComplete={() => setShowTutorial(false)}
                currentStep={currentTutorialStep}
                onStepChange={setCurrentTutorialStep}
            />
            
            {!isMobile ? (
                <div className="help-button-wrapper">
                    <HelpButton onClick={() => setShowTutorial(true)} className="visible-help-button" />
                </div>
            ) : (
                <MobileHelpButton onClick={() => setShowTutorial(true)} />
            )}
        </div>
    );
}

export default Professor;