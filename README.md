# Gemas en Pozo

Web que lista departamentos en pozo y en construcción del corredor norte de Buenos Aires (Núñez, Saavedra, Coghlan, Vicente López, Olivos, Florida, Florida Oeste y Martínez) que cuestan menos por m² que la mediana de su barrio. Se actualiza todos los días.

## Cómo funciona

```
Tarea programada diaria (Claude + Chrome)
        │  revisa Zonaprop, Mercado Libre, Argenprop y webs de desarrolladoras
        ▼
data/oportunidades.json  ──commit──▶  GitHub  ──Actions──▶  next build  ──▶  GitHub Pages
        │                                    │                        └─▶  Vercel (previews de cada PR)
        └─ data/historial/AAAA-MM-DD.json    └─ scripts/validar.mjs frena el deploy si los datos están mal
```

- **Next.js 15 + Tailwind 4, export estático.** El build lee `data/oportunidades.json` y genera la home, una página por oportunidad (con galería, comparación contra el barrio e historial), metodología, aviso legal, sitemap y robots. Sin servidor.
- **Código:** `src/app` (rutas), `src/components` (UI), `src/lib/data.ts` (cálculos), `src/lib/site.ts` (textos y configuración).
- **Datos en un solo archivo.** Cada oportunidad es un objeto en `items`. El historial de precios queda en `hist`.
- **Foto diaria.** Cada actualización guarda una copia en `data/historial/` para poder ver cómo cambia la oferta.
- **Validación.** Cada push corre `scripts/validar.mjs`. Si hay un error (precio fuera de rango, zona sin mediana, id duplicado, link roto), la web no se publica.

## Cómo se calcula el descuento

```
m² ponderado = m² cubiertos + 0,5 × m² descubiertos (balcón, terraza, patio)
descuento    = 1 − (precio ÷ m² ponderado) ÷ mediana USD/m² del barrio
gema         = descuento ≥ 15%
```

Las medianas están en `data/oportunidades.json` → `medians`. Revisarlas una vez por mes con los informes de Zonaprop Index, Mudafy o el GCBA.

## Formato de una oportunidad

| Campo | Qué es |
|---|---|
| `id` | Identificador estable, sin espacios. No cambiarlo nunca. |
| `name`, `zone` | Nombre o dirección del proyecto y barrio (tiene que existir en `medians`). |
| `amb`, `cub`, `ext` | Ambientes, m² cubiertos y m² descubiertos. |
| `usd` | Precio actual en dólares. Tiene que coincidir con el último valor de `hist`. |
| `fin`, `del`, `stage` | Forma de pago, entrega y etapa de obra. |
| `dev` | Solo hechos verificables: razón social o "No informada en el aviso". |
| `note` | Una o dos oraciones propias. No copiar descripciones de los avisos. |
| `first`, `hist` | Fecha en que apareció y lista de `[fecha, precio]`. |
| `links` | Lista de `[texto, url]` al aviso original. |
| `photos`, `photoCredit` | Opcional. Hasta 5 URLs de fotos del aviso (la mejor primero) y la fuente ("Zonaprop", "Mercado Libre"). |

## Probar en tu compu

```bash
npm run validar   # revisa los datos y muestra el ranking
npm install
npm run dev       # sirve la web en http://localhost:3000
npm run build     # genera el sitio estático en out/
```

## Publicar

**GitHub Pages (producción actual).** Cada push a `main` valida, compila con `NEXT_PUBLIC_BASE_PATH=/inmobiliario` y publica `out/` en `https://gastonberardo28-ux.github.io/inmobiliario/`.

**Vercel (previews y, si querés, producción con dominio propio).** En vercel.com → Add New → Project → importar `inmobiliario`. Framework: Next.js, sin variables. Cada PR recibe un link de preview en un comentario. Para usar Vercel como producción, cargar el dominio en Settings → Domains y definir `NEXT_PUBLIC_SITE_URL` con esa URL.

## Actualización diaria

El procedimiento completo está en [`docs/actualizacion-diaria.md`](docs/actualizacion-diaria.md). Lo ejecuta una tarea programada de Claude que usa el Chrome de una computadora prendida, porque los portales bloquean las búsquedas automáticas desde servidores.

## Límites y cuidados legales

- Mostramos datos fácticos del aviso (precio, superficie, zona, entrega) y el link a la fuente. No se copian descripciones.
- Las fotos se muestran enlazadas al servidor original, con crédito y link al aviso. Si un anunciante lo pide, se quitan; `showPhotos: false` en `src/lib/site.ts` las apaga todas.
- Los términos de uso de Zonaprop y Mercado Libre restringen la extracción automática para uso comercial. **Antes de monetizar o escalar, hacer una consulta legal** y evaluar acuerdos directos con inmobiliarias y desarrolladoras.
- No publicar juicios sobre empresas con nombre propio. El campo `dev` lleva solo hechos.
- No es una tasación ni una recomendación de inversión. El aviso al pie de la web lo dice.

## Próximos pasos

- Alertas por mail o WhatsApp cuando aparece una gema nueva.
- Fuentes propias: formulario para que desarrolladoras carguen sus lanzamientos.
- Mover la actualización a un servidor propio cuando haya acuerdos de datos.
