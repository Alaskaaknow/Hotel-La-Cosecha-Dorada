import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const hotelService = {
    // Obtener información del hotel
    getHotelInfo: async () => {
        try {
            const response = await axios.get(`${API_URL}/hotel/info`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener información del hotel:', error);
            throw error;
        }
    },

    // Actualizar información del hotel
    updateHotelInfo: async (hotelData) => {
        try {
            const response = await axios.put(`${API_URL}/hotel/info`, hotelData);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar información del hotel:', error);
            throw error;
        }
    }
};

export default hotelService;