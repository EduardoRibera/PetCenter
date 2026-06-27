# 🐾 PetCenter - Petshop Online

Sitio web de PetCenter, una tienda de mascotas con servicios integrados de veterinaria, hotel, peluquería, baños, guardería y tienda online.

## 🛠️ Stack Tecnológico

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Base de datos**: Supabase (PostgreSQL)
- **Automatización**: n8n (webhooks)
- **Hosting**: Netlify

## 🚀 Instalación y Configuración

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/TU_REPO.git
   ```

2. Abre `index.html` en tu navegador o despliega en Netlify.

3. Ve a la página **⚙️ Config** (`config.html`) e ingresa tus credenciales:
   - **Supabase URL** y **Anon Key**
   - **Webhooks de n8n** (Pedidos, Reservas, Contacto)

> ⚠️ **Seguridad**: Las credenciales se almacenan en `localStorage` del navegador. No se suben al repositorio ni se exponen en el código fuente.

## 📁 Estructura del Proyecto

```
Proyecto/
├── index.html          # Página principal
├── shop.html           # Tienda online
├── carrito.html        # Carrito de compras
├── reservas.html       # Sistema de reservas
├── nosotros.html       # Página "Nosotros"
├── config.html         # Panel de configuración de API keys
├── hotel-pet.html      # Servicio de hotel
├── veterinaria.html    # Servicio de veterinaria
├── peluqueria.html     # Servicio de peluquería
├── banos.html          # Servicio de baños y spa
├── guarderia-y-piscina.html  # Servicio de guardería
├── about.html          # Página "About"
├── style.css           # Estilos globales
├── app.js              # Lógica global (carrito, navegación)
└── supabase-n8n.js     # Integración con Supabase y n8n
```

## 📄 Licencia

Proyecto académico - Todos los derechos reservados © 2026
