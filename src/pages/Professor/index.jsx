import React, { useEffect, useState } from "react";
import "./styles.css";
import config from "../../services/config";
import useFetch from "../../hooks/useFetch";
import DataTable from "./DataTable";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import { useNavigate, useSearchParams } from "react-router-dom";
import RecommendationGroup from "../../components/RecommendationGroup";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Skeleton from '@mui/material/Skeleton';
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import ExportCSV from "../../components/ExportCSV";
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import ExtensionIcon from '@mui/icons-material/Extension';
import Pagination from '@mui/material/Pagination';

// IMPORT THE NEW CARD
import ClassCard from "./ClassCard";

const Professor = () => {
    const { fetchEntryPoint } = useFetch();
    
    // --- STATE MANAGEMENT ---
    const [availableClassroomStudy, setAvailableClassroomStudy] = useState([]); 
    const [uniqueClasses, setUniqueClasses] = useState([]); 
    const [selectedClass, setSelectedClass] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Tutorial
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

    // Pagination
    const [page, setPage] = useState(1);
    const CLASSES_PER_PAGE = 4;

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const isMobile = useIsMobile();

    const createData = (id, year, semester, sclass, study, totalStudents, totalAnswers, relatory, classId) => {
        return { id, year, semester, sclass, study, totalAnswers, totalStudents, relatory, classId };
    }

    // --- FETCH DATA ---
    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            try {
                const { role } = JSON.parse(localStorage.getItem(config.tokenName));
                const studies = await fetchEntryPoint(role, controller);

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
                        classStudy.sclass.id 
                    )
                );
                setAvailableClassroomStudy(newRows);

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
                const classesArray = Array.from(classesMap.values());
                setUniqueClasses(classesArray);

                // Restore selection from URL
                const classIdFromUrl = searchParams.get("classId");
                if (classIdFromUrl) {
                    const foundClass = classesArray.find(c => c.id.toString() === classIdFromUrl);
                    if (foundClass) {
                        setSelectedClass(foundClass);
                    }
                }

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
    const handleClassSelect = (classItem) => {
        setSelectedClass(classItem);
        setSearchParams({ classId: classItem.id }); 
        window.scrollTo(0, 0); 
    };

    const handleBackToSelection = () => {
        setSelectedClass(null);
        setSearchParams({}); 
        setPage(1);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    // --- PAGINATION LOGIC ---
    const pageCount = Math.ceil(uniqueClasses.length / CLASSES_PER_PAGE);
    const displayedClasses = uniqueClasses.slice(
        (page - 1) * CLASSES_PER_PAGE,
        page * CLASSES_PER_PAGE
    );

    const filteredRows = selectedClass 
        ? availableClassroomStudy.filter(row => row.classId === selectedClass.id)
        : [];

    const csvData = filteredRows.map((row) => ({
        ano: row.year, 
        semestre: row.semester,
        turma: row.sclass,
        estudo: row.study,
        respostas: `${row.totalAnswers}/${row.totalStudents}`,
    }));

    const getTutorialSteps = () => {
        if (!selectedClass) {
            return [
                { targetSelector: '.professor-header', title: 'Seleção de Turmas', description: 'Bem-vindo! Aqui você vê todas as suas turmas cadastradas.' },
                { targetSelector: '.class-card-container', title: 'Cartão da Turma', description: 'Clique em "Visualizar" para acessar os relatórios e recomendações específicos daquela turma.' }
            ];
        } else {
            return [
                { targetSelector: '.professor-header', title: 'Painel da Turma', description: 'Aqui você visualiza os dados detalhados da turma selecionada.' },
                { targetSelector: '.professor-datatable-section', title: 'Relatórios', description: 'Acesse os relatórios Sintético e Analítico para ver o perfil dos alunos.' },
                { targetSelector: '[data-tutorial="materiais-de-apoio"]', title: 'Recomendações', description: 'Com base nos resultados, o sistema gera recomendações de materiais e metodologias.' }
            ];
        }
    };

    return (
        <div className="professor">
            <PageTitleUpdater title={"Início"} />
            <div className="professor-container">
                
                {!selectedClass && (
                    <>
                        <div className="professor-header">
                            <p className="primary-heading">Minhas Turmas</p>
                            <p className="secondary-text">Selecione uma turma para visualizar os relatórios e recomendações.</p>
                        </div>

                        {loading ? (
                            <Skeleton variant="rectangular" height={200} sx={{mt: 2, borderRadius: 2}} />
                        ) : (
                            <>
                                <div style={{ 
                                    display: 'grid',
                                    gridTemplateColumns: displayedClasses.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                                    gap: '24px', 
                                    maxWidth: displayedClasses.length === 1 ? '400px' : '1000px',
                                    margin: '2rem auto 0',
                                    padding: '0 20px',
                                    justifyItems: 'center'
                                }}>
                                    {displayedClasses.map((cls) => (
                                        <ClassCard 
                                            key={cls.id}
                                            description={cls.description}
                                            code={cls.code}
                                            year={cls.year}
                                            semester={cls.semester}
                                            onClick={() => handleClassSelect(cls)}
                                        />
                                    ))}
                                </div>
                                
                                {pageCount > 1 && (
                                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                                        <Pagination 
                                            count={pageCount} 
                                            page={page} 
                                            onChange={handlePageChange} 
                                            color="primary" 
                                            size="large"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

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
                                {selectedClass.description} ({selectedClass.code})
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
                                    onCardClick={(recId) => {
                                        if (recId === 3) {
                                            navigate(`/recommendation/${recId}`);
                                        } else {
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