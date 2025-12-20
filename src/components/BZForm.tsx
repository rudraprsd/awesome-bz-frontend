import React, { useState } from 'react';
import type { BZRequest, VisualizationConfig } from '../api/api';

interface BZFormProps {
    onSubmit: (data: BZRequest) => void;
    isLoading: boolean;
    visualizer: React.ReactNode;
    error: string | null;
}

const BZForm: React.FC<BZFormProps> = ({ onSubmit, isLoading, visualizer, error }) => {
    const [latticeVectors, setLatticeVectors] = useState<string>('[[0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]');
    const [kpoints, setKpoints] = useState<string>('{"GAMMA": [0, 0, 0], "X": [0.5, 0, 0.5], "L": [0.5, 0.5, 0.5], "W": [0.5, 0.25, 0.75], "K": [0.375, 0.375, 0.75]}');
    const [path, setPath] = useState<string>('["GAMMA", "X", "W", "L", "GAMMA", "K"]');
    const [config, setConfig] = useState<VisualizationConfig>({
        SHOW_FACES: true,
        FACE_COLOR: '#add8e6',
        FACE_OPACITY: 0.3,
        EDGE_COLOR: '#000000',
        EDGE_WIDTH: 3.0,
        SHOW_PATH: true,
        PATH_COLOR: '#ff0000',
        PATH_WIDTH: 5.0,
        SHOW_POINTS: true,
        POINT_COLOR: '#ff0000',
        POINT_SIZE: 6.0,
        TEXT_SIZE: 22.0,
        TEXT_OFFSET_FACTOR: 1.0,
        SHOW_AXES: true,
        AXES_FACTOR: 0.5,
        ORTHOGRAPHIC: true
    });

    const [activeTab, setActiveTab] = useState<'surfaces' | 'features' | 'scene'>('surfaces');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedLattice = JSON.parse(latticeVectors);
            const parsedKpoints = JSON.parse(kpoints);
            const parsedPath = JSON.parse(path);
            
            onSubmit({
                lattice_vectors: parsedLattice,
                kpoints: parsedKpoints,
                path: parsedPath,
                config
            });
        } catch (error) {
            alert('Invalid JSON format in Lattice Vectors, K-Points or Path');
        }
    };

    const updateConfig = (key: keyof VisualizationConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Column 1: Crystal Structure */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg shadow-indigo-100/20 border border-white/60 space-y-5 h-full min-h-[600px] ring-1 ring-slate-200/50">
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent border-b border-slate-100 pb-3">Crystal Structure</h3>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Lattice Vectors (3x3)</label>
                        <textarea
                            value={latticeVectors}
                            onChange={(e) => setLatticeVectors(e.target.value)}
                            className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 h-24 font-mono text-sm transition-all resize-none shadow-sm hover:shadow-md"
                            placeholder='[[0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">High Symmetry Points</label>
                        <textarea
                            value={kpoints}
                            onChange={(e) => setKpoints(e.target.value)}
                            className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 h-32 font-mono text-sm transition-all resize-none shadow-sm hover:shadow-md"
                            placeholder='{"GAMMA": [0,0,0], ...}'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">K-Path</label>
                        <input
                            type="text"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            className="w-full p-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono text-sm transition-all shadow-sm hover:shadow-md"
                            placeholder='["GAMMA", "X", ...]'
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-xl shadow-indigo-500/30 text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98] hover:shadow-2xl hover:shadow-indigo-500/40 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </span>
                        ) : 'Generate'}
                    </button>

                    {error && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-red-50/50 border border-rose-200 rounded-xl text-rose-700 text-xs flex gap-3 backdrop-blur-sm shadow-sm animate-fadeIn">
                            <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="leading-relaxed">{error}</p>
                        </div>
                    )}
                </div>

                {/* Column 2: Visualization Settings */}
                <div className="lg:col-span-3 bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow-lg shadow-indigo-100/20 border border-white/60 space-y-4 h-full min-h-[600px] flex flex-col ring-1 ring-slate-200/50">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent">Visual Settings</h3>
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex p-1 bg-gradient-to-r from-slate-100 to-indigo-100/50 rounded-xl shadow-inner">
                        <button
                            type="button"
                            onClick={() => setActiveTab('surfaces')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'surfaces' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Surfaces
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('features')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'features' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Features
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('scene')}
                            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'scene' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Scene
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {/* Surfaces Tab */}
                        {activeTab === 'surfaces' && (
                            <div className="space-y-4 animate-fadeIn h-full flex flex-col">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-lg">
                                        <label className="text-sm font-medium text-slate-700">Show Faces</label>
                                        <input
                                            type="checkbox"
                                            checked={config.SHOW_FACES}
                                            onChange={(e) => updateConfig('SHOW_FACES', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                        />
                                    </div>
                                    {config.SHOW_FACES && (
                                        <div className="space-y-3 p-3 bg-white/50 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-medium text-slate-500 min-w-[60px]">Color</label>
                                                <input
                                                    type="color"
                                                    value={config.FACE_COLOR}
                                                    onChange={(e) => updateConfig('FACE_COLOR', e.target.value)}
                                                    className="h-8 w-16 rounded cursor-pointer border-2 border-slate-200"
                                                />
                                                <input 
                                                    type="text" 
                                                    value={config.FACE_COLOR}
                                                    onChange={(e) => updateConfig('FACE_COLOR', e.target.value)}
                                                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <label className="font-medium text-slate-500">Opacity</label>
                                                    <span className="text-indigo-600 font-semibold">{config.FACE_OPACITY}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={config.FACE_OPACITY}
                                                    onChange={(e) => updateConfig('FACE_OPACITY', parseFloat(e.target.value))}
                                                    className="w-full h-2 accent-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <label className="text-sm font-medium text-slate-700 block px-3">Edges</label>
                                    <div className="space-y-3 p-3 bg-white/50 rounded-lg border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-medium text-slate-500 min-w-[60px]">Color</label>
                                            <input
                                                type="color"
                                                value={config.EDGE_COLOR}
                                                onChange={(e) => updateConfig('EDGE_COLOR', e.target.value)}
                                                className="h-8 w-16 rounded cursor-pointer border-2 border-slate-200"
                                            />
                                            <input 
                                                type="text" 
                                                value={config.EDGE_COLOR}
                                                onChange={(e) => updateConfig('EDGE_COLOR', e.target.value)}
                                                className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                            />
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs mb-1">
                                                <label className="font-medium text-slate-500">Width</label>
                                                <span className="text-indigo-600 font-semibold">{config.EDGE_WIDTH}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                step="0.5"
                                                value={config.EDGE_WIDTH}
                                                onChange={(e) => updateConfig('EDGE_WIDTH', parseFloat(e.target.value))}
                                                className="w-full h-2 accent-indigo-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features Tab */}
                        {activeTab === 'features' && (
                            <div className="space-y-4 animate-fadeIn h-full flex flex-col">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-lg">
                                        <label className="text-sm font-medium text-slate-700">Show K-Path</label>
                                        <input
                                            type="checkbox"
                                            checked={config.SHOW_PATH}
                                            onChange={(e) => updateConfig('SHOW_PATH', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                        />
                                    </div>
                                    {config.SHOW_PATH && (
                                        <div className="space-y-3 p-3 bg-white/50 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-medium text-slate-500 min-w-[60px]">Color</label>
                                                <input
                                                    type="color"
                                                    value={config.PATH_COLOR}
                                                    onChange={(e) => updateConfig('PATH_COLOR', e.target.value)}
                                                    className="h-8 w-16 rounded cursor-pointer border-2 border-slate-200"
                                                />
                                                <input 
                                                    type="text" 
                                                    value={config.PATH_COLOR}
                                                    onChange={(e) => updateConfig('PATH_COLOR', e.target.value)}
                                                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <label className="font-medium text-slate-500">Width</label>
                                                    <span className="text-indigo-600 font-semibold">{config.PATH_WIDTH}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    step="0.5"
                                                    value={config.PATH_WIDTH}
                                                    onChange={(e) => updateConfig('PATH_WIDTH', parseFloat(e.target.value))}
                                                    className="w-full h-2 accent-indigo-600"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-lg">
                                        <label className="text-sm font-medium text-slate-700">Points & Labels</label>
                                        <input
                                            type="checkbox"
                                            checked={config.SHOW_POINTS}
                                            onChange={(e) => updateConfig('SHOW_POINTS', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                        />
                                    </div>
                                    {config.SHOW_POINTS && (
                                        <div className="space-y-3 p-3 bg-white/50 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-2">
                                                <label className="text-xs font-medium text-slate-500 min-w-[60px]">Color</label>
                                                <input
                                                    type="color"
                                                    value={config.POINT_COLOR}
                                                    onChange={(e) => updateConfig('POINT_COLOR', e.target.value)}
                                                    className="h-8 w-16 rounded cursor-pointer border-2 border-slate-200"
                                                />
                                                <input 
                                                    type="text" 
                                                    value={config.POINT_COLOR}
                                                    onChange={(e) => updateConfig('POINT_COLOR', e.target.value)}
                                                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Size</label>
                                                    <input
                                                        type="number"
                                                        value={config.POINT_SIZE}
                                                        onChange={(e) => updateConfig('POINT_SIZE', parseFloat(e.target.value))}
                                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Text</label>
                                                    <input
                                                        type="number"
                                                        value={config.TEXT_SIZE}
                                                        onChange={(e) => updateConfig('TEXT_SIZE', parseFloat(e.target.value))}
                                                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Scene Tab */}
                        {activeTab === 'scene' && (
                            <div className="space-y-4 animate-fadeIn h-full flex flex-col">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-lg">
                                        <label className="text-sm font-medium text-slate-700">Show Axes</label>
                                        <input
                                            type="checkbox"
                                            checked={config.SHOW_AXES}
                                            onChange={(e) => updateConfig('SHOW_AXES', e.target.checked)}
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                        />
                                    </div>
                                    {config.SHOW_AXES && (
                                        <div className="p-3 bg-white/50 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="flex justify-between text-xs mb-1">
                                                <label className="font-medium text-slate-500">Axes Scale</label>
                                                <span className="text-indigo-600 font-semibold">{config.AXES_FACTOR}</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="2"
                                                step="0.1"
                                                value={config.AXES_FACTOR}
                                                onChange={(e) => updateConfig('AXES_FACTOR', parseFloat(e.target.value))}
                                                className="w-full h-2 accent-indigo-600"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 pt-3 border-t border-slate-100">
                                    <div className="p-3 bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-slate-700">Orthographic View</label>
                                            <input
                                                type="checkbox"
                                                checked={config.ORTHOGRAPHIC}
                                                onChange={(e) => updateConfig('ORTHOGRAPHIC', e.target.checked)}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Toggle between perspective and orthographic projection modes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Visualization */}
                <div className="lg:col-span-6 h-full">
                    {visualizer}
                </div>
            </div>
        </form>
    );
};

export default BZForm;
