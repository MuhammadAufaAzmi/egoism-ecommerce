const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

content = content.replace(/import BlurText from \"@\/components\/ui\/reactbits\/BlurText\";/g, '');
content = content.replace(/import ScrollVelocity from \"@\/components\/ui\/reactbits\/ScrollVelocity\";/g, '');
content = content.replace(/import SpotlightCard from \"@\/components\/ui\/reactbits\/SpotlightCard\";/g, '');

content = 'import BlurText from "@/components/ui/reactbits/BlurText";\nimport ScrollVelocity from "@/components/ui/reactbits/ScrollVelocity";\nimport SpotlightCard from "@/components/ui/reactbits/SpotlightCard";\n' + content;

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log('Fixed imports');
