import axios, { AxiosRequestConfig } from 'axios'
import { format } from 'date-fns/format';

import { RestManager } from './RestManager'

const PROXY_URL = 'https://cors-anywhere.herokuapp.com'

const statsApiAxios = axios.create({
  baseURL: `${PROXY_URL}/https://api-web.nhle.com/`,
})
const statsApiRestManager = new RestManager(statsApiAxios)

export default class NhlScoreboardApi {
  public static async getGames(gameDate: number) {
    const date: string = format(gameDate, 'yyyy-MM-dd');
    return statsApiRestManager.get(`v1/score/${date}`);
  }
}