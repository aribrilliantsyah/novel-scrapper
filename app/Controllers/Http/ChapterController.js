'use strict'
const AxiosServ = require('../../Helpers/AxiosServ');
const cheerio = require('cheerio');
const Env = use('Env');
const urlTarget = Env.get('URL_TARGET', '');
const fetch = require('node-fetch');


class ChapterController {
  async read({request, response}) {
    let req = request.all();
    let path = `${urlTarget}wp-admin/admin-ajax.php`;
    let list_chapter = [];
    let srv = new AxiosServ();
    let id;
    // console.log(req)
    if(req.id == undefined || req.id == ''){
      return response.json({
        'rc': 422,
        'rm': 'Novel id required',
        'request': req,
      }, 422)
    }
    id = req.id;
    // console.log('id', id)

    try {
      let sRes = await fetch(path, {
        "headers": {
          "accept": "*/*",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-ch-ua": "\"Google Chrome\";v=\"89\", \"Chromium\";v=\"89\", \";Not A Brand\";v=\"99\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
        },
        "referrer": `${urlTarget}/novel/*`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `action=manga_get_chapters&manga=${id}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })

      let html = await sRes.text();
      // console.log(html)
      const $ = cheerio.load(html);
      let parent = $("ul.main");
      let slug, chapter;
      
      parent.find('li.parent').each((i, el) => {
        let chapters = [];
        // console.log('ww',el); return;
        $(el).find('.sub-chap .wp-manga-chapter').each((i, el) => {
          slug = $(el).find('a').attr('href').trim();
          slug = slug.replace(urlTarget, '');
          slug = slug.split('/');
          slug = slug[3];

          chapter = $(el).find('a').text().trim();

          chapters.push({
            'slug': slug,
            'chapter': chapter,
            'released_date': $(el).find('.chapter-release-date').text().trim(),
          })
        })
        
        list_chapter.push({
          'tl_type': $(el).find('.has-child').text().trim().toLowerCase(),
          'chapters': chapters,
        })
      })

      return response.json({
        'rc': 200,
        'rm': 'Success get chapters',
        'request': req,
        'data': list_chapter
      }, 200)
    } catch (err) {
      return response.json({
        'rc': 200,
        'rm': err,
        'request': req,
      }, 200)
    } 
  }

  async detail({request, response, params}) {
    let req = params;
    // console.log(req); return;
    let path = `novel/${req.novel_slug}/${req.tl_type}/${req.chapter_slug}`;
    let chapter_detail = [];
    let srv = new AxiosServ();

    try {
      let sRes = await srv.get(path);

      if (sRes.status != undefined && sRes.status == 200) {
        console.log(sRes.status)
        const $ = cheerio.load(sRes.data);
        let title, chapter, content, id_chap;

        title = $('.c-breadcrumb li:nth-child(2)').text().trim();
        chapter = $('.c-breadcrumb li:nth-child(3)').text().trim();
        content = $('.reading-content div.text-left').html().trim();
        id_chap = $('#wp-manga-current-chap').attr('data-id').trim();

        chapter_detail = {
          'id_chap': id_chap,
          'title': title,
          'chapter': chapter,
          'tl_type': req.tl_type,
          'content': content,
        }

        return response.json({
          'rc': 200,
          'rm': 'Success get detail chapter',
          'request': req,
          'data': chapter_detail
        }, 200)
      }
      
      return response.json({
        'rc': 400,
        'rm': 'Bad Request',
        'request': req,
        'data': chapter_detail
      }, 400)
    } catch (err) {
      return response.json({
        'rc': 400,
        'rm': err,
        'request': req,
        'data': chapter_detail
      }, 400)
    } 
  }
}

module.exports = ChapterController
