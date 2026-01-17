import api from "../services/api";
import config from "../services/config";
import handleError from "./handleError";

const useForm = () => {

    const requestPasswordReset = async (email) => {
        try {
            const clientViewUrl = "/password-request-confirmation";
            const response = await api.post(config.passwordResetRequestUrl, {
                email,
                clientViewUrl,
            });

            const { status } = response.data;
            if (status === "OK") {
                return { success: true };
            }

        } catch (error) {
            console.error("Error request password reset:", error);
            return { success: false, message: handleError(error) };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await api.post(config.passwordResetConfirmUrl, {
                token,
                password,
            });
            
            const { status } = response.data;
            if (status === "OK") {
                return { success: true };
            }
        
        } catch (error) {
            console.error("Error reset password:", error);
            return { success: false, message: handleError(error) };
        }
    };

    const signUp = async (signUpObj) => {
        try {
            const response = await api.post(config.student.signupUrl, signUpObj);
            const { status } = response;
            
            if (status === 201) { //created
                return { success: true }
            }
        } catch (error) {
            console.error("Error signup:", error);
            return { success: false, message: handleError(error) };
        }
    };

    const processAnswer = async (studyId, answers) => {
        try {
            const payload = {'answers': answers};
            const url = `/survey/study/${studyId}/process`;
            const response = await api.post(url, payload, {'studyId': studyId});
            const { status } = response;
            if (status === 200) {
                return { success: true };
            }
        } catch (error) {
            console.error("Error process answer:", error);
            return { success: false, message: handleError(error) };
        }
    };

    const registerRecommendation = async (productId) => {
        try {
            const { data } = await api.post(config.products.recommendationToStudent, {
                'product_id': productId,
            });
            return { success: true, data: data };
        } catch (error) {
            console.error('Error posting register recommendation:', error);
            return { success: false, message: handleError(error) };
        }
    };

    const registerRating = async (productId, ratingValue) => {
        try {
            const { data } = await api.post(config.products.ratingRegister, {
                'product_id': productId,
                'rating': ratingValue,
            });
            console.log('Rating response:', data);
            return { success: true, data: data };
        } catch (error) {
            console.error('Error posting register rating:', error);
            return { success: false, message: handleError(error) };
        }
    };

    const registerFavorite = async (productId) => {
        try {
            const { data } = await api.post(config.products.favoriteRegister, {
                'product_id': productId,
            });
            return { success: true, data: data };
        } catch (error) {
            console.error('Error posting register favorite:', error);
            return { success: false, message: handleError(error) };
        }
    }

    return {
        requestPasswordReset,
        resetPassword,
        signUp,
        processAnswer,
        registerRecommendation,
        registerRating,
        registerFavorite,
    }

};

export default useForm;