interface config {
    EDIT_PATIENT: any;
    VIEW_PATIENT: any;
    staff: any;
    VIEW_APPOINTMENT: any;
    EDIT_APPOINTMENT: any;
    GET_ROOM: any;
    ADD_APPOINTMENT: any;
    UPDATE_USER: any;
    GET_DOCTOR_LIST: string;
    BASE_URL: string;
    CREATE_USER: string;
    VERIFY_USER: string;
    LOGIN_USER: string;
    GET_USER: string;
    GET_DOC_LIST: string;
    GET_PATIENT_LIST: string;
    ADD_PATIENT: string
    ADD_ADDRESS: string
    CHANGE_PASSWORD: any;
    ADD_STAFF: any
    GET_STAFF: any
    GET_APPOINTMENT_LIST: any
}

export const Local: config = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    CREATE_USER: import.meta.env.VITE_CREATE_USER,
    VERIFY_USER: import.meta.env.VITE_VERIFY_USER,
    LOGIN_USER: import.meta.env.VITE_LOGIN_USER,
    GET_USER: import.meta.env.VITE_GET_USER,
    GET_DOC_LIST: import.meta.env.VITE_GET_DOC_LIST,
    GET_PATIENT_LIST: import.meta.env.VITE_GET_PATIENT_LIST,
    ADD_PATIENT: import.meta.env.VITE_ADD_PATIENT,
    ADD_ADDRESS: import.meta.env.VITE_ADD_ADDRESS,
    ADD_STAFF: import.meta.env.VITE_ADD_STAFF,
    GET_STAFF: import.meta.env.VITE_GET_STAFF,
    GET_DOCTOR_LIST: import.meta.env.VITE_GET_DOCTOR_LIST,
    UPDATE_USER: import.meta.env.VITE_UPDATE_PROFILE,
    CHANGE_PASSWORD: import.meta.env.VITE_CHANGE_PASSWORD,
    ADD_APPOINTMENT: import.meta.env.VITE_ADD_APPOINTMENT,
    GET_APPOINTMENT_LIST: import.meta.env.VITE_GET_APPOINTMENTLIST,
    GET_ROOM: import.meta.env.VITE_GET_ROOM,
    EDIT_APPOINTMENT: import.meta.env.VITE_EDIT_APPOINTMENT,
    VIEW_APPOINTMENT: import.meta.env.VITE_VIEW_APPOINTMENT,
    VIEW_PATIENT: import.meta.env.VITE_VIEW_PATIENT,
    staff: undefined,
    EDIT_PATIENT: import.meta.env.VITE_EDIT_PATIENT
}