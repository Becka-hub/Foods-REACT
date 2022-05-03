import { AJOUTE_USER,SUPRIMER_USER } from '../types/typeUser';

export const AjouteUser = (user) => {
    return {
        type: AJOUTE_USER,
        payload: user
    }
}

export const suprimerUser = (user) => {
    return {
        type: SUPRIMER_USER,
        payload:user
    }
}
