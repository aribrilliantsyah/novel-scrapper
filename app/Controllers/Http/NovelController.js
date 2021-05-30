'use strict'
const { default: axios } = require('axios');
const AxiosServ = require('../../Helpers/AxiosServ');
const cheerio = require('cheerio');
const Env = use('Env');
const urlTarget = Env.get('URL_TARGET', 'https://meionovel.id/');

class NovelController {
  async test({request, response}) {
    let req = request.body;

    return response.json({
      'rc': 200,
      'rm': 'test',
    }, 200)
  }

  async read({request, response}) {
    let req = request.all();
    let path = '';
    let list_novel = [];
    let srv = new AxiosServ();

    console.log(req)

    if(req.page != undefined && req.page != ''){
      if(req.page > 0){
        path = `page/${req.page}`
      }else{
        return response.json({
          'rc': 422,
          'rm': 'Query page must be greater than 0',
          'request': req,
          'data': list_novel
        }, 422)
      }
    }
    try {
      let sRes = await srv.get(path);

      if (sRes.status != undefined && sRes.status == 200) {
        console.log(sRes.status)
        const $ = cheerio.load(sRes.data);
        let parent = $("#loop-content");
        let title, rating, cover, link, slug, chapters;
        // console.log(parent.html());
        parent.find('.page-item-detail').each((i, el) => {
          title = $(el).find('.item-summary div.post-title a').text().trim();
          rating = $(el).find('.rating').text().trim();
          cover = $(el).find('.item-thumb img').attr('data-src').trim();
          link = $(el).find('.item-summary a').attr('href').trim();
          slug = link.replace(urlTarget, '');
          slug = slug.replace('novel/', '');
          slug = slug.replace('/', '');
          chapters = [];
         
          let el_chap = $(el).find('.list-chapter .chapter-item');
          el_chap.each((i, el) => {
            chapters.push({
              'chapter': $(el).find('.chapter').text().trim(),
              'tl_type': $(el).find('.vol').text().trim(),
              'post_on': $(el).find('.post-on').text().trim(),
            })
          })
          
          list_novel.push({
            'title': title,
            'rating': rating,
            'cover': cover,
            'original_link': link,
            'slug': slug,
            'chapters': chapters
          })
        })

        // console.log('PAGE', sRes.data);
        return response.json({
          'rc': 200,
          'rm': 'Success get novels',
          'request': req,
          'data': list_novel
        }, 200)
      }
      
      return response.json({
        'rc': 400,
        'rm': 'Bad Request',
        'request': req,
        'data': list_novel
      }, 400)
    } catch (err) {
      return response.json({
        'rc': 400,
        'rm': err,
        'request': req,
        'data': list_novel
      }, 400)
    } 
  }

  async detail({request, response, params}) {
    let req = params;
    // console.log(req); return;
    let path = `novel/${req.novel_slug}`;
    let detail_novel = [];
    let srv = new AxiosServ();

    try {
      let sRes = await srv.get(path);

      if (sRes.status != undefined && sRes.status == 200) {
        console.log(sRes.status)
        const $ = cheerio.load(sRes.data);
        let box_detail = $(".summary_content");
        let title, rating, rank, alternative_title, authors, genres, type, tags, release, status, summary, img;

        title = $('.post-title h1').text().trim();
        rating = box_detail.find('.post-content .post-content_item span[property="ratingValue"]').text().trim();
        rating = `${rating}/${box_detail.find('.post-content .post-content_item span[property="bestRating"]').text().trim()}`;
        rank = box_detail.find('.post-content .post-content_item:nth-child(4) > div.summary-content').text().trim();
        alternative_title = box_detail.find('.post-content .post-content_item:nth-child(5) > div.summary-content').text().trim();
        authors = [];
        box_detail.find('.post-content .post-content_item .summary-content .author-content a').each((i, el) => {
          // console.log(i, el)
          authors[i] = $(el).text().trim();
        });
        genres = [];
        box_detail.find('.post-content .post-content_item .summary-content .genres-content a').each((i, el) => {
          genres[i] = $(el).text().trim();
        });
        type = box_detail.find('.post-content .post-content_item:nth-child(8) > div.summary-content').text().trim();
        tags = [];
        box_detail.find('.post-content .post-content_item .summary-content .tags-content a').each((i, el) => {
          tags[i] = $(el).text().trim();
        });
        release = box_detail.find('.post-status .post-content_item:nth-child(1) > div.summary-content').text().trim();
        status = box_detail.find('.post-status .post-content_item:nth-child(2) > div.summary-content').text().trim();
        img = $('.summary_image a img').attr('data-src');
        summary = $('.description-summary .summary__content').html().trim();

        let id = $('input.rating-post-id').val();

        detail_novel = {
          'id': id,
          'img': img,
          'title': title,
          'rating': rating,
          'rank': rank,
          'alternative_title': alternative_title,
          'authors': authors,
          'genres': genres,
          'type': type,
          'tags': tags,
          'release': release,
          'status': status,
          'summary': summary
        }

        return response.json({
          'rc': 200,
          'rm': 'Success get detail novel',
          'request': req,
          'data': detail_novel
        }, 200)
      }
      
      return response.json({
        'rc': 400,
        'rm': 'Bad Request',
        'request': req,
        'data': detail_novel
      }, 400)
    } catch (err) {
      return response.json({
        'rc': 400,
        'rm': err,
        'request': req,
        'data': detail_novel
      }, 400)
    } 
  }
}

module.exports = NovelController
