import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MainsController {
  public async index({ request, response }: HttpContextContract,) {
    console.log()
    const data = request.only([
      'name',
      'surname',
      'bdate',
      'cid'
    ])
    return response.ok(data)
  }
}
