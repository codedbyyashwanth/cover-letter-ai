import React from 'react';
import PdfExtractor from './components/PdfExtractor';


const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <PdfExtractor />
        </div>
    );
};

export default App;