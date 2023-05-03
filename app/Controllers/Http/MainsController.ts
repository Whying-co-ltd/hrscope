import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import moment from 'moment'
//เหลือ compatability กับ คิด percentage

export default class MainsController {
  public async index({ request, view }: HttpContextContract) {
    const data = request.only([
      'name_1',
      'surname_1',
      'bdate_1',
      'cid_1',
      'name_2',
      'surname_2',
      'bdate_2',
      'cid_2',
    ])
    const dateParts1 = data.bdate_1.split('-')
    const day_1 = parseInt(dateParts1[0])
    const month_1 = parseInt(dateParts1[1])
    const year_1 = parseInt(dateParts1[2]) + 543

    console.log(dateParts1)

    let compatibility = await this.compatibility(data.bdate_1, data.bdate_2) //here
    let month_num_1 = await this.findMonthNum(day_1, month_1)
    let year_num_1 = await this.findYearNum(year_1)
    let month_zodiac_name_1 = await this.findZodiacName(month_num_1)
    let year_zodiac_name_1 = await this.findZodiacName(year_num_1)
    let score_for_cid_1 = await this.scoreForCID(data.cid_1)
    let score_for_month_1 = await this.scoreForPercentage(month_num_1)
    let score_for_year_1 = await this.scoreForPercentage(year_num_1)
    let score_for_month_zodiac_1 = await this.scoreForZodiac(month_num_1)
    let score_for_year_zodiac_1 = await this.scoreForZodiac(year_num_1)
    let score_for_percentage_1 = await this.findPercentage(
      score_for_month_1,
      score_for_year_1,
      score_for_cid_1
    )

    let job_score = await this.jobScore(score_for_percentage_1) //here

    const dateParts2 = data.bdate_2.split('-')
    const day_2 = parseInt(dateParts2[0])
    const month_2 = parseInt(dateParts2[1])
    const year_2 = parseInt(dateParts2[2]) + 543

    let month_num_2 = await this.findMonthNum(day_2, month_2)
    let year_num_2 = await this.findYearNum(year_2)
    let month_zodiac_name_2 = await this.findZodiacName(month_num_2)
    let year_zodiac_name_2 = await this.findZodiacName(year_num_2)

    const result = {
      name_1: data.name_1,
      surname_1: data.surname_1,
      bdate_1: day_1 + '/' + month_1 + '/' + year_1,
      cid_1: data.cid_1,
      month_num_1: month_num_1,
      year_num_1: year_num_1,
      month_zodiac_name_1: month_zodiac_name_1,
      year_zodiac_name_1: year_zodiac_name_1,
      score_for_month_zodiac_1: score_for_month_zodiac_1,
      score_for_year_zodiac_1: score_for_year_zodiac_1,
      score_for_percentage_1: score_for_percentage_1,

      name_2: data.name_2,
      surname_2: data.surname_2,
      bdate_2: day_2 + '/' + month_2 + '/' + year_2,
      cid_2: data.cid_2,
      month_num_2: month_num_2,
      year_num_2: year_num_2,
      month_zodiac_name_2: month_zodiac_name_2,
      year_zodiac_name_2: year_zodiac_name_2,

      job_score: job_score,

      compatibility: compatibility,
    }
    // return response.ok(result)
    return view.render('result', result)
  }

  public async findMonthNum(day, month) {
    if (day >= 5) {
      return month === 12 ? 1 : month + 1
    }
    return month
  }

  public async findYearNum(year) {
    const animals = {
      rat: [2455, 2467, 2479, 2491, 2503, 2515, 2527, 2539, 2551, 2563, 2575],
      cow: [2456, 2468, 2480, 2492, 2504, 2516, 2528, 2540, 2552, 2564, 2576],
      tiger: [2457, 2469, 2481, 2493, 2505, 2517, 2529, 2541, 2553, 2565, 2577],
      rabbit: [2458, 2470, 2482, 2494, 2506, 2518, 2530, 2542, 2554, 2566, 2578],
      dragon: [2459, 2471, 2483, 2495, 2507, 2519, 2531, 2543, 2555, 2567, 2579],
      snake: [2460, 2472, 2484, 2496, 2508, 2520, 2532, 2544, 2556, 2568, 2580],
      horse: [2461, 2473, 2485, 2497, 2509, 2521, 2533, 2545, 2557, 2569, 2581],
      goat: [2462, 2474, 2486, 2498, 2510, 2522, 2534, 2546, 2558, 2570, 2582],
      monkey: [2463, 2475, 2487, 2499, 2511, 2523, 2535, 2547, 2559, 2571, 2583],
      rooster: [2464, 2476, 2488, 2500, 2512, 2524, 2536, 2548, 2560, 2572, 2584],
      dog: [2465, 2477, 2489, 2501, 2513, 2525, 2537, 2549, 2561, 2573, 2585],
      pig: [2466, 2478, 2490, 2502, 2514, 2526, 2538, 2550, 2562, 2574, 2586],
    }

    let year_num = 0
    Object.entries(animals).forEach(([animal, years]) => {
      if (years.includes(year)) {
        year_num = Object.keys(animals).indexOf(animal) + 1
      }
    })
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
      { row: 31, name: 'เป็นนักปฏิบัติ' },
    ]

    let score = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
    if (param === 1) {
      score = [
        0, 0, 0, 10, 10, 0, 0, 10, 0, 0, 10, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 10, 0, 10, 0, 0, 0,
        0, 0, 10,
      ]
    } else if (param === 2) {
      score = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 20, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 20,
        10, 0,
      ]
    } else if (param === 3) {
      score = [
        10, 10, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0,
        10, 0, 0,
      ]
    } else if (param === 4) {
      score = [
        0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 10,
        0, 10, 10,
      ]
    } else if (param === 5) {
      score = [
        10, 0, 10, 0, 0, 10, 10, 10, 10, 10, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        10, 10, 0,
      ]
    } else if (param === 6) {
      score = [
        10, 10, 10, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0,
        0, 0, 0, 0,
      ]
    } else if (param === 7) {
      score = [
        0, 0, 10, 0, 0, 0, 0, 10, 0, 10, 10, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 10,
        0, 0, 0, 0,
      ]
    } else if (param === 8) {
      score = [
        0, 10, 10, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 10, 0, 0, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0,
        10, 0, 0,
      ]
    } else if (param === 9) {
      score = [
        0, 10, 10, 10, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0,
        0, 0, 10,
      ]
    } else if (param === 10) {
      score = [
        10, 0, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 10,
        0, 0, 10,
      ]
    } else if (param === 11) {
      score = [
        0, 0, 0, 0, 0, 20, 20, 10, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0,
        10, 0, 0,
      ]
    } else if (param === 12) {
      score = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 0, 10, 0, 0, 10, 10,
        0, 10, 0,
      ]
    }
    const mappedArray = personality.map((item, index) => {
      return {
        row: item.row,
        name: item.name,
        score: score[index],
      }
    })
    return mappedArray
  }

  public async findZodiacName(param) {
    let res = ''
    switch (param) {
      case 1:
        res = 'ชวด'
        break
      case 2:
        res = 'ฉลู'
        break
      case 3:
        res = 'ขาล'
        break
      case 4:
        res = 'เถาะ'
        break
      case 5:
        res = 'มะโรง'
        break
      case 6:
        res = 'มะเส็ง'
        break
      case 7:
        res = 'มะเมีย'
        break
      case 8:
        res = 'มะแม'
        break
      case 9:
        res = 'วอก'
        break
      case 10:
        res = 'ระกา'
        break
      case 11:
        res = 'จอ'
        break
      case 12:
        res = 'กุน'
        break
    }
    return res
  }

  //F work plz
  public async findPercentage(score_for_month, score_for_year, score_for_cid) {
    //max is 20
    const arr1 = score_for_month //40%
    const arr2 = score_for_year //40%
    const arr3 = score_for_cid //20%

    //to be discuss
    const sumArray = arr1.map((num, index) => {
      let sum = num * 2 + arr2[index] * 2 + arr3[index]
      return sum
    })
    let score = sumArray

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
      { row: 31, name: 'เป็นนักปฏิบัติ' },
    ]

    const mappedArray = personality.map((item, index) => {
      return {
        row: item.row,
        name: item.name,
        score: score[index],
      }
    })
    return mappedArray
  }

  public async jobScore(score_for_percentage_1) {
    let sum = score_for_percentage_1

    let multiply = [
      [2, 1, 1, 1, 3, 4, 2, 3, 3, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 3, 2, 2, 2, 2, 1, 1, 1, 2, 3, 2],
      [1, 1, 1, 4, 1, 1, 1, 2, 2, 3, 2, 2, 2, 1, 1, 1, 3, 2, 1, 1, 1, 1, 1, 1, 2, 3, 2, 1, 1, 1, 3],
      [1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 4, 3, 1, 1, 1, 4, 2, 1, 1, 1, 1, 1, 3, 1, 1, 3, 3, 1],
      [2, 3, 3, 1, 4, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 3, 1, 3, 1, 1, 2, 2, 1, 1, 1, 2],
      [1, 1, 1, 3, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2, 1, 3, 4, 4, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
      [2, 3, 4, 1, 2, 2, 1, 1, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 3, 1, 2, 1, 1, 1, 1, 1, 2],
    ]
    // let divide = [55, 50, 50, 50, 50, 50]
    const name = [
      { row: 1, name: 'การบริหาร' },
      { row: 2, name: 'การขาย' },
      { row: 3, name: 'การเงิน' },
      { row: 4, name: 'การตลาด' },
      { row: 5, name: 'การบริการ' },
      { row: 6, name: 'การพัฒนา' },
    ]
    let score = new Array()
    for (let i = 0; i < 6; i++) {
      let tmp_val = 0
      for (let i2 = 0; i2 < multiply[i].length; i2++) {
        tmp_val += sum[i2].score * multiply[i][i2]
      }
      score.push(Math.floor(tmp_val / 6 / 2))
    }

    const mappedArray = name.map((item, index) => {
      return {
        row: item.row,
        name: item.name,
        score: score[index],
      }
    })

    return mappedArray
  }

  public async compatibility(bdate_person_1, bdate_person_2) {
    let person_1 = {
      day: moment(bdate_person_1, 'DD/MM/YYYY HH:mm').format('dddd'),
      date_month: moment(bdate_person_1, 'DD/MM/YYYY HH:mm').format('M-D'),
      time: moment(bdate_person_1, 'DD/MM/YYYY HH:mm').format('HH:mm'),
      year: await this.findYearNum(
        parseInt(moment(bdate_person_1, 'DD/MM/YYYY HH:mm').format('YYYY')) + 543
      ),
    }
    let person_2 = {
      day: moment(bdate_person_2, 'DD/MM/YYYY HH:mm').format('dddd'),
      date_month: moment(bdate_person_2, 'DD/MM/YYYY HH:mm').format('M-D'),
      time: moment(bdate_person_2, 'DD/MM/YYYY HH:mm').format('HH:mm'),
      year: await this.findYearNum(
        parseInt(moment(bdate_person_2, 'DD/MM/YYYY HH:mm').format('YYYY')) + 543
      ),
    }
    let day_score = await this.dayScoreForCompatibility(person_1, person_2)
    let month_score = await this.monthScoreForCompatibility(person_1, person_2)
    let year_score = await this.yearScoreForCompatibility(person_1, person_2)
    let result = day_score * 0.75 + month_score + year_score * 1.3
    return result
  }

  public async dayScoreForCompatibility(person_1, person_2) {
    //assume NightTime & Wed-Wed Score
    // let night_start = moment('17:59', 'HH:mm')
    // let night_end = moment('06:01', 'HH:mm')
    let day_1 = person_1.day
    let day_2 = person_2.day
    // let time_1 = moment(person_1.time, 'HH:mm')
    // let time_2 = moment(person_2.time, 'HH:mm')
    // let is_night_1 = time_1.isAfter(night_start) || time_1.isBefore(night_end)
    // let is_night_2 = time_2.isAfter(night_start) || time_2.isBefore(night_end)
    let day_arr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let score = [
      [5, 5, 0, 5, 20, 10, 15],
      [5, 5, 15, 20, 0, 5, 5],
      [0, 15, 5, 5, 10, 20, 5],
      [5, 20, 5, 0, 5, 5, 15], //night-20
      [20, 0, 10, 5, 5, 5, 5],
      [10, 5, 20, 5, 5, 5, 0],
      [15, 5, 5, 20, 5, 0, 5], //night +20
    ]
    let result = score[day_arr.indexOf(day_1)][day_arr.indexOf(day_2)]
    // if (day_1 == 'Wednesday' && day_2 == 'Wednesday') {
    //   if (is_night_1 || is_night_2) {
    //     result -= 20
    //   }
    // } else if (
    //   (day_1 == 'Wednesday' || day_2 == 'Wednesday') &&
    //   (day_1 == 'Saturday' || day_2 == 'Saturday')
    // ) {
    //   if (day_1 == 'Saturday') {
    //     if (is_night_2) {
    //       result += 20
    //     }
    //   } else {
    //     if (is_night_1) {
    //       result += 20
    //     }
    //   }
    // }
    return result
  }

  public async monthScoreForCompatibility(person_1, person_2) {
    const to_index_month = (el) =>
      parseInt(moment(el, 'M-D').format('DD')) >= 5
        ? parseInt(moment(el, 'M-D').format('MM')) - 1
        : parseInt(moment(el, 'M-D').format('MM')) - 2
    let score_arr = [
      [0, 40, 10, 10, 30, 20, 0, 10, 30, 20, 10, 0],
      [40, 20, 10, 10, 20, 30, 10, 0, 20, 30, 10, 0],
      [0, 10, 0, 20, 10, 10, 30, 20, 0, 10, 30, 40],
      [0, 10, 20, 10, 10, 10, 20, 30, 10, 0, 40, 30],
      [30, 20, 10, 10, 30, 20, 10, 10, 30, 40, 0, 0],
      [20, 30, 10, 10, 20, 0, 10, 10, 40, 30, 10, 0],
      [0, 10, 30, 20, 10, 10, 0, 40, 10, 10, 30, 20],
      [0, 0, 20, 30, 10, 10, 40, 0, 10, 10, 20, 30],
      [30, 20, 0, 10, 30, 40, 10, 10, 10, 20, 10, 0],
      [20, 30, 10, 0, 40, 30, 10, 10, 20, 0, 10, 0],
      [0, 10, 30, 40, 0, 10, 30, 20, 10, 10, 40, 20],
      [0, 10, 40, 30, 10, 0, 20, 30, 10, 10, 20, 30],
    ]
    let month_index_1 = to_index_month(person_1.date_month)
    let month_index_2 = to_index_month(person_2.date_month)

    return score_arr[month_index_1][month_index_2]
  }

  public async yearScoreForCompatibility(person_1, person_2) {
    let score_arr = [
      [0, 40, 10, 10, 30, 20, 0, 10, 30, 20, 10, 0],
      [40, 20, 10, 10, 20, 30, 10, 0, 20, 30, 10, 0],
      [0, 10, 0, 20, 10, 10, 30, 20, 0, 10, 30, 40],
      [0, 10, 20, 10, 10, 10, 20, 30, 10, 0, 40, 30],
      [30, 20, 10, 10, 30, 20, 10, 10, 30, 40, 0, 0],
      [20, 30, 10, 10, 20, 0, 10, 10, 40, 30, 10, 0],
      [0, 10, 30, 20, 10, 10, 0, 40, 10, 10, 30, 20],
      [0, 0, 20, 30, 10, 10, 40, 0, 10, 10, 20, 30],
      [30, 20, 0, 10, 30, 40, 10, 10, 10, 20, 10, 0],
      [20, 30, 10, 0, 40, 30, 10, 10, 20, 0, 10, 0],
      [0, 10, 30, 40, 0, 10, 30, 20, 10, 10, 40, 20],
      [0, 10, 40, 30, 10, 0, 20, 30, 10, 10, 20, 30],
    ]
    return score_arr[person_1.year][person_2.year]
  }

  public async scoreForPercentage(param) {
    //brute force version
    let score = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
    if (param === 1) {
      score = [
        0, 0, 0, 10, 10, 0, 0, 10, 0, 0, 10, 0, 10, 0, 0, 0, 0, 0, 0, 0, 20, 0, 10, 0, 10, 0, 0, 0,
        0, 0, 10,
      ]
    } else if (param === 2) {
      score = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 10, 20, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 20,
        10, 0,
      ]
    } else if (param === 3) {
      score = [
        10, 10, 0, 0, 10, 10, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0,
        10, 0, 0,
      ]
    } else if (param === 4) {
      score = [
        0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 10,
        0, 10, 10,
      ]
    } else if (param === 5) {
      score = [
        10, 0, 10, 0, 0, 10, 10, 10, 10, 10, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        10, 10, 0,
      ]
    } else if (param === 6) {
      score = [
        10, 10, 10, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0,
        0, 0, 0, 0,
      ]
    } else if (param === 7) {
      score = [
        0, 0, 10, 0, 0, 0, 0, 10, 0, 10, 10, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 10,
        0, 0, 0, 0,
      ]
    } else if (param === 8) {
      score = [
        0, 10, 10, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 10, 0, 0, 0, 0, 0, 10, 0, 10, 0, 0, 0, 0,
        10, 0, 0,
      ]
    } else if (param === 9) {
      score = [
        0, 10, 10, 10, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 0, 10, 0, 0, 0,
        0, 0, 10,
      ]
    } else if (param === 10) {
      score = [
        10, 0, 0, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 10,
        0, 0, 10,
      ]
    } else if (param === 11) {
      score = [
        0, 0, 0, 0, 0, 20, 20, 10, 0, 0, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0,
        10, 0, 0,
      ]
    } else if (param === 12) {
      score = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 0, 10, 0, 0, 10, 10,
        0, 10, 0,
      ]
    }
    return score
  }

  public async scoreForCID(cid) {
    let last_digit = cid % 10
    //better version of thought
    let score = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
    if (last_digit === 1) {
      score[5] = 20
      score[7] = 20
      score[14] = 20
      score[24] = 20
      score[28] = 20
    } else if (last_digit === 2) {
      score[1] = 20
      score[2] = 20
      score[10] = 20
      score[16] = 20
      score[26] = 20
    } else if (last_digit === 3) {
      score[4] = 20
      score[12] = 20
      score[19] = 20
      score[20] = 20
      score[30] = 20
    } else if (last_digit === 4) {
      score[3] = 20
      score[8] = 20
      score[15] = 20
      score[17] = 20
      score[26] = 20
    } else if (last_digit === 5) {
      score[11] = 20
      score[13] = 20
      score[22] = 20
      score[24] = 20
      score[25] = 20
    } else if (last_digit === 6) {
      score[6] = 20
      score[9] = 20
      score[19] = 20
      score[23] = 20
      score[24] = 20
    } else if (last_digit === 7) {
      score[16] = 20
      score[17] = 20
      score[21] = 20
      score[29] = 20
      score[30] = 20
    } else if (last_digit === 8) {
      score[0] = 20
      score[1] = 20
      score[5] = 20
      score[22] = 20
      score[28] = 20
    } else if (last_digit === 9) {
      score[1] = 20
      score[3] = 20
      score[8] = 20
      score[10] = 20
      score[25] = 20
    } else if (last_digit === 0) {
      score[10] = 20
      score[15] = 20
      score[21] = 20
      score[24] = 20
      score[29] = 20
    }
    return score
  }
}
