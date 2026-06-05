const fs = require('fs');

const path = 'src/app/checkout/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  'LOADING CHECKOUT DATA...': 'MEMUAT DATA CHECKOUT...',
  'AN ERROR OCCURRED': 'TERJADI KESALAHAN',
  'TRY AGAIN': 'COBA LAGI',
  'REDIRECTING TO PAYMENT...': 'MENGALIHKAN KE PEMBAYARAN...',
  'YOUR CART IS EMPTY.': 'KERANJANG ANDA KOSONG.',
  'BACK TO SHOP': 'KEMBALI BELANJA',
  '>CART<': '>KERANJANG<',
  '>PAYMENT<': '>PEMBAYARAN<',
  'SHIPPING ADDRESS': 'ALAMAT PENGIRIMAN',
  '>CANCEL<': '>BATAL<',
  '>EDIT / ADD<': '>UBAH / TAMBAH<',
  '>ADD ADDRESS<': '>TAMBAH ALAMAT<',
  'No shipping address available.': 'Belum ada alamat pengiriman.',
  'ADD NEW ADDRESS': 'TAMBAH ALAMAT BARU',
  'Label (e.g., Home)': 'Label (contoh: Rumah)',
  'Recipient Name': 'Nama Penerima',
  'Phone Number': 'Nomor Telepon',
  'Full Address': 'Alamat Lengkap',
  'Street address...': 'Alamat jalan...',
  'City': 'Kota',
  'Province': 'Provinsi',
  'Select Province': 'Pilih Provinsi',
  'Postal Code': 'Kode Pos',
  'Email Address (For Order Updates)': 'Alamat Email (Untuk Info Resi)',
  'Your email address': 'Alamat email Anda',
  '>SAVING...<': '>MENYIMPAN...<',
  '>SAVE ADDRESS<': '>SIMPAN ALAMAT<',
  'SHIPPING': 'PENGIRIMAN',
  'Calculating shipping...': 'Menghitung ongkir...',
  '>RECALCULATE<': '>HITUNG ULANG<',
  'Add an address in My Account to calculate shipping.': 'Pilih atau tambah alamat untuk menghitung ongkir.',
  'Shipping not calculated.': 'Ongkir belum dihitung.',
  '>CALCULATE SHIPPING<': '>HITUNG ONGKIR<',
  'ORDER SUMMARY': 'RINGKASAN PESANAN',
  'Color:': 'Warna:',
  'Size:': 'Ukuran:',
  'Qty:': 'Jumlah:',
  'SUBTOTAL (': 'SUBTOTAL (',
  ' item)': ' barang)',
  'Menghitung...': 'Menghitung...',
  'FREE (JABODETABEK)': 'GRATIS (JABODETABEK)',
  'Butuh alamat': 'Butuh alamat',
  'Belum tersedia': 'Belum tersedia',
  'PROMO CODE': 'KODE PROMO',
  '>REMOVE<': '>HAPUS<',
  'ENTER CODE': 'MASUKKAN KODE',
  '>APPLY<': '>TERAPKAN<',
  '>DISCOUNT<': '>DISKON<',
  '>TOTAL<': '>TOTAL<',
  'Payment': 'Pembayaran',
  'Direct bank transfer (require manual payment confirmation)': 'Transfer manual (memerlukan konfirmasi pembayaran manual)',
  'We accept bank transfer payment via BCA bank.': 'Kami menerima pembayaran via transfer bank dan e-wallet. Detail akan diberikan pada halaman selanjutnya.',
  'Orders require approximately 7–8 working days to be processed before dispatch. Orders can be cancelled directly through your Account page as long as they have not been dispatched yet.': 'Pesanan membutuhkan waktu sekitar 7–8 hari kerja untuk diproses sebelum pengiriman. Pesanan dapat dibatalkan langsung melalui halaman Akun Anda selama pesanan belum dikirim.',
  'PLEASE ADD SHIPPING ADDRESS': 'SILAKAN TAMBAHKAN ALAMAT PENGIRIMAN',
  'CALCULATING SHIPPING...': 'MENGHITUNG ONGKIR...',
  'SHIPPING UNAVAILABLE': 'PENGIRIMAN TIDAK TERSEDIA',
  'PROCESSING ORDER...': 'MEMPROSES PESANAN...',
  '>PLACE ORDER<': '>BUAT PESANAN<'
};

for (const [key, value] of Object.entries(replacements)) {
  // Use regex to replace all occurrences if needed, or simple replace for exact strings
  // Simple split-join to replace all occurrences of exact strings
  content = content.split(key).join(value);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done translating checkout/page.tsx');
