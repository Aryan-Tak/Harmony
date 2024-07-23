import React, { useEffect, useState } from 'react';
import { useNavigate , useSearchParams } from 'react-router-dom';
import OnboardingForm from '../components/OnBoardingForm';
import UseAuth from '../components/UseAuth';
import axios from 'axios';
import Login from '../components/Login';

function OnBoarding() {
    return <OnboardingForm />;
}

export default OnBoarding;
