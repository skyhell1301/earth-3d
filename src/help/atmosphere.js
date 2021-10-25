export function getAtmosphere() {
    let atm = {}
    for (let key = -90; key < 91; key++) {
        atm[key] = {}
        for (let i = -180; i < 180; i++) {
            atm[key][i] = 0 //Math.round(Math.random() * 10)
        }
    }


    let clouds1 = createClouds(10, 120, 50, 70)
    let clouds2 = createClouds(0, 50, 30, 40)
    let clouds3 = createClouds(80, 160, 30, 50)
    let clouds4 = createClouds(100, 30, 70, 50)

    let clouds = [
        clouds1,
        clouds2,
        clouds3,
        clouds4,
    ]

    clouds.forEach(el => {
        for (let lat in el) {
            for (let lon in el[lat]) {
                atm[lat][lon] = el[lat][lon]
            }
        }
    })

    // min = 20
    // max = 40
    //
    // for (let j = min; j < max; j += step) {
    //   dataY[j] = parseInt(0);
    // }
    //
    // for (let i = 0; i < n; i += step) {
    //   let rand_num = randn_bm(min, max, 1);
    //   let rounded = round_to_precision(rand_num, step)
    //   dataY[rounded] += 1;
    // }
    //
    // i = 0
    // for(let key in dataY) {
    //   if(dataY[key] > i) i = dataY[key]
    // }
    // for(let key in dataY) {
    //   dataY[key] = dataY[key] / i * 10
    // }
    // console.log(dataY)
    return atm
}

/**
 * Расчет облака с нормальным распределением прозрачности
 * @param lon_max максимальный градус по долготе
 * @param lon_min минимальный градус по долготе
 * @param lat_max максимальный градус по широте
 * @param lat_min минимальный градус по широте
 * @return {{}}
 */
function createClouds(lon_min, lon_max, lat_min, lat_max) {
    let val = {}
    let lon_center = Math.round(lon_max - ((lon_max - lon_min) / 2))
    let lon_step = Math.round(Math.abs(lon_max - lon_min) / Math.abs(lat_max - lat_min))
    let lat_center = Math.round(lat_max - ((lat_max - lat_min) / 2))
    let min = lon_center - 1
    let max = lon_center + 1

    let flag = true

    for (let lat = lat_min; lat < lat_max; lat++) {

        if (lat === lat_center) flag = false

        let dataX = {};
        let n = 10000;
        let step = 1;

        for (let j = min; j < max; j += step) {
            dataX[j] = parseInt(0);
        }

        for (let i = 0; i < n; i += step) {
            let rand_num = randn_bm(min, max, 1);
            let rounded = round_to_precision(rand_num, step)
            dataX[rounded] += 1;
        }

        let i = 0
        for (let key in dataX) {
            if (dataX[key] > i) i = dataX[key]
        }
        for (let key in dataX) {
            dataX[key] = dataX[key] / i * 10
        }
        val[lat] = dataX

        if (flag) {
            min = min - lon_step
            max = max + lon_step
        } else {
            min = min + lon_step
            max = max - lon_step
        }

    }

    // for (let lat = 30; lat < 40; lat++) {
    //
    //   let dataX = {};
    //   let n = 10000;
    //   let step = 1;
    //
    //   for (let j = min; j < max; j += step) {
    //     dataX[j] = parseInt(0);
    //   }
    //
    //   for (let i = 0; i < n; i += step) {
    //     let rand_num = randn_bm(min, max, 1);
    //     let rounded = round_to_precision(rand_num, step)
    //     dataX[rounded] += 1;
    //   }
    //
    //   let i = 0
    //   for (let key in dataX) {
    //     if (dataX[key] > i) i = dataX[key]
    //   }
    //   for (let key in dataX) {
    //     dataX[key] = dataX[key] / i * 10
    //   }
    //   val[lat] = dataX
    //   min--
    //   max++
    // }


    return val
}


function randn_bm(min, max, skew) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
    return num;
}

const round_to_precision = (x, precision) => {
    let y = +x + (precision === undefined ? 0.5 : precision / 2);
    return y - (y % (precision === undefined ? 1 : +precision));
}