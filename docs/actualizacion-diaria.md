# Actualización diaria

Procedimiento que sigue la tarea programada (o cualquier persona) para actualizar `data/oportunidades.json`.

## Criterios

- **Zonas:** Núñez, Saavedra, Coghlan (CABA); Olivos, Vicente López, Florida, Florida Oeste, Martínez (GBA Norte).
- **Unidades:** 2 o más ambientes, 60 m² totales o más (o 55 m² cubiertos o más), entre USD 60.000 y 200.000.
- **Solo obra nueva:** en pozo, en construcción o recién terminada. Excluir usados, PH y reciclados aunque el portal los etiquete "a estrenar" o "en construcción".

## Fuentes y cómo leerlas

Todo se hace desde Chrome con la sesión del navegador, abriendo pestañas nuevas y cerrándolas al terminar.

### Zonaprop, avisos sueltos

Desde una pestaña en `zonaprop.com.ar`, pedir con `fetch` (mismo origen):

```
/departamentos-venta-{zona}-en-construccion-mas-50-m2-cubiertos-menos-200000-dolar.html
/departamentos-venta-{zona}-q-pozo-menos-200000-dolar.html
```

`zona` = `nunez`, `saavedra`, `coghlan`, `olivos`, `vicente-lopez-vicente-lopez`, `florida`, `florida-oeste`, `martinez`. Paginar con `-pagina-N.html`.

El HTML trae los avisos como JSON en objetos que empiezan con `{"postingId":`:

- precio: `"amount":N,"formattedAmount":"…","currency":"USD"`
- superficie: `"CFT100"` (total) y `"CFT101"` (cubierta)
- ambientes: `"CFT1"`
- barrio: `"location":{"locationId":…,"name":"…"`

Abrir cada candidato y confirmar en el texto visible que es pozo o construcción (entrega, anticipo, cuotas).

### Zonaprop, emprendimientos

`/emprendimientos-departamentos-{zona}-etapa-en-pozo.html` y `…-etapa-en-construccion.html`. Contar como disponibles solo las unidades del texto visible de la ficha (`Departamento … USD X Ym² tot.`). El JSON de la página incluye unidades ya vendidas.

### Mercado Libre

Desde `inmuebles.mercadolibre.com.ar`:

```
/departamentos/venta/{ruta}/_PriceRange_60000USD-200000USD_NoIndex_True_PROPERTY*AGE_0a%C3%B1os-0a%C3%B1os
```

Rutas: `capital-federal/nunez`, `capital-federal/saavedra`, `capital-federal/coghlan`, `bsas-gba-norte/vicente-lopez/olivos`, `bsas-gba-norte/vicente-lopez/vicente-lopez`, `bsas-gba-norte/vicente-lopez/florida`, `bsas-gba-norte/vicente-lopez/florida-oeste`, `bsas-gba-norte/san-isidro/martinez`. Paginar con `_Desde_49`, `_Desde_97`, …

Las tarjetas son `li.ui-search-layout__item`. En el aviso, leer la tabla de superficies y la descripción: Mercado Libre a veces pone la superficie total en el campo de cubierta.

### Argenprop

`/departamentos/venta/{zona}?estadodeobra-en-pozo`, solo si carga sin verificación humana. **Nunca resolver captchas.**

### Webs de desarrolladoras

`estudiokohon.com`, `grupobriones.com.ar`, `skaladesarrollos.com`, `lopez.com.ar`, `brikz.com.ar`. Sumar lanzamientos solo si hay precio y superficie.

## Fotos de cada oportunidad

La web muestra una vista previa con fotos del aviso (enlazadas al original, con crédito). Para cada oportunidad nueva cargar hasta 5 URLs en `photos`, la más apaisada y representativa primero, y la fuente en `photoCredit`.

- **Zonaprop:** en el HTML del aviso, tomar las URLs `https://imgar.zonapropcdn.com/avisos/resize/1/00/{id en pares}/1200x1200/{archivo}.jpg` cuya ruta contenga el `postingId` del aviso (así no se mezclan fotos de otros avisos). `photoCredit`: `"Zonaprop"`.
- **Mercado Libre:** en la galería del aviso, tomar los ids de imagen y armar `https://http2.mlstatic.com/D_NQ_NP_2X_{id}-F.webp`. `photoCredit`: `"Mercado Libre"`.
- Comprobar que cada foto carga. Si ninguna sirve, omitir `photos`: la tarjeta muestra un placeholder.
- Si un anunciante pide quitar fotos, borrar su `photos`. Para apagarlas en todo el sitio: `showPhotos: false` en `src/lib/site.ts`.

## Cómo actualizar el archivo

1. Poner `updated` con la fecha de hoy.
2. Para cada oportunidad que sigue publicada: conservar `id` y `first`. Si cambió el precio, agregar `[hoy, precio]` al final de `hist` y actualizar `usd`.
3. Sacar las que ya no están publicadas o ya no cumplen los criterios.
4. Agregar las nuevas con `first` = hoy, `hist` = `[[hoy, precio]]` y sus `photos` (ver arriba).
5. Copiar el archivo a `data/historial/AAAA-MM-DD.json`.
6. Correr `node scripts/validar.mjs`. Si falla, corregir antes de seguir.
7. Commit con el mensaje `datos: actualización AAAA-MM-DD (+N nuevas, −M salieron)` y push a `main`.
