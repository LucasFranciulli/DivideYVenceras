interface GrupoUsuario {
    id: number;
    id_grupo: number;
    id_usuario: number;
    balance: string;
}

export interface UsuarioByIdGroups {
    id: number;
    nombre_usuario: string;
    nombre: string;
    apellido: string;
    email: string;
    GrupoUsuario: GrupoUsuario;
}

export interface GrupoByID {
    id: number;
    nombre: string;
    descripcion: string;
    limite_gasto: string;
    monto_gastado: string;
    color: string;
    token: string;
    usuarios: UsuarioByIdGroups[];
}