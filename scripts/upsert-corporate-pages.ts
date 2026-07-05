// Kurumsal alt sayfalarını (Vizyon & Misyon, Kalite, İK, Belgelerimiz) dinamik Page
// tablosuna yazar. Panelde "Sayfalar" bölümünden düzenlenebilir olurlar; site /[slug]
// altında render eder. SADECE Page tablosuna dokunur (migration gerektirmez, güvenli).
// Çalıştırma:  npx tsx scripts/upsert-corporate-pages.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Loc = { tr: string; en: string; ar: string };
type PageDef = { slug: string; title: Loc; body: Loc; seoDesc: Loc };

const pages: PageDef[] = [
  {
    slug: "vizyon-ve-misyon",
    title: { tr: "Vizyon ve Misyon", en: "Vision & Mission", ar: "الرؤية والرسالة" },
    seoDesc: {
      tr: "Akuçar Nakliyat vizyon ve misyonu: kaliteyi yaşam biçimi edinen, insana saygılı, sürdürülebilir verimlilik odaklı taşımacılık.",
      en: "Akuçar's vision and mission: transport built on quality as a way of life, respect for people and sustainable efficiency.",
      ar: "رؤية ورسالة أكوتشار: نقل قائم على الجودة كأسلوب حياة واحترام الإنسان والكفاءة المستدامة.",
    },
    body: {
      tr: "VİZYON\n\nKaliteyi bir yaşam biçimi olarak benimseyen; doğruluk ve güveni en önemli değeri sayan Akuçar Nakliyat, kuruluşundan bu yana 'insana saygı' temelli bir yönetim anlayışıyla hizmet veriyor. Farklılık yaratarak taşımacılık sektöründe kalıcı üstünlük sağlamayı, değer üretmeyi ve ilkelerimiz doğrultusunda müşterilerimize sürdürülebilir verimlilik sunmayı hedefliyoruz.\n\nMİSYON\n\nMüşterilerimize hızlı, ekonomik ve yenilikçi bir anlayışla hizmet vererek onların kendi işlerine odaklanmasını sağlamak; beklentileri istikrarlı kalite anlayışıyla karşılamak. Uluslararası kabul görmüş kalite standartlarını esas alarak insana, doğaya ve topluma saygılı biçimde; teknolojiye ve insan kaynağına sürekli yatırım yaparak müşterilerimizin verimliliğini her zaman en üst düzeyde tutmak.",
      en: "VISION\n\nEmbracing quality as a way of life and holding honesty and trust as our highest values, Akuçar has served with a management approach rooted in 'respect for people' since its founding. We aim to create lasting advantage in the transport sector by making a difference, generating value, and delivering sustainable efficiency to our customers in line with our principles.\n\nMISSION\n\nTo serve our customers with a fast, economical and innovative approach so they can focus on their core business, and to meet their expectations with consistent quality. Building on internationally recognised quality standards — respectful of people, nature and society — we invest continuously in technology and human resources to keep our customers' efficiency at the highest level.",
      ar: "الرؤية\n\nتتبنى أكوتشار الجودة أسلوبَ حياة، وتصون الصدق والثقة بوصفهما أهمّ قيمها، وتخدم منذ تأسيسها بنهج إداري قائم على 'احترام الإنسان'. نهدف إلى تحقيق تفوّق دائم في قطاع النقل عبر صناعة الفارق وخلق القيمة وتقديم كفاءة مستدامة لعملائنا وفق مبادئنا.\n\nالرسالة\n\nأن نخدم عملاءنا بنهج سريع واقتصادي ومبتكر ليتفرّغوا لأعمالهم الأساسية، وأن نلبّي توقعاتهم بجودة ثابتة. واستنادًا إلى معايير الجودة المعترف بها دوليًا، وباحترام للإنسان والطبيعة والمجتمع، نستثمر باستمرار في التكنولوجيا والموارد البشرية لإبقاء كفاءة عملائنا في أعلى مستوى.",
    },
  },
  {
    slug: "kalite-politikamiz",
    title: { tr: "Kalite Politikamız", en: "Quality Policy", ar: "سياسة الجودة" },
    seoDesc: {
      tr: "Akuçar Nakliyat kalite politikası: koşulsuz müşteri memnuniyeti, ISO 9001 ve sürekli iyileştirme.",
      en: "Akuçar quality policy: unconditional customer satisfaction, ISO 9001 and continuous improvement.",
      ar: "سياسة الجودة في أكوتشار: رضا العملاء غير المشروط وISO 9001 والتحسين المستمر.",
    },
    body: {
      tr: "Akuçar Nakliyat olarak kalite, her sürecimizin merkezindedir. Taahhütlerimiz:\n\n• Müşterilerimizin ihtiyaç ve beklentilerini tam olarak tespit edip karşılayarak koşulsuz müşteri memnuniyeti sağlamak.\n• Maliyet, süre ve kalite açısından müşteriyi memnun etmek; operasyon bazında şikâyetleri en aza indirmek.\n• Hizmette 'güvenilir firma' algısını sürekli kılmak.\n• Personelimizin gelişimini destekleyen eğitimleri sürekli hale getirmek.\n• Yılda en az iki kez iç tetkik yaparak düzeltici ve önleyici iyileştirmeler uygulamak.\n• ISO 9001 kalite yönetim sistemini uygulamak ve sürekli iyileştirmek.\n• Tüm hizmetlerimizi yürürlükteki mevzuat ve yasalara tam uyumla gerçekleştirmek.",
      en: "At Akuçar, quality sits at the heart of every process. Our commitments:\n\n• Ensuring unconditional customer satisfaction by fully identifying and meeting our customers' needs and expectations.\n• Satisfying customers in terms of cost, time and quality, and minimising complaints at the operational level.\n• Sustaining our reputation as a 'reliable company' in service.\n• Continuously providing training that supports our staff's development.\n• Conducting internal audits at least twice a year and applying corrective and preventive improvements.\n• Operating and continuously improving an ISO 9001 quality management system.\n• Carrying out all our services in full compliance with applicable regulations and laws.",
      ar: "في أكوتشار، تقع الجودة في قلب كل عملية لدينا. التزاماتنا:\n\n• تحقيق رضا العملاء غير المشروط عبر تحديد احتياجاتهم وتوقعاتهم وتلبيتها بالكامل.\n• إرضاء العميل من حيث التكلفة والوقت والجودة، وتقليل الشكاوى على مستوى العمليات إلى أدنى حد.\n• الحفاظ على صورة 'الشركة الموثوقة' في الخدمة.\n• الاستمرار في تقديم التدريب الذي يدعم تطوّر موظفينا.\n• إجراء تدقيق داخلي مرتين سنويًا على الأقل وتطبيق تحسينات تصحيحية ووقائية.\n• تطبيق نظام إدارة الجودة ISO 9001 وتحسينه باستمرار.\n• تنفيذ جميع خدماتنا بالامتثال الكامل للأنظمة والقوانين السارية.",
    },
  },
  {
    slug: "insan-kaynaklari-politikamiz",
    title: { tr: "İnsan Kaynakları Politikamız", en: "Human Resources Policy", ar: "سياسة الموارد البشرية" },
    seoDesc: {
      tr: "Akuçar Nakliyat insan kaynakları politikası: eğitim, gelişim ve adil kariyer planlaması.",
      en: "Akuçar human resources policy: training, development and fair career planning.",
      ar: "سياسة الموارد البشرية في أكوتشار: التدريب والتطوير وتخطيط المسار المهني بعدالة.",
    },
    body: {
      tr: "Değerli çalışanlarımızın; mutlu bir aile ortamında, gelişime ve yeniliğe açık, motivasyonu ve iletişimi yüksek, yaratıcı ve toplam kalite anlayışıyla çalıştığı verimli bir şirket iklimi sunmayı hedefliyoruz. Bu hedefe ulaşmanın yolunun eğitimden ve çalışanlarımıza değer vermekten geçtiğinin bilincindeyiz. Düzenli eğitim ve motivasyon faaliyetleriyle ekibimizi destekliyor; şirket kültürünün benimsenmesini ve kuruma bağlılığı güçlendirmeyi amaçlıyoruz.\n\nEğitim ve Gelişim\n\nMüşteri memnuniyetini etkileyen en önemli unsurun eğitim olduğu inancıyla; oryantasyon, sektörel eğitimler, kişisel gelişim, kariyer ve bilgi teknolojileri başlıklarında düzenli eğitimler planlıyoruz.\n\nKariyer Planlama\n\nÇalışanlarımızın teknik ve mesleki bilgisi, yetkinlikleri ve performansı doğrultusunda kariyer hedeflerine ulaşacakları yolu belirliyor; kurum içi gelişim ve terfileri adil biçimde yönetiyoruz.\n\nGenç ve dinamik ekibimizin bir parçası olmak isterseniz, başvurularınızı bizimle paylaşabilirsiniz.",
      en: "We aim to offer an efficient company climate where our valued employees work in a happy, family atmosphere — open to growth and innovation, high in motivation and communication, creative, and guided by a total-quality mindset. We know the path to this goal runs through training and caring for our people. Through regular training and motivation activities we support our team and strengthen commitment to our company culture.\n\nTraining and Development\n\nBelieving that training is the most important factor affecting customer satisfaction, we plan regular programmes in orientation, sector-specific training, personal development, career and information technologies.\n\nCareer Planning\n\nIn line with our employees' technical and professional knowledge, competencies and performance, we map the path to their career goals and manage internal development and promotions fairly.\n\nIf you would like to be part of our young and dynamic team, you are welcome to share your application with us.",
      ar: "نهدف إلى توفير مناخ عمل فعّال يعمل فيه موظفونا الكرام في أجواء عائلية سعيدة، منفتحين على التطور والابتكار، بدافعية وتواصل عاليين، وبعقلية الجودة الشاملة. وندرك أن الطريق إلى هذا الهدف يمرّ عبر التدريب والاهتمام بموظفينا. ومن خلال أنشطة تدريب وتحفيز منتظمة ندعم فريقنا ونعزّز الانتماء إلى ثقافة شركتنا.\n\nالتدريب والتطوير\n\nإيمانًا بأن التدريب هو أهمّ عامل يؤثّر في رضا العملاء، نخطّط لبرامج منتظمة في التهيئة والتدريب القطاعي والتطوير الشخصي والمسار المهني وتقنيات المعلومات.\n\nتخطيط المسار المهني\n\nوفق المعرفة الفنية والمهنية لموظفينا وكفاءاتهم وأدائهم، نرسم الطريق نحو أهدافهم المهنية وندير التطور والترقيات الداخلية بعدالة.\n\nإذا رغبت في الانضمام إلى فريقنا الشاب والديناميكي، يسعدنا أن تشاركنا طلبك.",
    },
  },
  {
    slug: "belgelerimiz",
    title: { tr: "Belgelerimiz", en: "Certificates", ar: "شهاداتنا" },
    seoDesc: {
      tr: "Akuçar Nakliyat yetki belgeleri ve sertifikaları: ISO 9001, C2, ADR, TIR ve daha fazlası.",
      en: "Akuçar authorisations and certificates: ISO 9001, C2, ADR, TIR and more.",
      ar: "تصاريح وشهادات أكوتشار: ISO 9001 وC2 وADR وTIR وغيرها.",
    },
    body: {
      tr: "Akuçar Nakliyat, faaliyetlerini ulusal ve uluslararası standartlara uygun biçimde yürütür. Sahip olduğumuz yetki belgeleri ve sertifikalar, sunduğumuz hizmetin güvenilirliğini ve kalitesini belgeler:\n\n• Marka Tescil Belgesi\n• ISO 9001 Kalite Yönetim Sistemi\n• C2 Yetki Belgesi — uluslararası eşya taşımacılığı\n• ADR — tehlikeli madde taşıma yetkisi\n• TIR Karnesi — uluslararası transit taşıma\n• Yük Sigortası Poliçesi\n\nGüncel belge görsellerimizi talebiniz üzerine paylaşabiliriz.",
      en: "Akuçar conducts its operations in line with national and international standards. Our authorisations and certificates document the reliability and quality of the service we provide:\n\n• Trademark Registration Certificate\n• ISO 9001 Quality Management System\n• C2 Authorisation — international freight transport\n• ADR — dangerous goods transport authorisation\n• TIR Carnet — international transit transport\n• Cargo Insurance Policy\n\nWe are happy to share up-to-date images of our documents on request.",
      ar: "تُدير أكوتشار عملياتها وفق المعايير الوطنية والدولية. وتوثّق تصاريحنا وشهاداتنا موثوقية الخدمة التي نقدّمها وجودتها:\n\n• شهادة تسجيل العلامة التجارية\n• نظام إدارة الجودة ISO 9001\n• تصريح C2 — النقل الدولي للبضائع\n• ADR — تصريح نقل المواد الخطرة\n• دفتر TIR — النقل العابر الدولي\n• وثيقة تأمين الشحن\n\nيسعدنا مشاركة أحدث صور لوثائقنا عند الطلب.",
    },
  },
];

async function main() {
  for (const p of pages) {
    const data = { title: p.title, body: p.body, seoDesc: p.seoDesc, status: "PUBLISHED" as const };
    await prisma.page.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
    console.log("✓ upsert:", p.slug);
  }
  console.log(`\nToplam ${pages.length} kurumsal sayfa eklendi/güncellendi.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
