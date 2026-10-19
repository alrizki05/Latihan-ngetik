import { LevelItem } from '../types/typing';

export const LEVELS: LevelItem[] = [
  // --- TAHAP 1: BARIS DASAR (HOME ROW FOUNDATION) ---
  {
    id: 1,
    tier: 'home-row',
    tierTitle: 'Tahap 1: Baris Rumah (Home Row)',
    title: 'Level 1: Tombol Jangkar F & J',
    description: 'Letakkan telunjuk kiri pada tombol F dan telunjuk kanan pada tombol J (perhatikan tonjolan kecil penuntun pada keyboard Anda). Gunakan kedua ibu jari untuk spasi.',
    focusKeys: ['f', 'j', ' '],
    focusFingers: ['left-index', 'right-index', 'right-thumb'],
    targetWpm: 15,
    minAccuracy: 90,
    text: 'f j f j fj jf ff jj ff jj fff jjj fjf jfj ff jj f j fj jf'
  },
  {
    id: 2,
    tier: 'home-row',
    tierTitle: 'Tahap 1: Baris Rumah (Home Row)',
    title: 'Level 2: Jari Tengah D & K',
    description: 'Gunakan jari tengah kiri untuk tombol D dan jari tengah kanan untuk tombol K. Pertahankan telunjuk tetap bersiap di dekat F dan J.',
    focusKeys: ['d', 'k', 'f', 'j'],
    focusFingers: ['left-middle', 'right-middle', 'left-index', 'right-index'],
    targetWpm: 18,
    minAccuracy: 90,
    text: 'd k d k dk kd dd kk df jk dk fj kf dj df jk dk kd dd kk'
  },
  {
    id: 3,
    tier: 'home-row',
    tierTitle: 'Tahap 1: Baris Rumah (Home Row)',
    title: 'Level 3: Jari Manis S & L',
    description: 'Gunakan jari manis kiri untuk menekan tombol S dan jari manis kanan untuk menekan tombol L. Jaga pergelangan tangan tetap rileks.',
    focusKeys: ['s', 'l', 'd', 'k'],
    focusFingers: ['left-ring', 'right-ring', 'left-middle', 'right-middle'],
    targetWpm: 20,
    minAccuracy: 90,
    text: 's l s l sl ls ss ll sdk lkj sdf jkl sl dk fs jl sl ls sk dl'
  },
  {
    id: 4,
    tier: 'home-row',
    tierTitle: 'Tahap 1: Baris Rumah (Home Row)',
    title: 'Level 4: Jari Kelingking A & Titik Koma ;',
    description: 'Gunakan kelingking kiri untuk tombol A dan kelingking kanan untuk tombol titik koma (;). Kelingking adalah jangkar terluar baris dasar.',
    focusKeys: ['a', ';', 's', 'l'],
    focusFingers: ['left-pinky', 'right-pinky', 'left-ring', 'right-ring'],
    targetWpm: 20,
    minAccuracy: 90,
    text: 'a ; a ; a; ;a aa ;; asdf ;lkj as ;l fa ;j asdf ;lkj aa ;; asdf'
  },
  {
    id: 5,
    tier: 'home-row',
    tierTitle: 'Tahap 1: Baris Rumah (Home Row)',
    title: 'Level 5: Jangkauan Samping G & H',
    description: 'Geser telunjuk kiri sedikit ke kanan untuk meraih G, dan geser telunjuk kanan ke kiri untuk meraih H. Segera kembalikan ke F dan J setelah menekan.',
    focusKeys: ['g', 'h', 'f', 'j'],
    focusFingers: ['left-index', 'right-index'],
    targetWpm: 22,
    minAccuracy: 90,
    text: 'g h g h fg jh gf hj fg hj gh hg fgh jhg asdfg ;lkjh gh gh'
  },
  {
    id: 6,
    tier: 'home-row',
    tierTitle: 'Tahap 1: Baris Rumah (Home Row)',
    title: 'Level 6: Kata Perdana Baris Dasar',
    description: 'Mari menyusun kata-kata bermakna hanya menggunakan baris dasar (ASDF GH JKL;). Rasakan aliran ritme jari Anda.',
    focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring'],
    targetWpm: 25,
    minAccuracy: 92,
    text: 'asal dadah gajah fajar salah kalah jala laga hafal dahaga lada lafa'
  },

  // --- TAHAP 2: BARIS ATAS (TOP ROW EXPANSION) ---
  {
    id: 7,
    tier: 'top-row',
    tierTitle: 'Tahap 2: Baris Atas (Top Row)',
    title: 'Level 7: Telunjuk Atas R & U',
    description: 'Dari posisi dasar F dan J, dorong telunjuk kiri lurus ke atas untuk tombol R, dan telunjuk kanan ke atas untuk tombol U.',
    focusKeys: ['r', 'u', 'f', 'j'],
    focusFingers: ['left-index', 'right-index'],
    targetWpm: 25,
    minAccuracy: 92,
    text: 'r u r u fr ju rf uj rr uu fur jur ruf urf fur jur ruru urur rf ju'
  },
  {
    id: 8,
    tier: 'top-row',
    tierTitle: 'Tahap 2: Baris Atas (Top Row)',
    title: 'Level 8: Jari Tengah Atas E & I',
    description: 'Dorong jari tengah kiri ke atas untuk tombol E (huruf yang paling sering digunakan) dan jari tengah kanan untuk tombol I.',
    focusKeys: ['e', 'i', 'd', 'k'],
    focusFingers: ['left-middle', 'right-middle'],
    targetWpm: 26,
    minAccuracy: 92,
    text: 'e i e i de ki ed ik ee ii ded kik dei ied ide kide edik dedi kiki'
  },
  {
    id: 9,
    tier: 'top-row',
    tierTitle: 'Tahap 2: Baris Atas (Top Row)',
    title: 'Level 9: Jari Manis Atas W & O',
    description: 'Dorong jari manis kiri ke atas untuk tombol W, dan jari manis kanan ke atas untuk tombol O.',
    focusKeys: ['w', 'o', 's', 'l'],
    focusFingers: ['left-ring', 'right-ring'],
    targetWpm: 26,
    minAccuracy: 92,
    text: 'w o w o sw lo ws ol ww oo sow low owl wol sw lo wool slow wows'
  },
  {
    id: 10,
    tier: 'top-row',
    tierTitle: 'Tahap 2: Baris Atas (Top Row)',
    title: 'Level 10: Kelingking & Samping Q, P, T, Y',
    description: 'Raih Q dengan kelingking kiri, P dengan kelingking kanan, T dengan telunjuk kiri, dan Y dengan telunjuk kanan.',
    focusKeys: ['q', 'p', 't', 'y'],
    focusFingers: ['left-pinky', 'right-pinky', 'left-index', 'right-index'],
    targetWpm: 28,
    minAccuracy: 92,
    text: 'q p t y aq ;p ft jy qt py typ pot top quit poet type port party'
  },
  {
    id: 11,
    tier: 'top-row',
    tierTitle: 'Tahap 2: Baris Atas (Top Row)',
    title: 'Level 11: Fluensi Baris Dasar & Atas',
    description: 'Gabungan kata umum bahasa Indonesia yang menggunakan tombol baris dasar dan baris atas.',
    focusKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 30,
    minAccuracy: 93,
    text: 'teropong pulau warta roda pasir tidur kertas perahu sepatu kopi teh roti'
  },

  // --- TAHAP 3: BARIS BAWAH (BOTTOM ROW EXPANSION) ---
  {
    id: 12,
    tier: 'bottom-row',
    tierTitle: 'Tahap 3: Baris Bawah (Bottom Row)',
    title: 'Level 12: Telunjuk Bawah V & M',
    description: 'Tarik telunjuk kiri ke bawah sedikit condong ke kanan untuk V, dan telunjuk kanan ke bawah untuk M.',
    focusKeys: ['v', 'm', 'f', 'j'],
    focusFingers: ['left-index', 'right-index'],
    targetWpm: 28,
    minAccuracy: 92,
    text: 'v m v m fv jm vf mj vv mm fvm jmv vam mav vim mov vamp move vim'
  },
  {
    id: 13,
    tier: 'bottom-row',
    tierTitle: 'Tahap 3: Baris Bawah (Bottom Row)',
    title: 'Level 13: Jari Tengah Bawah C & Koma ,',
    description: 'Tarik jari tengah kiri ke bawah untuk tombol C, dan jari tengah kanan untuk tombol koma (,).',
    focusKeys: ['c', ',', 'd', 'k'],
    focusFingers: ['left-middle', 'right-middle'],
    targetWpm: 28,
    minAccuracy: 92,
    text: 'c , c , dc k, cd ,k cc ,, ace ice pic doc cari, kaca, cuka, cuci,'
  },
  {
    id: 14,
    tier: 'bottom-row',
    tierTitle: 'Tahap 3: Baris Bawah (Bottom Row)',
    title: 'Level 14: Jari Manis Bawah X & Titik .',
    description: 'Tarik jari manis kiri ke bawah untuk tombol X, dan jari manis kanan ke bawah untuk tombol titik (.).',
    focusKeys: ['x', '.', 's', 'l'],
    focusFingers: ['left-ring', 'right-ring'],
    targetWpm: 28,
    minAccuracy: 92,
    text: 'x . x . sx l. xs .l xx .. sax. mix. fox. max. lux. taksi. teks.'
  },
  {
    id: 15,
    tier: 'bottom-row',
    tierTitle: 'Tahap 3: Baris Bawah (Bottom Row)',
    title: 'Level 15: Kelingking Bawah Z, Garis Miring /, serta B & N',
    description: 'Raih Z dengan kelingking kiri, tombol garis miring (/) dengan kelingking kanan, serta B dan N dengan jari telunjuk.',
    focusKeys: ['z', '/', 'b', 'n'],
    focusFingers: ['left-pinky', 'right-pinky', 'left-index', 'right-index'],
    targetWpm: 30,
    minAccuracy: 92,
    text: 'z / b n az ;/ fb jn zip bin zen ban zon dan/atau zaman bina nano'
  },
  {
    id: 16,
    tier: 'bottom-row',
    tierTitle: 'Tahap 3: Baris Bawah (Bottom Row)',
    title: 'Level 16: Harmoni Tiga Baris Huruf',
    description: 'Selamat! Seluruh 26 huruf alfabet kini telah dikuasai oleh 10 jari Anda. Latih koordinasi mulus antar ketiga baris.',
    focusKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 32,
    minAccuracy: 93,
    text: 'zamrud bima candi makan jalan kabar malam sinar danau lembah wangi cakrawala'
  },

  // --- TAHAP 4: KAPITALISASI & SHIFT KEYS ---
  {
    id: 17,
    tier: 'shift-caps',
    tierTitle: 'Tahap 4: Huruf Kapital & Tombol Shift',
    title: 'Level 17: Shift Silang (Cross-Shift Rule)',
    description: 'Gunakan kelingking kanan untuk menekan Shift Kanan saat huruf kiri kapital (seperti A, S, D, F, E). Gunakan kelingking kiri untuk Shift Kiri saat huruf kanan kapital (J, K, L, O, P).',
    focusKeys: ['A', 'F', 'J', 'K', 'L', 'D'],
    focusFingers: ['left-pinky', 'right-pinky'],
    targetWpm: 30,
    minAccuracy: 93,
    text: 'Ada Saja Dari Fajar Jaya Kencana Lautan Danau Salju Kaca Matahari'
  },
  {
    id: 18,
    tier: 'shift-caps',
    tierTitle: 'Tahap 4: Huruf Kapital & Tombol Shift',
    title: 'Level 18: Kota & Pulau Nusantara',
    description: 'Latih kecepatan shift silang dengan nama-nama wilayah di Indonesia. Huruf kapital di awal kata melatih refleks jari kelingking.',
    focusKeys: ['Jakarta', 'Bandung', 'Surabaya', 'Medan'],
    focusFingers: ['left-pinky', 'right-pinky', 'left-index', 'right-index'],
    targetWpm: 34,
    minAccuracy: 94,
    text: 'Jakarta Bandung Surabaya Medan Makassar Denpasar Balikpapan Padang Palembang Manado Ambon'
  },

  // --- TAHAP 5: ANGKA & SIMBOL ---
  {
    id: 19,
    tier: 'numbers-symbols',
    tierTitle: 'Tahap 5: Angka & Simbol',
    title: 'Level 19: Menjelajah Baris Angka 1 sampai 0',
    description: 'Jangkau baris angka di atas dengan jari masing-masing tanpa mengangkat seluruh telapak tangan.',
    focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 30,
    minAccuracy: 92,
    text: 'tahun 1945 bulan 8 tanggal 17 pukul 10 pagi nomor 24 500 meter 365 hari'
  },
  {
    id: 20,
    tier: 'numbers-symbols',
    tierTitle: 'Tahap 5: Angka & Simbol',
    title: 'Level 20: Tanda Baca & Tanda Seru ? ! " - :',
    description: 'Tanda baca memerlukan kombinasi tombol Shift dan kelingking. Pertahankan ketelitian tinggi.',
    focusKeys: ['!', '?', '"', '-', ':', '(', ')'],
    focusFingers: ['left-pinky', 'right-pinky'],
    targetWpm: 32,
    minAccuracy: 93,
    text: 'Halo! Apa kabar? "Mengetik cepat", hemat 50% waktu: sangat efisien (luar biasa).'
  },

  // --- TAHAP 6: KATA POPULER & KELANCARAN BAHASA INDONESIA ---
  {
    id: 21,
    tier: 'indonesian-words',
    tierTitle: 'Tahap 6: Kelancaran Bahasa Indonesia',
    title: 'Level 21: Kata Penghubung & Kata Kunci Terpopuler',
    description: 'Latih pengetikan kata-kata yang menyusun lebih dari 50% pembicaraan sehari-hari dalam Bahasa Indonesia.',
    focusKeys: ['yang', 'untuk', 'dengan', 'tidak', 'ini', 'dari'],
    focusFingers: ['left-index', 'right-index', 'left-middle', 'right-middle'],
    targetWpm: 38,
    minAccuracy: 95,
    text: 'yang untuk dengan tidak ini dari mereka bisa menjadi akan dalam bahwa oleh kepada karena sangat'
  },
  {
    id: 22,
    tier: 'indonesian-words',
    tierTitle: 'Tahap 6: Kelancaran Bahasa Indonesia',
    title: 'Level 22: Rangkaian Kata Kerja & Kata Sifat',
    description: 'Tingkatkan irama mengetik terus menerus tanpa jeda (flow state) dengan kata-kata deskriptif.',
    focusKeys: ['belajar', 'bekerja', 'berpikir', 'berlari'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 40,
    minAccuracy: 95,
    text: 'belajar bekerja berpikir berjalan melihat mendengar membaca menulis cerdas tangkas cermat mandiri bahagia sukses'
  },

  // --- TAHAP 7: KALIMAT & PROSA INSPIRATIF ---
  {
    id: 23,
    tier: 'sentences-prose',
    tierTitle: 'Tahap 7: Kalimat & Prosa Inspiratif',
    title: 'Level 23: Peribahasa & Kearifan Tradisional',
    description: 'Ketik kalimat utuh lengkap dengan tanda koma dan titik penutup kalimat.',
    focusKeys: ['kalimat lengkap'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 42,
    minAccuracy: 95,
    text: 'Berakit-rakit ke hulu, berenang-renang ke tepian. Bersakit-sakit dahulu, bersenang-senang kemudian. Di mana bumi dipijak, di sana langit dijunjung.'
  },
  {
    id: 24,
    tier: 'sentences-prose',
    tierTitle: 'Tahap 7: Kalimat & Prosa Inspiratif',
    title: 'Level 24: Sains, Literasi & Dunia Modern',
    description: 'Kombinasi kosakata modern sains dan teknologi dengan variasi huruf vokal dan konsonan.',
    focusKeys: ['sains', 'teknologi'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 45,
    minAccuracy: 95,
    text: 'Kecerdasan komputasi dan teknologi informasi membuka peluang tanpa batas bagi mereka yang tekun melatih keterampilan digital setiap hari.'
  },
  {
    id: 25,
    tier: 'sentences-prose',
    tierTitle: 'Tahap 7: Kalimat & Prosa Inspiratif',
    title: 'Level 25: Kekuatan Disiplin 10 Jari',
    description: 'Refleksi mendalam tentang manfaat memori otot jari tangan dalam mempercepat pekerjaan dan karya nyata.',
    focusKeys: ['prosa'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 48,
    minAccuracy: 96,
    text: 'Ketika sepuluh jari bergerak lincah tanpa perlu melirik papan tombol, pikiran kita bebas melayang mengalirkan gagasan brilian langsung ke layar kaca.'
  },

  // --- TAHAP 8: MASTER & SPEED RUSH ---
  {
    id: 26,
    tier: 'master-speed',
    tierTitle: 'Tahap 8: Tingkat Master & Kecepatan Tinggi',
    title: 'Level 26: Uji Sprint Kecepatan 50+ WPM',
    description: 'Uji batas kecepatan Anda dengan aliran kata dinamis. Fokus pada ritme ketukan yang konstan.',
    focusKeys: ['sprint'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 50,
    minAccuracy: 95,
    text: 'gerak cepat kilat cahaya lompat tinggi tangguh juara terbang melesat fokus tajam tak tergoyahkan melaju deras menuju puncak prestasi sejati'
  },
  {
    id: 27,
    tier: 'master-speed',
    tierTitle: 'Tahap 8: Tingkat Master & Kecepatan Tinggi',
    title: 'Level 27: Sintaks Koding & Karakter Khusus',
    description: 'Tantangan khusus programmer: kurung kurawal, panah fungsi, dan titik koma.',
    focusKeys: ['{', '}', '=>', ';', '$'],
    focusFingers: ['left-pinky', 'right-pinky', 'left-middle', 'right-middle'],
    targetWpm: 42,
    minAccuracy: 94,
    text: 'const hitungTotal = (angka, rasio) => { return Math.round(angka * rasio) + 100; };'
  },
  {
    id: 28,
    tier: 'master-speed',
    tierTitle: 'Tahap 8: Tingkat Master & Kecepatan Tinggi',
    title: 'Level 28: Uji Akurasi Sempurna (Target 98%)',
    description: 'Pada level ini, akurasi adalah segalanya. Jangan terburu-buru, pastikan setiap sentuhan tepat sasaran.',
    focusKeys: ['akurasi'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 45,
    minAccuracy: 98,
    text: 'Ketepatan menentukan kesuksesan; pengetik sejati menghargai akurasi di atas segalanya, sebab memperbaiki kesalahan membuang lebih banyak waktu berharga.'
  },
  {
    id: 29,
    tier: 'master-speed',
    tierTitle: 'Tahap 8: Tingkat Master & Kecepatan Tinggi',
    title: 'Level 29: Grandmaster Speed Run (Target 60+ WPM)',
    description: 'Uji coba tingkat tinggi untuk pengetik profesional. Pertahankan koordinasi kesepuluh jari di atas 60 kata per menit.',
    focusKeys: ['grandmaster'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 60,
    minAccuracy: 96,
    text: 'Kecepatan sejati lahir dari ketenangan batin, posisi tubuh yang ergonomis, dan harmoni sempurna antara penglihatan dan refleks sepuluh jari tangan.'
  },
  {
    id: 30,
    tier: 'master-speed',
    tierTitle: 'Tahap 8: Tingkat Master & Kecepatan Tinggi',
    title: 'Level 30: Mahkota Dewa Keyboard (The Final Trial)',
    description: 'Ujian pamungkas! Teks lengkap perpaduan huruf kapital, tanda baca rumit, angka, dan kata-kata ekspresif. Buktikan Anda adalah Master 10 Jari sejati!',
    focusKeys: ['all'],
    focusFingers: ['left-pinky', 'left-ring', 'left-middle', 'left-index', 'right-index', 'right-middle', 'right-ring', 'right-pinky'],
    targetWpm: 65,
    minAccuracy: 97,
    text: 'Selamat! Pada tahun 2026 ini, Anda telah menguasai seni mengetik 10 jari: 100% tanpa melihat keyboard, efisiensi tinggi, dan presisi kelas dunia (Champion).'
  }
];

export const TIER_DESCRIPTIONS: Record<string, { label: string; count: number; badgeColor: string }> = {
  'home-row': { label: 'Tahap 1: Baris Rumah (Home Row)', count: 6, badgeColor: 'text-emerald-400' },
  'top-row': { label: 'Tahap 2: Baris Atas (Top Row)', count: 5, badgeColor: 'text-sky-400' },
  'bottom-row': { label: 'Tahap 3: Baris Bawah (Bottom Row)', count: 5, badgeColor: 'text-indigo-400' },
  'shift-caps': { label: 'Tahap 4: Huruf Kapital & Shift', count: 2, badgeColor: 'text-violet-400' },
  'numbers-symbols': { label: 'Tahap 5: Angka & Simbol', count: 2, badgeColor: 'text-amber-400' },
  'indonesian-words': { label: 'Tahap 6: Kelancaran Bahasa', count: 2, badgeColor: 'text-orange-400' },
  'sentences-prose': { label: 'Tahap 7: Kalimat & Prosa', count: 3, badgeColor: 'text-pink-400' },
  'master-speed': { label: 'Tahap 8: Master & Kecepatan', count: 5, badgeColor: 'text-rose-400' },
};
