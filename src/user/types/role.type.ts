export const roleList = ['USER', 'ADMIN'] as const;

// export type Role = (typeof roleList)[number];
export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
}