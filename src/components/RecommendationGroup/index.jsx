import React from "react";
import "./styles.css";

const RecommendationGroup = ({ recommendations, navigate }) => {
    const handleClick = (recommendationId) => {
        navigate(`/recommendation/${recommendationId}`)
    }

    return (
        <div className="recommendation-group-container">
            {recommendations?.map((recommendation) => (
                <div key={recommendation.id} className="recommendation-group-area">
                    <div className={`recommendation-group-area-content ${recommendation.background}`} onClick={() => handleClick(recommendation.id)}>
                        <div className={`recommendation-group-icon ${recommendation.color}`}>
                            { recommendation.icon }
                        </div>
                        <div className={`recommendation-group-description ${recommendation.background}`}>
                            <span>{ recommendation.title }</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecommendationGroup;