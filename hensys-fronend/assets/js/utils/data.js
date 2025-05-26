/**
 * Mock Data for the Application
 */

// Transactions data
const transactionsData = [
    {
        id: 1,
        type: 'income',
        title: 'Venta de huevos',
        subtitle: 'Cliente: José Pérez',
        amount: 1250000,
        date: '2023-11-28'
    },
    {
        id: 2,
        type: 'expense',
        title: 'Compra de alimento',
        subtitle: 'Proveedor: Nutriaves',
        amount: 850000,
        date: '2023-11-27'
    },
    {
        id: 3,
        type: 'income',
        title: 'Venta de pollos',
        subtitle: 'Cliente: Restaurante El Gallo',
        amount: 2350000,
        date: '2023-11-25'
    },
    {
        id: 4,
        type: 'expense',
        title: 'Medicamentos',
        subtitle: 'Proveedor: VetSupplies',
        amount: 450000,
        date: '2023-11-24'
    },
    {
        id: 5,
        type: 'income',
        title: 'Venta de gallinas',
        subtitle: 'Cliente: Granja Vecina',
        amount: 1800000,
        date: '2023-11-22'
    }
];

// Upcoming vaccinations data
const vaccinationsData = [
    {
        id: 1,
        title: 'Vacuna Newcastle',
        subtitle: 'Galpón 3 - 120 aves',
        date: '2023-12-05'
    },
    {
        id: 2,
        title: 'Vacuna Bronquitis',
        subtitle: 'Galpón 5 - 85 aves',
        date: '2023-12-08'
    },
    {
        id: 3,
        title: 'Vacuna Marek',
        subtitle: 'Galpón 2 - 150 aves',
        date: '2023-12-12'
    },
    {
        id: 4,
        title: 'Vacuna Gumboro',
        subtitle: 'Galpón 4 - 100 aves',
        date: '2023-12-15'
    }
];

// Production data
const productionData = [
    { tipo: "Huevo", cantidad: 120, observaciones: "Calidad A", galpon: 3, fecha: "2023-11-28" },
    { tipo: "Huevo", cantidad: 115, observaciones: "Calidad A", galpon: 3, fecha: "2023-11-27" },
    { tipo: "Huevo", cantidad: 118, observaciones: "Calidad A", galpon: 3, fecha: "2023-11-26" },
    { tipo: "Carne", cantidad: 45, observaciones: "Pollos de engorde", galpon: 5, fecha: "2023-11-28" },
    { tipo: "Carne", cantidad: 38, observaciones: "Pollos de engorde", galpon: 5, fecha: "2023-11-25" },
    { tipo: "Huevo", cantidad: 105, observaciones: "Calidad B", galpon: 4, fecha: "2023-11-28" },
    { tipo: "Huevo", cantidad: 110, observaciones: "Calidad B", galpon: 4, fecha: "2023-11-27" },
    { tipo: "Carne", cantidad: 42, observaciones: "Gallinas ponedoras", galpon: 6, fecha: "2023-11-26" }
];

// Expenses data
const expensesData = [
    { categoria: "Alimento", descripcion: "Concentrado para ponedoras", monto: 1200000, fecha: "2023-11-28" },
    { categoria: "Medicamento", descripcion: "Antibióticos", monto: 450000, fecha: "2023-11-25" },
    { categoria: "Servicios", descripcion: "Electricidad", monto: 350000, fecha: "2023-11-20" },
    { categoria: "Mantenimiento", descripcion: "Reparación de bebederos", monto: 180000, fecha: "2023-11-18" },
    { categoria: "Alimento", descripcion: "Maíz para engorde", monto: 850000, fecha: "2023-11-15" }
];

// Invoices data
const invoicesData = [
    { numero: "F-001", cliente: "José Pérez", fecha: "2023-11-28", total: 1250000 },
    { numero: "F-002", cliente: "Restaurante El Gallo", fecha: "2023-11-25", total: 2350000 },
    { numero: "F-003", cliente: "Granja Vecina", fecha: "2023-11-22", total: 1800000 },
    { numero: "F-004", cliente: "Supermercado Local", fecha: "2023-11-20", total: 950000 },
    { numero: "F-005", cliente: "Hotel Campestre", fecha: "2023-11-15", total: 1450000 }
];

// Clients data
const clientsData = [
    { id: 1, nombre: "José Pérez", telefono: "315-123-4567", email: "jose@example.com", direccion: "Calle 123 #45-67" },
    { id: 2, nombre: "Restaurante El Gallo", telefono: "318-765-4321", email: "elgallo@example.com", direccion: "Av Principal #28-15" },
    { id: 3, nombre: "Granja Vecina", telefono: "310-987-6543", email: "granja@example.com", direccion: "Km 5 Vía Rural" },
    { id: 4, nombre: "Supermercado Local", telefono: "317-246-8097", email: "super@example.com", direccion: "Calle Comercial #12-34" },
    { id: 5, nombre: "Hotel Campestre", telefono: "314-159-2653", email: "hotel@example.com", direccion: "Km 3 Vía Panorámica" }
];

// Coops data
const coopsData = [
    { id: 1, numero: 1, capacidad: 200, ocupacion: 180, tipo: "Ponedoras" },
    { id: 2, numero: 2, capacidad: 250, ocupacion: 230, tipo: "Ponedoras" },
    { id: 3, numero: 3, capacidad: 150, ocupacion: 120, tipo: "Ponedoras" },
    { id: 4, numero: 4, capacidad: 180, ocupacion: 160, tipo: "Ponedoras" },
    { id: 5, numero: 5, capacidad: 300, ocupacion: 280, tipo: "Engorde" },
    { id: 6, numero: 6, capacidad: 280, ocupacion: 250, tipo: "Engorde" },
    { id: 7, numero: 7, capacidad: 220, ocupacion: 200, tipo: "Engorde" },
    { id: 8, numero: 8, capacidad: 190, ocupacion: 170, tipo: "Reproductoras" }
];

// Export data
window.appData = {
    transactions: transactionsData,
    vaccinations: vaccinationsData,
    production: productionData,
    expenses: expensesData,
    invoices: invoicesData,
    clients: clientsData,
    coops: coopsData
};