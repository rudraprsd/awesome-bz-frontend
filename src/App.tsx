import { useState, useEffect } from 'react';
import BZForm from './components/BZForm';
import BZVisualizer from './components/BZVisualizer';
import { generatePlot, checkHealth } from './api/api';
import type { BZRequest } from './api/api';

function App() {
  const [plotData, setPlotData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApiHealthy, setIsApiHealthy] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkApi = async () => {
      try {
        await checkHealth();
        setIsApiHealthy(true);
      } catch (error) {
        console.error('API Health Check Failed:', error);
        setIsApiHealthy(false);
      }
    };
    checkApi();
  }, []);

  const handleGenerate = async (data: BZRequest) => {
    setIsLoading(true);
    setError(null);
    console.log('Sending request to API:', data);
    try {
      const result = await generatePlot(data);
      console.log('API Response:', result);
      if (!result || !result.data || !result.layout) {
        console.error('Invalid API response structure:', result);
        throw new Error('API returned invalid plot data structure');
      }
      setPlotData(result);
    } catch (err: any) {
      console.error('Error generating plot:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to generate plot. Please check your input and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">Awesome BZ</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Brillouin Zone Visualizer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isApiHealthy === true ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                isApiHealthy === false ? 'bg-rose-50 text-rose-700 border border-rose-100' : 
                'bg-slate-50 text-slate-500 border border-slate-100'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  isApiHealthy === true ? 'bg-emerald-500 animate-pulse' : 
                  isApiHealthy === false ? 'bg-rose-500' : 
                  'bg-slate-300'
                }`}></span>
                {isApiHealthy === true ? 'API Online' : isApiHealthy === false ? 'API Offline' : 'Checking API...'}
              </div>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="sticky top-24">
              <BZForm onSubmit={handleGenerate} isLoading={isLoading} />
              
              {error && (
                <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm flex gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[700px] flex flex-col">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Interactive Visualization
                </h2>
                {plotData && (
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    Use mouse to rotate • Scroll to zoom
                  </div>
                )}
              </div>
              
              <div className="flex-1 relative">
                {!plotData && !isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-slate-600 mb-2">No Visualization Generated</h3>
                    <p className="max-w-xs text-sm">Configure your lattice vectors and k-points on the left, then click "Generate Visualization" to see the Brillouin Zone.</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <p className="mt-4 text-indigo-600 font-medium animate-pulse">Calculating Brillouin Zone...</p>
                  </div>
                )}

                <BZVisualizer plotData={plotData} />
                
                {import.meta.env.DEV && plotData && (
                  <details className="absolute bottom-4 right-4 z-20 bg-white/90 p-2 rounded border text-[10px] max-w-xs max-h-40 overflow-auto">
                    <summary className="cursor-pointer font-bold">Debug: API Response</summary>
                    <pre>{JSON.stringify(plotData, null, 2)}</pre>
                  </details>
                )}
              </div>
            </div>
            
            {/* Footer Info */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">What is this?</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This tool visualizes the First Brillouin Zone of a crystal lattice. It calculates the Wigner-Seitz cell in reciprocal space and highlights high-symmetry points and paths.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">How to use</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter your lattice vectors as a 3x3 matrix. Define high-symmetry points in fractional coordinates. Specify the path you want to visualize.
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Export</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  You can download the generated plot as a PNG or SVG using the camera icon in the visualization toolbar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
