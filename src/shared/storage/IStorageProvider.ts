export interface IStorageProvider {
  upload(file: File, options?: { folder?: string }): Promise<string>;
}
