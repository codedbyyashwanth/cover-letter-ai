import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import PdfUploadTab from './components/PdfUploadTab';
import JobDescriptionTab from './components/JobDescriptionTab';
import ResultsTab from './components/ResultsTab';
import { PDFExtractResult } from './types/pdf';

const App = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [pdfResult, setPdfResult] = useState<PDFExtractResult>({
    text: "",
    pageCount: 0,
    isLoading: false
  });
  const [jobDescription, setJobDescription] = useState("");
  
  const handlePdfProcessed = (result: PDFExtractResult) => {
    setPdfResult(result);
    if (result.text && !result.error) {
      setActiveTab("description");
    }
  };
  
  const handleJobDescriptionSubmit = (description: string) => {
    setJobDescription(description);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Cover Letter Generator</h1>
        
        {/* Progress Steps */}
        <div className="relative mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${activeTab === "upload" || activeTab === "description" || activeTab === "results" ? "bg-green-500" : "bg-gray-200"} text-white font-bold`}>
              1
            </div>
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${activeTab === "description" || activeTab === "results" ? "bg-green-500" : "bg-gray-200"} text-white font-bold`}>
              2
            </div>
            <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full ${activeTab === "results" ? "bg-green-500" : "bg-gray-200"} text-white font-bold`}>
              3
            </div>
          </div>
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-0">
            <div 
              className="h-full bg-green-500 transition-all duration-300" 
              style={{ 
                width: activeTab === "upload" ? "0%" : activeTab === "description" ? "50%" : "100%" 
              }}
            ></div>
          </div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="hidden">
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="description">Job Description</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <PdfUploadTab onPdfProcessed={handlePdfProcessed} />
          </TabsContent>
          
          <TabsContent value="description">
            <JobDescriptionTab onSubmit={handleJobDescriptionSubmit} />
          </TabsContent>
          
          <TabsContent value="results">
            <ResultsTab resumeText={pdfResult.text} jobDescription={jobDescription} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default App;