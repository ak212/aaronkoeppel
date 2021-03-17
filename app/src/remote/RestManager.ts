import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'

export class RestManager {
  private axiosInstance: AxiosInstance

  public constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance
  }

  protected handleError = (error: AxiosError) => {
    throw error
  }

  public get = async (url: string, config?: AxiosRequestConfig) => {
    try {
      const response = await this.axiosInstance.get(url, config)
      return response.data
    } catch (error) {
      await this.handleError(error)
    }
  }

  public post = async (url: string, data: unknown, config?: AxiosRequestConfig) => {
    try {
      const response = await this.axiosInstance.post(url, data, config)
      return response.data
    } catch (error) {
      await this.handleError(error)
    }
  }

  public put = async (url: string, data: unknown, config?: AxiosRequestConfig) => {
    try {
      const response = await this.axiosInstance.put(url, data, config)
      return response.data
    } catch (error) {
      await this.handleError(error)
    }
  }

  public delete = async (url: string, config?: AxiosRequestConfig) => {
    try {
      const response = await this.axiosInstance.delete(url, config)
      return response.data
    } catch (error) {
      await this.handleError(error)
    }
  }

  public patch = async (url: string, data: unknown, config?: AxiosRequestConfig) => {
    try {
      const response = await this.axiosInstance.patch(url, data, config)
      return response.data
    } catch (error) {
      await this.handleError(error)
    }
  }
}
