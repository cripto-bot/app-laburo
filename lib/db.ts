// lib/db.ts
import { Low } from 'lowdb'; // Importamos la clase principal de lowdb
import { JSONFile } from 'lowdb/node'; // Importamos el adaptador para leer/escribir archivos JSON en Node.js
import path from 'path'; // Módulo de Node.js para trabajar con rutas de archivos
import fs from 'fs'; // Módulo de Node.js para interactuar con el sistema de archivos (File System)

// --- Definición de Tipos (Interfaces) ---
// Las interfaces describen la "forma" que tendrán nuestros objetos de datos.
// Ayudan a TypeScript a verificar que estamos usando los datos correctamente.

export interface Usuario {
  id: string; // Identificador único para cada usuario
  nombre: string;
  apellido: string;
  correo: string; // Lo usaremos para el login, debería ser único
  telefono: string;
  cedula: string; // Número de cédula de identidad
  hashContrasena: string; // IMPORTANTE: Aquí guardaremos la contraseña encriptada (hasheada), NUNCA la contraseña real.
  rol: 'contratante' | 'prestador' | 'ambos' | 'admin'; // Define los roles posibles
  fechaRegistro: string; // Guardaremos la fecha como texto en formato ISO (ej: "2023-10-27T10:30:00.000Z")
}

export interface Trabajo {
  id: string;
  contratanteId: string; // El 'id' del Usuario que publicó el trabajo
  titulo: string;
  categoria: string; // Ej: "Poda", "Chofer", "Electricista"
  descripcion: string;
  precioOfrecido: number; // El monto que el contratante ofrece
  ubicacionTexto: string; // La dirección escrita, ej: "Av. Eusebio Ayala casi General Santos"
  latitud?: number; // Coordenada GPS (opcional, por si usamos un mapa)
  longitud?: number; // Coordenada GPS (opcional)
  fechaHoraDeseada: string; // Cuándo se necesita el trabajo (formato ISO)
  fotos?: string[]; // Lista de URLs de imágenes (opcional)
  estado: 'publicado' | 'en_proceso' | 'completado_pendiente_confirmacion' | 'finalizado' | 'cancelado'; // Estados del trabajo
  prestadorId?: string; // El 'id' del Usuario prestador que tomó el trabajo (si alguno lo tomó)
  fechaCreacion: string; // Cuándo se publicó el trabajo
  fechaAceptacion?: string; // Cuándo un prestador aceptó el trabajo (opcional)
  fechaCompletado?: string; // Cuándo se marcó como completado (opcional)
}

export interface Saldo {
  prestadorId: string; // El 'id' del Usuario prestador
  monto: number; // El saldo actual que tiene el prestador
  ultimaActualizacion: string; // Cuándo se actualizó por última vez este saldo
}

export interface Carga {
  id: string;
  prestadorId: string; // El 'id' del prestador que solicita la carga
  monto: number; // El monto que el prestador dice que transfirió
  comprobanteUrl?: string; // Puede ser un texto (Nro. de transacción) o una URL a una imagen del comprobante
  fechaSolicitud: string; // Cuándo el prestador solicitó la carga
  estado: 'pendiente' | 'aprobado' | 'rechazado'; // Estado de la solicitud de carga
  fechaRevision?: string; // Cuándo el admin revisó la solicitud (opcional)
  adminId?: string; // El 'id' del admin que aprobó/rechazó (opcional)
}

export interface Calificacion {
  id: string;
  trabajoId: string; // El 'id' del Trabajo que se está calificando
  contratanteId: string; // El 'id' del Usuario (contratante) que está calificando
  prestadorId: string; // El 'id' del Usuario (prestador) que está siendo calificado
  puntuacion: 1 | 2 | 3 | 4 | 5; // Calificación en estrellas
  comentario?: string; // Comentario opcional
  fecha: string; // Cuándo se hizo la calificación
}

// --- Esquema General de la Base de Datos ---
// Esta interfaz describe cómo se verá el contenido completo de nuestra "base de datos",
// es decir, un objeto que contiene listas para cada tipo de dato.
interface Schema {
  usuarios: Usuario[]; // una lista de objetos Usuario
  trabajos: Trabajo[]; // una lista de objetos Trabajo
  saldos: Saldo[];     // etc.
  cargas: Carga[];
  calificaciones: Calificacion[];
}

// --- Configuración de LowDB ---

// `process.cwd()` nos da la ruta a la carpeta raíz de nuestro proyecto.
const baseDir = process.cwd();
// Creamos la ruta completa a nuestra carpeta `db`.
const dbFolderPath = path.join(baseDir, 'db');

// Verificamos si la carpeta `db` existe. Si no, la creamos.
// Esto es una medida de seguridad por si borramos la carpeta `db` accidentalmente.
if (!fs.existsSync(dbFolderPath)) {
  fs.mkdirSync(dbFolderPath, { recursive: true }); // `recursive: true` crea carpetas padres si no existen
}

// `defaultData` es lo que `lowdb` usará si un archivo JSON está vacío o no existe cuando intenta leerlo.
// Para nosotros, significa que cada "tabla" comenzará como una lista vacía.
const defaultData: Schema = {
  usuarios: [],
  trabajos: [],
  saldos: [],
  cargas: [],
  calificaciones: [],
};

// `createAdapter` es una pequeña función que nos ayuda a crear el "adaptador" para cada archivo JSON.
// Un adaptador le dice a `lowdb` CÓMO leer y escribir un tipo específico de archivo (en nuestro caso, JSON).
const createAdapter = <TData>(filename: string) => {
  const filePath = path.join(dbFolderPath, filename); // Ruta completa al archivo JSON, ej: `.../laburo-plataforma/db/usuarios.json`
  return new JSONFile<TData>(filePath); // Creamos el adaptador para ese archivo
};


// --- Instancias de LowDB para cada "tabla" (archivo JSON) ---
// Aquí creamos un objeto `db` que tendrá una "conexión" a cada uno de nuestros archivos JSON.
// Cada conexión (`db.usuarios`, `db.trabajos`, etc.) es una instancia de `Low`.
// Le pasamos el adaptador y los datos por defecto.
export const db = {
  usuarios: new Low<Usuario[]>(createAdapter<Usuario[]>('usuarios.json'), defaultData.usuarios),
  trabajos: new Low<Trabajo[]>(createAdapter<Trabajo[]>('trabajos.json'), defaultData.trabajos),
  saldos: new Low<Saldo[]>(createAdapter<Saldo[]>('saldos.json'), defaultData.saldos),
  cargas: new Low<Carga[]>(createAdapter<Carga[]>('cargas.json'), defaultData.cargas),
  calificaciones: new Low<Calificacion[]>(createAdapter<Calificacion[]>('calificaciones.json'), defaultData.calificaciones),
};

// --- Función para Inicializar y Leer las Bases de Datos ---
// Esta función se asegura de que `lowdb` lea el contenido de todos nuestros archivos JSON
// cuando la aplicación (el servidor de Next.js) se inicie.
let inicializado = false; // Una bandera para asegurarnos de que solo se inicialice una vez.
export async function inicializarDBs() {
  if (inicializado) return; // Si ya se inicializó, no hacemos nada.

  try {
    // `Promise.all` ejecuta varias promesas (operaciones asíncronas) al mismo tiempo.
    // `Object.values(db)` nos da una lista de todas nuestras "conexiones" (`db.usuarios`, `db.trabajos`, etc.).
    // `map` aplica la función `databaseInstance.read()` a cada una de ellas.
    // `await` espera a que todas las lecturas terminen.
    await Promise.all(Object.values(db).map(databaseInstance => databaseInstance.read()));
    inicializado = true; // Marcamos como inicializado.
    console.log('Bases de datos JSON inicializadas y leídas.'); // Mensaje para la consola del servidor.
  } catch (error) {
    console.error('Error al inicializar las bases de datos JSON:', error);
    // En un caso real, aquí podríamos querer detener la aplicación o reintentar.
  }
}

// Esta línea llama a `inicializarDBs()` automáticamente cuando este archivo `db.ts` se importa por primera vez.
// `process.env.NODE_ENV !== 'test'` evita que se ejecute durante las pruebas automáticas (si las tuviéramos).
// Esto es útil porque nuestras API Routes (que crearemos después) importarán este archivo,
// y así nos aseguramos de que los datos estén cargados antes de que la API intente usarlos.
if (process.env.NODE_ENV !== 'test') {
    inicializarDBs();
}
