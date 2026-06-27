// Supabase & n8n API Integration Core
// Loaded on all pages requiring API connectivity.

// Retrieve configuration from localStorage
function getApiConfig() {
  return {
    supabaseUrl: localStorage.getItem('petshop_supabase_url') || '',
    supabaseKey: localStorage.getItem('petshop_supabase_key') || '',
    webhookPedidos: localStorage.getItem('petshop_webhook_pedidos') || '',
    webhookReservas: localStorage.getItem('petshop_webhook_reservas') || '',
    webhookContacto: localStorage.getItem('petshop_webhook_contacto') || ''
  };
}

// Initialise Supabase Client if credentials exist
let supabaseClient = null;
function initSupabase() {
  const config = getApiConfig();
  if (config.supabaseUrl && config.supabaseKey && window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseKey);
      console.log('Supabase client initialized successfully!');
      return true;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
    }
  }
  return false;
}

// Dynamic fallback products array if database is not active
const FALLBACK_PRODUCTS = [
  {
    id: 'f1',
    nombre: 'NEXGARD 25.1 - 50 KG X 3 UNIDADES',
    descripcion: 'Antiparasitario masticable para perros grandes (25-50 kg). Protección mensual efectiva contra pulgas y garrapatas.',
    precio: 350.00,
    imagen_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300',
    categoria: 'Farmacia',
    animal: 'perros',
    marca: 'NexGard',
    stock: 12
  },
  {
    id: 'f2',
    nombre: 'NEXGARD 4.1 - 10 KG X 3 UNIDADES',
    descripcion: 'Antiparasitario masticable para perros medianos-pequeños (4-10 kg). Excelente sabor y alta palatabilidad.',
    precio: 290.00,
    imagen_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300',
    categoria: 'Farmacia',
    animal: 'perros',
    marca: 'NexGard',
    stock: 18
  },
  {
    id: 'f3',
    nombre: 'MOTHER AND BABY CAT 4 KG',
    descripcion: 'Alimento premium formulado para gatitos en primera fase de crecimiento (1-4 meses) y gatas gestantes/lactantes.',
    precio: 220.00,
    imagen_url: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=300',
    categoria: 'Alimentos',
    animal: 'gatos',
    marca: 'Royal Canin',
    stock: 15
  },
  {
    id: 'f4',
    nombre: 'PRO PLAN ADULT COMPLET X 15 KG',
    descripcion: 'Alimento completo y balanceado para perros adultos de razas medianas. Formulado con carne de pollo de alta digestibilidad.',
    precio: 480.00,
    imagen_url: 'https://images.unsplash.com/photo-1589748483370-bb7ded0e2e82?auto=format&fit=crop&q=80&w=300',
    categoria: 'Alimentos',
    animal: 'perros',
    marca: 'Pro Plan',
    stock: 9
  },
  {
    id: 'f5',
    nombre: 'MINI JUNIOR 195 G. LATA',
    descripcion: 'Alimento húmedo en lata para cachorros de razas pequeñas. Nutrición apetitosa y de textura suave.',
    precio: 25.00,
    imagen_url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=300',
    categoria: 'Alimentos',
    animal: 'perros',
    marca: 'Royal Canin',
    stock: 24
  },
  {
    id: 'f6',
    nombre: 'COLLAR ISABELINO PREMIUM N°3',
    descripcion: 'Collar protector ajustable e impermeable de alta durabilidad para post-operatorios y tratamientos de piel.',
    precio: 55.00,
    imagen_url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=300',
    categoria: 'Farmacia',
    animal: 'perros',
    marca: 'Genérico',
    stock: 10
  },
  {
    id: 'f7',
    nombre: 'ARENA CANADA LITTER 12 KG. LAVANDER',
    descripcion: 'Arena de bentonita de sodio 100% natural y aglomerante con aroma a lavanda. Control óptimo de olores.',
    precio: 130.00,
    imagen_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
    categoria: 'Accesorios',
    animal: 'gatos',
    marca: 'Canada Litter',
    stock: 14
  },
  {
    id: 'f8',
    nombre: 'JUGUETE CUERDA CON PELOTA',
    descripcion: 'Juguete interactivo de soga trenzada de algodón resistente, ideal para morder y limpiar dientes.',
    precio: 35.00,
    imagen_url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=300',
    categoria: 'Juguetes',
    animal: 'perros',
    marca: 'Genérico',
    stock: 30
  }
];

// Fetch all products from Supabase or Fallback
async function fetchProducts() {
  initSupabase();
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('productos')
        .select('*');
      
      if (error) {
        console.warn('Error reading from Supabase table "productos", using fallbacks:', error);
        return FALLBACK_PRODUCTS;
      }
      
      if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase request failed, using local product list:', e);
    }
  }
  return FALLBACK_PRODUCTS;
}

// POST data to n8n Webhook
async function postToWebhook(url, payload) {
  if (!url) {
    console.error('n8n Webhook URL is not configured!');
    showToast('Error: Webhook de n8n no configurado. Ve a Configuración.', 'error');
    return false;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('Successfully submitted data to n8n webhook!');
      return true;
    } else {
      console.error('n8n webhook returned status:', response.status);
      showToast('Error en la comunicación con n8n. Revisa las llaves.', 'error');
      return false;
    }
  } catch (e) {
    console.error('Network error requesting n8n Webhook:', e);
    showToast('Error de red al conectar con n8n. Verifica tu conexión.', 'error');
    return false;
  }
}

// Specific functions to submit requests
async function submitPedido(pedido) {
  const config = getApiConfig();
  return await postToWebhook(config.webhookPedidos, pedido);
}

async function submitReserva(reserva) {
  const config = getApiConfig();
  return await postToWebhook(config.webhookReservas, reserva);
}

async function submitContacto(mensaje) {
  const config = getApiConfig();
  return await postToWebhook(config.webhookContacto, mensaje);
}

// Toast helper
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '🐾';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';
  
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
window.showToast = showToast;
