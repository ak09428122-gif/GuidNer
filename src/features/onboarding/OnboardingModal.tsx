import React from 'react';
import { OnboardingWizard } from './OnboardingWizard';
import { UserProfile } from '../../core/database/schema';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updatedProfile: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = (props) => {
  return <OnboardingWizard {...props} />;
};

export { OnboardingWizard };
