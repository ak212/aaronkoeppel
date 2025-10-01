/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ENV: string;
    // add other env vars as needed, e.g.:
    // readonly VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;
