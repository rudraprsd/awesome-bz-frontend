import React, { useState } from 'react';
import type { ErrorInfo } from 'react';
// @ts-ignore
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

interface BZVisualizerProps {
    plotData: any;
}

class PlotErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Plotly Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-rose-600">
                    <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-bold">Visualization Crash</h3>
                    <p className="text-sm opacity-80">Plotly encountered an error while rendering this data.</p>
                    <button 
                        onClick={() => this.setState({ hasError: false })}
                        className="mt-4 px-4 py-2 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors text-xs font-bold"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

const BZVisualizer: React.FC<BZVisualizerProps> = ({ plotData }) => {
    const [graphDiv, setGraphDiv] = useState<any>(null);

    if (!plotData) {
        return null;
    }

    const handleDownload = (format: 'png' | 'svg') => {
        if (graphDiv) {
            Plotly.downloadImage(graphDiv, {
                format,
                filename: `brillouin_zone_${new Date().getTime()}`,
                height: 1200,
                width: 1200,
                scale: 2
            });
        }
    };

    if (!plotData.data || !plotData.layout) {
        return (
            <div className="flex items-center justify-center h-full text-rose-500 p-8 text-center">
                <div>
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="font-semibold">Invalid Plot Data</p>
                    <p className="text-sm opacity-80">The API response is missing required Plotly fields.</p>
                </div>
            </div>
        );
    }

    return (
        <PlotErrorBoundary>
            <div className="w-full h-full min-h-[700px] relative group flex flex-col">
                {/* Custom Export Controls - Permanent */}
                <div className="absolute bottom-6 right-6 z-30 flex gap-2 transition-all duration-300">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownload('png');
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-xl shadow-xl shadow-indigo-200/30 border border-indigo-100 rounded-xl text-xs font-bold text-slate-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-600 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-300/40 active:translate-y-0 ring-1 ring-slate-200/50"
                        title="Download as PNG"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        PNG
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDownload('svg');
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/95 backdrop-blur-xl shadow-xl shadow-indigo-200/30 border border-indigo-100 rounded-xl text-xs font-bold text-slate-700 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-indigo-600 transition-all transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-300/40 active:translate-y-0 ring-1 ring-slate-200/50"
                        title="Download as SVG"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        SVG
                    </button>
                </div>

                <div className="flex-1 w-full h-full min-h-[700px]">
                    <Plot
                        data={plotData.data}
                        onInitialized={(_, div) => setGraphDiv(div)}
                        onUpdate={(_, div) => setGraphDiv(div)}
                        layout={{
                            ...plotData.layout,
                            autosize: true,
                            margin: { l: 0, r: 0, b: 0, t: 0 },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            scene: {
                                ...plotData.layout?.scene,
                                aspectmode: 'data',
                                xaxis: { ...(plotData.layout?.scene?.xaxis || {}), showbackground: false },
                                yaxis: { ...(plotData.layout?.scene?.yaxis || {}), showbackground: false },
                                zaxis: { ...(plotData.layout?.scene?.zaxis || {}), showbackground: false },
                            },
                            legend: {
                                x: 0,
                                y: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.5)',
                                ...(plotData.layout?.legend || {})
                            }
                        }}
                        useResizeHandler={true}
                        className="w-full h-full"
                        style={{ width: '100%', height: '100%', minHeight: '700px' }}
                        config={{ 
                            responsive: true,
                            displaylogo: false,
                            toImageButtonOptions: {
                                format: 'png',
                                filename: 'brillouin_zone',
                                height: 1200,
                                width: 1200,
                                scale: 2
                            }
                        }}
                    />
                </div>
            </div>
        </PlotErrorBoundary>
    );
};

export default BZVisualizer;
