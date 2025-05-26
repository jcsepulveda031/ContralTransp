import api from './../../../services/api';


export const getDiverTransporte = async ( id:number ) => { 
    const response = await api.get(`/Driver/${id}`)
    return response.data;
}

export const postStatusDiver = async ( id:string, status: string) => { 
    const response = await api.post(`/Driver/status/${id}` , {params:status })
    return response.data;

}
export const postDetailDiver = async ( data: { id_Seguimiento: string, fecha: string, hora: string, detalle: string }) => { 

    const response = await api.post(`/Driver/detail/${data.id_Seguimiento}` , {params:data })
    return response.data;
}
export const getDetailDiver = async ( id:string ) => { 
    const response = await api.get(`/Driver/detail/${id}`)
    return response.data;
}

