import api from "../services/api";

const useFetch = () => {

    const fetchEmailVerification = async (token, controller) => {
        try {
            const url = `survey/student-view/email-verification/verify/${token}`;
            const response = await api.get(url, { signal: controller.signal });
            return { status: response.status }
        } catch (error) {
            console.log('Error fetching email verification:', error);
            throw error;
        }
    };

    const fetchAnswers = async (studyId, controller) => {
        try {
            const url = `/survey/study/${studyId}/answer`;
            const response = await api.get(url, { signal: controller.signal });
            return { data: response.data };
        } catch (error) {
            console.error("Error fetching answers:", error);
            throw error;
        }   
    }; 

    const fetchResult = async (studyId, controller) => {
        try {
            const url = `/survey/study/${studyId}/report`;
            const response = await api.get(url, { signal: controller.signal });
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Error fetching result:", error);
            throw error;
        }
    };

    const fetchEntryPoint = async (role, controller) => {
        try {
            const { data: switcherUrl } = await api.get(`/survey/switcher/role/${role}`);
            const { data: availableStudies } = await api.get(switcherUrl, { signal: controller.signal });
            return availableStudies;
        } catch (error) {
            console.error("Error fetching entry point or studies:", error);
            throw error;
        }
    };

    const fetchSyntheticReport = async (classId, studyId, controller) => {
        try {
            const { data } = await api.get(
                `/survey/class/${classId}/study/${studyId}/synthetic-report`,
                { signal: controller.signal }
            );
            return data;
        } catch (error) {
            console.error("Error fetching synthetic report:", error);
            throw error;
        }
    };

    const fetchAnalyticalReport = async (classId, studyId, controller) => {
        try {
            const { data } = await api.get(
                `/survey/class/${classId}/study/${studyId}/analytical-report`,
                { signal: controller.signal }
            );
            return data;
        } catch(error) {
            console.error("Error fetching synthetic report:", error);
            throw error;
        }
    };

    return {
        fetchEmailVerification,
        fetchAnswers,
        fetchResult,
        fetchEntryPoint,
        fetchSyntheticReport,
        fetchAnalyticalReport
    };

};

export default useFetch;