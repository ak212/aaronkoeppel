import axios from 'axios'
import format from 'date-fns/format'

import { Campsite } from '../store/campsites'
import { RestManager } from './RestManager'

const PROXY_URL = 'https://cors-anywhere-49a7m0q7vcpoxggi.herokuapp.com'

const axiosInstance = axios.create({
  baseURL: `${PROXY_URL}/https://www.recreation.gov/api/`,
})
const rest = new RestManager(axiosInstance)

function buildParamArray(arrayName: string, params: string[]): string {
  return params.map(param => `${arrayName}=${encodeURIComponent(param)}`).join('&')
}

export default class CampsitesApi {
  public static async getCampgroundsForRecArea(entity_id: string) {
    const params = [
      `parent_asset_id:${entity_id}`,
      'entity_type:campground',
      'campsite_type_of_use:Overnight',
      'campsite_type_of_use:Day',
      'campsite_type_of_use:na',
    ]
    return rest.get(`search?${buildParamArray('fq', params)}`, { params: { size: 1000, sort: 'score' } })
  }

  public static async getCampground(entity_id: string) {
    return rest.get(`camps/campgrounds/${entity_id}`)
  }

  public static async getAutocomplete(query: string) {
    const config = {
      params: {
        q: query,
      },
    }
    return rest.get('search/suggest', config)
  }

  public static async getCampgroundAvailablity(entity_id: string, startDate: number): Promise<Campsite[]> {
    return rest.get(
      `camps/availability/campground/${entity_id}/month?start_date=${format(startDate, 'yyyy-MM-01').concat(
        encodeURIComponent('T00:00:00.000Z'),
      )}`,
    )
  }
}
