const mensajes = [
  "Reciclar una tonelada de papel salva 17 árboles y 26.000 litros de agua.",
  "El plástico tarda hasta 500 años en descomponerse en la naturaleza.",
  "Si reciclas una lata de aluminio, ahorras energía para ver TV durante 3 horas.",
  "El 80% de los residuos que van al mar podrían haberse reciclado.",
  "Compostar restos de comida reduce hasta un 30% la basura del hogar.",
  "Una bolsa de tela reemplaza hasta 700 bolsas plásticas a lo largo de su vida.",
  "El vidrio se puede reciclar infinitas veces sin perder calidad.",
  "Apagar las luces al salir puede reducir tu huella de carbono un 10%.",
  "El agua que usas al ducharte 2 minutos menos al día ahorra 15.000 litros al año.",
  "Reparar en lugar de botar es el reciclaje más poderoso que existe.",
  "Los océanos absorben el 30% del CO₂ que producimos. Cuidarlos es cuidarnos.",
  "Un smartphone contiene hasta 60 minerales distintos, muchos recuperables.",
];

const elemento = document.getElementById("mensajeAmbiental");
if (elemento) {
  const indice = Math.floor(Math.random() * mensajes.length);
  elemento.textContent = mensajes[indice];
}