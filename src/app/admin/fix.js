const fs = require("fs");
const path = "C:/Users/cperez/Documents/DEV/kft/frontend/src/app/admin/encuestas/page.tsx";
let content = fs.readFileSync(path, "utf8");
content = content.replace(/text-orange-600\\" : aceptacion >= 40 \\? \\"text-orange-600\\" : \\"text-red-600"/g, "'text-green-600' : aceptacion >= 40 ? 'text-orange-600' : 'text-red-600'");
fs.writeFileSync(path, content, "utf8");
console.log("Hecho");