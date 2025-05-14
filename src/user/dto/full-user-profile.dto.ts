// user-profile/dto/full-user-profile.dto.ts
export class FullUserProfileDto {
    id: string;
    nickname: string;
    theme: 'light' | 'dark';
    interfaceLanguage: 'EN' | 'RU' | 'KA';
}
