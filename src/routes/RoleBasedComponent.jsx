import React from "react";
import { Navigate } from "react-router-dom";
import Student from "../pages/Student";
import Professor from "../pages/Professor";
import RevisorDashboard from "../pages/RevisorDashboard"; // Importe a nova tela
import config from "../services/config";

const RoleBasedComponent = () => {
    const { role } = JSON.parse(localStorage.getItem(config.tokenName)) || {};

    if (role) {
        if (role === "Student") {
            return <Student />
        } else if (role === "Professor") {
            return <Professor />
        } else if (role === "Revisor") {
            return <RevisorDashboard />
        }
    }
    return <Navigate to="/login/" />

};

export default RoleBasedComponent;