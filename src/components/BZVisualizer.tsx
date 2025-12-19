import React from 'react';
import Plot from 'react-plotly.js';

interface BZVisualizerProps {
    plotData: any;
}

const BZVisualizer: React.FC<BZVisualizerProps> = ({ plotData }) => {
    if (!plotData) {
        return <div className="text-center text-gray-500">No plot data available. Generate a plot to see it here.</div>;
    }

    return (
        <div className="w-full h-full min-h-[600px] bg-white rounded-lg shadow-md p-4">
            <Plot
                data={plotData.data}
                layout={{
                    ...plotData.layout,
                    autosize: true,
                    margin: { l: 0, r: 0, b: 0, t: 0 },
                    scene: {
                        ...plotData.layout.scene,
                        aspectmode: 'data'
                    }
                }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                config={{ responsive: true }}
            />
        </div>
    );
};

export default BZVisualizer;
