import { FileText, Briefcase, FileOutput } from 'lucide-react';

interface ProgressStepsProps {
    currentStep: number;
    steps: string[];
}

const ProgressSteps = ({ currentStep, steps }: ProgressStepsProps) => {
    const icons = [
        <FileText key="file" className="w-5 h-5" />,
        <Briefcase key="briefcase" className="w-5 h-5" />,
        <FileOutput key="output" className="w-5 h-5" />
    ];

    return (
        <div className="w-full mb-8">
        <div className="relative flex items-center justify-between">
            {/* Progress Line */}
            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2" />
            
            {/* Completed Line */}
            <div 
            className="absolute left-0 top-1/2 h-1 bg-green-500 -z-5 transform -translate-y-1/2 transition-all duration-300"
            style={{ width: `${(currentStep - 1) * 50}%` }}
            />
            
            {/* Steps */}
            {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
                <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index < currentStep 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : index === currentStep 
                        ? 'bg-white border-green-500 text-green-500' 
                        : 'bg-white border-gray-300 text-gray-400'
                } transition-colors z-10`}
                >
                {icons[index]}
                </div>
                <span 
                className={`mt-2 text-xs font-medium ${
                    index <= currentStep ? 'text-green-500' : 'text-gray-500'
                }`}
                >
                {step}
                </span>
            </div>
            ))}
        </div>
        </div>
    );
};

export default ProgressSteps;