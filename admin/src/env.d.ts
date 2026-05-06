declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

declare module '@capgo/capacitor-native-biometric' {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  export const NativeBiometric: any;
  export enum BiometryType {
    NONE = 0,
    TOUCH_ID = 1,
    FACE_ID = 2,
    FINGERPRINT = 3,
    FACE_AUTHENTICATION = 4,
    IRIS_AUTHENTICATION = 5
  }
}

declare module 'capacitor-secure-storage-plugin' {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  export const SecureStoragePlugin: any;
}


