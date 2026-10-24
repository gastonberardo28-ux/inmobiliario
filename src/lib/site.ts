// Copy y configuración del sitio. Los componentes solo renderizan.
export const site = {
  name: "Gemas en Pozo",
  tagline: "Departamentos en pozo por debajo del precio de su barrio",
  description:
    "Cada día revisamos los avisos de pozo y en construcción del corredor norte de Buenos Aires y marcamos los que cuestan menos por m² que la mediana de su barrio.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gastonberardo28-ux.github.io/inmobiliario",
  zones: ["Núñez", "Saavedra", "Coghlan", "Vicente López", "Olivos", "Florida", "Florida Oeste", "Martínez"],
  sources: ["Zonaprop", "Mercado Libre", "Argenprop", "Webs de desarrolladoras"],
  // Poner en false si algún anunciante pide que no mostremos sus fotos.
  showPhotos: true,
  contact: "gaston.berardo28@gmail.com",
  nav: [
    { href: "/", label: "Oportunidades" },
    { href: "/metodologia/", label: "Cómo calculamos" },
    { href: "/aviso-legal/", label: "Aviso legal" },
  ],
};

export const checklist = [
  "Pedí razón social y CUIT de la desarrolladora y del fiduciario.",
  "Pedí tres obras entregadas y andá a verlas.",
  "Preguntá si el precio es cerrado o al costo, y cómo se ajustan las cuotas.",
  "Verificá el número de permiso de obra en el municipio o en la Ciudad.",
  "Sumá entre 4% y 6% de gastos de escritura y sellos al precio.",
];

// Prefijo para assets propios cuando el sitio vive bajo un subpath (GitHub Pages).
export const asset = (p: string) => (process.env.NEXT_PUBLIC_BASE_PATH || "") + p;
