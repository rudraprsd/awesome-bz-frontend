import React, { useState } from 'react';
import type { BZRequest, VisualizationConfig } from '../api/api';

interface BZFormProps {
    onSubmit: (data: BZRequest) => void;
    isLoading: boolean;
}

const BZForm: React.FC<BZFormProps> = ({ onSubmit, isLoading }) => {
    const [latticeVectors, setLatticeVectors] = useState<string>('[[0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]]');
    const [kpoints, setKpoints] = useState<string>('{"GAMMA": [0, 0, 0], "X": [0, 0.5, 0.5], "L": [0.5, 0.5, 0.5], "W": [0.25, 0.75, 0.5]}');
    const [path, setPath] = useState<string>('["GAMMA", "X", "W", "L", "GAMMA", "K"]');
    const [config, setConfig] = useState<VisualizationConfig>({
        SHOW_FACES: true,
        FACE_COLOR: 'lightblue',
        FACE_OPACITY: 0.3,
        EDGE_COLOR: 'black',
        EDGE_WIDTH: 3.0,
        SHOW_PATH: true,
        PATH_COLOR: 'red',
        PATH_WIDTH: 5.0,
        SHOW_POINTS: true,
        POINT_COLOR: 'red',
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
            alert('Invalid JSON format in one of the fields');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lattice Vectors (JSON 3x3 matrix)</label>
                <textarea
                    value={latticeVectors}
                    onChange={(e) => setLatticeVectors(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24 font-mono text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">K-Points (JSON object)</label>
                <textarea
                    value={kpoints}
                    onChange={(e) => setKpoints(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24 font-mono text-sm"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Path (JSON array of strings)</label>
                <input
                    type="text"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
            </div>

            <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Visualization Config</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.SHOW_FACES}
                            onChange={(e) => setConfig({ ...config, SHOW_FACES: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Show Faces</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.SHOW_PATH}
                            onChange={(e) => setConfig({ ...config, SHOW_PATH: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Show Path</label>
                    </div>
                     <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.SHOW_POINTS}
                            onChange={(e) => setConfig({ ...config, SHOW_POINTS: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Show Points</label>
                    </div>
                     <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={config.SHOW_AXES}
                            onChange={(e) => setConfig({ ...config, SHOW_AXES: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Show Axes</label>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Generating...' : 'Generate Visualization'}
            </button>
        </form>
    );
};

export default BZForm;
