import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

export class RestManager {
   private axiosInstance: AxiosInstance

   public constructor(axiosInstance: AxiosInstance) {
      this.axiosInstance = axiosInstance

      this.get = this.get.bind(this)
      this.post = this.post.bind(this)
      this.put = this.put.bind(this)
      this.delete = this.delete.bind(this)
      this.patch = this.patch.bind(this)
   }

   protected handleError(error: AxiosError) {
      console.error(error)
   }

   public async get(url: string, config?: AxiosRequestConfig) {
      try {
         const response = await this.axiosInstance.get(url, config)
         return response.data
      } catch (error) {
         await this.handleError(error)
      }
   }

   public async post(url: string, data: unknown, config?: AxiosRequestConfig) {
      try {
         const response = await this.axiosInstance.post(url, data, config)
         return response.data
      } catch (error) {
         await this.handleError(error)
      }
   }

   public async put(url: string, data: unknown, config?: AxiosRequestConfig) {
      try {
         const response = await this.axiosInstance.put(url, data, config)
         return response.data
      } catch (error) {
         await this.handleError(error)
      }
   }

   public async delete(url: string, config?: AxiosRequestConfig) {
      try {
         const response = await this.axiosInstance.delete(url, config)
         return response.data
      } catch (error) {
         await this.handleError(error)
      }
   }

   public async patch(url: string, data: unknown, config?: AxiosRequestConfig) {
      try {
         const response = await this.axiosInstance.patch(url, data, config)
         return response.data
      } catch (error) {
         await this.handleError(error)
      }
   }
}
