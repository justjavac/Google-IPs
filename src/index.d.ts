export declare const countries: readonly string[];
export declare const ips: readonly string[];
export declare const byCountry: Readonly<Record<string, readonly string[]>>;

export declare function getByCountry(country: string): readonly string[];
export declare function has(ip: string): boolean;
export declare function findCountry(ip: string): string | undefined;
export declare function random(country?: string): string | undefined;
