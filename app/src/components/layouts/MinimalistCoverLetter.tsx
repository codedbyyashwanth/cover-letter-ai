
const MinimalistCoverLetter = () => {
    return (
        <div className="flex justify-center bg-gray-100 p-4">
            <div className="bg-white w-full max-w-2xl shadow-md mx-auto p-8 h-[1056px] relative">
                {/* Header */}
                <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Your Name</h1>
                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                    <span>youremail@example.com</span>
                    <span>•</span>
                    <span>(555) 123-4567</span>
                    <span>•</span>
                    <span>City, State</span>
                    <span>•</span>
                    <span>LinkedIn Profile</span>
                </div>
                </div>
                
                {/* Date */}
                <div className="mb-6 text-gray-700">
                <p>May 9, 2025</p>
                </div>
                
                {/* Recipient */}
                <div className="mb-6 text-gray-700">
                <p>Hiring Manager</p>
                <p>Company Name</p>
                <p>City, State Zip</p>
                </div>
                
                {/* Greeting */}
                <div className="mb-4">
                <p className="text-gray-800">Dear Hiring Manager,</p>
                </div>
                
                {/* Body */}
                <div className="space-y-4 text-gray-700">
                <p>
                    I am writing to express my interest in the [Position] role at [Company Name]. With my background in [relevant field] and experience in [specific skills], I believe I would be a valuable addition to your team.
                </p>
                <p>
                    During my time at [Previous Company], I successfully [accomplishment with metrics if possible]. This experience has equipped me with the skills necessary to excel in the [Position] role at your company. I am particularly drawn to [Company Name] because of [specific reason such as company values, projects, or reputation].
                </p>
                <p>
                    My key strengths include:
                </p>
                <ul className="list-disc pl-8 space-y-1">
                    <li>Strong [skill 1] with proven results in [brief example]</li>
                    <li>Experience with [skill 2] that resulted in [outcome]</li>
                    <li>Excellent [skill 3] demonstrated by [brief example]</li>
                </ul>
                <p>
                    I am excited about the opportunity to bring my unique skills and experiences to [Company Name]. I am confident that my background in [relevant field] and passion for [industry/field] make me an ideal candidate for this position.
                </p>
                <p>
                    Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team.
                </p>
                </div>
                
                {/* Closing */}
                <div className="mt-6 text-gray-800">
                <p>Sincerely,</p>
                <p className="mt-4">Your Name</p>
                </div>
                
                {/* Footer */}
                <div className="absolute bottom-8 w-full pr-16 border-t border-gray-200 pt-3">
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Your Name • Cover Letter</span>
                    <span>Page 1 of 1</span>
                </div>
                </div>
            </div>
        </div>
    );
};

export default MinimalistCoverLetter;