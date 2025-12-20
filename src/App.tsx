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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 ring-2 ring-indigo-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-transparent">Awesome BZ</h1>
                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Brillouin Zone Visualizer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                isApiHealthy === true ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                isApiHealthy === false ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                'bg-slate-50 text-slate-500 border border-slate-200'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  isApiHealthy === true ? 'bg-emerald-500 animate-pulse' : 
                  isApiHealthy === false ? 'bg-rose-500' : 
                  'bg-slate-300'
                }`}></span>
                {isApiHealthy === true ? 'API Online' : isApiHealthy === false ? 'API Offline' : 'Checking API...'}
              </div>
              <a href="https://github.com/rudraprsd/awesome-bz" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-all duration-200 transform hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">
        <BZForm 
          onSubmit={handleGenerate} 
          isLoading={isLoading} 
          error={error}
          visualizer={
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-indigo-100/20 border border-white/60 overflow-hidden min-h-[700px] flex flex-col relative group h-full ring-1 ring-slate-200/50">
              <div className="px-6 py-4 border-b border-slate-100/50 flex justify-between items-center bg-gradient-to-r from-slate-50/80 to-indigo-50/40">
                <h2 className="text-sm font-semibold bg-gradient-to-r from-slate-700 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
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
              
              <div className="flex-1 relative w-full h-full min-h-[600px]">
                {!plotData && !isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-12 text-center animate-fadeIn">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100/50 ring-1 ring-indigo-100">
                      <svg className="w-12 h-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-slate-700 to-indigo-600 bg-clip-text text-transparent mb-3">Ready to Visualize</h3>
                    <p className="max-w-sm text-sm text-slate-500 leading-relaxed">Configure your crystal structure and visual settings, then click the Generate button to create your 3D Brillouin Zone visualization.</p>
                  </div>
                )}
                
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white/95 to-indigo-50/30 backdrop-blur-xl z-10 animate-fadeIn">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-xl shadow-indigo-200/50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">Generating Visualization</p>
                      <p className="text-sm text-slate-500">Please wait while we compute your Brillouin Zone...</p>
                    </div>
                  </div>
                )}

                <div className="w-full h-full min-h-[600px]">
                  <BZVisualizer plotData={plotData} />
                </div>
              </div>
            </div>
          }
        />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 border-t border-slate-200/50 mt-12 py-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-200/50">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <span className="font-bold bg-gradient-to-r from-slate-900 to-indigo-700 bg-clip-text text-transparent">Awesome BZ</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                A modern, interactive tool for visualizing First Brillouin Zones and K-paths in reciprocal space. Built for researchers and students in condensed matter physics.
              </p>
              <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Awesome BZ. All rights reserved.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Learning Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://en.wikipedia.org/wiki/Brillouin_zone" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Brillouin Zone (Wikipedia)
                  </a>
                </li>
                <li>
                  <a href="https://en.wikipedia.org/wiki/Reciprocal_lattice" target="_blank" rel="noreferrer" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Reciprocal Lattice
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Credits</h4>
              <p className="text-sm text-slate-600">
                Made with <span className="text-rose-500 animate-pulse">❤️</span> by <a href="https://rudraprsd.github.io/" target="_blank" rel="noreferrer" className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">Rudra Prasad Sahu</a>
              </p>
              <div className="flex gap-3 pt-2">
                <a href="https://rudraprsd.github.io/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-all transform hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
