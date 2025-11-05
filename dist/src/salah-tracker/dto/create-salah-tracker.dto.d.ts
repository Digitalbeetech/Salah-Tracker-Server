export declare class CreateRakatDto {
    farz: boolean;
    number: number;
    markAsOffered?: string | null;
}
export declare class CreatePrayerDto {
    name: string;
    rakats: CreateRakatDto[];
    key: string;
    subtext: string;
    active?: boolean;
}
export declare class CreateSalahTrackerDto {
    date: string;
    prayers: CreatePrayerDto[];
}
