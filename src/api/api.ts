import axios from 'axios';

const API_BASE_URL = 'https://awesome-bz.delightfulpebble-4e97604d.centralindia.azurecontainerapps.io';

export interface VisualizationConfig {
    SHOW_FACES?: boolean;
    FACE_COLOR?: string;
    FACE_OPACITY?: number;
    EDGE_COLOR?: string;
    EDGE_WIDTH?: number;
    SHOW_PATH?: boolean;
    PATH_COLOR?: string;
    PATH_WIDTH?: number;
    SHOW_POINTS?: boolean;
    POINT_COLOR?: string;
    POINT_SIZE?: number;
    TEXT_SIZE?: number;
    TEXT_OFFSET_FACTOR?: number;
    SHOW_AXES?: boolean;
    AXES_FACTOR?: number;
    ORTHOGRAPHIC?: boolean;
}

export interface BZRequest {
    lattice_vectors: number[][];
    kpoints: { [key: string]: number[] };
    path: string[];
    config?: VisualizationConfig;
}

export const generatePlot = async (data: BZRequest) => {
    const response = await axios.post(`${API_BASE_URL}/generate_plot`, data);
    return response.data;
};

export const checkHealth = async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
};
