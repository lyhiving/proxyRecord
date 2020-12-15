import request from '../request'

export async function getCardInfoData() {
  return await request({
    url: '/api/getCardInfoData',
    method: 'get',
  })
}
