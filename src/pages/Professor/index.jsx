// Professor.jsx

import React, { useEffect, useState } from "react";
import "./styles.css";
import config from "../../services/config";
import useFetch from "../../hooks/useFetch";
import DataTable from "./DataTable";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import { useNavigate } from "react-router-dom";
import RecommendationGroup from "../../components/RecommendationGroup";
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import ExtensionIcon from '@mui/icons-material/Extension';
import ExportCSV from "../../components/ExportCSV";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Skeleton from '@mui/material/Skeleton';
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";

const Professor = () => {
    const { fetchEntryPoint } = useFetch();
    const [availableClassroomStudy, setAvailableClassroomStudy] = useState(null);
    const [studiesAnswered, setStudiesAnswered] = useState(null);
    const [classDescription, setClassDescription] = useState("");
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para controlar a exibição e navegação do tutorial
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

    const navigate = useNavigate();
    const isMobile = useIsMobile();

    const createData = (id, year, semester, sclass, study, totalStudents, totalAnswers, relatory) => {
        return { id, year, semester, sclass, study, totalAnswers, totalStudents, relatory };
    }

    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            try {
                const { role } = JSON.parse(localStorage.getItem(config.tokenName));
                const studies = await fetchEntryPoint(role, controller);

                setClassDescription(studies[0].sclass.description);
                setStudiesAnswered(studies.map((studie) => 
                    studie.total_answered > 0 ? true : false
                ));

                const newRows = studies.map((classStudy, index) => 
                    createData(
                        index,
                        classStudy.sclass.year, 
                        classStudy.sclass.semester,
                        classStudy.sclass.description, 
                        classStudy.study.description,
                        classStudy.total_students,
                        classStudy.total_answered,
                        { classId: classStudy.sclass.id, studyId: classStudy.study.id }
                    )
                );
                setAvailableClassroomStudy(newRows);

                let newCsvData = [];
                newRows.map((row) => (
                    newCsvData.push(
                        { 
                            ano: row.year, 
                            semestre: row.semester,
                            turma: row.sclass,
                            estudo: row.study,
                            respostas: `${row.totalAnswers}/${row.totalStudents}`,
                        }
                    )
                ));
                setCsvData(newCsvData);

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
    
    /**
     * Define os passos do tutorial com base no estado atual do componente
     * Cada passo contém um seletor CSS para o elemento alvo, um título e uma descrição
     */
    const getTutorialSteps = () => {
        const steps = [
            {
                targetSelector: '.professor-header',
                title: 'Bem-vindo ao SIREEDU',
                description: 'Esta é sua página inicial como professor, onde você terá acesso aos resultados dos estudos de suas turmas e poderá acompanhar o progresso dos alunos.'
            },
            {
                targetSelector: '.about-section-text-container',
                title: 'Informações da Turma',
                description: 'Aqui você encontra informações sobre o levantamento do perfil cognitivo da sua turma, baseado nos questionários respondidos pelos alunos.'
            },
            {
                targetSelector: '.about-section-text-container',
                title: 'Estudos Disponíveis',
                description: 'Esta página mostra os estudos disponíveis para sua turma, o número total de alunos e quantos já responderam cada questionário. Você pode exportar estes dados em formato CSV para análise externa.'
            }
        ];
        
        // Adiciona um passo específico para as recomendações apenas se ambos os estudos tiverem respostas
        if (studiesAnswered && studiesAnswered[0] && studiesAnswered[1]) {
            steps.push({
                targetSelector: '[data-tutorial="materiais-de-apoio"]',
                title: 'Recomendações para Ensino',
                description: 'Com base nos resultados dos estudos, você tem acesso a recomendações de "Produtos Educacionais", "Metodologias de Ensino" e "Materiais de Apoio" adaptados ao perfil de aprendizagem específico da sua turma. Clique em Produtos Educacionais para ver as recomendações.'
            });
        } else if (studiesAnswered) {
            steps.push({
                targetSelector: '[data-tutorial="materiais-de-apoio"]',
                title: 'Materiais de Apoio',
                description: 'Aqui você encontra materiais de apoio que podem auxiliar no processo de ensino. Para ter acesso às recomendações completas, incentive seus alunos a responderem todos os questionários disponíveis.'
            });
        }
        
        return steps;
    };
    
    /**
     * Manipulador para fechar o tutorial
     */
    const handleTutorialClose = () => {
        setShowTutorial(false);
    };
    
    /**
     * Manipulador para quando o tutorial é concluído
     * Marca no localStorage que o tutorial já foi visto
     */
    const handleTutorialComplete = () => {
        localStorage.setItem('tutorial_professor_seen', 'true');
        setShowTutorial(false);
    };
    
    /**
     * Manipulador para abrir o tutorial manualmente através do botão de ajuda
     */
    const handleOpenTutorial = () => {
        setCurrentTutorialStep(0); // Reinicia o tutorial do primeiro passo
        setShowTutorial(true);
    };
    
    /**
     * Manipulador para mudança de passo no tutorial
     */
    const handleStepChange = (stepIndex) => {
        setCurrentTutorialStep(stepIndex);
    };
    
    return (
        <div className="professor">
            <PageTitleUpdater title={"Início"} />
            <div className="professor-container">
                <div className="professor-header">
                    <p className="primary-heading">Estudos Disponíveis</p>
                </div>
                <div className="about-section-text-container">
                    <div className="professor-text-section border-red-color fade-in">
                        <p className="secondary-text">
                            Apresentamos o resultado do levantamento do perfil 
                            cognitivo da sua turma de <span style={{ textTransform: 'capitalize' }}>{ classDescription }</span>. 
                            Os instrumentos utilizados foram o questionário de estilos de aprendizagem de Honey-Alonso e o 
                            inventário das inteligências múltiplas de Armstrong.
                        </p>
                    </div>
                </div>
                <div className="professor-datatable-section">
                {availableClassroomStudy && !loading ? (
                    <div >
                        <ExportCSV data={csvData} filename="estudos.csv"/>
                        <DataTable rows={availableClassroomStudy} data-tutorial="data-table"/>
                    </div>
                ) : (
                    <Skeleton
                        variant="rectangular"
                        height={230}
                        style={{ borderRadius: 5 }}
                    />
                )}
                </div>
                <div data-tutorial="recommendation-group">
                    <div className="professor-text-section border-orange-color fade-in">
                        <p className="secondary-text">
                            Mais informações sobre os estudos disponíveis nos links abaixo:
                        </p>
                    </div >
                    <div data-tutorial="materiais-de-apoio">
                        <RecommendationGroup data-tutorial="materiais-de-apoio"
                            recommendations={
                                [
                                    {
                                        id: 3,
                                        title: 'Materiais de Apoio',
                                        color: 'red-color',
                                        background: 'bg-red',
                                        icon: <MenuBookIcon />,
                                    }
                                ]
                            }
                            navigate={navigate}
                        />   
                    </div>
                </div>
            </div>
            
            {/* Componente de Tutorial - Exibido apenas quando showTutorial for true */}
            <TutorialGuide 
                steps={getTutorialSteps()}
                isOpen={showTutorial}
                onClose={handleTutorialClose}
                onComplete={handleTutorialComplete}
                currentStep={currentTutorialStep}
                onStepChange={handleStepChange}
            />
            
            {/* Botão de Ajuda - Sempre visível no canto da tela */}
            {!isMobile ? (
            <div className="help-button-wrapper">
                <HelpButton
                    onClick={handleOpenTutorial}
                    className="visible-help-button"
                />
            </div>
            ) : (
            <MobileHelpButton onClick={handleOpenTutorial} />
            )}
        </div>
    );
}

export default Professor;