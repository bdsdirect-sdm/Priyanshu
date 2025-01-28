// types.ts
export interface FormField {
    id: string;
    label: string;
    type: "name" | "email" | "phone" | "dropdown" | "textarea" | "text" | "password" | "number" | "radio" | "checkbox" | "url" | "date";
    nameType?: "fullName" | "firstName" | "lastName";
    required: boolean;
    options?: string[];  // For fields like dropdown and radio
    value?: string;      // For pre-filled values
}
