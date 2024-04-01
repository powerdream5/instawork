import { ROLE_ADMIN, ROLE_REGULAR, SORT_OPTION_NAME, SORT_OPTION_CREATED_AT } from "./constant";

export type RoleType = typeof ROLE_ADMIN | typeof ROLE_REGULAR;

export type TeamMemberData = {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    role: RoleType;
};

export type TeamMember = TeamMemberData & {
    id: number;
};

export type SortOptionType = typeof SORT_OPTION_NAME | typeof SORT_OPTION_CREATED_AT;