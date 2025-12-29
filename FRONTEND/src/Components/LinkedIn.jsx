const LinkedIn = () => {
  const testimonial = [
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439567/WhatsApp_Image_2025-07-24_at_6.02.57_PM_yd5wgb.jpg" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439524/20_ycdjkc.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439523/1_vdp4xo.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439522/2_rpntpz.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439521/4_hc6o6c.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439519/5_xj9c11.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439518/3_ugsiw6.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439517/7_sjy84v.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439516/6_emfct6.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439515/8_dxnucx.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439513/9_jtdioo.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439512/11_l0w3pt.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439512/10_jwwubl.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439511/12_gnfxye.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439508/13_mehjpq.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439506/14_nequ0f.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439506/16_wfehxb.png" , size:"1"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439506/15_muwiws.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439503/17_xgwqol.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439501/19_iybdot.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439501/18_b0et54.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439500/21_iavo2a.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439496/2_bunlkz.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439496/3_wgusdd.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439495/9_plrsxj.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439493/1_x55sl8.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439491/4_hzj8nb.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439489/6_qmrdkc.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439488/8_njegz0.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439487/10_php4de.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439486/12_f2utvq.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439485/14_tvr3ey.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439484/16_jmfk80.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439482/18_gkspxu.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439481/20_lsqzsv.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439480/22_dfunri.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439479/24_btp1rw.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439478/23_djrqze.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439477/21_awjytv.png" , size:"normal"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439475/19_n2uywn.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439474/17_dslog0.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439474/15_runv9x.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439474/5_x3ntq3.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439473/13_xw2nmi.png" , size:"tall"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439473/11_f7blut.png" , size:"wide"},
    { img:"https://res.cloudinary.com/dzqtl9zvg/image/upload/v1753439472/7_dxdjaf.png" , size:"wide"},
  ];

  // Helper function to assign dynamic grid classes
  // const getGridClass = (index) => {
  //   if (index % 7 === 0) return "big";
  //   if (index % 5 === 0) return "wide";
  //   if (index % 3 === 0) return "tall";
  //   return "";
  // };

  return (
    <div id="linkedin__testimonial">
      <div className="main__container">
        <div className="grid-wrapper">
          {testimonial.map((item, index) => (
            <div key={index} className={item.size}>
              <img src={item.img} alt={`Testimonial ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LinkedIn;
