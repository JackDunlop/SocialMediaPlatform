import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'



export interface Database {
    users: UserTable
}

export interface UserTable {
    id: Generated<number>
    username: string
    hash: string
    email: string
    DOB: string
    fullname: string


}


export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>