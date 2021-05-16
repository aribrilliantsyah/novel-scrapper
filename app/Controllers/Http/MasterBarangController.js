'use strict'

const MasterBarang = use('App/Models/MasterBarang')
const Encryption = require('node_triple_des')

class MasterBarangController {
  async get_list({request, response}) {
    let req = request.body;
    
    let query = MasterBarang.query()
    if(req.kode_kantor != undefined){
      query.where('kd_kantor', '=', req.kode_kantor)
    }

    let data = await query
      .select('master_barang.id_barang',
        'master_barang.barcode', 
        'master_barang.kode_barang', 
        'master_barang.nama_barang', 
        'master_barang.is_active',
        'master_barang.kd_kantor')
      .with('detailBarang.masterSatuan')
      .with('detailBarang.masterSubKategori.masterKategori',(builder) => {
        builder.select('master_kategori.id_kategori',
          'master_kategori.kode_kategori',
          'master_kategori.kategori')
      })
      .with('detailBarang.masterSubKategori', (builder) => {
        builder.select('master_sub_kategori.id_sub_kategori',
          'master_sub_kategori.id_kategori',
          'master_sub_kategori.kode_sub_kategori',
          'master_sub_kategori.sub_kategori')
      })
      .with('detailBarang', (builder) => {
        builder.select('detail_barang.id_barang',
          'detail_barang.kode_detail_barang',
          'detail_barang.kode_sku',
          'detail_barang.jenis_satuan',
          'detail_barang.id_satuan',
          'detail_barang.id_sub_kategori')
      })
      .fetch();
      
    let total = await query.getCount();
    // if(total > 0){
    //   data = JSON.stringify(data);
    //   console.log(data)
    //   data =  await Encryption.encrypt('J33R4!', data);
    //   console.log(data)
    // }else{
    //   data = '';
    // }

    // console.log(data)


    return response.json({
      'rc': 200,
      'rm': 'Berhasil Get Data',
      'data': {
        'results': data,
        'total': total
      },
    }, 200)
  }
}

module.exports = MasterBarangController
