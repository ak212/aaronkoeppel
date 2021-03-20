import axios, { AxiosRequestConfig } from 'axios'
import moment from 'moment'

import { RestManager } from './RestManager'

const PROXY_URL = 'https://cors-anywhere-49a7m0q7vcpoxggi.herokuapp.com'

const statsApiAxios = axios.create({
  baseURL: `${PROXY_URL}/https://statsapi.web.nhl.com/`
})
const statsApiRestManager = new RestManager(statsApiAxios)

export default class NhlScoreboardApi {
  public static async getGames() {
    const date: string = moment().format('YYYY-MM-DD')
    const config: AxiosRequestConfig = {
      params: {
        startDate: date,
        endDate: date,
        hydrate:
          'team(leaders(categories=[points,goals,assists],gameTypes=[R])),linescore,game(content(media(epg),highlights(scoreboard)),seriesSummary),metadata,decisions,scoringplays,seriesSummary(series)',
        site: 'en_nhl'
      }
    }
    return statsApiRestManager.get('api/v1/schedule', config)
  }
}
