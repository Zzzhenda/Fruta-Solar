// Este es el archivo que faltaba y causaba el error de compilación.

// 1. Definimos el "tipo" de dato para un producto
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
  descripcion: string;
  origen: string;
  sostenibilidad: string;
  receta: string;
}

// 2. Exportamos la lista de productos iniciales
export const productosIniciales: Producto[] = [
  // Frutas Frescas
  {
    id: "FR001",
    nombre: "Manzanas Fuji",
    precio: 1200,
    stock: 150,
    categoria: "Frutas Frescas",
    imagen: "/images/manzana.png", // React usa la carpeta 'public/' como raíz
    descripcion: "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o postres.",
    origen: "Valle del Maule, Chile",
    sostenibilidad: "Certificación orgánica, técnicas de riego eficiente",
    receta: "Tarta de manzana casera"
  },
  {
    id: "FR002",
    nombre: "Naranjas Valencia",
    precio: 1000,
    stock: 200,
    categoria: "Frutas Frescas",
    imagen: "/images/Naranja.png",
    descripcion: "Jugosas y ricas en vitamina C, ideales para zumos frescos. Cultivadas en condiciones óptimas para asegurar dulzura y jugosidad.",
    origen: "La Serena, Chile",
    sostenibilidad: "Producción con control de agua y reducción de químicos",
    receta: "Jugo de naranja natural"
  },
  {
    id: "FR003",
    nombre: "Plátanos Cavendish",
    precio: 800,
    stock: 250,
    categoria: "Frutas Frescas",
    imagen: "/images/Platano.png",
    descripcion: "Plátanos dulces y maduros, ricos en potasio y vitaminas. Perfectos para desayunos o snacks energéticos.",
    origen: "Ecuador",
    sostenibilidad: "Cultivo responsable, apoyo a pequeños agricultores",
    receta: "Smoothie de plátano con avena"
  },
  // Productos Orgánicos
  {
    id: "VR001",
    nombre: "Zanahorias Orgánicas",
    precio: 900,
    stock: 100,
    categoria: "Productos Orgánicos",
    imagen: "/images/Carrotss-1.png",
    descripcion: "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins. Excelente fuente de vitamina A y fibra.",
    origen: "Región de O'Higgins, Chile",
    sostenibilidad: "Cultivo 100% libre de pesticidas",
    receta: "Jugo de zanahoria natural"
  },
  {
    id: "VR002",
    nombre: "Espinacas Frescas",
    precio: 700,
    stock: 80,
    categoria: "Productos Orgánicos",
    imagen: "/images/Espinaca.png",
    descripcion: "Espinacas frescas y nutritivas, ideales para ensaladas y batidos verdes. Cultivadas bajo prácticas orgánicas.",
    origen: "Región del Bío-Bío, Chile",
    sostenibilidad: "Producción orgánica certificada",
    receta: "Ensalada de espinacas frescas con nueces"
  },
  {
    id: "VR003",
    nombre: "Pimientos Tricolores",
    precio: 1500,
    stock: 120,
    categoria: "Productos Orgánicos",
    imagen: "/images/Pimiento.png",
    descripcion: "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos. Ricos en antioxidantes y vitaminas.",
    origen: "Región de Valparaíso, Chile",
    sostenibilidad: "Uso de fertilizantes naturales y riego eficiente",
    receta: "Salteado de pimientos con pollo"
  },
  // Lácteos y Orgánicos
  {
    id: "PO001",
    nombre: "Miel Orgánica",
    precio: 2500,
    stock: 50,
    categoria: "Lácteos y Orgánicos",
    imagen: "/images/Miel.png",
    descripcion: "Miel pura y orgánica, recolectada de colmenas naturales. Ideal para endulzar de manera saludable.",
    origen: "Región del Maule, Chile",
    sostenibilidad: "Apicultura orgánica y responsable",
    receta: "Tostadas con miel y frutos secos"
  },
  {
    id: "PO003",
    nombre: "Quinua Orgánica",
    precio: 3000,
    stock: 40,
    categoria: "Lácteos y Orgánicos",
    imagen: "/images/Quinua.png",
    descripcion: "Quinua orgánica de alta calidad, rica en proteínas y minerales, perfecta para ensaladas o guisos.",
    origen: "Región de Coquimbo, Chile",
    sostenibilidad: "Agricultura orgánica certificada",
    receta: "Ensalada de quinua con verduras"
  },
  {
    id: "PL001",
    nombre: "Leche Entera",
    precio: 1200,
    stock: 60,
    categoria: "Lácteos y Orgánicos",
    imagen: "/images/Leche.png",
    descripcion: "Leche fresca y natural, ideal para consumo diario o preparación de recetas. Producto lácteo de calidad.",
    origen: "Región del Bío-Bío, Chile",
    sostenibilidad: "Ganadería responsable y control de calidad",
    receta: "Batido de frutas con leche"
  }
];