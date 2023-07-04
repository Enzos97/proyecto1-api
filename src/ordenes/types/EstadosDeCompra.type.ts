export const EstadoCompraList = ['RECHAZADO', 'PENDIENTE', 'ACEPTADO'] as const;

// export type Role = (typeof roleList)[number];
export enum CompraEstado {
    RECHAZADO = 'RECHAZADO',
    PENDIENTE = 'PENDIENTE',
    ACEPTADO = 'ACEPTADO',
}