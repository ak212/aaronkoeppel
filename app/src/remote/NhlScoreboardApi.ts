import axios, { AxiosRequestConfig } from 'axios'
import format from 'date-fns/format'

import { RestManager } from './RestManager'

const PROXY_URL = 'https://cors-anywhere-49a7m0q7vcpoxggi.herokuapp.com'

const statsApiAxios = axios.create({
  baseURL: `${PROXY_URL}/https://statsapi.web.nhl.com/`,
})
const statsApiRestManager = new RestManager(statsApiAxios)

export default class NhlScoreboardApi {
  public static async getGames(gameDate: number) {
    const date: string = format(gameDate, 'yyyy-MM-dd')
    const config: AxiosRequestConfig = {
      params: {
        startDate: date,
        endDate: date,
        hydrate:
          'team(leaders(categories=[points,goals,assists],gameTypes=[R])),linescore,game(content(media(epg),highlights(scoreboard)),seriesSummary),metadata,decisions,scoringplays,seriesSummary(series)',
        site: 'en_nhl',
      },
    }
    return statsApiRestManager.get('api/v1/schedule', config)
  }
}
