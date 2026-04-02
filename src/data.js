const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const getMediaType = (filePath) =>
  /\.(mp4|webm|ogg)$/i.test(filePath) ? 'video' : 'image';

const loadMedia = (context) =>
  context
    .keys()
    .sort(naturalSort)
    .map((key) => ({
      src: context(key),
      type: getMediaType(key),
    }));

const cristalCarousel = loadMedia(
  require.context('./assets/fotos/residentes/cristaljacob/carousel', false, /\.(png|jpe?g|webp|mp4)$/i)
);

const ciroCarousel = loadMedia(
  require.context('./assets/fotos/residentes/cirobeltran/carousel', false, /\.(png|jpe?g|webp|mp4)$/i)
);

const kenjiCarousel = loadMedia(
  require.context('./assets/fotos/residentes/kenjisenda/carousel', false, /\.(png|jpe?g|webp|mp4)$/i)
);

const dafnaCarousel = loadMedia(
  require.context('./assets/fotos/residentes/dafnakojchen/carousel', false, /\.(png|jpe?g|webp|mp4)$/i)
);

const fernandoCarousel = loadMedia(
  require.context('./assets/fotos/residentes/fernandowanders/carousel', false, /\.(png|jpe?g|webp|mp4)$/i)
);

export const residentesData = {
  cristal: {
    nombre: 'Cristal Jacob',
    sections: [
      {
        type: 'text',
        content:
          'Cristal Jacob es una artista visual cuya práctica se define por una curiosidad insaciable y una búsqueda transdisciplinar que desafía los límites de los soportes tradicionales. A lo largo de su trayectoria, ha configurado un cuerpo de obra diverso donde la performance y el videoarte no son solo medios, sino lenguajes para interpelar la realidad. Su trabajo ha transitado por las profundidades de la pintura y la escultura, siempre impulsada por un deseo de desentrañar los mecanismos internos de la imagen y la forma.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/cristaljacob/carousel/cj (1).jpg'),
        alt: 'Cristal Jacob - Obra 1',
      },
      {
        type: 'text',
        content:
          'Sin embargo, el hito más transformador de su carrera se produjo hace una década, cuando decidió hacer de Tunquén su hogar y su centro de operaciones. Durante estos últimos diez años, Cristal ha habitado el territorio como una investigadora de lo invisible, descubriendo en el paisaje costero una riqueza de materialidades que han redefinido su estética. No solo observa el entorno; lo vive, lo respira y lo traduce. De esta convivencia íntima con la luz, el viento y la geología del lugar, surge su fascinación por los elementos que hoy definen el pulso de su trabajo: la transformación de la materia en su estado más puro.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/cristaljacob/carousel/cj (2).jpg'),
        alt: 'Cristal Jacob - Obra 2',
      },
      {
        type: 'text',
        content:
          'Bajo esta premisa de habitar la creación, Cristal Jacob construyó la Residencia CAT (Cultura y Arte de Tunquén). Lo que nació como un taller personal se expandió hasta convertirse en un espacio de apertura y generosidad, diseñado específicamente para compartir la riqueza material y emocional que ella misma descubrió en este borde costero. Para Cristal, la residencia es una extensión de su propia obra: un acto de construcción colectiva donde el espacio invita a otros creadores a sumergirse en la misma experimentación radical que ha marcado su última década de vida.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/cristaljacob/carousel/cj (3).jpg'),
        alt: 'Cristal Jacob - Obra 3',
      },
      {
        type: 'text',
        content:
          'En la actualidad, su labor como artista y gestora se funde en un solo propósito: ofrecer un refugio donde la experimentación no tenga miedo al error y donde la belleza de lo elemental —esa que reside en el polvo, la ceniza y la piedra— sea el motor de un nuevo diálogo artístico desde el corazón de Tunquén.',
      },
    ],
    carousel: cristalCarousel,
  },

  ciro: {
    nombre: 'Ciro Beltrán',
    sections: [
      {
        type: 'text',
        content:
          'Ciro Beltrán (Santiago, 1965) es una de las figuras más sólidas y reconocidas del arte contemporáneo chileno. Su trabajo, que se expande desde la pintura hacia la instalación y el objeto, ha sido exhibido en los centros artísticos más importantes del mundo, desde la Kunstakademie de Düsseldorf hasta museos en Asia, Europa y América.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/cirobeltran/cb.jpg'),
        alt: 'Ciro Beltrán - Obra',
      },
      {
        type: 'text',
        content:
          'En la Residencia CAT, Beltrán trae consigo una trayectoria marcada por la libertad del gesto y la búsqueda de nuevos soportes. Su obra no intenta representar el paisaje, sino encarnarlo. A través de su estética abstracta y el uso de materiales cargados de historia, Beltrán transforma la estancia en Tunquén en un proceso de síntesis, donde la fuerza del litoral se traduce en grandes formatos y trazos que exploran la memoria y la materia.\n\nTener a Ciro Beltrán como residente es consolidar un estándar de excelencia artística; es la unión entre la experiencia de un maestro internacional y la energía virgen de nuestro territorio.',
      },
    ],
    carousel: ciroCarousel.length
      ? ciroCarousel
      : [
          {
            src: require('./assets/fotos/residentes/cirobeltran/cb.jpg'),
            type: 'image',
          },
        ],
  },

  kenji: {
    nombre: 'Kenji Senda',
    sections: [
      {
        type: 'text',
        content:
          'Nacido en Santiago en 1984 y formado en la Escuela Arcis, Kenji Senda desarrolla una práctica donde el lenguaje surge de la tensión entre el rigor y el accidente. Su trabajo ha transitado por la gráfica, la performance y la escultura; disciplinas que hoy confluyen en un colapso matérico donde el medio cede ante la urgencia del resto. En su obra, la ruina es la imagen: un proceso que ocurre en el tiempo y que el artista intercepta.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/kenjisenda/carousel/ks (1).JPEG'),
        alt: 'Kenji Senda - Obra 1',
      },
      {
        type: 'text',
        content:
          'Su práctica renuncia a la construcción de totalidades para centrarse en el registro de lo que queda tras el desgaste. Es el resultado de un gesto obsesivo que acepta tanto la falla como el logro como parte de una misma búsqueda elemental',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/kenjisenda/carousel/ks (2).JPEG'),
        alt: 'Kenji Senda - Obra 2',
      },
      {
        type: 'text',
        content:
          'Nacido en Santiago el 11 de diciembre de 1984, Kenji Senda es un artista visual cuya identidad se teje en el cruce de tres mundos: Chile, Japón y Alemania. Esta herencia bicultural no es un dato menor en su biografía, sino el motor de una sensibilidad única que equilibra el rigor estructural germano-japonés con la urgencia matérica propia del contexto latinoamericano. Su obra es, en esencia, una síntesis entre la precisión del pensamiento y la vulnerabilidad de los materiales.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/kenjisenda/carousel/ks (3).JPEG'),
        alt: 'Kenji Senda - Obra 3',
      },
      {
        type: 'text',
        content:
          'Su camino en las artes comenzó a consolidarse en la Escuela Arcis (UNIACC), donde obtuvo la Licenciatura en Artes Visuales con menciones en Gráfica y Escultura. Esta formación dual definió la gramática de su trabajo actual: de la gráfica heredó el dominio del trazo, la capacidad de síntesis y la limpieza del gesto; de la escultura, la necesidad de confrontar el espacio tridimensional y de cuestionar la masa y el vacío con una mirada crítica. Para Senda, la obra no es un objeto estático, sino un cuerpo que ocupa un lugar y demanda una respuesta.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/kenjisenda/carousel/ks (4).JPEG'),
        alt: 'Kenji Senda - Obra 4',
      },
      {
        type: 'text',
        content:
          'A lo largo de su trayectoria, Kenji ha entendido la práctica artística no solo como una búsqueda estética, sino como un acto de acción social y política. Sus ejes temáticos se desplazan por territorios complejos, utilizando el arte como un dispositivo de diálogo y denuncia. A través de instalaciones y obras performáticas, Senda interpela las estructuras de poder tradicionales, cruzando su mirada con los discursos del feminismo y la inclusividad. En sus manos, el territorio deja de ser una representación del paisaje para convertirse en un espacio de disputa, una geografía donde la memoria colectiva y la resistencia individual se encuentran.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/kenjisenda/carousel/ks (5).JPEG'),
        alt: 'Kenji Senda - Obra 5',
      },
      {
        type: 'text',
        content:
          'En su etapa más reciente, esta búsqueda se ha radicalizado a través de una rigurosa economía de medios. Kenji Senda ha hecho del hallazgo su método: tras años de explorar la ciudad a través del cartón como símbolo de la precariedad urbana, su proceso ha descendido hacia lo elemental. Hoy, su trabajo se sumerge en la densidad de la arcilla, la oscuridad del carbón, la volatilidad de las cenizas y la humildad del polvo. En este tránsito hacia lo primario, Senda nos recuerda que el arte es, al fin y al cabo, un proceso de transmutación donde lo que parece desecho —el residuo del fuego o el rastro del tiempo— se convierte en el lenguaje sagrado de nuestra propia existencia.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/kenjisenda/carousel/ks (6).JPEG'),
        alt: 'Kenji Senda - Obra 6',
      },
    ],
    carousel: kenjiCarousel,
  },

  dafna: {
    nombre: 'Dafna Kojchen',
    sections: [
      {
        type: 'text',
        content:
          'Desde los ocho años, Tunquén no ha sido solo un paisaje para ella, sino un territorio íntimo de exploración y contemplación. Creció observando su transformación constante: las mareas que respiran, el viento que esculpe la arena, la luz que muta sobre el horizonte. Su cámara se convirtió en una extensión natural de su mirada; su ojo es la cámara, y la cámara, su forma de habitar el mundo.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/dafnakojchen/carousel/dk (1).JPEG'),
        alt: 'Dafna Kojchen - Fotografía 1',
      },
      {
        type: 'text',
        content:
          'A través de su obra, la artista ha construido un archivo sensible de Tunquén, registrando no solo sus cambios visibles, sino también sus pulsaciones invisibles. Su práctica se sitúa en la intersección entre lo íntimo y lo cósmico: una reflexión constante sobre la expansión infinita del universo y su resonancia en la naturaleza terrestre. En sus imágenes, el cielo dialoga con la arena, las constelaciones encuentran eco en las formas orgánicas, y el tiempo se manifiesta como una presencia viva.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/dafnakojchen/carousel/dk (2).JPEG'),
        alt: 'Dafna Kojchen - Fotografía 2',
      },
      {
        type: 'text',
        content:
          'Más que documentar un territorio, su trabajo propone una forma de conciencia. Cada fotografía es un acto de observación profunda, donde lo aparentemente cotidiano revela su dimensión cósmica. Tunquén aparece así no solo como un lugar geográfico, sino como un espacio de conexión entre lo humano y lo infinito.\n\nSu obra nos invita a detenernos, a mirar con atención y a comprender que la expansión del universo no ocurre únicamente en la distancia astronómica, sino también en cada pliegue de la naturaleza que habitamos.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/dafnakojchen/carousel/dk (3).JPEG'),
        alt: 'Dafna Kojchen - Fotografía 3',
      },
    ],
    carousel: dafnaCarousel,
  },

  fernando: {
    nombre: 'Fernando Wanders',
    sections: [
      {
        type: 'text',
        content:
          'La mirada de Fernando Wanders se sitúa en el umbral donde la fotografía deja de ser un mero registro para convertirse en un acto de justicia territorial. Su trabajo se articula desde el respeto profundo por el entorno, entendiendo la imagen como una herramienta de rescate y permanencia en un mundo que a menudo olvida observar lo que pisa. Wanders no solo captura paisajes; habita el territorio para desenterrar las narrativas silenciosas que yacen en la superficie de la tierra.',
      },
      {
        type: 'image',
        src: require('./assets/fotos/residentes/fernandowanders/carousel/fw (1).jpg'),
        alt: 'Fernando Wanders - Fotografía',
      },
      {
        type: 'text',
        content:
          'Durante su paso por la Residencia CAT, el fotógrafo ha volcado su atención hacia la micro-ecología de la quebrada, sumergiéndose en la penumbra húmeda para rescatar la profunda delicadeza de los hongos del bosque. En este ejercicio de paciencia y atención plena, Wanders logra visibilizar lo imperceptible: esas formas de vida esenciales que suelen pasar inadvertidas ante la falta de atención de cada paso humano. Su lente actúa como un microscopio emocional, devolviéndole la importancia a lo pequeño y revelando la arquitectura frágil que sostiene el equilibrio del ecosistema.',
      },
      {
        type: 'text',
        content:
          'Fernando Wanders se posiciona así como un descubridor de lo inmediato, un cronista que nos recuerda que la riqueza del territorio no está solo en el horizonte, sino en el detalle mínimo. Al igual que el carbón y la ceniza en el trabajo de sus pares, sus fotografías son rastros de una realidad latente que nos rodea, invitándonos a detener la marcha y reconocer, por fin, la complejidad y el misterio de lo que habitamos.',
      }
    ],
    carousel: fernandoCarousel,
  },
};
