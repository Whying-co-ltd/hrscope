import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class MainsController {
  public async index({ request, response, view }: HttpContextContract,) {
    const data = request.only([
      'name',
      'surname',
      'bdate',
      'cid'
    ])
    const dateParts = data.bdate.split("/")
    const day = parseInt(dateParts[0])
    const month = parseInt(dateParts[1])
    const year = parseInt(dateParts[2]) + 543

    let month_num = await this.findMonthNum(day, month)
    let year_num = await this.findYearNum(year)
    let month_zodiac_name = await this.findZodiacName(month_num)
    let year_zodiac_name = await this.findZodiacName(year_num)
    let score_for_month = await this.scoreForPercentage(month_num)
    let score_for_year = await this.scoreForPercentage(year_num)
    let score_for_month_zodiac = await this.scoreForZodiac(month_num)
    let score_for_year_zodiac = await this.scoreForZodiac(year_num)
    let score_for_percentage = await this.findPercentage(score_for_month, score_for_year)

    const result = {
      'name': data.name,
      'surname': data.surname,
      'bdate': day + '/' + month + '/' + year,
      'cid': data.cid,
      'month_num': month_num,
      'year_num': year_num,
      'month_zodiac_name': month_zodiac_name,
      'year_zodiac_name': year_zodiac_name,
      'score_for_month_zodiac': score_for_month_zodiac,
      'score_for_year_zodiac': score_for_year_zodiac,
      'score_for_percentage': score_for_percentage
    }
    // return response.ok(result)
    return view.render('result', result)
  }

  public async findMonthNum(day, month) {
    let month_num = 0
    if (month === 1 && day >= 5 || month === 2 && day <= 4) {

      month_num = 2
    } else if (month === 2 && day >= 5 || month === 3 && day <= 4) {

      month_num = 3
    } else if (month === 3 && day >= 5 || month === 4 && day <= 4) {

      month_num = 4
    } else if (month === 4 && day >= 5 || month === 5 && day <= 4) {

      month_num = 5
    } else if (month === 5 && day >= 5 || month === 6 && day <= 4) {

      month_num = 6
    } else if (month === 6 && day >= 5 || month === 7 && day <= 4) {

      month_num = 7
    } else if (month === 7 && day >= 5 || month === 8 && day <= 4) {

      month_num = 8
    } else if (month === 8 && day >= 5 || month === 9 && day <= 4) {

      month_num = 9
    } else if (month === 9 && day >= 5 || month === 10 && day <= 4) {

      month_num = 10
    } else if (month === 10 && day >= 5 || month === 11 && day <= 4) {

      month_num = 11
    } else if (month === 11 && day >= 5 || month === 12 && day <= 4) {

      month_num = 12
    } else {

      month_num = 1
    }
    return month_num
  }

  public async findYearNum(year) {
    const rat = [2455, 2467, 2479, 2491, 2503, 2515, 2527, 2539, 2551, 2563, 2575]
    const cow = [2456, 2468, 2480, 2492, 2504, 2516, 2528, 2540, 2552, 2564, 2576]
    const tiger = [2457, 2469, 2481, 2493, 2505, 2517, 2529, 2541, 2553, 2565, 2577]
    const rabbit = [2458, 2470, 2482, 2494, 2506, 2518, 2530, 2542, 2554, 2566, 2578]
    const dragon = [2459, 2471, 2483, 2495, 2507, 2519, 2531, 2543, 2555, 2567, 2579]
    const snake = [2460, 2472, 2484, 2496, 2508, 2520, 2532, 2544, 2556, 2568, 2580]
    const horse = [2461, 2473, 2485, 2497, 2509, 2521, 2533, 2545, 2557, 2569, 2581]
    const goat = [2462, 2474, 2486, 2498, 2510, 2522, 2534, 2546, 2558, 2570, 2582]
    const monkey = [2463, 2475, 2487, 2499, 2511, 2523, 2535, 2547, 2559, 2571, 2583]
    const rooster = [2464, 2476, 2488, 2500, 2512, 2524, 2536, 2548, 2560, 2572, 2584]
    const dog = [2465, 2477, 2489, 2501, 2513, 2525, 2537, 2549, 2561, 2573, 2585]
    const pig = [2466, 2478, 2490, 2502, 2514, 2526, 2538, 2550, 2562, 2574, 2586]

    let year_num = 0
    if (rat.includes(year)) {
      year_num = 1
    } else if (cow.includes(year)) {
      year_num = 2
    }
    else if (tiger.includes(year)) {
      year_num = 3
    }
    else if (rabbit.includes(year)) {
      year_num = 4
    }
    else if (dragon.includes(year)) {
      year_num = 5
    }
    else if (snake.includes(year)) {
      year_num = 6
    }
    else if (horse.includes(year)) {
      year_num = 7
    }
    else if (goat.includes(year)) {
      year_num = 8
    }
    else if (monkey.includes(year)) {
      year_num = 9
    }
    else if (rooster.includes(year)) {
      year_num = 10
    }
    else if (dog.includes(year)) {
      year_num = 11
    }
    else if (pig.includes(year)) {
      year_num = 12
    }

    return year_num
  }

  public async scoreForZodiac(param) {
    const personality = [
      { row: 1, name: 'สติปัญญาดี' },
      { row: 2, name: 'เรียนรู้เร็ว ใฝ่รู้' },
      { row: 3, name: 'ความคิดสร้างสรรค์' },
      { row: 4, name: 'การพูดการเจรจา' },
      { row: 5, name: 'การคิดวิเคราะห์' },
      { row: 6, name: 'ความเป็นผู้นำ' },
      { row: 7, name: 'ความมีเหตุผล' },
      { row: 8, name: 'ความมั่นใจในตัวเอง' },
      { row: 9, name: 'การทำงานเป็นทีม' },
      { row: 10, name: 'ความอดทน' },
      { row: 11, name: 'การปรับตัว' },
      { row: 12, name: 'ผู้ใหญ่สนับสนุน' },
      { row: 13, name: 'ความขยัน' },
      { row: 14, name: 'ความซื่อสัตย์' },
      { row: 15, name: 'ความมีระเบียบวินัย' },
      { row: 16, name: 'จิตใจดี' },
      { row: 17, name: 'เข้ากับคนง่าย' },
      { row: 18, name: 'ความมีน้ำใจ' },
      { row: 19, name: 'ความละเอียดรอบคอบ' },
      { row: 20, name: 'ความยุติธรรม' },
      { row: 21, name: 'แก้ปัญหา' },
      { row: 22, name: 'มองโลกในแง่ดี' },
      { row: 23, name: 'ความรอบรู้' },
      { row: 24, name: 'ใจกว้าง' },
      { row: 25, name: 'ความมุ่งมั่นทุ่มเท' },
      { row: 26, name: 'ความมีโชค' },
      { row: 27, name: 'มีสเน่ห์' },
      { row: 28, name: 'ใจเย็น สุขุม' },
      { row: 29, name: 'ตรงไปตรงมา' },
      { row: 30, name: 'มีความรับผิดชอบ' },
      { row: 31, name: 'เป็นนักปฏิบัติ' }
    ]

    let score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    if (param === 1) {
      score = [0, 0, 0, 10, 10, 0, 0, 10, 0, 0, 10, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 10, 0, 10, 0, 0, 0, 0, 0, 10]
    }
    else if (param === 2) {
      score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 20, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 20, 10, 0]
    }
    else if (param === 3) {
      score = [10, 10, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0, 10, 0, 0]
    }
    else if (param === 4) {
      score = [0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 10, 0, 10, 10]
    }
    else if (param === 5) {
      score = [10, 0, 10, 0, 0, 10, 10, 10, 10, 10, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0]
    }
    else if (param === 6) {
      score = [10, 10, 10, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    else if (param === 7) {
      score = [0, 0, 10, 0, 0, 0, 0, 10, 0, 10, 10, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 10, 0, 0, 0, 0]
    }
    else if (param === 8) {
      score = [0, 10, 10, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 10, 0, 0, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0, 10, 0, 0]
    }
    else if (param === 9) {
      score = [0, 10, 10, 10, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0, 0, 0, 10]
    }
    else if (param === 10) {
      score = [10, 0, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 10, 0, 0, 10]
    }
    else if (param === 11) {
      score = [0, 0, 0, 0, 0, 20, 20, 10, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 10, 0, 0]
    }
    else if (param === 12) {
      score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 0, 10, 0, 0, 10, 10, 0, 10, 0]
    }
    const mappedArray = personality.map((item, index) => {
      return {
        row: item.row,
        name: item.name,
        score: score[index]
      }
    })
    return mappedArray
  }
  public async findZodiacName(param) {

    let res = ''
    switch (param) {
      case 1:
        res = 'ชวด'
        break;
      case 2:
        res = 'ฉลู'
        break;
      case 3:
        res = 'ขาล'
        break;
      case 4:
        res = 'เถาะ'
        break;
      case 5:
        res = 'มะโรง'
        break;
      case 6:
        res = 'มะเส็ง'
        break;
      case 7:
        res = 'มะเมีย'
        break;
      case 8:
        res = 'มะแม'
        break;
      case 9:
        res = 'วอก'
        break;
      case 10:
        res = 'ระกา'
        break;
      case 11:
        res = 'จอ'
        break;
      case 12:
        res = 'กุน'
        break;
    }
    return res
  }

  public async findPercentage(score_for_month, score_for_year) {
    // เต็ม 40 คิด %

    const arr1 = score_for_month
    const arr2 = score_for_year

    const score = arr1.reduce((acc, curr, index) => {
      // const randomNumber = Math.floor(Math.random() * 10);
      // return acc.concat(Math.floor((Math.random() * 10) + ((curr + arr2[index]) / 25) * 100))
      return acc.concat(((curr + arr2[index]) / 40) * 100)
    }, [])

    // console.log(score)

    const personality = [
      { row: 1, name: 'สติปัญญาดี' },
      { row: 2, name: 'เรียนรู้เร็ว ใฝ่รู้' },
      { row: 3, name: 'ความคิดสร้างสรรค์' },
      { row: 4, name: 'การพูดการเจรจา' },
      { row: 5, name: 'การคิดวิเคราะห์' },
      { row: 6, name: 'ความเป็นผู้นำ' },
      { row: 7, name: 'ความมีเหตุผล' },
      { row: 8, name: 'ความมั่นใจในตัวเอง' },
      { row: 9, name: 'การทำงานเป็นทีม' },
      { row: 10, name: 'ความอดทน' },
      { row: 11, name: 'การปรับตัว' },
      { row: 12, name: 'ผู้ใหญ่สนับสนุน' },
      { row: 13, name: 'ความขยัน' },
      { row: 14, name: 'ความซื่อสัตย์' },
      { row: 15, name: 'ความมีระเบียบวินัย' },
      { row: 16, name: 'จิตใจดี' },
      { row: 17, name: 'เข้ากับคนง่าย' },
      { row: 18, name: 'ความมีน้ำใจ' },
      { row: 19, name: 'ความละเอียดรอบคอบ' },
      { row: 20, name: 'ความยุติธรรม' },
      { row: 21, name: 'แก้ปัญหา' },
      { row: 22, name: 'มองโลกในแง่ดี' },
      { row: 23, name: 'ความรอบรู้' },
      { row: 24, name: 'ใจกว้าง' },
      { row: 25, name: 'ความมุ่งมั่นทุ่มเท' },
      { row: 26, name: 'ความมีโชค' },
      { row: 27, name: 'มีสเน่ห์' },
      { row: 28, name: 'ใจเย็น สุขุม' },
      { row: 29, name: 'ตรงไปตรงมา' },
      { row: 30, name: 'มีความรับผิดชอบ' },
      { row: 31, name: 'เป็นนักปฏิบัติ' }
    ]

    const mappedArray = personality.map((item, index) => {
      return {
        row: item.row,
        name: item.name,
        score: score[index]
      }
    })
    return mappedArray
  }

  public async scoreForPercentage(param) {
    let score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    if (param === 1) {
      score = [0, 0, 0, 10, 10, 0, 0, 10, 0, 0, 10, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 10, 0, 10, 0, 0, 0, 0, 0, 10]
    }
    else if (param === 2) {
      score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 20, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 20, 10, 0]
    }
    else if (param === 3) {
      score = [10, 10, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0, 10, 0, 0]
    }
    else if (param === 4) {
      score = [0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 10, 0, 10, 10]
    }
    else if (param === 5) {
      score = [10, 0, 10, 0, 0, 10, 10, 10, 10, 10, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0]
    }
    else if (param === 6) {
      score = [10, 10, 10, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    else if (param === 7) {
      score = [0, 0, 10, 0, 0, 0, 0, 10, 0, 10, 10, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 10, 0, 0, 0, 0]
    }
    else if (param === 8) {
      score = [0, 10, 10, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 10, 0, 0, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0, 10, 0, 0]
    }
    else if (param === 9) {
      score = [0, 10, 10, 10, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0, 0, 0, 10]
    }
    else if (param === 10) {
      score = [10, 0, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 10, 0, 0, 10]
    }
    else if (param === 11) {
      score = [0, 0, 0, 0, 0, 20, 20, 10, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 10, 0, 0]
    }
    else if (param === 12) {
      score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 0, 10, 0, 0, 10, 10, 0, 10, 0]
    }
    // const mappedArray = personality.map((item, index) => {
    //   return {
    //     row: item.row,
    //     name: item.name,
    //     score: score[index]
    //   }
    // })
    // return mappedArray
    return score
  }
}
