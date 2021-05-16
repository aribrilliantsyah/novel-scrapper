const axios = require("axios").default;
const Env = use('Env');
axios.defaults.baseURL = Env.get('URL_TARGET', '');

class AxiosServ {
  async get(path) {
    console.log('PATH: ', path)
    return new Promise(async (resolve, reject) => {
      const target = path == null ? path : encodeURI(path)
      try {
        const response = await axios.get(target)
        if (response.status === 200) {
          return resolve(response)
        }
        return reject(response)
      } catch (error) {
        return reject(error.message)
      }
    })
  }

  async post(path, params) {
    console.log('PATH: ', path)
    // console.log('PATH: ', params)
    // const headers = {
    //   ':authority': 'application/json',
    //   'Authorization': 'JWT fefege...'
    // }
    return new Promise(async (resolve, reject) => {
      const target = path == null ? path : encodeURI(path)
      try {
        await axios({
          method: "post",
          url: target,
          data: params,
          headers: { 
            "accept": "*/*",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest",
            "cookie": "wordpress_15e8e765acc7925d1147580244ae2825=aribrilliantsyah%7C1621055767%7CTYrXdc7BmWBjdzYbPlgPbxUbOVuzsMPyWeFJBjhoEmX%7Cbabb58fa0b04471e68e0c309ee19ad2c626a240799497e380a9909843683d72d; __cfduid=df781723bc5936e8d4f78f0a2f65694ed1619845956; _ga=GA1.2.1219985146.1619845964; __gads=ID=088e93d4db749e07-2258f0dbbbc700fa:T=1619845965:RT=1619845965:S=ALNI_ManelIhlRiNUyorveLsV6V_pGLF8Q; wordpress_logged_in_15e8e765acc7925d1147580244ae2825=aribrilliantsyah%7C1621055767%7CTYrXdc7BmWBjdzYbPlgPbxUbOVuzsMPyWeFJBjhoEmX%7C17d77526512fa8649e23553a594719bebc24495eb9786454634154054b55c111; PHPSESSID=116881588eb4c1d8333d73aa1c575a0c; _gid=GA1.2.1049213579.1621054542; MarketGidStorage=%7B%220%22%3A%7B%7D%2C%22C962781%22%3A%7B%22page%22%3A1%2C%22time%22%3A1621064599862%7D%7D"
          },
        }).then((res) => {
          console.log('UH: ', res)
        }).catch((xhr) => {
          console.log('AH: ', xhr)
        })
        // if (response.status === 200) {
        //   return resolve(response)
        // }
        // return reject(response)
      } catch (error) {
        // return reject(error.message)
      }
    })
  }
}

module.exports = AxiosServ;