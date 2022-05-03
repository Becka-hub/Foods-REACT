import { AJOUTE_JAIMEDATA,SUPRIMER_JAIMEDATA} from "../types/typeDataJaime";
export const ajouteDataJaime=(jaime)=>{
    return {
        type: AJOUTE_JAIMEDATA,
        payload: jaime
    }
}
export const suprimerDataJaime=(jaime)=>{
    return {
        type: SUPRIMER_JAIMEDATA,
        payload: jaime
    }
}
