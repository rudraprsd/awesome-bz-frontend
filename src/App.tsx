import { useState, useEffect } from 'react';
import BZForm from './components/BZForm';
import BZVisualizer from './components/BZVisualizer';
import { generatePlot, checkHealth } from './api/api';
import type { BZRequest } from './api/api';

function App() {
  const [plotData, setPlotData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        await checkHealth();
        setIsApiHealthy(true);
      } catch (error) {
        setIsApiHealthy(false);
      }
    };
    checkApi();
  }, []);

  const handleGenerate = async (data: BZRequest) => {
    setIsLoading(true);
    try {
      const result = await generatePlot(data);
      setPlotData(result);
    } catch (error) {
      console.error('Error generating plot:', error);
      alert('Failed to generate plot. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Brillouin Zone Visualizer
          </h1>
          <div className="flex items-center">
            <span className={`inline-block h-3 w-3 rounded-full mr-2 ${isApiHealthy === true ? 'bg-green-500' : isApiHealthy === false ? 'bg-red-500' : 'bg-gray-400'}`}></span>
            <span className="text-sm text-gray-500">
              API Status: {isApiHealthy === true ? 'Online' : isApiHealthy === false ? 'Offline' : 'Checking...'}
            </span>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <BZForm onSubmit={handleGenerate} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-2">
                <BZVisualizer plotData={plotData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
