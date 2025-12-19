import React, { useState } from 'react';
import type { BZRequest, VisualizationConfig } from '../api/api';

interface BZFormProps {
    onSubmit: (data: BZRequest) => void;
    isLoading: boolean;
}

const BZForm: React.FC<BZFormProps> = ({ onSubmit, isLoading }) => {
    const [latticeMatrix, setLatticeMatrix] = useState<string[][]>([
        ['0', '0.5', '0.5'],
        ['0.5', '0', '0.5'],
        ['0.5', '0.5', '0']
    ]);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const parsedKpoints = JSON.parse(kpoints);
            const parsedPath = JSON.parse(path);
            
            // Convert string matrix to numbers for API
            const numericLattice = latticeMatrix.map(row => 
                row.map(val => parseFloat(val) || 0)
            );

            onSubmit({
                lattice_vectors: numericLattice,
                kpoints: parsedKpoints,
                path: parsedPath,
                config
            });
        } catch (error) {
            alert('Invalid JSON format in K-Points or Path');
        }
    };

    const updateLattice = (row: number, col: number, val: string) => {
        const newMatrix = [...latticeMatrix];
        newMatrix[row] = [...newMatrix[row]];
        newMatrix[row][col] = val;
        setLatticeMatrix(newMatrix);
    };

    const updateConfig = (key: keyof VisualizationConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Crystal Structure */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Crystal Structure</h3>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Lattice Vectors (3x3 Matrix)</label>
                        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            {latticeMatrix.map((row, i) => (
                                row.map((val, j) => (
                                    <input
                                        key={`${i}-${j}`}
                                        type="text"
                                        value={val}
                                        onChange={(e) => updateLattice(i, j, e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                ))
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">High Symmetry Points</label>
                        <textarea
                            value={kpoints}
                            onChange={(e) => setKpoints(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-32 font-mono text-sm transition-all"
                            placeholder='{"GAMMA": [0,0,0], ...}'
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">K-Path</label>
                        <input
                            type="text"
                            value={path}
                            onChange={(e) => setPath(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm transition-all"
                            placeholder='["GAMMA", "X", ...]'
                        />
                    </div>
                </div>

                {/* Right Column: Visualization Settings */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Visualization Settings</h3>
                    
                    <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-6">
                        {/* Faces & Edges */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Brillouin Zone Faces</label>
                                <input
                                    type="checkbox"
                                    checked={config.SHOW_FACES}
                                    onChange={(e) => updateConfig('SHOW_FACES', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                            </div>
                            {config.SHOW_FACES && (
                                <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-indigo-50">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Face Color</label>
                                        <input
                                            type="color"
                                            value={config.FACE_COLOR}
                                            onChange={(e) => updateConfig('FACE_COLOR', e.target.value)}
                                            className="w-full h-8 rounded cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Opacity ({config.FACE_OPACITY})</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={config.FACE_OPACITY}
                                            onChange={(e) => updateConfig('FACE_OPACITY', parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Edge Color</label>
                                    <input
                                        type="color"
                                        value={config.EDGE_COLOR}
                                        onChange={(e) => updateConfig('EDGE_COLOR', e.target.value)}
                                        className="w-full h-8 rounded cursor-pointer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Edge Width ({config.EDGE_WIDTH})</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="0.5"
                                        value={config.EDGE_WIDTH}
                                        onChange={(e) => updateConfig('EDGE_WIDTH', parseFloat(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Path Settings */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Show K-Path</label>
                                <input
                                    type="checkbox"
                                    checked={config.SHOW_PATH}
                                    onChange={(e) => updateConfig('SHOW_PATH', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                            </div>
                            {config.SHOW_PATH && (
                                <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-red-50">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Path Color</label>
                                        <input
                                            type="color"
                                            value={config.PATH_COLOR}
                                            onChange={(e) => updateConfig('PATH_COLOR', e.target.value)}
                                            className="w-full h-8 rounded cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Path Width ({config.PATH_WIDTH})</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="0.5"
                                            value={config.PATH_WIDTH}
                                            onChange={(e) => updateConfig('PATH_WIDTH', parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Points & Labels */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Show Points & Labels</label>
                                <input
                                    type="checkbox"
                                    checked={config.SHOW_POINTS}
                                    onChange={(e) => updateConfig('SHOW_POINTS', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                            </div>
                            {config.SHOW_POINTS && (
                                <div className="space-y-4 pl-4 border-l-2 border-green-50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Point Color</label>
                                            <input
                                                type="color"
                                                value={config.POINT_COLOR}
                                                onChange={(e) => updateConfig('POINT_COLOR', e.target.value)}
                                                className="w-full h-8 rounded cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Point Size ({config.POINT_SIZE})</label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="15"
                                                step="1"
                                                value={config.POINT_SIZE}
                                                onChange={(e) => updateConfig('POINT_SIZE', parseFloat(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Text Size ({config.TEXT_SIZE})</label>
                                            <input
                                                type="range"
                                                min="8"
                                                max="50"
                                                step="1"
                                                value={config.TEXT_SIZE}
                                                onChange={(e) => updateConfig('TEXT_SIZE', parseFloat(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Text Offset ({config.TEXT_OFFSET_FACTOR})</label>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2"
                                                step="0.1"
                                                value={config.TEXT_OFFSET_FACTOR}
                                                onChange={(e) => updateConfig('TEXT_OFFSET_FACTOR', parseFloat(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Scene Settings */}
                        <div className="space-y-4 pt-4 border-t border-gray-50">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Show Axes</label>
                                <input
                                    type="checkbox"
                                    checked={config.SHOW_AXES}
                                    onChange={(e) => updateConfig('SHOW_AXES', e.target.checked)}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {config.SHOW_AXES && (
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Axes Factor ({config.AXES_FACTOR})</label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="2"
                                            step="0.1"
                                            value={config.AXES_FACTOR}
                                            onChange={(e) => updateConfig('AXES_FACTOR', parseFloat(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                )}
                                <div className={`flex items-center justify-between pt-4 ${!config.SHOW_AXES ? 'col-span-2' : ''}`}>
                                    <label className="text-sm font-medium text-gray-700">Orthographic</label>
                                    <input
                                        type="checkbox"
                                        checked={config.ORTHOGRAPHIC}
                                        onChange={(e) => updateConfig('ORTHOGRAPHIC', e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </span>
                ) : 'Generate Visualization'}
            </button>
        </form>
    );
};

export default BZForm;
