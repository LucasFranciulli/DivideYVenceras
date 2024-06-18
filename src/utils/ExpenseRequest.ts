export interface ExpenseRequest {
    nombre: string;
    descripcion: string;
    monto: number;
    fecha: string;
    id_categoria: number;
    tags: number[];
    frecuencia?: string;
    saldado: boolean;
}