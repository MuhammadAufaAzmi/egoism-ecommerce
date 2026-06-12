const fs = require('fs');
const files = [
  'src/lib/account.ts',
  'src/lib/admin-products.ts',
  'src/lib/admin.ts',
  'src/lib/checkout.ts',
  'src/lib/reviews.ts',
  'src/lib/wishlist.ts'
];
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('"use server"')) {
    content = content.replace(/"use server";\s*/, '');
    content = '"use server";\n' + content;
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed ' + f);
  }
});
