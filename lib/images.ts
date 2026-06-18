// Geçici placeholder görseller — TELİFSİZ (Pexels lisansı, ticari kullanıma uygun).
// Final aşamada (v3) müşterinin gerçek filo fotoğraflarıyla değiştirilecek.
// Tek kaynak (DRY): tüm bileşenler buradan beslenir. Tema bütünlüğü CSS overlay ile sağlanır.
const px = (id: number, w = 1600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}`;

export const images = {
  hero: px(11087837, 1920),
  corporate: px(2199293, 1200),
  services: {
    lebanon: px(12261472),
    syria: px(13569837),
    middleeast: px(1606957),
    turkey: px(2348359),
    customs: px(14020705),
  } as Record<string, string>,
  fleet: {
    tir: px(11087837),
    frigo: px(8909442),
    lowbed: px(2348359),
    konteyner: px(1427107),
    tenteli: px(12261472),
    parsiyel: px(1606957),
  } as Record<string, string>,
  news: {
    "suriye-hatti-yeniden": px(13569837),
    "filo-yenileme": px(8909442),
    "gumruk-surec-hizlandi": px(14020705),
  } as Record<string, string>,
};
